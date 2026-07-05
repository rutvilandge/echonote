import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { generateSummary } from "@/lib/ai";
import { notifyWorkspace } from "@/lib/notify";

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { meetingId } = await req.json();
  if (!meetingId) return NextResponse.json({ error: "meetingId required" }, { status: 400 });

  const transcript = await prisma.transcript.findUnique({ where: { meetingId } });
  if (!transcript) return NextResponse.json({ error: "No transcript for this meeting" }, { status: 404 });

  const meeting = await prisma.meeting.findUnique({ where: { id: meetingId } });
  const template = meeting?.templateId ? await prisma.template.findUnique({ where: { id: meeting.templateId } }) : null;

  const { summary, actionItems } = await generateSummary(transcript.rawText, template?.promptHint ?? undefined);

  await prisma.summary.upsert({
    where: { meetingId },
    update: { content: summary },
    create: { meetingId, content: summary },
  });

  await prisma.actionItem.deleteMany({ where: { meetingId } });
  if (actionItems.length) {
    await prisma.actionItem.createMany({ data: actionItems.map((text) => ({ meetingId, text })) });
  }

  await notifyWorkspace(meetingId, "Summary ready");

  return NextResponse.json({ summary, actionItems });
}
