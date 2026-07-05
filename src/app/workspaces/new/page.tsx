"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import AppShell from "@/components/AppShell";

export default function NewWorkspacePage() {
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim()) return;
    setLoading(true);
    try {
      const res = await fetch("/api/workspaces", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name }),
      });
      if (res.ok) {
        toast.success(`"${name}" workspace created`);
        router.push("/dashboard");
      } else {
        toast.error("Couldn't create workspace");
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <AppShell>
      <div className="max-w-md">
        <span className="font-mono text-xs text-muted uppercase tracking-widest">setup</span>
        <h1 className="font-display text-3xl mt-1 mb-8">Name your workspace</h1>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="ws-name" className="block text-sm text-muted mb-2">Workspace name</label>
            <input
              id="ws-name"
              autoFocus
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Product Team"
              className="w-full bg-ink-soft border border-ink-line rounded-lg px-4 py-3 outline-none focus:border-signal transition-colors"
            />
          </div>
          <button
            type="submit"
            disabled={loading || !name.trim()}
            className="w-full bg-signal text-ink font-semibold py-3 rounded-lg hover:brightness-110 transition-all disabled:opacity-40 disabled:cursor-not-allowed"
          >
            {loading ? "Creating…" : "Create workspace"}
          </button>
        </form>
      </div>
    </AppShell>
  );
}
