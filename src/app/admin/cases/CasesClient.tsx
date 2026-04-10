"use client";

/**
 * CasesClient — Case management with filtering, creation, and status updates.
 */

import { useState } from "react";

interface CaseItem {
  id: string;
  title: string;
  description: string;
  status: string;
  priority: string;
  category: string;
  subscriber: { id: string; email: string; name: string } | null;
  company: { id: string; name: string } | null;
  assignedTo: { id: string; name: string; email: string } | null;
  resolvedAt: string | null;
  createdAt: string;
  updatedAt: string;
}

interface Ref { id: string; name: string; email?: string }

const STATUS_COLORS: Record<string, string> = {
  open: "bg-blue-100 text-blue-700",
  in_progress: "bg-amber-100 text-amber-700",
  waiting: "bg-gray-100 text-gray-600",
  resolved: "bg-green-100 text-green-700",
  closed: "bg-gray-200 text-gray-500",
};

const PRIORITY_COLORS: Record<string, string> = {
  low: "text-gray-400",
  normal: "text-gray-600",
  high: "text-amber-600 font-semibold",
  urgent: "text-red-600 font-bold",
};

const STATUSES = ["open", "in_progress", "waiting", "resolved", "closed"];
const PRIORITIES = ["low", "normal", "high", "urgent"];
const CATEGORIES = ["general", "consulting", "billing", "technical", "compliance"];

