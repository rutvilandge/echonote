"use client";

import Link from "next/link";
import { motion } from "framer-motion";

const statusTone: Record<string, string> = {
  SCHEDULED: "text-muted",
  LIVE: "text-signal",
  ENDED: "text-muted",
  PROCESSING: "text-synth",
  READY: "text-synth",
};

type Meeting = {
  id: string;
  title: string;
  status: string;
  scheduledAt: Date | string | null;
  actionItems: { done: boolean }[];
};

export default function MeetingListItem({ meeting, index }: { meeting: Meeting; index: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25, delay: Math.min(index * 0.04, 0.3) }}
    >
      <Link
        href={`/meetings/${meeting.id}`}
        className="flex items-center gap-4 py-4 border-b border-ink-line hover:bg-ink-soft/50 transition-colors px-2 -mx-2 rounded"
      >
        <span className="font-mono text-xs text-muted w-32 shrink-0" suppressHydrationWarning>
          {meeting.scheduledAt
            ? new Date(meeting.scheduledAt).toLocaleString(undefined, {
                month: "short",
                day: "numeric",
                hour: "numeric",
                minute: "2-digit",
              })
            : "unscheduled"}
        </span>
        <span className="flex-1 font-medium truncate">{meeting.title}</span>
        {meeting.actionItems.length > 0 && (
          <span className="font-mono text-xs text-muted">
            {meeting.actionItems.filter((a) => !a.done).length}/{meeting.actionItems.length} open
          </span>
        )}
        <span className={`font-mono text-xs uppercase w-20 text-right ${statusTone[meeting.status]}`}>
          {meeting.status}
        </span>
      </Link>
    </motion.div>
  );
}
