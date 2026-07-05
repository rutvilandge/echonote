import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import AppShell from "@/components/AppShell";
import TemplatesManager from "@/components/TemplatesManager";

export default async function TemplatesPage() {
  const session = await getServerSession(authOptions);
  if (!session?.user) redirect("/login");
  const userId = (session.user as any).id as string;

  const membership = await prisma.workspaceMember.findFirst({
    where: { userId },
    include: { workspace: { include: { templates: true } } },
  });

  if (!membership) {
    return (
      <AppShell>
        <h1 className="font-display text-3xl mb-4">Templates</h1>
        <p className="text-sm text-muted">Create a workspace first.</p>
      </AppShell>
    );
  }

  return (
    <AppShell>
      <span className="font-mono text-xs text-muted uppercase tracking-widest">meeting templates</span>
      <h1 className="font-display text-3xl mt-1 mb-8">Templates</h1>
      <TemplatesManager workspaceId={membership.workspace.id} initialTemplates={membership.workspace.templates as any} />
    </AppShell>
  );
}
