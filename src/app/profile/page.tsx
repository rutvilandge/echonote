import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import AppShell from "@/components/AppShell";
import ProfileForm from "@/components/ProfileForm";

export default async function ProfilePage() {
  const session = await getServerSession(authOptions);
  if (!session?.user) redirect("/login");
  const userId = (session.user as any).id as string;

  const user = await prisma.user.findUnique({ where: { id: userId } });
  if (!user) redirect("/login");

  return (
    <AppShell>
      <span className="font-mono text-xs text-muted uppercase tracking-widest">account</span>
      <h1 className="font-display text-3xl mt-1 mb-8">Profile</h1>
      <ProfileForm user={{ name: user.name ?? "", email: user.email, timezone: user.timezone ?? "", language: user.language ?? "en" }} />
    </AppShell>
  );
}