export function CasesClient({
  cases: initial,
  companies,
  admins,
  subscribers,
}: {
  cases: CaseItem[];
  companies: { id: string; name: string }[];
  admins: Ref[];
  subscribers: { id: string; email: string; name: string }[];
}) {
  const [cases, setCases] = useState(initial);
  const [statusFilter, setStatusFilter] = useState("open");
  const [showAdd, setShowAdd] = useState(false);
  const [form, setForm] = useState({
    title: "", description: "", priority: "normal", category: "general",
    subscriberId: "", companyId: "", assignedToId: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const filtered = cases.filter((c) => statusFilter === "all" || c.status === statusFilter);

  // Stats
  const openCount = cases.filter((c) => c.status === "open").length;
  const inProgressCount = cases.filter((c) => c.status === "in_progress").length;
  const resolvedCount = cases.filter((c) => c.status === "resolved" || c.status === "closed").length;

  async function handleAdd(e: React.FormEvent) {
    e.preventDefault();
    if (!form.title) return;
    setLoading(true); setError("");
    try {
      const res = await fetch("/api/admin/cases", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (data.error) { setError(data.error); setLoading(false); return; }
      setCases((prev) => [data.caseItem, ...prev]);
      setForm({ title: "", description: "", priority: "normal", category: "general", subscriberId: "", companyId: "", assignedToId: "" });
      setShowAdd(false);
    } catch { setError("Failed to create case"); }
    setLoading(false);
  }

  async function updateStatus(id: string, status: string) {
    try {
      await fetch("/api/admin/cases", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, status }),
      });
      setCases((prev) => prev.map((c) => c.id === id ? { ...c, status, resolvedAt: status === "resolved" ? new Date().toISOString() : c.resolvedAt } : c));
    } catch { /* silently fail */ }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Cases</h1>
          <p className="text-sm text-gray-500">
            {openCount} open &middot; {inProgressCount} in progress &middot; {resolvedCount} resolved
          </p>
        </div>
        <button onClick={() => setShowAdd(!showAdd)}
          className="rounded-lg bg-[#003399] px-4 py-2 text-sm font-semibold text-white hover:bg-[#002277]">
          + New Case
        </button>
      </div>

      {error && <div className="rounded-lg bg-red-50 border border-red-200 p-3 text-sm text-red-700">{error}</div>}

      {/* Create form */}
      {showAdd && (
        <form onSubmit={handleAdd} className="rounded-xl border border-gray-200 bg-white p-5 space-y-3">
          <input type="text" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })}
            placeholder="Case title *" required className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm" />
          <textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })}
            placeholder="Description..." rows={3} className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm" />
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
            <select value={form.priority} onChange={(e) => setForm({ ...form, priority: e.target.value })}
              className="rounded-lg border border-gray-300 px-3 py-2 text-sm">
              {PRIORITIES.map((p) => <option key={p} value={p}>{p}</option>)}
            </select>
            <select value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })}
              className="rounded-lg border border-gray-300 px-3 py-2 text-sm">
              {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
            </select>
            <select value={form.assignedToId} onChange={(e) => setForm({ ...form, assignedToId: e.target.value })}
              className="rounded-lg border border-gray-300 px-3 py-2 text-sm">
              <option value="">Assign to...</option>
              {admins.map((a) => <option key={a.id} value={a.id}>{a.name || a.email}</option>)}
            </select>
            <select value={form.companyId} onChange={(e) => setForm({ ...form, companyId: e.target.value })}
              className="rounded-lg border border-gray-300 px-3 py-2 text-sm">
              <option value="">Company...</option>
              {companies.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
            </select>
            <select value={form.subscriberId} onChange={(e) => setForm({ ...form, subscriberId: e.target.value })}
              className="rounded-lg border border-gray-300 px-3 py-2 text-sm">
              <option value="">Subscriber...</option>
              {subscribers.slice(0, 100).map((s) => <option key={s.id} value={s.id}>{s.name || s.email}</option>)}
            </select>
          </div>
          <div className="flex gap-2">
            <button type="submit" disabled={loading}
              className="rounded-lg bg-[#003399] px-4 py-2 text-sm font-semibold text-white hover:bg-[#002277] disabled:opacity-50">
              {loading ? "Creating..." : "Create Case"}
            </button>
            <button type="button" onClick={() => setShowAdd(false)}
              className="rounded-lg border border-gray-200 px-4 py-2 text-sm text-gray-500">Cancel</button>
          </div>
        </form>
      )}

      {/* Status filter */}
      <div className="flex gap-1 rounded-lg bg-gray-100 p-1 w-fit">
        {["all", ...STATUSES].map((s) => (
          <button key={s} onClick={() => setStatusFilter(s)}
            className={`rounded-md px-3 py-1.5 text-xs font-medium transition ${
              statusFilter === s ? "bg-white text-gray-900 shadow-sm" : "text-gray-500 hover:text-gray-700"
            }`}>
            {s === "in_progress" ? "In Progress" : s.charAt(0).toUpperCase() + s.slice(1)}
          </button>
        ))}
      </div>

      {/* Cases list */}
      <div className="space-y-3">
        {filtered.length === 0 ? (
          <p className="text-center text-gray-500 text-sm py-12">No cases matching this filter.</p>
        ) : filtered.map((c) => (
          <div key={c.id} className="rounded-xl border border-gray-200 bg-white p-4">
            <div className="flex items-start justify-between gap-3">
              <div className="flex-1 min-w-0">
                <div className="flex flex-wrap items-center gap-2 mb-1">
                  <span className={`rounded-full px-2 py-0.5 text-[10px] font-semibold ${STATUS_COLORS[c.status] || STATUS_COLORS.open}`}>
                    {c.status === "in_progress" ? "In Progress" : c.status}
                  </span>
                  <span className={`text-[10px] ${PRIORITY_COLORS[c.priority]}`}>{c.priority}</span>
                  <span className="rounded bg-gray-100 px-1.5 py-0.5 text-[10px] text-gray-500">{c.category}</span>
                </div>
                <h3 className="font-medium text-gray-900 text-sm">{c.title}</h3>
                {c.description && <p className="mt-1 text-xs text-gray-500 line-clamp-2">{c.description}</p>}
                <div className="mt-2 flex flex-wrap items-center gap-3 text-[10px] text-gray-400">
                  {c.company && <span>🏢 {c.company.name}</span>}
                  {c.subscriber && <span>👤 {c.subscriber.name || c.subscriber.email}</span>}
                  {c.assignedTo && <span>→ {c.assignedTo.name || c.assignedTo.email}</span>}
                  <span>{new Date(c.createdAt).toLocaleDateString("en-GB")}</span>
                </div>
              </div>
              {/* Quick status update */}
              <select
                value={c.status}
                onChange={(e) => updateStatus(c.id, e.target.value)}
                className="rounded border border-gray-200 px-2 py-1 text-xs text-gray-600 shrink-0"
              >
                {STATUSES.map((s) => (
                  <option key={s} value={s}>{s === "in_progress" ? "In Progress" : s}</option>
                ))}
              </select>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
