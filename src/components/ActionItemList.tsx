"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { toast } from "sonner";

type ActionItem = { id: string; text: string; done: boolean };

export default function ActionItemList({ items }: { items: ActionItem[] }) {
  const [state, setState] = useState(items);

  async function toggle(id: string, done: boolean) {
    const previous = state;
    // Optimistic update — flip immediately, roll back on failure.
    setState((prev) => prev.map((i) => (i.id === id ? { ...i, done } : i)));

    try {
      const res = await fetch(`/api/action-items/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ done }),
      });
      if (!res.ok) throw new Error();
    } catch {
      setState(previous);
      toast.error("Couldn't update that action item");
    }
  }

  return (
    <ul className="space-y-2" role="list">
      {state.map((item, i) => (
        <motion.li
          key={item.id}
          initial={{ opacity: 0, x: -6 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: i * 0.03, duration: 0.2 }}
          className="flex items-start gap-3"
        >
          <button
            onClick={() => toggle(item.id, !item.done)}
            className={`mt-0.5 w-4 h-4 rounded border shrink-0 transition-colors ${
              item.done ? "bg-signal border-signal" : "border-ink-line hover:border-signal"
            }`}
            aria-pressed={item.done}
            aria-label={item.done ? `Mark "${item.text}" incomplete` : `Mark "${item.text}" complete`}
          />
          <span className={item.done ? "text-muted line-through" : "text-paper/90"}>{item.text}</span>
        </motion.li>
      ))}
    </ul>
  );
}
