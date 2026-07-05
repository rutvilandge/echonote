import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import AppShell from "@/components/AppShell";
import NotificationsList from "@/components/NotificationsList";

export default async function NotificationsPage() {
  const session = await getServerSession(authOptions);
  if (!session?.user) redirect("/login");
  const userId = (session.user as any).id as string;

  const notifications = await prisma.notification.findMany({
    where: { userId },
    orderBy: { createdAt: "desc" },
    take: 50,
    include: { meeting: { select: { title: true, id: true } } },
  });

  return (
    <AppShell>
      <span className="font-mono text-xs text-muted uppercase tracking-widest">alerts</span>
      <h1 className="font-display text-3xl mt-1 mb-8">Notifications</h1>
      <NotificationsList initial={notifications as any} />
    </AppShell>
  );
}
