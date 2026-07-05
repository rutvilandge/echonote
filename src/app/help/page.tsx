import Link from "next/link";
import { Waveform } from "@/components/Waveform";
import { BookOpen, Keyboard, Mail, Code2 } from "lucide-react";

const LINKS = [
  { icon: BookOpen, title: "Getting started", desc: "Create a workspace, schedule a meeting, and get your first AI summary." },
  { icon: Keyboard, title: "Keyboard shortcuts", desc: "⌘K or Ctrl+K opens the command palette from anywhere." },
  { icon: Mail, title: "Contact support", desc: "Reach out directly — see the Contact page." },
  { icon: Code2, title: "API keys", desc: "Generate keys under Settings → API Keys to build on top of EchoNote." },
];

export default function HelpPage() {
  return (
    <main className="min-h-screen flex flex-col">
      <header className="max-w-4xl mx-auto w-full px-6 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2.5">
          <Waveform size="sm" animated={false} />
          <span className="font-display italic text-lg tracking-tight">EchoNote</span>
        </Link>
        <Link href="/dashboard" className="text-sm text-muted hover:text-paper transition-colors">Back to app</Link>
      </header>
      <div className="max-w-4xl mx-auto w-full px-6 py-16 flex-1">
        <span className="font-mono text-xs text-muted uppercase tracking-widest">support</span>
        <h1 className="font-display text-4xl mt-2 mb-10">Help Center</h1>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {LINKS.map((l) => (
            <div key={l.title} className="border border-ink-line rounded-xl p-5">
              <l.icon size={18} className="text-signal mb-3" aria-hidden="true" />
              <h3 className="font-medium mb-1">{l.title}</h3>
              <p className="text-sm text-muted">{l.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
