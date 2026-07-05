"use client";

import { useEffect } from "react";
import { AlertTriangle } from "lucide-react";

export default function MeetingError({ error, reset }: { error: Error; reset: () => void }) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="border border-dashed border-danger/40 rounded-xl p-10 text-center">
      <AlertTriangle size={22} className="text-danger mx-auto mb-3" aria-hidden="true" />
      <p className="text-sm text-paper mb-1">Couldn't load this meeting.</p>
      <p className="text-xs text-muted mb-5">{error.message || "Something went wrong."}</p>
      <button
        onClick={reset}
        className="text-sm bg-signal text-ink font-semibold rounded-lg px-4 py-2 hover:brightness-110 transition-all"
      >
        Try again
      </button>
    </div>
  );
}
