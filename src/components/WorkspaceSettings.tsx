"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

type Member = { id: string; role: string; user: { name: string | null; email: string } };

export default function WorkspaceSettings({
  workspace,
  members,
  currentRole,
}: {
  workspace: { id: string; name: string; slackWebhookUrl: string | null };
  members: Member[];
  currentRole: string;
}) {
  const router = useRouter();
  const [name, setName] = useState(workspace.name);
  const [webhookUrl, setWebhookUrl] = useState(workspace.slackWebhookUrl ?? "");
  const [transferTo, setTransferTo] = useState("");
  const isOwner = currentRole === "OWNER";

  async function handleRename(e: React.FormEvent) {
    e.preventDefault();
    const res = await fetch(`/api/workspaces/${workspace.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name }),
    });
    if (res.ok) toast.success("Workspace renamed");
    else toast.error("Couldn't rename workspace");
  }

  async function handleSlackSave() {
    const res = await fetch(`/api/workspaces/${workspace.id}/slack`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ webhookUrl }),
    });
    const data = await res.json();
    if (data.error) toast.error(data.error);
    else toast.success(webhookUrl ? "Slack connected" : "Slack disconnected");
  }

  async function handleTransfer() {
    if (!transferTo) return;
    if (!confirm("Transfer ownership? You'll become an admin.")) return;
    const res = await fetch(`/api/workspaces/${workspace.id}/transfer`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ newOwnerMemberId: transferTo }),
    });
    if (res.ok) {
      toast.success("Ownership transferred");
      router.refresh();
    } else {
      toast.error("Couldn't transfer ownership");
    }
  }

  async function handleDelete() {
    if (!confirm(`Delete "${workspace.name}" permanently? This cannot be undone.`)) return;
    const res = await fetch(`/api/workspaces/${workspace.id}`, { method: "DELETE" });
    if (res.ok) {
      toast.success("Workspace deleted");
      router.push("/dashboard");
    } else {
      toast.error("Couldn't delete workspace");
    }
  }

  return (
    <div className="max-w-lg space-y-10">
      <form onSubmit={handleRename}>
        <h2 className="text-xs font-mono uppercase tracking-widest text-muted mb-3">Name</h2>
        <div className="flex gap-2">
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="flex-1 bg-ink-soft border border-ink-line rounded-lg px-3.5 py-2.5 text-sm outline-none focus:border-signal"
          />
          <button type="submit" className="bg-signal text-ink font-semibold text-sm px-4 py-2.5 rounded-lg hover:brightness-110 transition-all">
            Save
          </button>
        </div>
      </form>

      <div>
        <h2 className="text-xs font-mono uppercase tracking-widest text-muted mb-3">Slack notifications</h2>
        <p className="text-xs text-muted mb-3">
          Paste an incoming webhook from{" "}
          <a href="https://api.slack.com/messaging/webhooks" target="_blank" rel="noreferrer" className="text-signal hover:underline">
            api.slack.com/messaging/webhooks
          </a>
        </p>
        <div className="flex gap-2">
          <input
            value={webhookUrl}
            onChange={(e) => setWebhookUrl(e.target.value)}
            placeholder="https://hooks.slack.com/services/…"
            className="flex-1 bg-ink-soft border border-ink-line rounded-lg px-3.5 py-2.5 text-sm outline-none focus:border-signal font-mono"
          />
          <button onClick={handleSlackSave} className="bg-signal text-ink font-semibold text-sm px-4 py-2.5 rounded-lg hover:brightness-110 transition-all">
            Save
          </button>
        </div>
      </div>

      {isOwner && (
        <div>
          <h2 className="text-xs font-mono uppercase tracking-widest text-muted mb-3">Transfer ownership</h2>
          <div className="flex gap-2">
            <select
              value={transferTo}
              onChange={(e) => setTransferTo(e.target.value)}
              className="flex-1 bg-ink-soft border border-ink-line rounded-lg px-3.5 py-2.5 text-sm outline-none"
            >
              <option value="">Select a member…</option>
              {members.filter((m) => m.role !== "OWNER").map((m) => (
                <option key={m.id} value={m.id}>{m.user.name || m.user.email}</option>
              ))}
            </select>
            <button onClick={handleTransfer} disabled={!transferTo} className="border border-ink-line text-sm px-4 py-2.5 rounded-lg hover:border-signal transition-colors disabled:opacity-40">
              Transfer
            </button>
          </div>
        </div>
      )}

      {isOwner && (
        <div className="border border-danger/30 rounded-xl p-5">
          <h2 className="text-sm font-medium text-danger mb-1">Delete workspace</h2>
          <p className="text-xs text-muted mb-4">Permanently deletes all meetings, transcripts, and data in this workspace.</p>
          <button onClick={handleDelete} className="text-sm bg-danger/10 text-danger border border-danger/30 rounded-lg px-4 py-2 hover:bg-danger/20 transition-colors">
            Delete workspace
          </button>
        </div>
      )}
    </div>
  );
}
