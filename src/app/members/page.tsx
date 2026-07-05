import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import AppShell from "@/components/AppShell";
import MembersManager from "@/components/MembersManager";

export default async function MembersPage() {
  const session = await getServerSession(authOptions);
  if (!session?.user) redirect("/login");
  const userId = (session.user as any).id as string;

  const membership = await prisma.workspaceMember.findFirst({
    where: { userId },
    include: {
      workspace: {
        include: {
          members: { include: { user: { select: { id: true, name: true, email: true } } } },
          invites: { where: { status: "PENDING" } },
        },
      },
    },
  });

  if (!membership) {
    return (
      <AppShell>
        <span className="font-mono text-xs text-muted uppercase tracking-widest">workspace</span>
        <h1 className="font-display text-3xl mt-1 mb-8">Members</h1>
        <p className="text-sm text-muted">Create a workspace first.</p>
      </AppShell>
    );
  }

  return (
    <AppShell>
      <span className="font-mono text-xs text-muted uppercase tracking-widest">workspace</span>
      <h1 className="font-display text-3xl mt-1 mb-1">Members</h1>
      <p className="text-sm text-muted mb-8">{membership.workspace.name}</p>
      <MembersManager
        workspaceId={membership.workspace.id}
        initialMembers={membership.workspace.members as any}
        initialInvites={membership.workspace.invites as any}
        currentUserId={userId}
      />
    </AppShell>
  );
}
