import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { embedText } from "@/lib/embeddings";
import { answerFromContext } from "@/lib/ai";

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { meetingId, question } = await req.json();
  if (!meetingId || !question) {
    return NextResponse.json({ error: "meetingId and question required" }, { status: 400 });
  }

  const transcript = await prisma.transcript.findUnique({ where: { meetingId } });
  if (!transcript) return NextResponse.json({ error: "No transcript for this meeting" }, { status: 404 });

  const queryVector = await embedText(question);
  const topChunks = await prisma.$queryRawUnsafe<{ content: string }[]>(
    `SELECT content FROM "TranscriptChunk" WHERE "transcriptId" = $1 ORDER BY embedding <=> $2::vector LIMIT 5`,
    transcript.id,
    `[${queryVector.join(",")}]`
  );

  const answer = await answerFromContext(question, topChunks.map((c) => c.content));
  return NextResponse.json({ answer, sources: topChunks.length });
}
