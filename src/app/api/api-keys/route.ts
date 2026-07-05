import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import crypto from "crypto";

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const userId = (session.user as any).id as string;

  const keys = await prisma.apiKey.findMany({
    where: { userId },
    select: { id: true, name: true, keyPreview: true, createdAt: true, lastUsedAt: true },
    orderBy: { createdAt: "desc" },
  });
  return NextResponse.json(keys);
}

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const userId = (session.user as any).id as string;

  const { name } = await req.json();
  const rawKey = `en_${crypto.randomBytes(24).toString("hex")}`;
  const keyHash = crypto.createHash("sha256").update(rawKey).digest("hex");
  const keyPreview = `${rawKey.slice(0, 8)}…${rawKey.slice(-4)}`;

  await prisma.apiKey.create({
    data: { userId, name: name || "Untitled key", keyHash, keyPreview },
  });

  // Full key is only ever returned once, at creation time — never stored in plaintext.
  return NextResponse.json({ key: rawKey, preview: keyPreview }, { status: 201 });
}
