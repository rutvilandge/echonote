import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function POST(req: NextRequest, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions);
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { email, role } = await req.json();
  if (!email) return NextResponse.json({ error: "email required" }, { status: 400 });

  // If the user already has an account, add them directly. Otherwise,
  // create a pending invite they'll be attached to once they register
  // with this email (a real app would email them a signup link here).
  const existingUser = await prisma.user.findUnique({ where: { email } });

  if (existingUser) {
    const member = await prisma.workspaceMember.upsert({
      where: { workspaceId_userId: { workspaceId: params.id, userId: existingUser.id } },
      update: {},
      create: { workspaceId: params.id, userId: existingUser.id, role: role ?? "MEMBER" },
      include: { user: { select: { name: true, email: true } } },
    });
    return NextResponse.json({ type: "member", member }, { status: 201 });
  }

  const invite = await prisma.invite.create({
    data: { workspaceId: params.id, email, role: role ?? "MEMBER" },
  });
  return NextResponse.json({ type: "invite", invite }, { status: 201 });
}
