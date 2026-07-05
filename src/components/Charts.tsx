"use client";

import {
  ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip,
  PieChart, Pie, Cell, LineChart, Line,
} from "recharts";

function ChartTooltip({ active, payload, label }: any) {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-ink-soft border border-ink-line rounded-lg px-3 py-2 text-xs font-mono">
      <div className="text-muted mb-0.5">{label}</div>
      <div className="text-paper">{payload[0].value}</div>
    </div>
  );
}

export function MeetingsBarChart({ data }: { data: { month: string; count: number }[] }) {
  return (
    <div className="border border-ink-line rounded-xl p-5">
      <div className="flex items-center justify-between mb-4">
        <span className="text-sm font-medium">Meetings per month</span>
      </div>
      <ResponsiveContainer width="100%" height={160}>
        <BarChart data={data} barCategoryGap="30%">
          <XAxis dataKey="month" tick={{ fontSize: 11, fill: "#7A8290" }} axisLine={false} tickLine={false} />
          <YAxis hide />
          <Tooltip content={<ChartTooltip />} cursor={{ fill: "rgba(232,163,61,0.08)" }} />
          <Bar dataKey="count" fill="#E8A33D" radius={[4, 4, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

export function ActionItemsPieChart({ data }: { data: { name: string; value: number }[] }) {
  const colors: Record<string, string> = { Completed: "#4FD1C5", Pending: "#E8A33D" };
  const total = data.reduce((s, d) => s + d.value, 0);
  return (
    <div className="border border-ink-line rounded-xl p-5">
      <div className="flex items-center justify-between mb-4">
        <span className="text-sm font-medium">Action items status</span>
        <span className="font-mono text-xs text-muted">{total} total</span>
      </div>
      {total === 0 ? (
        <p className="text-sm text-muted py-8 text-center">No action items yet.</p>
      ) : (
        <div className="flex items-center gap-6">
          <ResponsiveContainer width={120} height={120}>
            <PieChart>
              <Pie data={data} dataKey="value" innerRadius={35} outerRadius={55} startAngle={90} endAngle={-270}>
                {data.map((entry) => (
                  <Cell key={entry.name} fill={colors[entry.name] ?? "#6B7280"} stroke="none" />
                ))}
              </Pie>
            </PieChart>
          </ResponsiveContainer>
          <div className="space-y-2">
            {data.map((d) => (
              <div key={d.name} className="flex items-center gap-2 text-xs">
                <span className="w-2.5 h-2.5 rounded-full" style={{ background: colors[d.name] ?? "#6B7280" }} />
                <span className="text-muted">{d.name}</span>
                <span className="font-mono text-paper">{d.value}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export function WorkspaceActivityChart({ data }: { data: { name: string; meetings: number }[] }) {
  return (
    <div className="border border-ink-line rounded-xl p-5">
      <div className="flex items-center justify-between mb-4">
        <span className="text-sm font-medium">Workspace activity</span>
      </div>
      {data.length === 0 ? (
        <p className="text-sm text-muted py-8 text-center">No workspaces yet.</p>
      ) : (
        <ResponsiveContainer width="100%" height={160}>
          <BarChart data={data} layout="vertical" barCategoryGap="25%">
            <XAxis type="number" hide />
            <YAxis dataKey="name" type="category" tick={{ fontSize: 11, fill: "#7A8290" }} axisLine={false} tickLine={false} width={100} />
            <Tooltip content={<ChartTooltip />} cursor={{ fill: "rgba(79,209,197,0.08)" }} />
            <Bar dataKey="meetings" fill="#4FD1C5" radius={[0, 4, 4, 0]} />
          </BarChart>
        </ResponsiveContainer>
      )}
    </div>
  );
}

export function MeetingTrendLine({ data }: { data: { month: string; count: number }[] }) {
  return (
    <div className="border border-ink-line rounded-xl p-5">
      <div className="flex items-center justify-between mb-4">
        <span className="text-sm font-medium">Meeting activity trend</span>
      </div>
      <ResponsiveContainer width="100%" height={140}>
        <LineChart data={data}>
          <XAxis dataKey="month" tick={{ fontSize: 11, fill: "#7A8290" }} axisLine={false} tickLine={false} />
          <YAxis hide />
          <Tooltip content={<ChartTooltip />} />
          <Line type="monotone" dataKey="count" stroke="#E8A33D" strokeWidth={2} dot={{ r: 3, fill: "#E8A33D" }} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
