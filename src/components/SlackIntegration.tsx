"use client";

import { useState } from "react";
import { toast } from "sonner";

export default function SlackIntegration({ workspaceId, initialWebhookUrl }: { workspaceId: string; initialWebhookUrl: string | null }) {
  const [url, setUrl] = useState(initialWebhookUrl ?? "");
  const [saving, setSaving] = useState(false);

  async function handleSave() {
    setSaving(true);
    try {
      const res = await fetch(`/api/workspaces/${workspaceId}/slack`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ webhookUrl: url }),
      });
      const data = await res.json();
      if (data.error) {
        toast.error(data.error);
      } else if (url) {
        toast.success("Slack connected — check your channel for a test message");
      } else {
        toast.success("Slack disconnected");
      }
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="border border-ink-line rounded-xl p-5 max-w-lg">
      <div className="flex items-center gap-3 mb-3">
        <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden="true">
          <path fill="#E01E5A" d="M6 15a2 2 0 1 1-2-2h2v2z" />
          <path fill="#E01E5A" d="M7 15a2 2 0 0 1 2-2 2 2 0 0 1 2 2v5a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-5z" />
          <path fill="#36C5F0" d="M9 6a2 2 0 1 1 2-2v2H9z" />
          <path fill="#36C5F0" d="M9 7a2 2 0 0 1-2 2 2 2 0 0 1-2-2V2a2 2 0 0 1 2-2 2 2 0 0 1 2 2v5z" />
          <path fill="#2EB67D" d="M18 9a2 2 0 1 1 2 2h-2V9z" />
          <path fill="#2EB67D" d="M17 9a2 2 0 0 1-2-2 2 2 0 0 1 2-2h5a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-5z" />
          <path fill="#ECB22E" d="M15 18a2 2 0 1 1-2 2v-2h2z" />
          <path fill="#ECB22E" d="M15 17a2 2 0 0 1 2-2 2 2 0 0 1 2 2v5a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-5z" />
        </svg>
        <span className="font-medium text-sm">Slack</span>
      </div>
      <p className="text-xs text-muted mb-4">
        Paste an incoming webhook URL from{" "}
        <a href="https://api.slack.com/messaging/webhooks" target="_blank" rel="noreferrer" className="text-signal hover:underline">
          api.slack.com/messaging/webhooks
        </a>{" "}
        — no OAuth app needed. New meetings and ready summaries will post there.
      </p>
      <div className="flex gap-2">
        <input
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          placeholder="https://hooks.slack.com/services/…"
          aria-label="Slack webhook URL"
          className="flex-1 bg-ink border border-ink-line rounded-lg px-3.5 py-2.5 text-sm outline-none focus:border-signal transition-colors font-mono"
        />
        <button
          onClick={handleSave}
          disabled={saving}
          className="bg-signal text-ink font-semibold px-4 py-2.5 rounded-lg text-sm hover:brightness-110 transition-all disabled:opacity-40"
        >
          {saving ? "Saving…" : "Save"}
        </button>
      </div>
    </div>
  );
}
