"use client";

import { useMemo, useState } from "react";
import { Search } from "lucide-react";
import MeetingListItem from "./MeetingListItem";

type Meeting = {
  id: string;
  title: string;
  status: string;
  scheduledAt: string | null;
  actionItems: { done: boolean }[];
};

const FILTERS = ["All", "Upcoming", "Completed", "Draft"] as const;

export default function MeetingsFilterClient({ meetings }: { meetings: Meeting[] }) {
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState<(typeof FILTERS)[number]>("All");

  const filtered = useMemo(() => {
    return meetings.filter((m) => {
      const matchesQuery = m.title.toLowerCase().includes(query.toLowerCase());
      const now = new Date();
      const matchesFilter =
        filter === "All" ||
        (filter === "Upcoming" && m.scheduledAt && new Date(m.scheduledAt) > now) ||
        (filter === "Completed" && (m.status === "ENDED" || m.status === "READY")) ||
        (filter === "Draft" && m.status === "SCHEDULED" && !m.scheduledAt);
      return matchesQuery && matchesFilter;
    });
  }, [meetings, query, filter]);

  return (
    <div>
      <div className="flex flex-wrap items-center gap-3 mb-6">
        <div className="flex items-center gap-2 border border-ink-line rounded-lg px-3 py-2 flex-1 min-w-[200px] max-w-xs">
          <Search size={14} className="text-muted" aria-hidden="true" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search meetings…"
            aria-label="Search meetings"
            className="bg-transparent outline-none text-sm w-full placeholder:text-muted"
          />
        </div>
        <div className="flex gap-1" role="tablist" aria-label="Filter meetings">
          {FILTERS.map((f) => (
            <button
              key={f}
              role="tab"
              aria-selected={filter === f}
              onClick={() => setFilter(f)}
              className={`text-xs px-3 py-1.5 rounded-full border transition-colors ${
                filter === f ? "bg-signal text-ink border-signal font-medium" : "border-ink-line text-muted hover:text-paper"
              }`}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      {filtered.length === 0 ? (
        <div className="border border-dashed border-ink-line rounded-xl p-10 text-center text-sm text-muted">
          No meetings match "{query || filter}".
        </div>
      ) : (
        <div className="border-t border-ink-line">
          {filtered.map((meeting, i) => (
            <MeetingListItem key={meeting.id} meeting={meeting} index={i} />
          ))}
        </div>
      )}
    </div>
  );
}
