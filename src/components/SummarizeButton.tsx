"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Waveform } from "./Waveform";

export default function SummarizeButton({ meetingId }: { meetingId: string }) {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function handleClick() {
    setLoading(true);
    try {
      await fetch("/api/summarize", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ meetingId }),
      });
      router.refresh();
    } finally {
      setLoading(false);
    }
  }

  if (loading) {
    return (
      <div className="flex items-center gap-3">
        <Waveform size="sm" tone="synth" />
        <span className="text-sm text-muted font-mono">generating summary…</span>
      </div>
    );
  }

  return (
    <button
      onClick={handleClick}
      className="bg-synth text-ink font-semibold text-sm px-5 py-2.5 rounded-lg hover:brightness-110 transition-all"
    >
      Generate summary
    </button>
  );
}
