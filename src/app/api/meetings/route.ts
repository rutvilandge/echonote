import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { createDailyRoom } from "@/lib/daily";
import { createCalendarEvent } from "@/lib/googleCalendar";

export async function GET(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const workspaceId = req.nextUrl.searchParams.get("workspaceId");
  if (!workspaceId) return NextResponse.json({ error: "workspaceId required" }, { status: 400 });

  const meetings = await prisma.meeting.findMany({
    where: { workspaceId },
    orderBy: { scheduledAt: "desc" },
    include: { summary: true, actionItems: true },
  });
  return NextResponse.json(meetings);
}

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json();
  const { workspaceId, title, scheduledAt, templateId } = body;
  if (!workspaceId || !title) {
    return NextResponse.json({ error: "workspaceId and title required" }, { status: 400 });
  }

  const roomName = `meeting-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
  let roomUrl: string | null = null;
  try {
    roomUrl = await createDailyRoom(roomName);
  } catch {
    roomUrl = null; // Daily key not configured yet — meeting still gets created
  }

  const meeting = await prisma.meeting.create({
    data: {
      workspaceId,
      title,
      scheduledAt: scheduledAt ? new Date(scheduledAt) : null,
      roomName,
      roomUrl,
      templateId: templateId ?? null,
    },
  });

  const members = await prisma.workspaceMember.findMany({ where: { workspaceId } });
  await prisma.notification.createMany({
    data: members.map((m) => ({
      userId: m.userId,
      meetingId: meeting.id,
      message: `"${title}" was scheduled`,
    })),
  });

  // Sync to Google Calendar if this user signed in with Google and has a stored access token.
  if (scheduledAt) {
    const userId = (session.user as any).id as string;
    const account = await prisma.account.findFirst({ where: { userId, provider: "google" } });
    if (account?.access_token) {
      try {
        const start = new Date(scheduledAt);
        const end = new Date(start.getTime() + 30 * 60 * 1000);
        const event = await createCalendarEvent(account.access_token, {
          title,
          startTime: start.toISOString(),
          endTime: end.toISOString(),
          meetingUrl: roomUrl ?? undefined,
        });
        if (event.id) {
          await prisma.meeting.update({ where: { id: meeting.id }, data: { googleEventId: event.id } });
        }
      } catch {
        // Token may be expired — calendar sync is best-effort, meeting creation still succeeds.
      }
    }
  }

  return NextResponse.json(meeting, { status: 201 });
}
