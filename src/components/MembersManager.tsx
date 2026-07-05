"use client";

import { useState } from "react";
import { toast } from "sonner";
import { UserPlus, X } from "lucide-react";

type Member = { id: string; role: string; user: { id: string; name: string | null; email: string } };
type Invite = { id: string; email: string; role: string };

export default function MembersManager({
  workspaceId,
  initialMembers,
  initialInvites,
  currentUserId,
}: {
  workspaceId: string;
  initialMembers: Member[];
  initialInvites: Invite[];
  currentUserId: string;
}) {
  const [members, setMembers] = useState(initialMembers);
  const [invites, setInvites] = useState(initialInvites);
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("MEMBER");
  const [loading, setLoading] = useState(false);

  async function handleInvite(e: React.FormEvent) {
    e.preventDefault();
    if (!email.trim()) return;
    setLoading(true);
    try {
      const res = await fetch(`/api/workspaces/${workspaceId}/invites`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, role }),
      });
      const data = await res.json();
      if (!res.ok) {
        toast.error(data.error ?? "Couldn't send invite");
        return;
      }
      if (data.type === "member") {
        setMembers((prev) => [...prev, data.member]);
        toast.success(`${email} added to the workspace`);
      } else {
        setInvites((prev) => [...prev, data.invite]);
        toast.success(`Invite created for ${email} — they'll be added once they sign up`);
      }
      setEmail("");
    } finally {
      setLoading(false);
    }
  }

  async function changeRole(memberId: string, newRole: string) {
    setMembers((prev) => prev.map((m) => (m.id === memberId ? { ...m, role: newRole } : m)));
    await fetch(`/api/members/${memberId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ role: newRole }),
    });
  }

  async function removeMember(memberId: string) {
    setMembers((prev) => prev.filter((m) => m.id !== memberId));
    await fetch(`/api/members/${memberId}`, { method: "DELETE" });
    toast.success("Member removed");
  }

  return (
    <div className="max-w-2xl">
      <form onSubmit={handleInvite} className="flex gap-2 mb-8">
        <input
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          type="email"
          placeholder="teammate@company.com"
          aria-label="Invite by email"
          className="flex-1 bg-ink-soft border border-ink-line rounded-lg px-4 py-2.5 text-sm outline-none focus:border-signal transition-colors"
        />
        <select
          value={role}
          onChange={(e) => setRole(e.target.value)}
          className="bg-ink-soft border border-ink-line rounded-lg px-3 py-2.5 text-sm outline-none"
        >
          <option value="MEMBER">Member</option>
          <option value="ADMIN">Admin</option>
        </select>
        <button
          type="submit"
          disabled={loading || !email.trim()}
          className="bg-signal text-ink font-semibold px-4 py-2.5 rounded-lg text-sm hover:brightness-110 transition-all disabled:opacity-40 flex items-center gap-2"
        >
          <UserPlus size={15} aria-hidden="true" /> Invite
        </button>
      </form>

      <h2 className="text-xs font-mono uppercase tracking-widest text-muted mb-3">Members ({members.length})</h2>
      <div className="border-t border-ink-line mb-8">
        {members.map((m) => (
          <div key={m.id} className="flex items-center gap-4 py-3 border-b border-ink-line">
            <div className="w-8 h-8 rounded-full bg-signal/20 flex items-center justify-center text-xs font-medium text-signal shrink-0">
              {(m.user.name || m.user.email)[0].toUpperCase()}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm truncate">{m.user.name || m.user.email}</p>
              <p className="text-xs text-muted truncate">{m.user.email}</p>
            </div>
            <select
              value={m.role}
              onChange={(e) => changeRole(m.id, e.target.value)}
              disabled={m.role === "OWNER"}
              className="bg-ink border border-ink-line rounded-lg px-2 py-1 text-xs outline-none disabled:opacity-60"
            >
              <option value="OWNER">Owner</option>
              <option value="ADMIN">Admin</option>
              <option value="MEMBER">Member</option>
            </select>
            {m.role !== "OWNER" && m.user.id !== currentUserId && (
              <button onClick={() => removeMember(m.id)} className="text-muted hover:text-danger transition-colors" aria-label={`Remove ${m.user.email}`}>
                <X size={16} />
              </button>
            )}
          </div>
        ))}
      </div>

      {invites.length > 0 && (
        <>
          <h2 className="text-xs font-mono uppercase tracking-widest text-muted mb-3">Pending invites ({invites.length})</h2>
          <div className="border-t border-ink-line">
            {invites.map((inv) => (
              <div key={inv.id} className="flex items-center gap-4 py-3 border-b border-ink-line text-sm text-muted">
                <span className="flex-1">{inv.email}</span>
                <span className="font-mono text-xs">{inv.role.toLowerCase()}</span>
                <span className="font-mono text-xs text-signal">pending</span>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
