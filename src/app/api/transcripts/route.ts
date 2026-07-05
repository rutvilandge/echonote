import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { chunkText, embedText } from "@/lib/embeddings";

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { meetingId, rawText, audioUrl } = await req.json();
  if (!meetingId || !rawText) {
    return NextResponse.json({ error: "meetingId and rawText required" }, { status: 400 });
  }

  const transcript = await prisma.transcript.create({ data: { meetingId, rawText, audioUrl } });
  const chunks = chunkText(rawText);

  for (let i = 0; i < chunks.length; i++) {
    const vector = await embedText(chunks[i]);
    await prisma.$executeRawUnsafe(
      `INSERT INTO "TranscriptChunk" (id, "transcriptId", content, "chunkIndex", embedding, "createdAt")
       VALUES (gen_random_uuid()::text, $1, $2, $3, $4::vector, now())`,
      transcript.id,
      chunks[i],
      i,
      `[${vector.join(",")}]`
    );
  }

  await prisma.meeting.update({ where: { id: meetingId }, data: { status: "READY" } });
  return NextResponse.json(transcript, { status: 201 });
}
