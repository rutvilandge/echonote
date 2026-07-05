"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut, useSession } from "next-auth/react";
import { useTheme } from "next-themes";
import { useState, useEffect } from "react";
import {
  LayoutDashboard,
  CalendarDays,
  ListChecks,
  BarChart3,
  Users,
  Briefcase,
  FileStack,
  Bell,
  Settings,
  Sun,
  Moon,
  Search,
  ChevronDown,
  Menu,
  X,
} from "lucide-react";
import { Waveform } from "./Waveform";

const NAV = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/meetings", label: "Meetings", icon: CalendarDays },
  { href: "/action-items", label: "Action Items", icon: ListChecks },
  { href: "/analytics", label: "Analytics", icon: BarChart3 },
  { href: "/calendar", label: "Calendar", icon: CalendarDays },
  { href: "/members", label: "Members", icon: Users },
  { href: "/templates", label: "Templates", icon: FileStack },
  { href: "/workspace", label: "Workspace", icon: Briefcase },
];

export default function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { data: session } = useSession();
  const { theme, setTheme } = useTheme();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [unread, setUnread] = useState(0);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    fetch("/api/notifications")
      .then((res) => (res.ok ? res.json() : []))
      .then((data) => setUnread(Array.isArray(data) ? data.filter((n: any) => !n.read).length : 0))
      .catch(() => {});
  }, []);

  return (
    <div className="min-h-screen flex">
      {/* Mobile overlay */}
      {mobileOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setMobileOpen(false)}
          aria-hidden="true"
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed lg:sticky top-0 h-screen w-64 bg-ink-soft border-r border-ink-line flex flex-col z-50 transition-transform lg:translate-x-0 ${
          mobileOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="h-16 flex items-center justify-between px-5 border-b border-ink-line">
          <Link href="/dashboard" className="flex items-center gap-2.5">
            <Waveform size="sm" animated={false} />
            <span className="font-display italic text-lg">EchoNote</span>
          </Link>
          <button className="lg:hidden text-muted" onClick={() => setMobileOpen(false)} aria-label="Close menu">
            <X size={18} />
          </button>
        </div>

        <button className="flex items-center justify-between mx-4 mt-4 px-3 py-2 rounded-lg border border-ink-line text-sm hover:border-signal transition-colors">
          <span className="truncate">Product Team</span>
          <ChevronDown size={14} className="text-muted shrink-0" />
        </button>

        <nav className="flex-1 px-3 mt-4 space-y-0.5 overflow-y-auto" aria-label="Main navigation">
          {NAV.map((item) => {
            const active = pathname === item.href || pathname?.startsWith(item.href + "/");
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-colors ${
                  active ? "bg-signal/15 text-signal font-medium" : "text-muted hover:text-paper hover:bg-ink"
                }`}
                aria-current={active ? "page" : undefined}
              >
                <Icon size={16} aria-hidden="true" />
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="p-3 border-t border-ink-line space-y-0.5">
          <Link
            href="/notifications"
            className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-muted hover:text-paper hover:bg-ink transition-colors relative"
          >
            <Bell size={16} aria-hidden="true" /> Notifications
            {unread > 0 && (
              <span className="absolute right-3 bg-signal text-ink text-[10px] font-bold rounded-full w-5 h-5 flex items-center justify-center">
                {unread > 9 ? "9+" : unread}
              </span>
            )}
          </Link>
          <Link
            href="/settings"
            className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-muted hover:text-paper hover:bg-ink transition-colors"
          >
            <Settings size={16} aria-hidden="true" /> Settings
          </Link>
        </div>
      </aside>

      {/* Main column */}
      <div className="flex-1 min-w-0 lg:ml-0">
        <header className="h-16 border-b border-ink-line flex items-center gap-4 px-4 lg:px-8 sticky top-0 bg-ink/95 backdrop-blur z-30">
          <button className="lg:hidden text-muted" onClick={() => setMobileOpen(true)} aria-label="Open menu">
            <Menu size={20} />
          </button>

          <button
            onClick={() => document.dispatchEvent(new KeyboardEvent("keydown", { key: "k", metaKey: true }))}
            className="flex items-center gap-2 text-sm text-muted border border-ink-line rounded-lg px-3 py-1.5 hover:border-signal transition-colors max-w-xs w-full"
          >
            <Search size={14} aria-hidden="true" />
            <span className="flex-1 text-left">Search…</span>
            <kbd className="font-mono text-[10px] border border-ink-line rounded px-1.5 py-0.5">⌘K</kbd>
          </button>

          <div className="flex-1" />

          <button
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            className="text-muted hover:text-paper transition-colors"
            aria-label="Toggle theme"
          >
            {mounted ? (theme === "dark" ? <Sun size={18} /> : <Moon size={18} />) : <span className="w-[18px] h-[18px] inline-block" />}
          </button>

          {session?.user && (
            <div className="flex items-center gap-3">
              <span className="hidden sm:block font-mono text-xs text-muted">{session.user.email}</span>
              <button
                onClick={() => signOut({ callbackUrl: "/" })}
                className="text-sm text-muted hover:text-paper transition-colors"
              >
                Sign out
              </button>
            </div>
          )}
        </header>

        <main id="main" className="px-4 lg:px-8 py-8 max-w-6xl">
          {children}
        </main>
      </div>
    </div>
  );
}
