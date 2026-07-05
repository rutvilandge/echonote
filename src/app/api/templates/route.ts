import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const workspaceId = req.nextUrl.searchParams.get("workspaceId");
  if (!workspaceId) return NextResponse.json({ error: "workspaceId required" }, { status: 400 });

  const templates = await prisma.template.findMany({ where: { workspaceId }, orderBy: { createdAt: "asc" } });
  return NextResponse.json(templates);
}

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { workspaceId, name, description, defaultTitle, promptHint }: {
    workspaceId: string; name: string; description?: string; defaultTitle?: string; promptHint?: string;
  } = await req.json();
  if (!workspaceId || !name) return NextResponse.json({ error: "workspaceId and name required" }, { status: 400 });

  const template = await prisma.template.create({
    data: { workspaceId, name, description, defaultTitle, promptHint },
  });
  return NextResponse.json(template, { status: 201 });
}
