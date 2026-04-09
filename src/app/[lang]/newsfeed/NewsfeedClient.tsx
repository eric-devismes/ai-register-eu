"use client";

/**
 * NewsfeedClient — Interactive newsfeed with search and time filtering.
 *
 * Default view: recent news (last 7 days).
 * Search: filters by title, description, framework, or system name.
 * "Show all" toggle to see the complete archive.
 */

import { useState } from "react";
import Link from "next/link";

interface Entry {
  id: string;
  date: string;
  title: string;
  description: string;
  changeType: string;
  sourceUrl: string;
  sourceLabel: string;
  framework: { slug: string; name: string } | null;
  system: { slug: string; name: string; vendor: string } | null;
}

const CHANGE_TYPE_LABELS: Record<string, { label: string; color: string }> = {
  update: { label: "Update", color: "bg-blue-100 text-blue-700" },
  amendment: { label: "Amendment", color: "bg-purple-100 text-purple-700" },
  jurisprudence: { label: "Ruling", color: "bg-amber-100 text-amber-700" },
  new_version: { label: "New Version", color: "bg-green-100 text-green-700" },
  incident: { label: "Incident", color: "bg-red-100 text-red-700" },
  certification: { label: "Certification", color: "bg-emerald-100 text-emerald-700" },
  correction: { label: "Correction", color: "bg-gray-100 text-gray-700" },
};

function formatDate(iso: string): string {
  return new Intl.DateTimeFormat("en-GB", { day: "numeric", month: "short", year: "numeric" }).format(new Date(iso));
}

export function NewsfeedClient({ entries }: { entries: Entry[] }) {
  const [search, setSearch] = useState("");
  const [showAll, setShowAll] = useState(false);

  // Recent = last 7 days
  const sevenDaysAgo = new Date();
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

  // Filter logic
  const filtered = entries.filter((e) => {
    // Time filter: recent by default, all if searching or showAll
    if (!showAll && !search) {
      if (new Date(e.date) < sevenDaysAgo) return false;
    }

    // Search filter
    if (search) {
      const q = search.toLowerCase();
      const searchable = [
        e.title,
        e.description,
        e.framework?.name || "",
        e.system?.name || "",
        e.system?.vendor || "",
        e.changeType,
      ].join(" ").toLowerCase();
      return searchable.includes(q);
    }

    return true;
  });

  const recentCount = entries.filter((e) => new Date(e.date) >= sevenDaysAgo).length;

  return (
    <>
      {/* Search + controls */}
      <div className="flex flex-col sm:flex-row gap-3 mb-8">
        <div className="relative flex-1">
          <svg className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
          </svg>
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search past news..."
            className="w-full rounded-lg border border-gray-300 pl-10 pr-4 py-2.5 text-sm focus:border-[#003399] focus:outline-none focus:ring-1 focus:ring-[#003399]"
          />
        </div>
        {!search && (
          <button
            onClick={() => setShowAll(!showAll)}
            className={`rounded-lg px-4 py-2.5 text-sm font-medium transition shrink-0 ${
              showAll
                ? "bg-[#003399] text-white"
                : "bg-white text-gray-600 border border-gray-300 hover:bg-gray-50"
            }`}
          >
            {showAll ? "Show recent" : `Show all (${entries.length})`}
          </button>
        )}
      </div>

      {/* Results count */}
      <p className="text-xs text-gray-400 mb-4">
        {search
          ? `${filtered.length} result${filtered.length !== 1 ? "s" : ""} for "${search}"`
          : showAll
          ? `${filtered.length} entries`
          : `${recentCount} recent update${recentCount !== 1 ? "s" : ""} (last 7 days)`}
      </p>

      {/* Entries */}
      {filtered.length === 0 ? (
        <div className="text-center py-16">
          <p className="text-gray-500 text-sm">
            {search ? "No news matching your search." : "No recent news."}
          </p>
          {!showAll && !search && (
            <button
              onClick={() => setShowAll(true)}
              className="mt-3 text-sm text-[#003399] underline hover:text-[#002277]"
            >
              View all past news
            </button>
          )}
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map((entry) => {
            const typeInfo = CHANGE_TYPE_LABELS[entry.changeType] || CHANGE_TYPE_LABELS.update;
            return (
              <article
                key={entry.id}
                className="rounded-xl border border-gray-200 bg-white p-4 hover:shadow-sm transition-shadow"
              >
                <div className="flex items-start gap-3">
                  {/* Date */}
                  <div className="hidden sm:block text-xs text-gray-400 pt-0.5 w-20 shrink-0">
                    {formatDate(entry.date)}
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-2 mb-1">
                      <span className={`inline-block rounded-full px-2.5 py-0.5 text-[10px] font-semibold ${typeInfo.color}`}>
                        {typeInfo.label}
                      </span>
                      {entry.framework && (
                        <Link href={`/en/regulations/${entry.framework.slug}`} className="text-[10px] font-medium text-[#003399] hover:underline">
                          {entry.framework.name}
                        </Link>
                      )}
                      {entry.system && (
                        <Link href={`/en/systems/${entry.system.slug}`} className="text-[10px] font-medium text-[#003399] hover:underline">
                          {entry.system.vendor} {entry.system.name}
                        </Link>
                      )}
                      <span className="sm:hidden text-[10px] text-gray-400">{formatDate(entry.date)}</span>
                    </div>
                    <h3 className="font-medium text-gray-900 text-sm">{entry.title}</h3>
                    <p className="mt-1 text-sm text-gray-600 line-clamp-2">{entry.description}</p>

                    {entry.sourceUrl && (
                      <a href={entry.sourceUrl} target="_blank" rel="noopener noreferrer" className="mt-1.5 inline-flex items-center gap-1 text-xs text-[#003399] hover:underline">
                        {entry.sourceLabel || "Source"}
                        <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 6H5.25A2.25 2.25 0 0 0 3 8.25v10.5A2.25 2.25 0 0 0 5.25 21h10.5A2.25 2.25 0 0 0 18 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25" />
                        </svg>
                      </a>
                    )}
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      )}

      {/* Pro upsell */}
      <div className="mt-12 rounded-xl border border-[#003399]/20 bg-gradient-to-r from-[#003399]/5 to-[#ffc107]/5 p-5 text-center">
        <p className="text-sm font-medium text-[#0d1b3e]">
          Want alerts tailored to your AI stack?
        </p>
        <p className="mt-1 text-xs text-gray-500">
          Pro subscribers get personalized dashboards and real-time alerts.
        </p>
        <Link href="/en/pricing" className="mt-3 inline-block rounded-lg bg-[#003399] px-5 py-2 text-xs font-semibold text-white hover:bg-[#002277]">
          Upgrade to Pro — €19/month
        </Link>
      </div>
    </>
  );
}
