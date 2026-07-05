import Link from "next/link";
import { Waveform } from "@/components/Waveform";

export default function PrivacyPage() {
  return (
    <main className="min-h-screen flex flex-col">
      <header className="max-w-2xl mx-auto w-full px-6 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2.5">
          <Waveform size="sm" animated={false} />
          <span className="font-display italic text-lg tracking-tight">EchoNote</span>
        </Link>
      </header>
      <div className="max-w-2xl mx-auto w-full px-6 py-16 flex-1 prose-sm">
        <span className="font-mono text-xs text-muted uppercase tracking-widest">legal</span>
        <h1 className="font-display text-4xl mt-2 mb-8">Privacy Policy</h1>
        <div className="space-y-6 text-sm text-muted leading-relaxed">
          <p>
            This is placeholder policy text for a project scaffold — replace it with real
            language before using EchoNote with actual user data.
          </p>
          <div>
            <h2 className="text-paper font-medium mb-2">What we store</h2>
            <p>Account details (name, email), workspace and meeting data, transcripts, and AI-generated summaries and action items, scoped to your workspace.</p>
          </div>
          <div>
            <h2 className="text-paper font-medium mb-2">Who can see it</h2>
            <p>Only members of the workspace a meeting belongs to. Data is never shared across workspaces.</p>
          </div>
          <div>
            <h2 className="text-paper font-medium mb-2">Third parties</h2>
            <p>Transcripts are sent to Groq for AI summaries and chat. Video calls run through Daily.co. Neither is used for anything beyond serving your request.</p>
          </div>
          <div>
            <h2 className="text-paper font-medium mb-2">Contact</h2>
            <p>Questions about this policy: <a href="mailto:rutvilandge@gmail.com" className="text-signal hover:underline">rutvilandge@gmail.com</a></p>
          </div>
        </div>
      </div>
    </main>
  );
}
