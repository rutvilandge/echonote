import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import AppShell from "@/components/AppShell";
import CalendarMonthView from "@/components/CalendarMonthView";

export default async function CalendarPage() {
  const session = await getServerSession(authOptions);
  if (!session?.user) redirect("/login");
  const userId = (session.user as any).id as string;

  const memberships = await prisma.workspaceMember.findMany({
    where: { userId },
    select: { workspaceId: true },
  });

  const meetings = await prisma.meeting.findMany({
    where: { workspaceId: { in: memberships.map((m) => m.workspaceId) }, scheduledAt: { not: null } },
    select: { id: true, title: true, scheduledAt: true, status: true },
  });

  const account = await prisma.account.findFirst({ where: { userId, provider: "google" } });

  return (
    <AppShell>
      <span className="font-mono text-xs text-muted uppercase tracking-widest">schedule</span>
      <h1 className="font-display text-3xl mt-1 mb-1">Calendar</h1>
      <p className="text-sm text-muted mb-8">
        {account
          ? "Synced with your Google Calendar — new meetings are added automatically."
          : "Sign in with Google to sync new meetings to your Google Calendar automatically."}
      </p>
      <CalendarMonthView meetings={meetings as any} />
    </AppShell>
  );
}
