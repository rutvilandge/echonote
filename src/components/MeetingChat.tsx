"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";
import { Waveform } from "./Waveform";

type Message = { role: "user" | "assistant"; content: string };

export default function MeetingChat({ meetingId }: { meetingId: string }) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  async function sendMessage() {
    if (!input.trim() || loading) return;
    const question = input;
    setMessages((prev) => [...prev, { role: "user", content: question }]);
    setInput("");
    setLoading(true);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ meetingId, question }),
      });
      if (!res.ok) throw new Error();
      const data = await res.json();
      setMessages((prev) => [...prev, { role: "assistant", content: data.answer ?? "No answer found." }]);
    } catch {
      toast.error("Couldn't get an answer. Try again.");
      setMessages((prev) => prev.slice(0, -1));
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="border border-ink-line rounded-xl bg-ink-soft/60 p-4">
      {messages.length === 0 && (
        <p className="text-sm text-muted font-mono px-1 pb-3">
          e.g. "what did we decide about the launch date?"
        </p>
      )}

      {messages.length > 0 && (
        <div className="space-y-3 max-h-80 overflow-y-auto mb-4 pr-1" role="log" aria-live="polite">
          <AnimatePresence initial={false}>
            {messages.map((m, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                className={m.role === "user" ? "text-right" : "text-left"}
              >
                <span
                  className={`inline-block px-3.5 py-2 rounded-lg text-sm max-w-[85%] text-left ${
                    m.role === "user" ? "bg-signal text-ink font-medium" : "bg-ink border border-ink-line"
                  }`}
                >
                  {m.content}
                </span>
              </motion.div>
            ))}
          </AnimatePresence>
          {loading && (
            <div className="flex items-center gap-2 pl-1">
              <Waveform size="sm" tone="synth" />
            </div>
          )}
          <div ref={endRef} />
        </div>
      )}

      <div className="flex gap-2">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && sendMessage()}
          placeholder="Ask this meeting something…"
          aria-label="Ask this meeting a question"
          className="flex-1 bg-ink border border-ink-line rounded-lg px-3.5 py-2.5 text-sm outline-none focus:border-signal transition-colors"
        />
        <button
          onClick={sendMessage}
          disabled={loading || !input.trim()}
          className="bg-signal text-ink font-semibold px-4 py-2.5 rounded-lg text-sm hover:brightness-110 transition-all disabled:opacity-40 disabled:cursor-not-allowed"
        >
          Ask
        </button>
      </div>
    </div>
  );
}
