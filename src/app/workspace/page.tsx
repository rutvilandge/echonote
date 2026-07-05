import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import AppShell from "@/components/AppShell";
import WorkspaceSettings from "@/components/WorkspaceSettings";

export default async function WorkspacePage() {
  const session = await getServerSession(authOptions);
  if (!session?.user) redirect("/login");
  const userId = (session.user as any).id as string;

  const membership = await prisma.workspaceMember.findFirst({
    where: { userId },
    include: {
      workspace: {
        include: { members: { include: { user: { select: { name: true, email: true } } } } },
      },
    },
  });

  if (!membership) {
    return (
      <AppShell>
        <h1 className="font-display text-3xl mb-4">Workspace</h1>
        <p className="text-sm text-muted">Create a workspace first.</p>
      </AppShell>
    );
  }

  return (
    <AppShell>
      <span className="font-mono text-xs text-muted uppercase tracking-widest">manage</span>
      <h1 className="font-display text-3xl mt-1 mb-8">Workspace</h1>
      <WorkspaceSettings
        workspace={{ id: membership.workspace.id, name: membership.workspace.name, slackWebhookUrl: membership.workspace.slackWebhookUrl }}
        members={membership.workspace.members as any}
        currentRole={membership.role}
      />
    </AppShell>
  );
}
