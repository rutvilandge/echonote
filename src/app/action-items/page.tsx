import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import AppShell from "@/components/AppShell";
import ActionItemList from "@/components/ActionItemList";
import Link from "next/link";

export default async function ActionItemsPage() {
  const session = await getServerSession(authOptions);
  if (!session?.user) redirect("/login");
  const userId = (session.user as any).id as string;

  const memberships = await prisma.workspaceMember.findMany({
    where: { userId },
    select: { workspaceId: true },
  });
  const workspaceIds = memberships.map((m) => m.workspaceId);

  const meetings = await prisma.meeting.findMany({
    where: { workspaceId: { in: workspaceIds }, actionItems: { some: {} } },
    include: { actionItems: true },
    orderBy: { scheduledAt: "desc" },
  });

  const totalOpen = meetings.flatMap((m) => m.actionItems).filter((a) => !a.done).length;

  return (
    <AppShell>
      <span className="font-mono text-xs text-muted uppercase tracking-widest">tracked across meetings</span>
      <h1 className="font-display text-3xl mt-1 mb-1">Action items</h1>
      <p className="text-sm text-muted mb-8">{totalOpen} still open</p>

      {meetings.length === 0 ? (
        <div className="border border-dashed border-ink-line rounded-xl p-10 text-center text-sm text-muted">
          No action items yet — they show up here once a meeting has been summarized.
        </div>
      ) : (
        <div className="space-y-10">
          {meetings.map((m) => (
            <div key={m.id}>
              <Link href={`/meetings/${m.id}`} className="text-sm font-medium hover:text-signal transition-colors">
                {m.title}
              </Link>
              <div className="mt-3">
                <ActionItemList items={m.actionItems} />
              </div>
            </div>
          ))}
        </div>
      )}
    </AppShell>
  );
}
