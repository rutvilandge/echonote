"use client";

import { useState, useEffect } from "react";
import { toast } from "sonner";
import { Copy, Trash2 } from "lucide-react";

const SECTIONS = ["General", "Workspace", "Notifications", "AI Preferences", "Recording", "Security", "Billing", "API Keys"] as const;

function ApiKeysSection() {
  const [keys, setKeys] = useState<{ id: string; name: string; keyPreview: string; createdAt: string }[]>([]);
  const [newKeyName, setNewKeyName] = useState("");
  const [freshKey, setFreshKey] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/api-keys")
      .then((res) => (res.ok ? res.json() : []))
      .then(setKeys)
      .finally(() => setLoading(false));
  }, []);

  async function handleGenerate() {
    const res = await fetch("/api/api-keys", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: newKeyName || "Untitled key" }),
    });
    if (!res.ok) {
      toast.error("Couldn't generate key");
      return;
    }
    const data = await res.json();
    setFreshKey(data.key);
    setKeys((prev) => [{ id: crypto.randomUUID(), name: newKeyName || "Untitled key", keyPreview: data.preview, createdAt: new Date().toISOString() }, ...prev]);
    setNewKeyName("");
  }

  async function handleRevoke(id: string) {
    setKeys((prev) => prev.filter((k) => k.id !== id));
    await fetch(`/api/api-keys/${id}`, { method: "DELETE" });
    toast.success("Key revoked");
  }

  return (
    <div>
      <h2 className="font-medium mb-4">API Keys</h2>

      {freshKey && (
        <div className="border border-signal/40 bg-signal/5 rounded-lg p-4 mb-4">
          <p className="text-xs text-muted mb-2">Copy this now — you won't be able to see it again.</p>
          <div className="flex items-center gap-2">
            <code className="flex-1 font-mono text-xs bg-ink px-3 py-2 rounded border border-ink-line truncate">{freshKey}</code>
            <button
              onClick={() => {
                navigator.clipboard.writeText(freshKey);
                toast.success("Copied");
              }}
              className="text-signal hover:brightness-110"
              aria-label="Copy key"
            >
              <Copy size={16} />
            </button>
          </div>
        </div>
      )}

      <div className="flex gap-2 mb-6">
        <input
          value={newKeyName}
          onChange={(e) => setNewKeyName(e.target.value)}
          placeholder="Key name (e.g. CI pipeline)"
          className="flex-1 bg-ink-soft border border-ink-line rounded-lg px-3.5 py-2.5 text-sm outline-none focus:border-signal"
        />
        <button
          onClick={handleGenerate}
          className="bg-signal text-ink font-semibold text-sm px-4 py-2.5 rounded-lg hover:brightness-110 transition-all"
        >
          Generate
        </button>
      </div>

      {loading ? (
        <p className="text-sm text-muted">Loading…</p>
      ) : keys.length === 0 ? (
        <p className="text-sm text-muted">No keys yet.</p>
      ) : (
        <div className="border-t border-ink-line">
          {keys.map((k) => (
            <div key={k.id} className="flex items-center gap-4 py-3 border-b border-ink-line">
              <span className="text-sm flex-1">{k.name}</span>
              <code className="font-mono text-xs text-muted">{k.keyPreview}</code>
              <button onClick={() => handleRevoke(k.id)} className="text-muted hover:text-danger transition-colors" aria-label={`Revoke ${k.name}`}>
                <Trash2 size={14} />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function Toggle({ label, defaultChecked = false }: { label: string; defaultChecked?: boolean }) {
  const [checked, setChecked] = useState(defaultChecked);
  return (
    <div className="flex items-center justify-between py-3 border-b border-ink-line last:border-0">
      <span className="text-sm">{label}</span>
      <button
        role="switch"
        aria-checked={checked}
        aria-label={label}
        onClick={() => setChecked((v) => !v)}
        className={`w-10 h-5.5 rounded-full relative transition-colors ${checked ? "bg-signal" : "bg-ink-line"}`}
      >
        <span
          className={`absolute top-0.5 left-0.5 w-4.5 h-4.5 rounded-full bg-white transition-transform ${
            checked ? "translate-x-4.5" : ""
          }`}
        />
      </button>
    </div>
  );
}

export default function SettingsTabs() {
  const [active, setActive] = useState<(typeof SECTIONS)[number]>("General");

  return (
    <div className="flex gap-8 flex-col sm:flex-row">
      <nav className="sm:w-48 shrink-0 space-y-0.5" aria-label="Settings sections">
        {SECTIONS.map((s) => (
          <button
            key={s}
            onClick={() => setActive(s)}
            className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${
              active === s ? "bg-signal/15 text-signal font-medium" : "text-muted hover:text-paper hover:bg-ink-soft"
            }`}
            aria-current={active === s ? "true" : undefined}
          >
            {s}
          </button>
        ))}
      </nav>

      <div className="flex-1 max-w-lg">
        {active === "General" && (
          <div>
            <h2 className="font-medium mb-4">General</h2>
            <Toggle label="Compact meeting list" />
            <Toggle label="24-hour time format" />
          </div>
        )}
        {active === "Workspace" && (
          <div>
            <h2 className="font-medium mb-4">Workspace</h2>
            <p className="text-sm text-muted mb-4">Rename, delete, transfer ownership, and Slack notifications live on the dedicated Workspace page.</p>
            <a href="/workspace" className="text-sm text-signal hover:underline">Go to Workspace settings →</a>
          </div>
        )}
        {active === "Notifications" && (
          <div>
            <h2 className="font-medium mb-4">Notifications</h2>
            <Toggle label="Meeting starts in 15 minutes" defaultChecked />
            <Toggle label="Summary ready" defaultChecked />
            <Toggle label="Action item overdue" defaultChecked />
            <Toggle label="New member joined" />
          </div>
        )}
        {active === "AI Preferences" && (
          <div>
            <h2 className="font-medium mb-4">AI Preferences</h2>
            <Toggle label="Auto-generate summary after each call" defaultChecked />
            <Toggle label="Auto-generate follow-up email" />
            <Toggle label="Sentiment analysis" />
          </div>
        )}
        {active === "Recording" && (
          <div>
            <h2 className="font-medium mb-4">Recording</h2>
            <Toggle label="Record video by default" defaultChecked />
            <Toggle label="Record audio-only fallback" defaultChecked />
          </div>
        )}
        {active === "Security" && (
          <div>
            <h2 className="font-medium mb-4">Security</h2>
            <Toggle label="Require sign-in to join meetings" defaultChecked />
            <Toggle label="Two-factor authentication" />
          </div>
        )}
        {active === "Billing" && (
          <div>
            <h2 className="font-medium mb-4">Billing</h2>
            <p className="text-sm text-muted leading-relaxed">
              This app is built entirely on free-tier infrastructure (Neon, Groq, Daily.co) by
              design, so there's no paid plan to manage here. You're not being charged for
              anything — there's simply nothing to bill.
            </p>
          </div>
        )}
        {active === "API Keys" && <ApiKeysSection />}
      </div>
    </div>
  );
}
