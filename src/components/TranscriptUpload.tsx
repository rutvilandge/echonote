"use client";

import { useState, useCallback, useRef } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { UploadCloud } from "lucide-react";

export default function TranscriptUpload({ meetingId }: { meetingId: string }) {
  const [dragging, setDragging] = useState(false);
  const [uploading, setUploading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  const handleFile = useCallback(
    async (file: File) => {
      if (!file.type.startsWith("text") && !file.name.endsWith(".txt") && !file.name.endsWith(".vtt")) {
        toast.error("Please upload a .txt or .vtt transcript file");
        return;
      }
      setUploading(true);
      try {
        const rawText = await file.text();
        const res = await fetch("/api/transcripts", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ meetingId, rawText }),
        });
        if (!res.ok) throw new Error();
        toast.success("Transcript uploaded — ready to summarize");
        router.refresh();
      } catch {
        toast.error("Upload failed. Try again.");
      } finally {
        setUploading(false);
      }
    },
    [meetingId, router]
  );

  return (
    <div
      onDragOver={(e) => {
        e.preventDefault();
        setDragging(true);
      }}
      onDragLeave={() => setDragging(false)}
      onDrop={(e) => {
        e.preventDefault();
        setDragging(false);
        const file = e.dataTransfer.files?.[0];
        if (file) handleFile(file);
      }}
      className={`border-2 border-dashed rounded-xl p-8 text-center transition-colors cursor-pointer ${
        dragging ? "border-signal bg-signal/5" : "border-ink-line hover:border-signal/50"
      }`}
      onClick={() => inputRef.current?.click()}
      role="button"
      tabIndex={0}
      aria-label="Upload transcript file"
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") inputRef.current?.click();
      }}
    >
      <input
        ref={inputRef}
        type="file"
        accept=".txt,.vtt,text/plain"
        className="sr-only"
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) handleFile(file);
        }}
      />
      <UploadCloud size={22} className={`mx-auto mb-3 ${dragging ? "text-signal" : "text-muted"}`} aria-hidden="true" />
      {uploading ? (
        <p className="text-sm text-muted font-mono">uploading…</p>
      ) : (
        <>
          <p className="text-sm text-muted">
            Drag a transcript file here, or <span className="text-signal">click to browse</span>
          </p>
          <p className="text-xs text-muted mt-1">.txt or .vtt</p>
        </>
      )}
    </div>
  );
}
