import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import AppShell from "@/components/AppShell";
import SettingsTabs from "@/components/SettingsTabs";

export default async function SettingsPage() {
  const session = await getServerSession(authOptions);
  if (!session?.user) redirect("/login");

  return (
    <AppShell>
      <span className="font-mono text-xs text-muted uppercase tracking-widest">preferences</span>
      <h1 className="font-display text-3xl mt-1 mb-8">Settings</h1>
      <SettingsTabs />
    </AppShell>
  );
}
