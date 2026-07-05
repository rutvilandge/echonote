"use client";

import { useState } from "react";
import { toast } from "sonner";

const TIMEZONES = ["UTC", "America/New_York", "America/Los_Angeles", "Europe/London", "Asia/Kolkata", "Asia/Tokyo"];
const LANGUAGES = [{ code: "en", label: "English" }, { code: "es", label: "Spanish" }, { code: "hi", label: "Hindi" }];

export default function ProfileForm({ user }: { user: { name: string; email: string; timezone: string; language: string } }) {
  const [name, setName] = useState(user.name);
  const [timezone, setTimezone] = useState(user.timezone || "UTC");
  const [language, setLanguage] = useState(user.language || "en");
  const [saving, setSaving] = useState(false);

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    try {
      const res = await fetch("/api/profile", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, timezone, language }),
      });
      if (res.ok) toast.success("Profile updated");
      else toast.error("Couldn't save changes");
    } finally {
      setSaving(false);
    }
  }

  return (
    <form onSubmit={handleSave} className="max-w-md space-y-6">
      <div className="flex items-center gap-4">
        <div className="w-16 h-16 rounded-full bg-signal/20 flex items-center justify-center font-display text-2xl text-signal">
          {name ? name[0].toUpperCase() : "?"}
        </div>
        <div>
          <p className="text-sm font-medium">{name || "Unnamed"}</p>
          <p className="text-xs text-muted">{user.email}</p>
        </div>
      </div>

      <div>
        <label htmlFor="name" className="block text-sm text-muted mb-2">Name</label>
        <input
          id="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full bg-ink-soft border border-ink-line rounded-lg px-4 py-2.5 text-sm outline-none focus:border-signal transition-colors"
        />
      </div>

      <div>
        <label htmlFor="email" className="block text-sm text-muted mb-2">Email</label>
        <input
          id="email"
          value={user.email}
          disabled
          className="w-full bg-ink border border-ink-line rounded-lg px-4 py-2.5 text-sm text-muted cursor-not-allowed"
        />
      </div>

      <div>
        <label htmlFor="timezone" className="block text-sm text-muted mb-2">Timezone</label>
        <select
          id="timezone"
          value={timezone}
          onChange={(e) => setTimezone(e.target.value)}
          className="w-full bg-ink-soft border border-ink-line rounded-lg px-4 py-2.5 text-sm outline-none focus:border-signal transition-colors"
        >
          {TIMEZONES.map((tz) => <option key={tz} value={tz}>{tz}</option>)}
        </select>
      </div>

      <div>
        <label htmlFor="language" className="block text-sm text-muted mb-2">Language</label>
        <select
          id="language"
          value={language}
          onChange={(e) => setLanguage(e.target.value)}
          className="w-full bg-ink-soft border border-ink-line rounded-lg px-4 py-2.5 text-sm outline-none focus:border-signal transition-colors"
        >
          {LANGUAGES.map((l) => <option key={l.code} value={l.code}>{l.label}</option>)}
        </select>
      </div>

      <button
        type="submit"
        disabled={saving}
        className="bg-signal text-ink font-semibold px-5 py-2.5 rounded-lg hover:brightness-110 transition-all disabled:opacity-40 text-sm"
      >
        {saving ? "Saving…" : "Save changes"}
      </button>
    </form>
  );
}
