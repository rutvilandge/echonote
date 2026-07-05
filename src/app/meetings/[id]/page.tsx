import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import AppShell from "@/components/AppShell";
import MeetingTabs from "@/components/MeetingTabs";
import MeetingHeader from "@/components/MeetingHeader";

export default async function MeetingPage({ params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions);
  if (!session?.user) redirect("/login");

  const meeting = await prisma.meeting.findUnique({
    where: { id: params.id },
    include: { summary: true, actionItems: true, transcript: true },
  });

  if (!meeting) notFound();

  return (
    <AppShell>
      <MeetingHeader meeting={{ id: meeting.id, title: meeting.title, scheduledAt: meeting.scheduledAt?.toISOString() ?? null, status: meeting.status }} />
      <MeetingTabs meeting={meeting} />
    </AppShell>
  );
}
