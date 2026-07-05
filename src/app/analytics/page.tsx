import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import AppShell from "@/components/AppShell";
import AnalyticsContent from "@/components/AnalyticsContent";

export default async function AnalyticsPage() {
  const session = await getServerSession(authOptions);
  if (!session?.user) redirect("/login");

  return (
    <AppShell>
      <span className="font-mono text-xs text-muted uppercase tracking-widest">business intelligence</span>
      <h1 className="font-display text-3xl mt-1 mb-8">Analytics</h1>
      <AnalyticsContent />
    </AppShell>
  );
}
