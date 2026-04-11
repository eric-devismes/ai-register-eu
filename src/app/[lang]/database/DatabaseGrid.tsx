"use client";

/**
 * DatabaseGrid — Interactive search + filter grid for the /database page.
 * Client component for state (search term, risk filter).
 *
 * Tier gating: free users see all systems listed but Pro-only systems
 * show a lock icon and link to the pricing page instead of the assessment.
 */

import { useState } from "react";
import Link from "next/link";
import { gradeColor } from "@/lib/scoring";
import { Tooltip } from "@/components/ui/Tooltip";
import type { SubscriptionTier } from "@/lib/tier-access";

interface Score {
  frameworkName: string;
  score: string;
}

interface System {
  id: string;
  slug: string;
  vendor: string;
  name: string;
  type: string;
  risk: string;
  description: string;
  category: string;
  industries: string[];
  scores: Score[];
  overallScore: string;
  updatedAt: string;
  isFree: boolean;
}

const RISK_FILTERS = ["All", "High", "Limited", "Minimal"];

const RISK_COLORS: Record<string, string> = {
  High: "bg-red-100 text-red-700 border-red-200",
  Limited: "bg-amber-100 text-amber-700 border-amber-200",
  Minimal: "bg-green-100 text-green-700 border-green-200",
};

const RISK_TOOLTIPS: Record<string, { short: string; detail: string }> = {
  High: {
    short: "EU AI Act: High-Risk Category",
    detail:
      "This AI system operates in a use-case category classified as 'high-risk' by the EU AI Act (e.g., credit scoring, recruitment, medical devices, law enforcement). This does NOT mean the vendor is non-compliant — it means the system must meet stricter requirements: risk management, data governance, human oversight, transparency, and conformity assessment. A high-risk system can still score A+ on compliance.",
  },
  Limited: {
    short: "EU AI Act: Limited Risk",
    detail:
      "This AI system falls under the 'limited risk' category of the EU AI Act. It has transparency obligations — users must be informed they are interacting with AI (e.g., chatbots, content generation). Fewer requirements than high-risk, but the vendor must still ensure transparency and user awareness.",
  },
  Minimal: {
    short: "EU AI Act: Minimal Risk",
    detail:
      "This AI system is classified as 'minimal risk' under the EU AI Act. No specific regulatory requirements apply beyond existing laws. Most AI systems fall in this category (e.g., spam filters, recommendation engines). Voluntary codes of conduct may apply.",
  },
};

const SCORE_TOOLTIPS: Record<string, string> = {
  "A+": "Excellent — exceeds requirements with best-in-class practices",
  A: "Very good — strong compliance with minor gaps",
  "A-": "Good — solid compliance, some areas for improvement",
  "B+": "Above average — meets most requirements with notable gaps",
  B: "Average — meets baseline requirements",
  "B-": "Below average — meets minimum but with significant gaps",
  "C+": "Needs improvement — partial compliance only",
  C: "Weak — major compliance gaps identified",
  "C-": "Poor — significant regulatory risk",
  D: "Failing — does not meet basic requirements",
};

function LockIcon() {
  return (
    <svg className="h-3.5 w-3.5 text-[#003399]" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 1 0-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 0 0 2.25-2.25v-6.75a2.25 2.25 0 0 0-2.25-2.25H6.75a2.25 2.25 0 0 0-2.25 2.25v6.75a2.25 2.25 0 0 0 2.25 2.25Z" />
    </svg>
  );
}

