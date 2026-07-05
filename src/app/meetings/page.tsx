import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import AppShell from "@/components/AppShell";
import MeetingsFilterClient from "@/components/MeetingsFilterClient";

export default async function MeetingsPage() {
  const session = await getServerSession(authOptions);
  if (!session?.user) redirect("/login");
  const userId = (session.user as any).id as string;

  const memberships = await prisma.workspaceMember.findMany({
    where: { userId },
    select: { workspaceId: true },
  });
  const workspaceIds = memberships.map((m) => m.workspaceId);

  const meetings = await prisma.meeting.findMany({
    where: { workspaceId: { in: workspaceIds } },
    orderBy: { scheduledAt: "desc" },
    include: { actionItems: true },
  });

  return (
    <AppShell>
      <span className="font-mono text-xs text-muted uppercase tracking-widest">all meetings</span>
      <h1 className="font-display text-3xl mt-1 mb-8">Meetings</h1>
      <MeetingsFilterClient meetings={meetings as any} />
    </AppShell>
  );
}
