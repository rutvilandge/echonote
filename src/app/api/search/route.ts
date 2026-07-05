import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const userId = (session.user as any).id as string;

  const q = req.nextUrl.searchParams.get("q")?.trim();
  if (!q || q.length < 2) return NextResponse.json({ meetings: [], templates: [], members: [], actionItems: [] });

  const memberships = await prisma.workspaceMember.findMany({ where: { userId } });
  const workspaceIds = memberships.map((m) => m.workspaceId);

  const [meetings, templates, members, actionItems] = await Promise.all([
    prisma.meeting.findMany({
      where: { workspaceId: { in: workspaceIds }, title: { contains: q, mode: "insensitive" } },
      select: { id: true, title: true },
      take: 5,
    }),
    prisma.template.findMany({
      where: { workspaceId: { in: workspaceIds }, name: { contains: q, mode: "insensitive" } },
      select: { id: true, name: true },
      take: 5,
    }),
    prisma.workspaceMember.findMany({
      where: { workspaceId: { in: workspaceIds }, user: { OR: [{ name: { contains: q, mode: "insensitive" } }, { email: { contains: q, mode: "insensitive" } }] } },
      select: { id: true, user: { select: { name: true, email: true } } },
      take: 5,
    }),
    prisma.actionItem.findMany({
      where: { meeting: { workspaceId: { in: workspaceIds } }, text: { contains: q, mode: "insensitive" } },
      select: { id: true, text: true, meetingId: true },
      take: 5,
    }),
  ]);

  return NextResponse.json({ meetings, templates, members, actionItems });
}
