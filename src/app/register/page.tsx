"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { signIn } from "next-auth/react";
import { toast } from "sonner";
import { Waveform } from "@/components/Waveform";

export default function RegisterPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch("/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password }),
      });
      const data = await res.json();
      if (!res.ok) {
        toast.error(data.error ?? "Something went wrong");
        return;
      }
      toast.success("Workspace created — signing you in…");
      const signInRes = await signIn("credentials", { email, password, redirect: false });
      if (signInRes?.ok) router.push("/dashboard");
      else router.push("/login");
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
        <h1 className="font-display text-2xl mb-1">Create your workspace</h1>
        <p className="text-sm text-muted mb-6">Takes about a minute.</p>

        <form onSubmit={handleSubmit} className="space-y-3">
          <div>
            <label htmlFor="name" className="block text-xs text-muted mb-1.5">Name</label>
            <input
              id="name"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Ada Lovelace"
              className="w-full bg-ink border border-ink-line rounded-lg px-3.5 py-2.5 text-sm outline-none focus:border-signal transition-colors"
            />
          </div>
          <div>
            <label htmlFor="email" className="block text-xs text-muted mb-1.5">Email</label>
            <input
              id="email"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="ada@company.com"
              className="w-full bg-ink border border-ink-line rounded-lg px-3.5 py-2.5 text-sm outline-none focus:border-signal transition-colors"
            />
          </div>
          <div>
            <label htmlFor="password" className="block text-xs text-muted mb-1.5">Password</label>
            <input
              id="password"
              type="password"
              required
              minLength={8}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="At least 8 characters"
              className="w-full bg-ink border border-ink-line rounded-lg px-3.5 py-2.5 text-sm outline-none focus:border-signal transition-colors"
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-signal text-ink font-semibold py-2.5 rounded-lg hover:brightness-110 transition-all disabled:opacity-40 text-sm mt-2"
          >
            {loading ? "Creating…" : "Continue"}
          </button>
        </form>

        <p className="text-center text-sm text-muted mt-6">
          Already have an account? <Link href="/login" className="text-signal hover:underline">Sign in</Link>
        </p>
      </div>
    </main>
  );
}
