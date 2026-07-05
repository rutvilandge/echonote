"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { CalendarClock, ListTodo, Clock3, Briefcase, FileText, CheckCircle2, TrendingUp, Bell } from "lucide-react";
import { MeetingsBarChart, ActionItemsPieChart, WorkspaceActivityChart, MeetingTrendLine } from "./Charts";
import { SkeletonCard } from "./Skeleton";

type Analytics = {
  totalMeetings: number;
  upcomingMeetings: number;
  todaysMeetings: number;
  totalWorkspaces: number;
  summariesGenerated: number;
  pendingActionItems: number;
  completedActionItems: number;
  completionRate: number;
  meetingsThisMonth: number;
  mostActiveWorkspace: string | null;
  avgActionItemsPerMeeting: number;
  avgDurationMinutes: number | null;
  monthlyMeetings: { month: string; count: number }[];
  workspaceActivity: { name: string; meetings: number }[];
  actionItemsBreakdown: { name: string; value: number }[];
  recentNotifications: { id: string; message: string; createdAt: string }[];
};

export default function DashboardContent() {
  const [data, setData] = useState<Analytics | null>(null);

  useEffect(() => {
    fetch("/api/analytics")
      .then((res) => (res.ok ? res.json() : null))
      .then(setData);
  }, []);

  if (!data) {
    return (
      <div>
        <div className="h-8 w-48 rounded skeleton animate-shimmer mb-8" />
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 mb-8">
          <SkeletonCard /><SkeletonCard /><SkeletonCard /><SkeletonCard />
        </div>
      </div>
    );
  }

  const stats = [
    { label: "Total meetings", value: data.totalMeetings, icon: Briefcase, tone: "text-signal", bg: "bg-signal/15" },
    { label: "Upcoming meetings", value: data.upcomingMeetings, icon: CalendarClock, tone: "text-synth", bg: "bg-synth/15" },
    { label: "Today's meetings", value: data.todaysMeetings, icon: Clock3, tone: "text-paper", bg: "bg-ink-line/60" },
    { label: "Workspaces", value: data.totalWorkspaces, icon: Briefcase, tone: "text-signal", bg: "bg-signal/15" },
    { label: "AI summaries generated", value: data.summariesGenerated, icon: FileText, tone: "text-synth", bg: "bg-synth/15" },
    { label: "Pending action items", value: data.pendingActionItems, icon: ListTodo, tone: "text-signal", bg: "bg-signal/15" },
    { label: "Completed action items", value: data.completedActionItems, icon: CheckCircle2, tone: "text-synth", bg: "bg-synth/15" },
    { label: "Completion rate", value: `${data.completionRate}%`, icon: TrendingUp, tone: "text-paper", bg: "bg-ink-line/60" },
  ];

  return (
    <div>
      <div className="flex items-end justify-between mb-8 flex-wrap gap-4">
        <div>
          <span className="font-mono text-xs text-muted uppercase tracking-widest">overview</span>
          <h1 className="font-display text-3xl mt-1">Dashboard</h1>
        </div>
        <Link
          href="/meetings/new"
          className="text-sm bg-signal text-ink font-semibold rounded-lg px-4 py-2 hover:brightness-110 transition-all"
        >
          Schedule meeting
        </Link>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
        {stats.map((s) => (
          <div key={s.label} className="border border-ink-line rounded-xl p-4 flex items-center gap-3">
            <div className={`w-9 h-9 rounded-lg ${s.bg} flex items-center justify-center shrink-0`}>
              <s.icon size={16} className={s.tone} aria-hidden="true" />
            </div>
            <div>
              <div className="font-display text-xl">{s.value}</div>
              <div className="text-[11px] text-muted leading-tight">{s.label}</div>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
        <MeetingsBarChart data={data.monthlyMeetings} />
        <ActionItemsPieChart data={data.actionItemsBreakdown} />
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
        <WorkspaceActivityChart data={data.workspaceActivity} />
        <MeetingTrendLine data={data.monthlyMeetings} />
      </div>

      {/* AI Insights panel */}
      <div className="border border-ink-line rounded-xl p-5 mb-8">
        <div className="flex items-center gap-3 mb-4">
          <span className="font-mono text-xs text-synth uppercase tracking-widest">AI insights</span>
          <span className="flex-1 h-px bg-ink-line" />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
          <InsightRow label="Meetings this month" value={data.meetingsThisMonth} />
          <InsightRow label="Most active workspace" value={data.mostActiveWorkspace ?? "—"} />
          <InsightRow label="Avg. action items per meeting" value={data.avgActionItemsPerMeeting} />
          <InsightRow label="Avg. meeting duration" value={data.avgDurationMinutes ? `${data.avgDurationMinutes} min` : "Not enough data yet"} />
        </div>
      </div>

      {data.recentNotifications.length > 0 && (
        <div className="border border-ink-line rounded-xl p-5">
          <div className="flex items-center gap-3 mb-4">
            <Bell size={14} className="text-muted" aria-hidden="true" />
            <span className="font-mono text-xs text-muted uppercase tracking-widest">recent notifications</span>
          </div>
          <div className="space-y-2">
            {data.recentNotifications.map((n) => (
              <div key={n.id} className="flex items-center justify-between text-sm">
                <span className="text-paper/90">{n.message}</span>
                <span className="font-mono text-xs text-muted" suppressHydrationWarning>
                  {new Date(n.createdAt).toLocaleDateString(undefined, { month: "short", day: "numeric" })}
                </span>
              </div>
            ))}
          </div>
          <Link href="/notifications" className="text-xs text-signal hover:underline mt-3 inline-block">
            View all →
          </Link>
        </div>
      )}
    </div>
  );
}

function InsightRow({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="flex items-center justify-between border-b border-ink-line pb-2">
      <span className="text-muted">{label}</span>
      <span className="font-medium">{value}</span>
    </div>
  );
}
