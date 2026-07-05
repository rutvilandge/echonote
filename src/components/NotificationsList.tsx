"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Bell, Trash2, Search } from "lucide-react";
import { toast } from "sonner";

type Notification = {
  id: string;
  message: string;
  read: boolean;
  createdAt: string;
  meeting: { id: string; title: string } | null;
};

function relativeTime(iso: string) {
  const diffMs = Date.now() - new Date(iso).getTime();
  const mins = Math.floor(diffMs / 60000);
  if (mins < 1) return "just now";
  if (mins < 60) return `${mins}m ago`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  if (days < 7) return `${days}d ago`;
  return new Date(iso).toLocaleDateString(undefined, { month: "short", day: "numeric" });
}

export default function NotificationsList({ initial }: { initial: Notification[] }) {
  const [items, setItems] = useState(initial);
  const [filter, setFilter] = useState<"all" | "unread">("all");
  const [query, setQuery] = useState("");

  const filtered = useMemo(() => {
    return items.filter((n) => {
      const matchesFilter = filter === "all" || !n.read;
      const matchesQuery = n.message.toLowerCase().includes(query.toLowerCase());
      return matchesFilter && matchesQuery;
    });
  }, [items, filter, query]);

  async function markRead(id: string) {
    setItems((prev) => prev.map((n) => (n.id === id ? { ...n, read: true } : n)));
    await fetch(`/api/notifications/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ read: true }),
    });
  }

  async function deleteNotification(id: string) {
    setItems((prev) => prev.filter((n) => n.id !== id));
    await fetch(`/api/notifications/${id}`, { method: "DELETE" });
    toast.success("Notification removed");
  }

  return (
    <div>
      <div className="flex flex-wrap items-center gap-3 mb-6">
        <div className="flex items-center gap-2 border border-ink-line rounded-lg px-3 py-2 flex-1 min-w-[200px] max-w-xs">
          <Search size={14} className="text-muted" aria-hidden="true" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search notifications…"
            aria-label="Search notifications"
            className="bg-transparent outline-none text-sm w-full placeholder:text-muted"
          />
        </div>
        <div className="flex gap-1">
          {(["all", "unread"] as const).map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`text-xs px-3 py-1.5 rounded-full border transition-colors capitalize ${
                filter === f ? "bg-signal text-ink border-signal font-medium" : "border-ink-line text-muted hover:text-paper"
              }`}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      {filtered.length === 0 ? (
        <div className="border border-dashed border-ink-line rounded-xl p-10 text-center">
          <Bell size={22} className="text-muted mx-auto mb-3" aria-hidden="true" />
          <p className="text-sm text-muted">
            {items.length === 0 ? "Nothing yet — you'll see alerts here when meetings are scheduled or summaries are ready." : "No notifications match."}
          </p>
        </div>
      ) : (
        <ul className="space-y-2" role="list">
          <AnimatePresence initial={false}>
            {filtered.map((n, i) => (
              <motion.li
                key={n.id}
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ delay: Math.min(i * 0.03, 0.3) }}
                className={`flex items-center gap-4 border rounded-xl px-4 py-3 transition-colors ${
                  n.read ? "border-ink-line" : "border-signal/40 bg-signal/5"
                }`}
              >
                <button
                  onClick={() => !n.read && markRead(n.id)}
                  className="flex items-center gap-4 flex-1 min-w-0 text-left"
                >
                  <span className={`w-2 h-2 rounded-full shrink-0 ${n.read ? "bg-ink-line" : "bg-signal"}`} aria-hidden="true" />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm truncate">{n.message}</p>
                    {n.meeting && (
                      <Link href={`/meetings/${n.meeting.id}`} className="text-xs text-signal hover:underline" onClick={(e) => e.stopPropagation()}>
                        {n.meeting.title}
                      </Link>
                    )}
                  </div>
                </button>
                <span className="font-mono text-xs text-muted shrink-0" suppressHydrationWarning>{relativeTime(n.createdAt)}</span>
                <button onClick={() => deleteNotification(n.id)} className="text-muted hover:text-danger transition-colors shrink-0" aria-label="Delete notification">
                  <Trash2 size={14} />
                </button>
              </motion.li>
            ))}
          </AnimatePresence>
        </ul>
      )}
    </div>
  );
}
