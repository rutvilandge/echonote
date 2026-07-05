import Link from "next/link";
import { Waveform } from "@/components/Waveform";
import {
  Brain, Video, ListChecks, FileStack, CalendarDays, Users, Bell, Search, BarChart3,
  Clock, Handshake, Target, Sparkles, ShieldCheck, ChevronDown, Github, Linkedin, Mail,
} from "lucide-react";

const FEATURES = [
  { icon: Brain, title: "AI Meeting Summaries", desc: "Every call is distilled into a clear overview, decisions, and risks — automatically." },
  { icon: Video, title: "Live Video Meetings", desc: "Built-in video calling, no extra app to install for your team." },
  { icon: ListChecks, title: "AI Action Items", desc: "Extracted from the conversation and tracked until they're done." },
  { icon: FileStack, title: "Meeting Templates", desc: "Sprint planning, stand-ups, interviews — reusable formats for every meeting type." },
  { icon: CalendarDays, title: "Calendar Scheduling", desc: "Schedule meetings and sync them straight to Google Calendar." },
  { icon: Users, title: "Team Workspaces", desc: "Invite your team, assign roles, and keep every meeting in one place." },
  { icon: Bell, title: "Notifications", desc: "Know the moment a summary is ready or a meeting is coming up." },
  { icon: Search, title: "AI Search", desc: "Ask any meeting a question and get an answer sourced from the transcript." },
  { icon: BarChart3, title: "Analytics Dashboard", desc: "See meeting load, completion rates, and team activity at a glance." },
];

const HOW_IT_WORKS = [
  { n: "01", t: "Create Workspace", d: "Set up a home for your team's meetings in seconds." },
  { n: "02", t: "Schedule Meeting", d: "Pick a time, a template, and you're set." },
  { n: "03", t: "Join Video Call", d: "Talk — EchoNote records and transcribes as you go." },
  { n: "04", t: "Get AI Summary", d: "Minutes later: a summary, decisions, and action items, ready to read." },
];

const WHY = [
  { icon: Clock, t: "Saves meeting time", d: "No one has to take notes — the AI does it, so the room can stay focused on talking." },
  { icon: Handshake, t: "Improves collaboration", d: "Everyone works from the same summary instead of five different memories of the call." },
  { icon: Target, t: "Tracks action items", d: "Commitments made out loud don't get lost — they land in a tracked list automatically." },
  { icon: Sparkles, t: "AI-powered organization", d: "Meetings, transcripts, and decisions are searchable, not scattered across notebooks." },
  { icon: ShieldCheck, t: "Secure authentication", d: "Google, GitHub, or email sign-in, with workspace-level access control." },
];

const TESTIMONIALS = [
  { quote: "We stopped assigning someone to take notes every meeting — EchoNote just does it, and does it better.", name: "Priya Nair", role: "Head of Product, Fintory" },
  { quote: "Action items used to die in someone's notebook. Now they're tracked automatically and nothing slips.", name: "Marcus Webb", role: "Engineering Manager, Loomis Labs" },
  { quote: "Being able to ask a meeting a question instead of scrubbing through a recording has genuinely saved us hours.", name: "Ana Torres", role: "Ops Lead, Northwind Studio" },
];

const FAQS = [
  { q: "Can I record meetings?", a: "Yes — EchoNote records and transcribes video meetings automatically once you join the call." },
  { q: "Does AI generate summaries?", a: "Yes, every meeting gets an AI-generated summary along with decisions and action items." },
  { q: "Can I invite team members?", a: "Yes — invite teammates to your workspace by email and assign them a role." },
  { q: "Is my data secure?", a: "Every workspace's meetings and transcripts are isolated, and access is controlled per workspace." },
];

