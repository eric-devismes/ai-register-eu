"use client";

/**
 * CustomersClient — Light CRM view of subscribers.
 *
 * - Stat cards by tier
 * - Search by email, role, industry
 * - Filter by tier
 * - Expandable row details (systems followed, frameworks, dates)
 */

import { useState } from "react";

interface Subscriber {
  id: string;
  email: string;
  verified: boolean;
  tier: string;
  role: string;
  industry: string;
  orgSize: string;
  platforms: string;
  digestEnabled: boolean;
  digestFrequency: string;
  stripeCustomerId: string | null;
  systems: string[];
  frameworks: string[];
  consentDate: string | null;
  createdAt: string;
  tierExpiresAt: string | null;
}

const TIER_BADGES: Record<string, string> = {
  free: "bg-gray-100 text-gray-600",
  pro: "bg-blue-100 text-blue-700",
  enterprise: "bg-purple-100 text-purple-700",
};

const ROLE_LABELS: Record<string, string> = {
  dpo: "DPO",
  procurement: "Procurement",
  cto: "CTO",
  ciso: "CISO",
  legal: "Legal",
  executive: "Executive",
  other: "Other",
};

const INDUSTRY_LABELS: Record<string, string> = {
  financial: "Financial Services",
  healthcare: "Healthcare",
  insurance: "Insurance",
  "public-sector": "Public Sector",
  hr: "HR",
  other: "Other",
};

const ORG_LABELS: Record<string, string> = {
  startup: "Startup",
  sme: "SME",
  enterprise: "Enterprise",
  "public-sector": "Public Sector",
};

function formatDate(iso: string | null): string {
  if (!iso) return "—";
  return new Date(iso).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" });
}

