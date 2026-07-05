"use client";

import { useState } from "react";
import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";

type Meeting = { id: string; title: string; scheduledAt: string; status: string };

export default function CalendarMonthView({ meetings }: { meetings: Meeting[] }) {
  const [cursor, setCursor] = useState(new Date());

  const year = cursor.getFullYear();
  const month = cursor.getMonth();
  const firstDay = new Date(year, month, 1);
  const startWeekday = firstDay.getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const cells: (number | null)[] = [
    ...Array(startWeekday).fill(null),
    ...Array.from({ length: daysInMonth }, (_, i) => i + 1),
  ];
  while (cells.length % 7 !== 0) cells.push(null);

  const meetingsByDay = new Map<number, Meeting[]>();
  meetings.forEach((m) => {
    const d = new Date(m.scheduledAt);
    if (d.getFullYear() === year && d.getMonth() === month) {
      const day = d.getDate();
      meetingsByDay.set(day, [...(meetingsByDay.get(day) ?? []), m]);
    }
  });

  const today = new Date();
  const isToday = (day: number) => today.getFullYear() === year && today.getMonth() === month && today.getDate() === day;

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h2 className="font-display text-xl">
          {cursor.toLocaleDateString(undefined, { month: "long", year: "numeric" })}
        </h2>
        <div className="flex gap-1">
          <button
            onClick={() => setCursor(new Date(year, month - 1, 1))}
            className="p-1.5 rounded-lg border border-ink-line hover:border-signal transition-colors"
            aria-label="Previous month"
          >
            <ChevronLeft size={15} />
          </button>
          <button
            onClick={() => setCursor(new Date(year, month + 1, 1))}
            className="p-1.5 rounded-lg border border-ink-line hover:border-signal transition-colors"
            aria-label="Next month"
          >
            <ChevronRight size={15} />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-7 gap-px bg-ink-line rounded-xl overflow-hidden border border-ink-line">
        {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((d) => (
          <div key={d} className="bg-ink-soft text-center text-xs font-mono text-muted py-2">
            {d}
          </div>
        ))}
        {cells.map((day, i) => (
          <div key={i} className={`bg-ink min-h-[90px] p-2 ${day && isToday(day) ? "bg-signal/5" : ""}`}>
            {day && (
              <>
                <span className={`text-xs font-mono ${isToday(day) ? "text-signal font-bold" : "text-muted"}`}>{day}</span>
                <div className="mt-1 space-y-1">
                  {(meetingsByDay.get(day) ?? []).slice(0, 2).map((m) => (
                    <Link
                      key={m.id}
                      href={`/meetings/${m.id}`}
                      className="block text-[11px] bg-signal/15 text-signal rounded px-1.5 py-0.5 truncate hover:bg-signal/25 transition-colors"
                    >
                      {m.title}
                    </Link>
                  ))}
                  {(meetingsByDay.get(day)?.length ?? 0) > 2 && (
                    <span className="text-[10px] text-muted">+{(meetingsByDay.get(day)?.length ?? 0) - 2} more</span>
                  )}
                </div>
              </>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
