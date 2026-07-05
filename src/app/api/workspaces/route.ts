import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const userId = (session.user as any).id as string;

  const { name } = await req.json();
  if (!name) return NextResponse.json({ error: "name required" }, { status: 400 });

  const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "") + "-" + Math.random().toString(36).slice(2, 6);

  const workspace = await prisma.workspace.create({
    data: {
      name,
      slug,
      members: { create: { userId, role: "OWNER" } },
      templates: {
        create: [
          { name: "Sprint Planning", defaultTitle: "Sprint Planning", promptHint: "Focus the summary on scope committed, story points, and risks." },
          { name: "Stand-up", defaultTitle: "Daily Stand-up", promptHint: "Summarize as: what was done, what's next, and blockers per person." },
          { name: "Interview", defaultTitle: "Candidate Interview", promptHint: "Summarize candidate strengths, concerns, and a hire/no-hire signal." },
          { name: "Client Meeting", defaultTitle: "Client Check-in", promptHint: "Highlight client requests, concerns, and commitments made." },
          { name: "Sales Call", defaultTitle: "Sales Call", promptHint: "Summarize pain points, objections, and next steps in the deal." },
          { name: "1-on-1", defaultTitle: "1:1", promptHint: "Summarize feedback given, career topics, and follow-ups." },
        ],
      },
    },
  });

  return NextResponse.json(workspace, { status: 201 });
}
