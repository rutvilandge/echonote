"use client";

import { useState } from "react";
import { toast } from "sonner";
import Link from "next/link";
import { Plus, Trash2, FileStack } from "lucide-react";

type Template = { id: string; name: string; description: string | null; defaultTitle: string | null; promptHint: string | null };

export default function TemplatesManager({ workspaceId, initialTemplates }: { workspaceId: string; initialTemplates: Template[] }) {
  const useTemplateHref = (templateId: string) => `/meetings/new?workspaceId=${workspaceId}&templateId=${templateId}`;
  const [templates, setTemplates] = useState(initialTemplates);
  const [showForm, setShowForm] = useState(false);
  const [name, setName] = useState("");
  const [promptHint, setPromptHint] = useState("");

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim()) return;
    const res = await fetch("/api/templates", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ workspaceId, name, defaultTitle: name, promptHint }),
    });
    if (res.ok) {
      const t = await res.json();
      setTemplates((prev) => [...prev, t]);
      setName("");
      setPromptHint("");
      setShowForm(false);
      toast.success(`"${t.name}" template created`);
    }
  }

  async function handleDelete(id: string) {
    setTemplates((prev) => prev.filter((t) => t.id !== id));
    await fetch(`/api/templates/${id}`, { method: "DELETE" });
  }

  return (
    <div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
        {templates.map((t) => (
          <div key={t.id} className="border border-ink-line rounded-xl p-5 group relative">
            <FileStack size={16} className="text-signal mb-3" aria-hidden="true" />
            <h3 className="font-medium text-sm mb-1">{t.name}</h3>
            {t.promptHint && <p className="text-xs text-muted leading-relaxed mb-3">{t.promptHint}</p>}
            <div className="flex items-center gap-3">
              <Link
                href={useTemplateHref(t.id)}
                className="text-xs text-signal hover:underline"
              >
                Use template
              </Link>
              <button
                onClick={() => handleDelete(t.id)}
                className="text-xs text-muted hover:text-danger transition-colors opacity-0 group-hover:opacity-100 ml-auto"
                aria-label={`Delete ${t.name}`}
              >
                <Trash2 size={13} />
              </button>
            </div>
          </div>
        ))}

        <button
          onClick={() => setShowForm(true)}
          className="border border-dashed border-ink-line rounded-xl p-5 flex flex-col items-center justify-center gap-2 text-muted hover:border-signal hover:text-signal transition-colors min-h-[120px]"
        >
          <Plus size={18} aria-hidden="true" />
          <span className="text-sm">New template</span>
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleCreate} className="border border-ink-line rounded-xl p-5 max-w-md space-y-3">
          <input
            autoFocus
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Template name"
            className="w-full bg-ink-soft border border-ink-line rounded-lg px-3.5 py-2.5 text-sm outline-none focus:border-signal"
          />
          <textarea
            value={promptHint}
            onChange={(e) => setPromptHint(e.target.value)}
            placeholder="What should the AI summary focus on for this meeting type?"
            rows={3}
            className="w-full bg-ink-soft border border-ink-line rounded-lg px-3.5 py-2.5 text-sm outline-none focus:border-signal resize-none"
          />
          <div className="flex gap-2">
            <button type="submit" className="bg-signal text-ink font-semibold text-sm px-4 py-2 rounded-lg hover:brightness-110 transition-all">
              Create
            </button>
            <button type="button" onClick={() => setShowForm(false)} className="text-sm text-muted hover:text-paper transition-colors">
              Cancel
            </button>
          </div>
        </form>
      )}
    </div>
  );
}
