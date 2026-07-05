"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Pencil, Trash2, Check, X } from "lucide-react";
import { Waveform } from "./Waveform";

type Meeting = { id: string; title: string; scheduledAt: string | null; status: string };

export default function MeetingHeader({ meeting }: { meeting: Meeting }) {
  const router = useRouter();
  const [editing, setEditing] = useState(false);
  const [title, setTitle] = useState(meeting.title);
  const [scheduledAt, setScheduledAt] = useState(
    meeting.scheduledAt ? new Date(meeting.scheduledAt).toISOString().slice(0, 16) : ""
  );
  const [saving, setSaving] = useState(false);

  async function handleSave() {
    setSaving(true);
    try {
      const res = await fetch(`/api/meetings/${meeting.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, scheduledAt: scheduledAt || null }),
      });
      if (res.ok) {
        toast.success("Meeting updated");
        setEditing(false);
        router.refresh();
      } else {
        toast.error("Couldn't update meeting");
      }
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete() {
    if (!confirm(`Delete "${meeting.title}"? This can't be undone.`)) return;
    const res = await fetch(`/api/meetings/${meeting.id}`, { method: "DELETE" });
    if (res.ok) {
      toast.success("Meeting deleted");
      router.push("/meetings");
    } else {
      toast.error("Couldn't delete meeting");
    }
  }

  if (editing) {
    return (
      <div className="mb-8 border border-ink-line rounded-xl p-4 max-w-md space-y-3">
        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full bg-ink-soft border border-ink-line rounded-lg px-3.5 py-2.5 text-sm outline-none focus:border-signal"
        />
        <input
          type="datetime-local"
          value={scheduledAt}
          onChange={(e) => setScheduledAt(e.target.value)}
          className="w-full bg-ink-soft border border-ink-line rounded-lg px-3.5 py-2.5 text-sm outline-none focus:border-signal font-mono [color-scheme:dark]"
        />
        <div className="flex gap-2">
          <button onClick={handleSave} disabled={saving} className="flex items-center gap-1.5 bg-signal text-ink font-semibold text-sm px-3 py-1.5 rounded-lg hover:brightness-110 transition-all disabled:opacity-40">
            <Check size={14} /> Save
          </button>
          <button onClick={() => setEditing(false)} className="flex items-center gap-1.5 text-sm text-muted hover:text-paper transition-colors px-3 py-1.5">
            <X size={14} /> Cancel
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="mb-8">
      <div className="flex items-center gap-3 mb-2">
        <Waveform size="sm" tone={meeting.status === "LIVE" ? "signal" : "muted"} animated={meeting.status === "LIVE"} />
        <span className="font-mono text-xs text-muted uppercase tracking-widest">{meeting.status.toLowerCase()}</span>
      </div>
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="font-display text-4xl mb-1">{meeting.title}</h1>
          {meeting.scheduledAt && (
            <p className="font-mono text-sm text-muted" suppressHydrationWarning>
              {new Date(meeting.scheduledAt).toLocaleString(undefined, {
                weekday: "short", month: "short", day: "numeric", hour: "numeric", minute: "2-digit",
              })}
            </p>
          )}
        </div>
        <div className="flex gap-2 shrink-0">
          <button onClick={() => setEditing(true)} className="text-muted hover:text-signal transition-colors p-2 border border-ink-line rounded-lg" aria-label="Edit meeting">
            <Pencil size={15} />
          </button>
          <button onClick={handleDelete} className="text-muted hover:text-danger transition-colors p-2 border border-ink-line rounded-lg" aria-label="Delete meeting">
            <Trash2 size={15} />
          </button>
        </div>
      </div>
    </div>
  );
}
