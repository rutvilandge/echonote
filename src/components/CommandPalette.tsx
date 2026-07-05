"use client";

import { useEffect, useState, useCallback } from "react";
import { Command } from "cmdk";
import { useRouter } from "next/navigation";
import {
  LayoutDashboard, CalendarPlus, Briefcase, Search, Settings, User, Sun, Moon,
  CalendarDays, FileStack, ListChecks,
} from "lucide-react";
import { useTheme } from "next-themes";

type SearchResults = {
  meetings: { id: string; title: string }[];
  templates: { id: string; name: string }[];
  members: { id: string; user: { name: string | null; email: string } }[];
  actionItems: { id: string; text: string; meetingId: string }[];
};

export function CommandPalette() {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchResults | null>(null);
  const router = useRouter();
  const { theme, setTheme } = useTheme();

  useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setOpen((v) => !v);
      }
      if (e.key === "Escape") setOpen(false);
    }
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, []);

  useEffect(() => {
    if (query.trim().length < 2) {
      setResults(null);
      return;
    }
    const timeout = setTimeout(() => {
      fetch(`/api/search?q=${encodeURIComponent(query)}`)
        .then((res) => (res.ok ? res.json() : null))
        .then(setResults)
        .catch(() => setResults(null));
    }, 200);
    return () => clearTimeout(timeout);
  }, [query]);

  const go = useCallback(
    (path: string) => {
      router.push(path);
      setOpen(false);
      setQuery("");
    },
    [router]
  );

  if (!open) return null;

  const hasResults = results && (results.meetings.length || results.templates.length || results.members.length || results.actionItems.length);

  return (
    <div
      className="fixed inset-0 z-50 flex items-start justify-center pt-[15vh] bg-black/50 backdrop-blur-sm"
      onClick={() => setOpen(false)}
      role="presentation"
    >
      <Command
        shouldFilter={false}
        className="w-full max-w-lg bg-ink-soft border border-ink-line rounded-xl shadow-2xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
        label="Command palette"
      >
        <div className="flex items-center gap-3 px-4 border-b border-ink-line">
          <Search size={16} className="text-muted shrink-0" aria-hidden="true" />
          <Command.Input
            autoFocus
            value={query}
            onValueChange={setQuery}
            placeholder="Search meetings, action items, members…"
            className="w-full bg-transparent py-3.5 text-sm outline-none placeholder:text-muted"
          />
          <kbd className="hidden sm:inline font-mono text-[10px] text-muted border border-ink-line rounded px-1.5 py-0.5">esc</kbd>
        </div>
        <Command.List className="max-h-96 overflow-y-auto p-2">
          <Command.Empty className="text-sm text-muted text-center py-8">
            {query.length >= 2 ? "No results found." : "Type to search, or jump to a page below."}
          </Command.Empty>

          {query.length >= 2 && hasResults && (
            <>
              {results!.meetings.length > 0 && (
                <Command.Group heading="Meetings" className="text-[10px] font-mono uppercase tracking-widest text-muted px-2 pt-2 pb-1">
                  {results!.meetings.map((m) => (
                    <Command.Item key={m.id} onSelect={() => go(`/meetings/${m.id}`)} className="flex items-center gap-3 px-2 py-2.5 rounded-lg text-sm cursor-pointer data-[selected=true]:bg-ink">
                      <CalendarDays size={15} aria-hidden="true" /> {m.title}
                    </Command.Item>
                  ))}
                </Command.Group>
              )}
              {results!.actionItems.length > 0 && (
                <Command.Group heading="Action Items" className="text-[10px] font-mono uppercase tracking-widest text-muted px-2 pt-3 pb-1">
                  {results!.actionItems.map((a) => (
                    <Command.Item key={a.id} onSelect={() => go(`/meetings/${a.meetingId}`)} className="flex items-center gap-3 px-2 py-2.5 rounded-lg text-sm cursor-pointer data-[selected=true]:bg-ink">
                      <ListChecks size={15} aria-hidden="true" /> {a.text}
                    </Command.Item>
                  ))}
                </Command.Group>
              )}
              {results!.templates.length > 0 && (
                <Command.Group heading="Templates" className="text-[10px] font-mono uppercase tracking-widest text-muted px-2 pt-3 pb-1">
                  {results!.templates.map((t) => (
                    <Command.Item key={t.id} onSelect={() => go(`/templates`)} className="flex items-center gap-3 px-2 py-2.5 rounded-lg text-sm cursor-pointer data-[selected=true]:bg-ink">
                      <FileStack size={15} aria-hidden="true" /> {t.name}
                    </Command.Item>
                  ))}
                </Command.Group>
              )}
              {results!.members.length > 0 && (
                <Command.Group heading="Members" className="text-[10px] font-mono uppercase tracking-widest text-muted px-2 pt-3 pb-1">
                  {results!.members.map((m) => (
                    <Command.Item key={m.id} onSelect={() => go(`/members`)} className="flex items-center gap-3 px-2 py-2.5 rounded-lg text-sm cursor-pointer data-[selected=true]:bg-ink">
                      <User size={15} aria-hidden="true" /> {m.user.name || m.user.email}
                    </Command.Item>
                  ))}
                </Command.Group>
              )}
            </>
          )}

          {query.length < 2 && (
            <>
              <Command.Group heading="Navigate" className="text-[10px] font-mono uppercase tracking-widest text-muted px-2 pt-2 pb-1">
                <Command.Item onSelect={() => go("/dashboard")} className="flex items-center gap-3 px-2 py-2.5 rounded-lg text-sm cursor-pointer data-[selected=true]:bg-ink">
                  <LayoutDashboard size={16} aria-hidden="true" /> Dashboard
                </Command.Item>
                <Command.Item onSelect={() => go("/meetings/new")} className="flex items-center gap-3 px-2 py-2.5 rounded-lg text-sm cursor-pointer data-[selected=true]:bg-ink">
                  <CalendarPlus size={16} aria-hidden="true" /> Schedule a meeting
                </Command.Item>
                <Command.Item onSelect={() => go("/workspace")} className="flex items-center gap-3 px-2 py-2.5 rounded-lg text-sm cursor-pointer data-[selected=true]:bg-ink">
                  <Briefcase size={16} aria-hidden="true" /> Workspace settings
                </Command.Item>
                <Command.Item onSelect={() => go("/settings")} className="flex items-center gap-3 px-2 py-2.5 rounded-lg text-sm cursor-pointer data-[selected=true]:bg-ink">
                  <Settings size={16} aria-hidden="true" /> Settings
                </Command.Item>
                <Command.Item onSelect={() => go("/profile")} className="flex items-center gap-3 px-2 py-2.5 rounded-lg text-sm cursor-pointer data-[selected=true]:bg-ink">
                  <User size={16} aria-hidden="true" /> Profile
                </Command.Item>
              </Command.Group>
              <Command.Group heading="Preferences" className="text-[10px] font-mono uppercase tracking-widest text-muted px-2 pt-3 pb-1">
                <Command.Item
                  onSelect={() => { setTheme(theme === "dark" ? "light" : "dark"); setOpen(false); }}
                  className="flex items-center gap-3 px-2 py-2.5 rounded-lg text-sm cursor-pointer data-[selected=true]:bg-ink"
                >
                  {theme === "dark" ? <Sun size={16} aria-hidden="true" /> : <Moon size={16} aria-hidden="true" />}
                  Switch to {theme === "dark" ? "light" : "dark"} mode
                </Command.Item>
              </Command.Group>
            </>
          )}
        </Command.List>
      </Command>
    </div>
  );
}
