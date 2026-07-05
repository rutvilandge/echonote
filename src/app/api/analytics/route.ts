import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const userId = (session.user as any).id as string;

  const memberships = await prisma.workspaceMember.findMany({ where: { userId } });
  const workspaceIds = memberships.map((m) => m.workspaceId);

  const [meetings, workspaces, notifications] = await Promise.all([
    prisma.meeting.findMany({
      where: { workspaceId: { in: workspaceIds } },
      include: { actionItems: true, summary: true, workspace: { select: { name: true } } },
    }),
    prisma.workspace.findMany({ where: { id: { in: workspaceIds } }, include: { _count: { select: { meetings: true } } } }),
    prisma.notification.findMany({ where: { userId }, orderBy: { createdAt: "desc" }, take: 5 }),
  ]);

  const now = new Date();
  const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const endOfToday = new Date(startOfToday.getTime() + 24 * 60 * 60 * 1000);
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

  const totalMeetings = meetings.length;
  const upcomingMeetings = meetings.filter((m) => m.scheduledAt && new Date(m.scheduledAt) > now).length;
  const todaysMeetings = meetings.filter(
    (m) => m.scheduledAt && new Date(m.scheduledAt) >= startOfToday && new Date(m.scheduledAt) < endOfToday
  ).length;
  const meetingsThisMonth = meetings.filter((m) => m.scheduledAt && new Date(m.scheduledAt) >= startOfMonth).length;

  const allActionItems = meetings.flatMap((m) => m.actionItems);
  const completedActionItems = allActionItems.filter((a) => a.done).length;
  const pendingActionItems = allActionItems.length - completedActionItems;
  const completionRate = allActionItems.length > 0 ? Math.round((completedActionItems / allActionItems.length) * 100) : 0;

  const summariesGenerated = meetings.filter((m) => m.summary).length;
  const avgActionItemsPerMeeting = totalMeetings > 0 ? +(allActionItems.length / totalMeetings).toFixed(1) : 0;

  // Meetings per month, last 6 months
  const monthBuckets: { month: string; count: number }[] = [];
  for (let i = 5; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
    const label = d.toLocaleDateString(undefined, { month: "short" });
    const count = meetings.filter((m) => {
      if (!m.scheduledAt) return false;
      const md = new Date(m.scheduledAt);
      return md.getFullYear() === d.getFullYear() && md.getMonth() === d.getMonth();
    }).length;
    monthBuckets.push({ month: label, count });
  }

  // Workspace activity — meeting count per workspace
  const workspaceActivity = workspaces.map((w) => ({ name: w.name, meetings: w._count.meetings }));

  // Most active workspace
  const mostActive = workspaceActivity.slice().sort((a, b) => b.meetings - a.meetings)[0];

  // Average meeting duration (only for meetings with both startedAt and endedAt)
  const withDuration = meetings.filter((m) => m.startedAt && m.endedAt);
  const avgDurationMinutes =
    withDuration.length > 0
      ? Math.round(
          withDuration.reduce((sum, m) => sum + (new Date(m.endedAt!).getTime() - new Date(m.startedAt!).getTime()), 0) /
            withDuration.length /
            60000
        )
      : null;

  return NextResponse.json({
    totalMeetings,
    upcomingMeetings,
    todaysMeetings,
    totalWorkspaces: workspaces.length,
    summariesGenerated,
    pendingActionItems,
    completedActionItems,
    completionRate,
    meetingsThisMonth,
    mostActiveWorkspace: mostActive?.name ?? null,
    avgActionItemsPerMeeting,
    avgDurationMinutes,
    monthlyMeetings: monthBuckets,
    workspaceActivity,
    actionItemsBreakdown: [
      { name: "Completed", value: completedActionItems },
      { name: "Pending", value: pendingActionItems },
    ],
    recentNotifications: notifications,
  });
}
