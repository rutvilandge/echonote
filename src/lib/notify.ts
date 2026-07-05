import { prisma } from "@/lib/prisma";
import { sendSlackMessage } from "@/lib/slack";

// Creates an in-app Notification row for every member of the meeting's
// workspace, and forwards to Slack if the workspace has a webhook configured.
export async function notifyWorkspace(meetingId: string, message: string) {
  const meeting = await prisma.meeting.findUnique({
    where: { id: meetingId },
    include: { workspace: { include: { members: true } } },
  });
  if (!meeting) return;

  await prisma.notification.createMany({
    data: meeting.workspace.members.map((m) => ({
      userId: m.userId,
      meetingId,
      message,
    })),
  });

  if (meeting.workspace.slackWebhookUrl) {
    await sendSlackMessage(meeting.workspace.slackWebhookUrl, `*${meeting.title}*: ${message}`);
  }
}
