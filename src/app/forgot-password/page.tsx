"use client";

import { useState } from "react";
import Link from "next/link";
import { Waveform } from "@/components/Waveform";
import { Mail } from "lucide-react";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    try {
      await fetch("/api/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      setSent(true);
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen flex flex-col items-center justify-center px-6">
      <Link href="/" className="flex items-center gap-2.5 mb-10">
        <Waveform size="sm" animated={false} />
        <span className="font-display italic text-lg tracking-tight">EchoNote</span>
      </Link>

      <div className="w-full max-w-sm border border-ink-line rounded-xl p-8 bg-ink-soft/60">
        {sent ? (
          <div className="text-center py-4">
            <Mail size={28} className="text-signal mx-auto mb-4" aria-hidden="true" />
            <h1 className="font-display text-xl mb-2">Check your email</h1>
            <p className="text-sm text-muted">
              If an account exists for {email}, a reset link is on its way.
            </p>
          </div>
        ) : (
          <>
            <h1 className="font-display text-2xl mb-1">Reset your password</h1>
            <p className="text-sm text-muted mb-6">
              Enter your email and we'll send you a reset link.
            </p>
            <form onSubmit={handleSubmit} className="space-y-3">
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Email"
                aria-label="Email"
                className="w-full bg-ink border border-ink-line rounded-lg px-3.5 py-2.5 text-sm outline-none focus:border-signal transition-colors"
              />
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-signal text-ink font-semibold py-2.5 rounded-lg hover:brightness-110 transition-all disabled:opacity-40 text-sm"
              >
                {loading ? "Sending…" : "Send reset link"}
              </button>
            </form>
          </>
        )}
        <p className="text-center text-sm text-muted mt-6">
          <Link href="/login" className="text-signal hover:underline">Back to sign in</Link>
        </p>
      </div>
    </main>
  );
}
