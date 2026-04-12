"use client";

/**
 * CompaniesClient — Company CRM with search, create, expand details.
 */

import { useState } from "react";

interface Company {
  id: string;
  name: string;
  domain: string;
  industry: string;
  country: string;
  size: string;
  tier: string;
  notes: string;
  subscriberCount: number;
  caseCount: number;
  aiSystemCount: number;
  subscribers: { id: string; email: string; name: string; tier: string; role: string }[];
  createdAt: string;
}

interface AISystem {
  id: string;
  slug: string;
  name: string;
  vendor: string;
}

const TIER_BADGES: Record<string, string> = {
  free: "bg-gray-100 text-gray-600",
  pro: "bg-blue-100 text-blue-700",
  enterprise: "bg-purple-100 text-purple-700",
};

export function CompaniesClient({
  companies: initial,
  allSystems,
}: {
  companies: Company[];
  allSystems: AISystem[];
}) {
  const [companies, setCompanies] = useState(initial);
  const [search, setSearch] = useState("");
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [showAdd, setShowAdd] = useState(false);
  const [form, setForm] = useState({ name: "", domain: "", industry: "", country: "", size: "", notes: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const filtered = companies.filter((c) => {
    if (!search) return true;
    const q = search.toLowerCase();
    return [c.name, c.domain, c.industry, c.country, c.tier].join(" ").toLowerCase().includes(q);
  });

  async function handleAdd(e: React.FormEvent) {
    e.preventDefault();
    if (!form.name) return;
    setLoading(true); setError("");
    try {
      const res = await fetch("/api/admin/companies", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (data.error) { setError(data.error); setLoading(false); return; }
      setCompanies((prev) => [...prev, data.company]);
      setForm({ name: "", domain: "", industry: "", country: "", size: "", notes: "" });
      setShowAdd(false);
    } catch { setError("Failed to create company"); }
    setLoading(false);
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Companies</h1>
          <p className="text-sm text-gray-500">{companies.length} companies</p>
        </div>
        <button onClick={() => setShowAdd(!showAdd)}
          className="rounded-lg bg-[#003399] px-4 py-2 text-sm font-semibold text-white hover:bg-[#002277]">
          + Add Company
        </button>
      </div>

      {error && <div className="rounded-lg bg-red-50 border border-red-200 p-3 text-sm text-red-700">{error}</div>}

      {/* Add form */}
      {showAdd && (
        <form onSubmit={handleAdd} className="rounded-xl border border-gray-200 bg-white p-5 space-y-3">
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
            <input type="text" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })}
              placeholder="Company name *" required className="rounded-lg border border-gray-300 px-3 py-2 text-sm" />
            <input type="text" value={form.domain} onChange={(e) => setForm({ ...form, domain: e.target.value })}
              placeholder="Domain (e.g. company.eu)" className="rounded-lg border border-gray-300 px-3 py-2 text-sm" />
            <input type="text" value={form.country} onChange={(e) => setForm({ ...form, country: e.target.value })}
              placeholder="Country" className="rounded-lg border border-gray-300 px-3 py-2 text-sm" />
            <select value={form.industry} onChange={(e) => setForm({ ...form, industry: e.target.value })}
              className="rounded-lg border border-gray-300 px-3 py-2 text-sm">
              <option value="">Industry</option>
              <option value="financial">Financial Services</option>
              <option value="healthcare">Healthcare</option>
              <option value="insurance">Insurance</option>
              <option value="public-sector">Public Sector</option>
              <option value="manufacturing">Manufacturing</option>
              <option value="telecommunications">Telecom</option>
              <option value="energy">Energy</option>
              <option value="hr">HR</option>
              <option value="other">Other</option>
            </select>
            <select value={form.size} onChange={(e) => setForm({ ...form, size: e.target.value })}
              className="rounded-lg border border-gray-300 px-3 py-2 text-sm">
              <option value="">Company size</option>
              <option value="sme">SME (50–1,000)</option>
              <option value="mid-enterprise">Mid Enterprise (1,000–5,000)</option>
              <option value="large-enterprise">Large Enterprise (5,000–20,000)</option>
              <option value="multinational">Multinational (20,000+)</option>
              <option value="public-sector">Public Sector</option>
            </select>
          </div>
          <textarea value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })}
            placeholder="Internal notes..." rows={2} className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm" />
          <div className="flex gap-2">
            <button type="submit" disabled={loading}
              className="rounded-lg bg-[#003399] px-4 py-2 text-sm font-semibold text-white hover:bg-[#002277] disabled:opacity-50">
              {loading ? "Creating..." : "Create"}
            </button>
            <button type="button" onClick={() => setShowAdd(false)}
              className="rounded-lg border border-gray-200 px-4 py-2 text-sm text-gray-500">Cancel</button>
          </div>
        </form>
      )}

      {/* Search */}
      <input type="text" value={search} onChange={(e) => setSearch(e.target.value)}
        placeholder="Search companies..."
        className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm focus:border-[#003399] focus:outline-none focus:ring-1 focus:ring-[#003399]" />

      {/* Table */}
      <div className="overflow-hidden rounded-xl border border-gray-200 bg-white">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 text-xs uppercase tracking-wider text-gray-500 border-b">
            <tr>
              <th className="px-4 py-3 text-left">Company</th>
              <th className="px-4 py-3 text-left">Industry</th>
              <th className="px-4 py-3 text-left">Country</th>
              <th className="px-4 py-3 text-left">Tier</th>
              <th className="px-4 py-3 text-left">Users</th>
              <th className="px-4 py-3 text-left">Cases</th>
              <th className="px-4 py-3 text-left">AI Systems</th>
              <th className="w-10"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {filtered.map((c) => {
              const isExpanded = expandedId === c.id;
              return (
                <>
                  <tr key={c.id} className={`hover:bg-gray-50 cursor-pointer ${isExpanded ? "bg-blue-50/30" : ""}`}
                    onClick={() => setExpandedId(isExpanded ? null : c.id)}>
                    <td className="px-4 py-3">
                      <p className="font-medium text-gray-900">{c.name}</p>
                      {c.domain && <p className="text-[10px] text-gray-400">{c.domain}</p>}
                    </td>
                    <td className="px-4 py-3 text-xs text-gray-600">{c.industry || "—"}</td>
                    <td className="px-4 py-3 text-xs text-gray-600">{c.country || "—"}</td>
                    <td className="px-4 py-3">
                      <span className={`rounded-full px-2 py-0.5 text-xs font-semibold ${TIER_BADGES[c.tier] || TIER_BADGES.free}`}>
                        {c.tier}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-xs text-gray-600">{c.subscriberCount}</td>
                    <td className="px-4 py-3 text-xs text-gray-600">{c.caseCount}</td>
                    <td className="px-4 py-3 text-xs text-gray-600">{c.aiSystemCount}</td>
                    <td className="px-4 py-3">
                      <svg className={`h-4 w-4 text-gray-400 transition-transform ${isExpanded ? "rotate-180" : ""}`}
                        fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" d="m19.5 8.25-7.5 7.5-7.5-7.5" />
                      </svg>
                    </td>
                  </tr>
                  {isExpanded && (
                    <tr key={`${c.id}-detail`}>
                      <td colSpan={8} className="px-4 py-4 bg-gray-50/50">
                        {c.notes && <p className="text-xs text-gray-600 mb-3 italic">{c.notes}</p>}
                        {c.subscribers.length > 0 && (
                          <div className="mb-3">
                            <p className="text-xs font-semibold text-gray-500 uppercase mb-1">People ({c.subscriberCount})</p>
                            <div className="flex flex-wrap gap-2">
                              {c.subscribers.map((s) => (
                                <span key={s.id} className="rounded bg-white border border-gray-200 px-2 py-1 text-[10px] text-gray-700">
                                  {s.name || s.email} <span className="text-gray-400">({s.role || s.tier})</span>
                                </span>
                              ))}
                            </div>
                          </div>
                        )}
                        <p className="text-[10px] text-gray-400">Created: {new Date(c.createdAt).toLocaleDateString("en-GB")}</p>
                      </td>
                    </tr>
                  )}
                </>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
