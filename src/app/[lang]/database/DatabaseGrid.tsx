"use client";

/**
 * DatabaseGrid — Interactive search + filter grid for the /database page.
 * Client component for state (search term, risk filter).
 */

import { useState } from "react";
import Link from "next/link";
import { gradeColor } from "@/lib/scoring";

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
}

const RISK_FILTERS = ["All", "High", "Limited", "Minimal"];

const RISK_COLORS: Record<string, string> = {
  High: "bg-red-100 text-red-700 border-red-200",
  Limited: "bg-amber-100 text-amber-700 border-amber-200",
  Minimal: "bg-green-100 text-green-700 border-green-200",
};

export function DatabaseGrid({ systems, initialSearch = "" }: { systems: System[]; initialSearch?: string }) {
  const [search, setSearch] = useState(initialSearch);
  const [riskFilter, setRiskFilter] = useState("All");

  const filtered = systems.filter((s) => {
    const matchesSearch =
      search === "" ||
      s.name.toLowerCase().includes(search.toLowerCase()) ||
      s.vendor.toLowerCase().includes(search.toLowerCase()) ||
      s.type.toLowerCase().includes(search.toLowerCase());
    const matchesRisk = riskFilter === "All" || s.risk === riskFilter;
    return matchesSearch && matchesRisk;
  });

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
              {filtered.map((s) => (
                <tr key={s.id} className="transition hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <Link href={`/systems/${s.slug}`} className="group">
                      <p className="font-medium text-gray-900 group-hover:text-[#003399]">
                        {s.name}
                      </p>
                      <p className="text-xs text-gray-500">{s.vendor} &middot; {s.type}</p>
                    </Link>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-block rounded-full border px-2.5 py-0.5 text-xs font-semibold ${RISK_COLORS[s.risk] || RISK_COLORS.High}`}>
                      {s.risk}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex h-8 w-8 items-center justify-center rounded-full text-xs font-bold text-white ${gradeColor(s.overallScore)}`}>
                      {s.overallScore}
                    </span>
                  </td>
                  <td className="hidden px-6 py-4 lg:table-cell">
                    <div className="flex gap-2">
                      {s.scores.slice(0, 4).map((sc) => (
                        <div key={sc.frameworkName} className="flex flex-col items-center gap-0.5">
                          <span className={`inline-flex h-6 w-6 items-center justify-center rounded-full text-[10px] font-bold text-white ${gradeColor(sc.score)}`}>
                            {sc.score}
                          </span>
                          <span className="text-[9px] text-gray-400 max-w-[48px] truncate">{sc.frameworkName}</span>
                        </div>
                      ))}
                    </div>
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
              ))}
            </tbody>
          </table>
        )}
      </div>
    </>
  );
}
