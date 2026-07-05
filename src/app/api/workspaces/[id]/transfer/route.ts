import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function POST(req: NextRequest, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions);
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const currentUserId = (session.user as any).id as string;

  const { newOwnerMemberId } = await req.json();

  await prisma.$transaction([
    prisma.workspaceMember.update({
      where: { workspaceId_userId: { workspaceId: params.id, userId: currentUserId } },
      data: { role: "ADMIN" },
    }),
    prisma.workspaceMember.update({
      where: { id: newOwnerMemberId },
      data: { role: "OWNER" },
    }),
  ]);

  return NextResponse.json({ ok: true });
}