export function DatabaseGrid({
  systems,
  initialSearch = "",
  tier = "free",
}: {
  systems: System[];
  initialSearch?: string;
  tier?: SubscriptionTier;
}) {
  const [search, setSearch] = useState(initialSearch);
  const [riskFilter, setRiskFilter] = useState("All");

  const hasFullAccess = tier === "pro" || tier === "enterprise";

  const filtered = systems.filter((s) => {
    const matchesSearch =
      search === "" ||
      s.name.toLowerCase().includes(search.toLowerCase()) ||
      s.vendor.toLowerCase().includes(search.toLowerCase()) ||
      s.type.toLowerCase().includes(search.toLowerCase());
    const matchesRisk = riskFilter === "All" || s.risk === riskFilter;
    return matchesSearch && matchesRisk;
  });

  const freeCount = filtered.filter((s) => s.isFree).length;
  const proCount = filtered.filter((s) => !s.isFree).length;

  return (
    <>
      {/* Search + Filters */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <input
          type="text"
          placeholder="Search by name, vendor, or type..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm focus:border-[#003399] focus:outline-none focus:ring-1 focus:ring-[#003399] sm:max-w-sm"
        />
        <div className="flex gap-2">
          {RISK_FILTERS.map((f) => (
            <button
              key={f}
              onClick={() => setRiskFilter(f)}
              className={`rounded-full px-4 py-1.5 text-sm font-medium transition ${
                riskFilter === f
                  ? "bg-[#003399] text-white"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      {/* Results count */}
      <p className="mt-4 text-sm text-gray-500">
        {filtered.length} system{filtered.length !== 1 ? "s" : ""} found
        {!hasFullAccess && proCount > 0 && (
          <span className="ml-2 text-[#003399]">
            &middot; {proCount} available with <Link href="/en/pricing" className="underline hover:text-[#002277]">Pro</Link>
          </span>
        )}
      </p>

      {/* Systems table */}
      <div className="mt-6 overflow-hidden rounded-xl border border-gray-200 bg-white">
        {filtered.length === 0 ? (
          <div className="p-12 text-center text-sm text-gray-500">
            No systems match your search.
          </div>
        ) : (
          <table className="w-full text-left text-sm">
            <thead className="border-b border-gray-100 bg-gray-50 text-xs uppercase tracking-wider text-gray-500">
              <tr>
                <th className="px-6 py-3">System</th>
                <th className="px-6 py-3">Risk</th>
                <th className="px-6 py-3">Overall</th>
                <th className="hidden px-6 py-3 lg:table-cell">Scores</th>
                <th className="hidden px-6 py-3 md:table-cell">Industries</th>
                <th className="px-6 py-3">Updated</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filtered.map((s) => {
                const accessible = hasFullAccess || s.isFree;
                return (
                  <tr key={s.id} className={`transition ${accessible ? "hover:bg-gray-50" : "hover:bg-blue-50/30"}`}>
                    <td className="px-6 py-4">
                      {accessible ? (
                        <Link href={`/systems/${s.slug}`} className="group">
                          <p className="font-medium text-gray-900 group-hover:text-[#003399]">
                            {s.name}
                          </p>
                          <p className="text-xs text-gray-500">{s.vendor} &middot; {s.type}</p>
                        </Link>
                      ) : (
                        <Link href="/en/pricing" className="group">
                          <p className="font-medium text-gray-900 group-hover:text-[#003399] flex items-center gap-1.5">
                            {s.name}
                            <LockIcon />
                          </p>
                          <p className="text-xs text-gray-500">{s.vendor} &middot; {s.type}</p>
                          <p className="mt-0.5 text-[10px] text-[#003399] opacity-0 group-hover:opacity-100 transition-opacity">
                            Upgrade to Pro for full assessment
                          </p>
                        </Link>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <Tooltip
                        text={RISK_TOOLTIPS[s.risk]?.short || "EU AI Act Risk Level"}
                        detail={RISK_TOOLTIPS[s.risk]?.detail}
                        clickable
                        position="bottom"
                      >
                        <span className={`inline-block cursor-pointer rounded-full border px-2.5 py-0.5 text-xs font-semibold ${RISK_COLORS[s.risk] || RISK_COLORS.High}`}>
                          {s.risk} ⓘ
                        </span>
                      </Tooltip>
                    </td>
                    <td className="px-6 py-4">
                      {accessible ? (
                        <Tooltip
                          text={`Overall: ${s.overallScore} — ${SCORE_TOOLTIPS[s.overallScore] || "Average across all frameworks"}`}
                          position="bottom"
                        >
                          <span className={`inline-flex h-8 w-8 items-center justify-center rounded-full text-xs font-bold text-white cursor-help ${gradeColor(s.overallScore)}`}>
                            {s.overallScore}
                          </span>
                        </Tooltip>
                      ) : (
                        <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-gray-200 text-xs font-bold text-gray-400">
                          ?
                        </span>
                      )}
                    </td>
                    <td className="hidden px-6 py-4 lg:table-cell">
                      {accessible ? (
                        <div className="flex gap-2">
                          {s.scores.slice(0, 4).map((sc) => (
                            <div key={sc.frameworkName} className="flex flex-col items-center gap-0.5">
                              <Tooltip
                                text={`${sc.frameworkName}: ${sc.score} — ${SCORE_TOOLTIPS[sc.score] || "Assessment score"}`}
                                position="bottom"
                              >
                                <span className={`inline-flex h-6 w-6 items-center justify-center rounded-full text-[10px] font-bold text-white cursor-help ${gradeColor(sc.score)}`}>
                                  {sc.score}
                                </span>
                              </Tooltip>
                              <span className="text-[9px] text-gray-400 max-w-[48px] truncate">{sc.frameworkName}</span>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="flex gap-2">
                          {[1, 2, 3].map((i) => (
                            <div key={i} className="flex flex-col items-center gap-0.5">
                              <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-gray-200 text-[10px] font-bold text-gray-400">
                                ?
                              </span>
                            </div>
                          ))}
                        </div>
                      )}
                    </td>
                    <td className="hidden px-6 py-4 md:table-cell">
                      <div className="flex flex-wrap gap-1">
                        {s.industries.slice(0, 2).map((name) => (
                          <span key={name} className="rounded bg-gray-100 px-1.5 py-0.5 text-[10px] text-gray-600">
                            {name}
                          </span>
                        ))}
                        {s.industries.length > 2 && (
                          <span className="text-[10px] text-gray-400">+{s.industries.length - 2}</span>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-xs text-gray-400">
                      {s.updatedAt}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>

      {/* Upgrade banner for free users */}
      {!hasFullAccess && proCount > 0 && (
        <div className="mt-8 rounded-xl border border-[#003399]/20 bg-gradient-to-r from-[#003399]/5 to-[#ffc107]/5 p-6 text-center">
          <p className="text-sm font-medium text-[#0d1b3e]">
            {proCount} more AI systems available with full compliance assessments
          </p>
          <p className="mt-1 text-xs text-gray-500">
            Get detailed scoring breakdowns, comparison tools, and a personalized compliance dashboard.
          </p>
          <Link
            href="/en/pricing"
            className="mt-4 inline-block rounded-lg bg-[#003399] px-6 py-2.5 text-sm font-semibold text-white hover:bg-[#002277] transition-colors"
          >
            Upgrade to Pro &mdash; &euro;19/month
          </Link>
        </div>
      )}
    </>
  );
}
