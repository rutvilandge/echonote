import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { sendSlackMessage } from "@/lib/slack";

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions);
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { webhookUrl } = await req.json();
  await prisma.workspace.update({ where: { id: params.id }, data: { slackWebhookUrl: webhookUrl || null } });

  if (webhookUrl) {
    try {
      await sendSlackMessage(webhookUrl, "✅ EchoNote is now connected to this channel.");
    } catch {
      return NextResponse.json({ error: "Saved, but the test message failed to send. Check the URL." }, { status: 200 });
    }
  }

  return NextResponse.json({ ok: true });
}
