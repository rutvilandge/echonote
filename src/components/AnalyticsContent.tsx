"use client";

import { useEffect, useState } from "react";
import { MeetingsBarChart, ActionItemsPieChart, WorkspaceActivityChart, MeetingTrendLine } from "./Charts";

export default function AnalyticsContent() {
  const [data, setData] = useState<any>(null);

  useEffect(() => {
    fetch("/api/analytics").then((res) => (res.ok ? res.json() : null)).then(setData);
  }, []);

  if (!data) return <p className="text-sm text-muted">Loading analytics…</p>;

  return (
    <div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
        <MeetingsBarChart data={data.monthlyMeetings} />
        <ActionItemsPieChart data={data.actionItemsBreakdown} />
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
        <WorkspaceActivityChart data={data.workspaceActivity} />
        <MeetingTrendLine data={data.monthlyMeetings} />
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <Stat label="Meetings this month" value={data.meetingsThisMonth} />
        <Stat label="AI summaries generated" value={data.summariesGenerated} />
        <Stat label="Completion rate" value={`${data.completionRate}%`} />
        <Stat label="Avg. action items / meeting" value={data.avgActionItemsPerMeeting} />
      </div>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="border border-ink-line rounded-xl p-5">
      <div className="font-display text-2xl mb-1">{value}</div>
      <div className="text-xs text-muted">{label}</div>
    </div>
  );
}
