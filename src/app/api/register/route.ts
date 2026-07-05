import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";

export async function POST(req: NextRequest) {
  try {
    const { name, email, password } = await req.json();

    if (!name || !email || !password) {
      return NextResponse.json({ error: "name, email, and password are required" }, { status: 400 });
    }
    if (password.length < 8) {
      return NextResponse.json({ error: "Password must be at least 8 characters" }, { status: 400 });
    }

    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) {
      return NextResponse.json({ error: "An account with this email already exists" }, { status: 409 });
    }

    const passwordHash = await bcrypt.hash(password, 10);
    const user = await prisma.user.create({ data: { name, email, passwordHash } });

    const slug =
      name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "") +
      "-" +
      Math.random().toString(36).slice(2, 6);

    await prisma.workspace.create({
      data: {
        name: `${name}'s Workspace`,
        slug,
        members: { create: { userId: user.id, role: "OWNER" } },
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

    return NextResponse.json({ id: user.id, email: user.email }, { status: 201 });
  } catch (err) {
    console.error("Register error:", err);
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
  }
}