import Link from "next/link";
import { Waveform } from "@/components/Waveform";
import { Mail, Github } from "lucide-react";

export default function ContactPage() {
  return (
    <main className="min-h-screen flex flex-col">
      <header className="max-w-2xl mx-auto w-full px-6 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2.5">
          <Waveform size="sm" animated={false} />
          <span className="font-display italic text-lg tracking-tight">EchoNote</span>
        </Link>
      </header>
      <div className="max-w-2xl mx-auto w-full px-6 py-16 flex-1">
        <span className="font-mono text-xs text-muted uppercase tracking-widest">get in touch</span>
        <h1 className="font-display text-4xl mt-2 mb-8">Contact</h1>
        <div className="space-y-4">
          <a href="mailto:rutvilandge@gmail.com" className="flex items-center gap-3 border border-ink-line rounded-xl p-4 hover:border-signal transition-colors">
            <Mail size={18} className="text-signal" aria-hidden="true" />
            <div>
              <p className="text-sm font-medium">Email</p>
              <p className="text-xs text-muted">rutvilandge@gmail.com</p>
            </div>
          </a>
          <a href="https://github.com/rutvilandge" target="_blank" rel="noreferrer" className="flex items-center gap-3 border border-ink-line rounded-xl p-4 hover:border-signal transition-colors">
            <Github size={18} className="text-signal" aria-hidden="true" />
            <div>
              <p className="text-sm font-medium">GitHub</p>
              <p className="text-xs text-muted">github.com/rutvilandge</p>
            </div>
          </a>
        </div>
      </div>
    </main>
  );
}