export function CustomersClient({ subscribers }: { subscribers: Subscriber[] }) {
  const [search, setSearch] = useState("");
  const [tierFilter, setTierFilter] = useState("all");
  const [expandedId, setExpandedId] = useState<string | null>(null);

  // Stats
  const total = subscribers.length;
  const freeCount = subscribers.filter((s) => s.tier === "free").length;
  const proCount = subscribers.filter((s) => s.tier === "pro").length;
  const entCount = subscribers.filter((s) => s.tier === "enterprise").length;
  const verifiedCount = subscribers.filter((s) => s.verified).length;

  // Filter
  const filtered = subscribers.filter((s) => {
    if (tierFilter !== "all" && s.tier !== tierFilter) return false;
    if (search) {
      const q = search.toLowerCase();
      return [s.email, s.role, s.industry, s.orgSize, ...s.systems].join(" ").toLowerCase().includes(q);
    }
    return true;
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Customers</h1>
          <p className="text-sm text-gray-500">
            {total} subscriber{total !== 1 ? "s" : ""} &middot; {verifiedCount} verified
          </p>
        </div>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        <button onClick={() => setTierFilter("all")}
          className={`rounded-xl border p-4 text-left transition ${tierFilter === "all" ? "border-[#003399] bg-blue-50" : "border-gray-200 bg-white hover:bg-gray-50"}`}>
          <p className="text-xs text-gray-500">All</p>
          <p className="mt-1 text-2xl font-bold text-gray-900">{total}</p>
        </button>
        <button onClick={() => setTierFilter("free")}
          className={`rounded-xl border p-4 text-left transition ${tierFilter === "free" ? "border-[#003399] bg-blue-50" : "border-gray-200 bg-white hover:bg-gray-50"}`}>
          <p className="text-xs text-gray-500">Free</p>
          <p className="mt-1 text-2xl font-bold text-gray-600">{freeCount}</p>
        </button>
        <button onClick={() => setTierFilter("pro")}
          className={`rounded-xl border p-4 text-left transition ${tierFilter === "pro" ? "border-[#003399] bg-blue-50" : "border-gray-200 bg-white hover:bg-gray-50"}`}>
          <p className="text-xs text-gray-500">Pro</p>
          <p className="mt-1 text-2xl font-bold text-blue-600">{proCount}</p>
        </button>
        <button onClick={() => setTierFilter("enterprise")}
          className={`rounded-xl border p-4 text-left transition ${tierFilter === "enterprise" ? "border-[#003399] bg-blue-50" : "border-gray-200 bg-white hover:bg-gray-50"}`}>
          <p className="text-xs text-gray-500">Enterprise</p>
          <p className="mt-1 text-2xl font-bold text-purple-600">{entCount}</p>
        </button>
      </div>

      {/* Search */}
      <div className="relative">
        <svg className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
        </svg>
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search by email, role, industry, or AI system..."
          className="w-full rounded-lg border border-gray-300 pl-10 pr-4 py-2.5 text-sm focus:border-[#003399] focus:outline-none focus:ring-1 focus:ring-[#003399]"
        />
      </div>

      {/* GDPR notice */}
      <div className="rounded-lg border border-amber-200 bg-amber-50 p-3 text-xs text-amber-800">
        <strong>GDPR:</strong> Read-only view. Subscribers manage their own data via self-service account settings.
      </div>

      {/* Results */}
      <p className="text-xs text-gray-400">{filtered.length} result{filtered.length !== 1 ? "s" : ""}</p>

      {/* Table */}
      <div className="overflow-hidden rounded-xl border border-gray-200 bg-white">
        {filtered.length === 0 ? (
          <div className="p-8 text-center text-sm text-gray-500">No subscribers match your filters.</div>
        ) : (
          <table className="w-full text-sm">
            <thead className="bg-gray-50 text-xs uppercase tracking-wider text-gray-500 border-b">
              <tr>
                <th className="px-4 py-3 text-left">Email</th>
                <th className="px-4 py-3 text-left">Tier</th>
                <th className="px-4 py-3 text-left">Role</th>
                <th className="px-4 py-3 text-left">Industry</th>
                <th className="px-4 py-3 text-left">Org</th>
                <th className="px-4 py-3 text-left">Registered</th>
                <th className="px-4 py-3 text-left">AI Systems</th>
                <th className="w-10"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filtered.map((sub) => {
                const isExpanded = expandedId === sub.id;
                return (
                  <>
                    <tr key={sub.id}
                      className={`hover:bg-gray-50 cursor-pointer ${isExpanded ? "bg-blue-50/30" : ""}`}
                      onClick={() => setExpandedId(isExpanded ? null : sub.id)}>
                      <td className="px-4 py-3">
                        <span className="font-medium text-gray-900">{sub.email}</span>
                        {!sub.verified && <span className="ml-1 text-[10px] text-red-400">unverified</span>}
                      </td>
                      <td className="px-4 py-3">
                        <span className={`rounded-full px-2 py-0.5 text-xs font-semibold ${TIER_BADGES[sub.tier] || TIER_BADGES.free}`}>
                          {sub.tier}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-xs text-gray-600">{ROLE_LABELS[sub.role] || sub.role || "—"}</td>
                      <td className="px-4 py-3 text-xs text-gray-600">{INDUSTRY_LABELS[sub.industry] || sub.industry || "—"}</td>
                      <td className="px-4 py-3 text-xs text-gray-600">{ORG_LABELS[sub.orgSize] || sub.orgSize || "—"}</td>
                      <td className="px-4 py-3 text-xs text-gray-400">{formatDate(sub.createdAt)}</td>
                      <td className="px-4 py-3 text-xs text-gray-400">{sub.systems.length || "—"}</td>
                      <td className="px-4 py-3">
                        <svg className={`h-4 w-4 text-gray-400 transition-transform ${isExpanded ? "rotate-180" : ""}`}
                          fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" d="m19.5 8.25-7.5 7.5-7.5-7.5" />
                        </svg>
                      </td>
                    </tr>
                    {/* Expanded details */}
                    {isExpanded && (
                      <tr key={`${sub.id}-detail`}>
                        <td colSpan={8} className="px-4 py-4 bg-gray-50/50">
                          <div className="grid grid-cols-2 gap-4 sm:grid-cols-4 text-xs">
                            <div>
                              <p className="font-semibold text-gray-500 uppercase">Digest</p>
                              <p className="mt-0.5 text-gray-700">{sub.digestEnabled ? sub.digestFrequency : "Off"}</p>
                            </div>
                            <div>
                              <p className="font-semibold text-gray-500 uppercase">Consent Date</p>
                              <p className="mt-0.5 text-gray-700">{formatDate(sub.consentDate)}</p>
                            </div>
                            <div>
                              <p className="font-semibold text-gray-500 uppercase">Tier Expires</p>
                              <p className="mt-0.5 text-gray-700">{formatDate(sub.tierExpiresAt)}</p>
                            </div>
                            <div>
                              <p className="font-semibold text-gray-500 uppercase">Stripe ID</p>
                              <p className="mt-0.5 text-gray-700 truncate">{sub.stripeCustomerId || "—"}</p>
                            </div>
                          </div>
                          {sub.systems.length > 0 && (
                            <div className="mt-3">
                              <p className="text-xs font-semibold text-gray-500 uppercase mb-1">AI Systems Followed</p>
                              <div className="flex flex-wrap gap-1">
                                {sub.systems.map((s) => (
                                  <span key={s} className="rounded bg-blue-50 px-2 py-0.5 text-[10px] text-blue-700">{s}</span>
                                ))}
                              </div>
                            </div>
                          )}
                          {sub.frameworks.length > 0 && (
                            <div className="mt-2">
                              <p className="text-xs font-semibold text-gray-500 uppercase mb-1">Frameworks Followed</p>
                              <div className="flex flex-wrap gap-1">
                                {sub.frameworks.map((f) => (
                                  <span key={f} className="rounded bg-purple-50 px-2 py-0.5 text-[10px] text-purple-700">{f}</span>
                                ))}
                              </div>
                            </div>
                          )}
                        </td>
                      </tr>
                    )}
                  </>
                );
              })}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
