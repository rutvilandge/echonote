import Link from "next/link";
import { Waveform } from "@/components/Waveform";

export default function NotFound() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center px-6 text-center">
      <Waveform size="md" tone="muted" animated={false} />
      <h1 className="font-display text-3xl mt-6 mb-2">Nothing logged here</h1>
      <p className="text-muted mb-8">The page you're looking for doesn't exist.</p>
      <Link href="/dashboard" className="bg-signal text-ink font-semibold px-5 py-2.5 rounded-lg hover:brightness-110 transition-all">
        Back to dashboard
      </Link>
    </main>
  );
}