export default function Home() {
  return (
    <main className="min-h-screen flex flex-col">
      <header className="max-w-6xl mx-auto w-full px-6 h-16 flex items-center justify-between sticky top-0 bg-ink/90 backdrop-blur z-30">
        <div className="flex items-center gap-2.5">
          <Waveform size="sm" animated={false} />
          <span className="font-display italic text-lg tracking-tight">EchoNote</span>
        </div>
        <nav className="hidden md:flex items-center gap-6 text-sm text-muted">
          <a href="#features" className="hover:text-paper transition-colors">Features</a>
          <a href="#how-it-works" className="hover:text-paper transition-colors">How It Works</a>
          <a href="#about" className="hover:text-paper transition-colors">About</a>
          <Link href="/contact" className="hover:text-paper transition-colors">Contact</Link>
        </nav>
        <div className="flex items-center gap-3">
          <Link href="/login" className="text-sm text-muted hover:text-paper transition-colors">Sign in</Link>
          <Link href="/register" className="text-sm font-medium bg-signal text-ink rounded-full px-4 py-1.5 hover:brightness-110 transition-all">
            Get Started
          </Link>
        </div>
      </header>

      {/* Hero */}
      <section className="max-w-6xl mx-auto w-full px-6 pt-20 pb-24 flex flex-col items-start">
        <div className="font-mono text-xs text-muted uppercase tracking-widest mb-6 flex items-center gap-3">
          <span>00:00:00</span>
          <span className="w-8 h-px bg-ink-line" />
          <span>recording</span>
        </div>

        <h1 className="font-display text-5xl sm:text-6xl leading-[1.05] tracking-tight text-balance mb-6 max-w-2xl">
          AI Meeting Assistant for <span className="italic text-signal">Smarter</span> Teams
        </h1>

        <p className="text-muted text-lg max-w-xl mb-10 leading-relaxed">
          EchoNote automatically records your meetings, generates AI summaries, extracts
          action items, and keeps your whole team organized — so no one has to take notes again.
        </p>

        <div className="flex items-center gap-4 mb-20">
          <Link href="/register" className="bg-signal text-ink font-semibold px-6 py-3 rounded-lg hover:brightness-110 transition-all">
            Get Started
          </Link>
          <a href="#how-it-works" className="border border-ink-line px-6 py-3 rounded-lg font-medium hover:border-signal transition-colors">
            Watch Demo
          </a>
        </div>

        <div className="w-full border border-ink-line rounded-xl bg-ink-soft/60 p-6 sm:p-8">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
            <div className="flex flex-col gap-4">
              <span className="font-mono text-xs text-signal uppercase tracking-widest">01 — capture</span>
              <Waveform size="lg" tone="signal" />
              <p className="text-sm text-muted leading-relaxed">Every call is recorded and transcribed in real time as it happens.</p>
            </div>
            <div className="flex flex-col gap-4">
              <span className="font-mono text-xs text-synth uppercase tracking-widest">02 — synthesize</span>
              <div className="space-y-1.5 font-mono text-xs text-muted">
                <p className="text-paper">"...ship the v2 pricing page by Friday..."</p>
                <p className="opacity-60">"...loop in design before we commit..."</p>
                <p className="opacity-40">"...revisit the onboarding flow next..."</p>
              </div>
              <p className="text-sm text-muted leading-relaxed">An AI pass turns raw transcript into a clean summary and action items.</p>
            </div>
            <div className="flex flex-col gap-4">
              <span className="font-mono text-xs text-muted uppercase tracking-widest">03 — recall</span>
              <div className="border border-ink-line rounded-lg px-3 py-2 text-sm text-muted italic">
                "what did we decide about the pricing page?"
              </div>
              <p className="text-sm text-muted leading-relaxed">Ask any meeting a question, anytime, and get a sourced answer.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="max-w-6xl mx-auto w-full px-6 py-24 border-t border-ink-line">
        <span className="font-mono text-xs text-muted uppercase tracking-widest">features</span>
        <h2 className="font-display text-3xl mt-2 mb-12">Everything a meeting needs, handled</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {FEATURES.map((f) => (
            <div key={f.title} className="border border-ink-line rounded-xl p-6 hover:border-signal/50 transition-colors">
              <f.icon size={20} className="text-signal mb-4" aria-hidden="true" />
              <h3 className="font-medium mb-1.5">{f.title}</h3>
              <p className="text-sm text-muted leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* How it works */}
      <section id="how-it-works" className="max-w-6xl mx-auto w-full px-6 py-24 border-t border-ink-line">
        <span className="font-mono text-xs text-muted uppercase tracking-widest">how it works</span>
        <h2 className="font-display text-3xl mt-2 mb-12">From scheduled to summarized</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {HOW_IT_WORKS.map((s) => (
            <div key={s.n} className="border border-ink-line rounded-xl p-6">
              <span className="font-mono text-3xl text-ink-line">{s.n}</span>
              <h3 className="font-medium mt-3 mb-1.5">{s.t}</h3>
              <p className="text-sm text-muted leading-relaxed">{s.d}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Why EchoNote */}
      <section id="about" className="max-w-6xl mx-auto w-full px-6 py-24 border-t border-ink-line">
        <span className="font-mono text-xs text-synth uppercase tracking-widest">why echonote</span>
        <h2 className="font-display text-3xl mt-2 mb-12">Built for teams that talk a lot</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {WHY.map((s) => (
            <div key={s.t}>
              <s.icon size={20} className="text-synth mb-4" aria-hidden="true" />
              <h3 className="font-medium mb-1.5">{s.t}</h3>
              <p className="text-sm text-muted leading-relaxed">{s.d}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Testimonials */}
      <section className="max-w-6xl mx-auto w-full px-6 py-24 border-t border-ink-line">
        <span className="font-mono text-xs text-muted uppercase tracking-widest">what teams say</span>
        <h2 className="font-display text-3xl mt-2 mb-12">Trusted by teams who'd rather talk than type</h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          {TESTIMONIALS.map((t) => (
            <div key={t.name} className="border border-ink-line rounded-xl p-6 flex flex-col">
              <p className="text-sm text-paper/90 leading-relaxed mb-4 flex-1">"{t.quote}"</p>
              <div>
                <p className="text-sm font-medium">{t.name}</p>
                <p className="text-xs text-muted">{t.role}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* FAQ */}
      <section className="max-w-3xl mx-auto w-full px-6 py-24 border-t border-ink-line">
        <span className="font-mono text-xs text-muted uppercase tracking-widest">faq</span>
        <h2 className="font-display text-3xl mt-2 mb-10">Questions, answered</h2>
        <div className="divide-y divide-ink-line">
          {FAQS.map((f) => (
            <details key={f.q} className="group py-5">
              <summary className="flex items-center justify-between cursor-pointer list-none font-medium">
                {f.q}
                <ChevronDown size={16} className="text-muted group-open:rotate-180 transition-transform" aria-hidden="true" />
              </summary>
              <p className="text-sm text-muted mt-3 leading-relaxed">{f.a}</p>
            </details>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-ink-line mt-auto">
        <div className="max-w-6xl mx-auto px-6 py-10 flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-2.5">
            <Waveform size="sm" animated={false} />
            <span className="font-display italic text-sm">EchoNote</span>
          </div>
          <div className="flex items-center gap-6 text-sm text-muted">
            <Link href="/help" className="hover:text-paper transition-colors">Help Center</Link>
            <Link href="/privacy" className="hover:text-paper transition-colors">Privacy Policy</Link>
            <Link href="/contact" className="hover:text-paper transition-colors">Contact</Link>
          </div>
          <div className="flex items-center gap-4">
            {/* Edit these links directly — swap the href for your real profiles */}
            <a href="https://github.com/rutvilandge" target="_blank" rel="noreferrer" className="text-muted hover:text-paper transition-colors" aria-label="GitHub">
              <Github size={16} />
            </a>
            <a href="https://linkedin.com/" target="_blank" rel="noreferrer" className="text-muted hover:text-paper transition-colors" aria-label="LinkedIn">
              <Linkedin size={16} />
            </a>
            <a href="mailto:rutvilandge@gmail.com" className="text-muted hover:text-paper transition-colors" aria-label="Email">
              <Mail size={16} />
            </a>
          </div>
        </div>
      </footer>
    </main>
  );
}
