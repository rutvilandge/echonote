"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "sonner";
import AppShell from "@/components/AppShell";
import { Waveform } from "@/components/Waveform";

type Workspace = { id: string; name: string };
type Template = { id: string; name: string; defaultTitle: string | null };

export default function NewMeetingPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const urlWorkspaceId = searchParams.get("workspaceId") ?? "";
  const urlTemplateId = searchParams.get("templateId") ?? "";

  const [workspaces, setWorkspaces] = useState<Workspace[]>([]);
  const [workspaceId, setWorkspaceId] = useState(urlWorkspaceId);
  const [templates, setTemplates] = useState<Template[]>([]);
  const [templateId, setTemplateId] = useState(urlTemplateId);
  const [title, setTitle] = useState("");
  const [scheduledAt, setScheduledAt] = useState("");
  const [loading, setLoading] = useState(false);
  const [loadingWorkspaces, setLoadingWorkspaces] = useState(true);

  // Always fetch the user's workspaces so we never depend solely on a URL
  // param — this is what caused the "workspaceId required" error before.
  useEffect(() => {
    fetch("/api/workspaces/mine")
      .then((res) => (res.ok ? res.json() : []))
      .then((data: Workspace[]) => {
        setWorkspaces(data);
        if (!urlWorkspaceId && data.length > 0) setWorkspaceId(data[0].id);
      })
      .finally(() => setLoadingWorkspaces(false));
  }, [urlWorkspaceId]);

  useEffect(() => {
    if (!workspaceId) return;
    fetch(`/api/templates?workspaceId=${workspaceId}`)
      .then((res) => (res.ok ? res.json() : []))
      .then(setTemplates)
      .catch(() => setTemplates([]));
  }, [workspaceId]);

  useEffect(() => {
    if (!templateId || templates.length === 0) return;
    const t = templates.find((t) => t.id === templateId);
    if (t) setTitle(t.defaultTitle ?? t.name);
  }, [templateId, templates]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!title.trim() || !workspaceId) {
      toast.error("Pick a workspace and give the meeting a title.");
      return;
    }
    setLoading(true);
    try {
      const res = await fetch("/api/meetings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ workspaceId, title, scheduledAt: scheduledAt || null, templateId: templateId || null }),
      });
      const data = await res.json();
      if (!res.ok) {
        toast.error(data.error ?? "Couldn't create the meeting.");
        return;
      }
      toast.success("Meeting created — room is ready");
      router.push(`/meetings/${data.id}`);
    } finally {
      setLoading(false);
    }
  }

  return (
    <AppShell>
      <div className="max-w-md">
        <div className="flex items-center gap-3 mb-1">
          <Waveform size="sm" tone="signal" animated={false} />
          <span className="font-mono text-xs text-muted uppercase tracking-widest">new entry</span>
        </div>
        <h1 className="font-display text-3xl mt-1 mb-8">Schedule a meeting</h1>

        {loadingWorkspaces ? (
          <p className="text-sm text-muted">Loading your workspaces…</p>
        ) : workspaces.length === 0 ? (
          <p className="text-sm text-danger">
            You don't have a workspace yet. <a href="/workspaces/new" className="underline">Create one first</a>.
          </p>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6">
            {workspaces.length > 1 && (
              <div>
                <label htmlFor="workspace" className="block text-sm text-muted mb-2">Workspace</label>
                <select
                  id="workspace"
                  value={workspaceId}
                  onChange={(e) => setWorkspaceId(e.target.value)}
                  className="w-full bg-ink-soft border border-ink-line rounded-lg px-4 py-3 outline-none focus:border-signal transition-colors"
                >
                  {workspaces.map((w) => (
                    <option key={w.id} value={w.id}>{w.name}</option>
                  ))}
                </select>
              </div>
            )}

            {templates.length > 0 && (
              <div>
                <label htmlFor="template" className="block text-sm text-muted mb-2">Template (optional)</label>
                <select
                  id="template"
                  value={templateId}
                  onChange={(e) => setTemplateId(e.target.value)}
                  className="w-full bg-ink-soft border border-ink-line rounded-lg px-4 py-3 outline-none focus:border-signal transition-colors"
                >
                  <option value="">None</option>
                  {templates.map((t) => (
                    <option key={t.id} value={t.id}>{t.name}</option>
                  ))}
                </select>
              </div>
            )}

            <div>
              <label htmlFor="title" className="block text-sm text-muted mb-2">Title</label>
              <input
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Weekly sync"
                className="w-full bg-ink-soft border border-ink-line rounded-lg px-4 py-3 outline-none focus:border-signal transition-colors"
              />
            </div>
            <div>
              <label htmlFor="scheduledAt" className="block text-sm text-muted mb-2">Date & time (optional)</label>
              <input
                id="scheduledAt"
                type="datetime-local"
                value={scheduledAt}
                onChange={(e) => setScheduledAt(e.target.value)}
                className="w-full bg-ink-soft border border-ink-line rounded-lg px-4 py-3 outline-none focus:border-signal transition-colors font-mono text-sm [color-scheme:dark]"
              />
            </div>

            <button
              type="submit"
              disabled={loading || !title.trim() || !workspaceId}
              className="w-full bg-signal text-ink font-semibold py-3 rounded-lg hover:brightness-110 transition-all disabled:opacity-40 disabled:cursor-not-allowed"
            >
              {loading ? "Creating room…" : "Create meeting"}
            </button>
          </form>
        )}
      </div>
    </AppShell>
  );
}
