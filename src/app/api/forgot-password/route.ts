import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { Resend } from "resend";

// Simple reset flow: generates a token, stores it on VerificationToken,
// and emails a reset link via Resend. Wire up a /reset-password/[token]
// page to actually consume the token and update passwordHash.
export async function POST(req: NextRequest) {
  const { email } = await req.json();
  if (!email) return NextResponse.json({ error: "email required" }, { status: 400 });

  const user = await prisma.user.findUnique({ where: { email } });
  // Always return ok, even if no user found, to avoid leaking which emails are registered.
  if (!user) return NextResponse.json({ ok: true });

  const token = crypto.randomUUID();
  await prisma.verificationToken.create({
    data: { identifier: email, token, expires: new Date(Date.now() + 1000 * 60 * 30) },
  });

  if (process.env.RESEND_API_KEY) {
    const resend = new Resend(process.env.RESEND_API_KEY);
    await resend.emails.send({
      from: "EchoNote <noreply@yourdomain.com>",
      to: email,
      subject: "Reset your EchoNote password",
      html: `<p>Click to reset your password:</p><a href="${process.env.NEXTAUTH_URL}/reset-password/${token}">Reset password</a><p>This link expires in 30 minutes.</p>`,
    });
  }

  return NextResponse.json({ ok: true });
}
