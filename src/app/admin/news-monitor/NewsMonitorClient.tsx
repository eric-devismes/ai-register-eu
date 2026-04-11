"use client";

/**
 * NewsMonitorClient — Admin UI for the news monitoring system.
 *
 * Shows:
 *  - Manual "Run Now" trigger button with live results
 *  - Configured news sources list
 *  - Recent auto-ingested items
 */

import { useState } from "react";
import { useRouter } from "next/navigation";

interface Source {
  id: string;
  name: string;
  type: string;
  category: string;
  trustLevel: string;
  region: string;
}

interface RecentItem {
  id: string;
  date: string;
  title: string;
  changeType: string;
  sourceLabel: string;
  sourceUrl: string;
  framework: string | null;
  system: string | null;
}

interface RunResult {
  success: boolean;
  sourcesFetched: number;
  rawItems: number;
  relevantItems: number;
  newItems: number;
  classifiedItems: number;
  ingestedItems: number;
  errors: string[];
  duration: number;
}

const CHANGE_TYPE_COLORS: Record<string, string> = {
  update: "bg-blue-100 text-blue-700",
  amendment: "bg-purple-100 text-purple-700",
  jurisprudence: "bg-amber-100 text-amber-700",
  new_version: "bg-green-100 text-green-700",
  incident: "bg-red-100 text-red-700",
  certification: "bg-emerald-100 text-emerald-700",
  correction: "bg-gray-100 text-gray-700",
};

const CATEGORY_COLORS: Record<string, string> = {
  regulation: "bg-blue-100 text-blue-700",
  enforcement: "bg-red-100 text-red-700",
  guidance: "bg-green-100 text-green-700",
  industry: "bg-purple-100 text-purple-700",
  standards: "bg-amber-100 text-amber-700",
};

const TRUST_COLORS: Record<string, string> = {
  official: "bg-emerald-100 text-emerald-700",
  institutional: "bg-blue-100 text-blue-700",
  press: "bg-gray-100 text-gray-600",
};

export function NewsMonitorClient({
  sources,
  recentItems,
}: {
  sources: Source[];
  recentItems: RecentItem[];
}) {
  const router = useRouter();
  const [running, setRunning] = useState(false);
  const [result, setResult] = useState<RunResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [tab, setTab] = useState<"recent" | "sources">("recent");

  async function handleRunNow() {
    setRunning(true);
    setResult(null);
    setError(null);

    try {
      const res = await fetch("/api/admin/news-ingest", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Failed to run news monitor");
      } else {
        setResult(data);
        // Refresh server components to update stats
        router.refresh();
      }
    } catch (err) {
      setError((err as Error).message);
    }

    setRunning(false);
  }

  return (
    <>
      {/* Run Now */}
      <div className="mb-8 rounded-xl border border-gray-200 bg-white p-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="font-semibold text-gray-900">Manual Trigger</h2>
            <p className="text-sm text-gray-500">
              Fetch news from all sources, classify with AI, and ingest into newsfeed.
            </p>
          </div>
          <button
            onClick={handleRunNow}
            disabled={running}
            className="rounded-lg bg-[#003399] px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-[#002277] disabled:opacity-50"
          >
            {running ? (
              <span className="flex items-center gap-2">
                <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24" fill="none">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                </svg>
                Running...
              </span>
            ) : (
              "Run Now"
            )}
          </button>
        </div>

        {/* Result */}
        {result && (
          <div className="mt-4 rounded-lg bg-green-50 border border-green-200 p-4">
            <p className="text-sm font-medium text-green-800">Pipeline completed in {result.duration}ms</p>
            <div className="mt-2 grid grid-cols-3 gap-3 text-xs">
              <div>
                <span className="font-semibold text-green-900">{result.sourcesFetched}</span>
                <span className="text-green-700"> sources fetched</span>
              </div>
              <div>
                <span className="font-semibold text-green-900">{result.rawItems}</span>
                <span className="text-green-700"> raw items</span>
              </div>
              <div>
                <span className="font-semibold text-green-900">{result.relevantItems}</span>
                <span className="text-green-700"> keyword-matched</span>
              </div>
              <div>
                <span className="font-semibold text-green-900">{result.newItems}</span>
                <span className="text-green-700"> new (after dedup)</span>
              </div>
              <div>
                <span className="font-semibold text-green-900">{result.classifiedItems}</span>
                <span className="text-green-700"> AI-classified</span>
              </div>
              <div>
                <span className="font-semibold text-green-900">{result.ingestedItems}</span>
                <span className="text-green-700"> ingested</span>
              </div>
            </div>
            {result.errors.length > 0 && (
              <div className="mt-2 text-xs text-amber-700">
                {result.errors.length} error(s): {result.errors.slice(0, 3).join(", ")}
              </div>
            )}
          </div>
        )}

        {error && (
          <div className="mt-4 rounded-lg bg-red-50 border border-red-200 p-4">
            <p className="text-sm text-red-700">{error}</p>
          </div>
        )}
      </div>

      {/* Tabs */}
      <div className="flex gap-1 mb-6 rounded-lg bg-gray-100 p-1 w-fit">
        <button
          onClick={() => setTab("recent")}
          className={`rounded-md px-4 py-2 text-sm font-medium transition ${
            tab === "recent" ? "bg-white text-gray-900 shadow-sm" : "text-gray-500 hover:text-gray-700"
          }`}
        >
          Recent Items ({recentItems.length})
        </button>
        <button
          onClick={() => setTab("sources")}
          className={`rounded-md px-4 py-2 text-sm font-medium transition ${
            tab === "sources" ? "bg-white text-gray-900 shadow-sm" : "text-gray-500 hover:text-gray-700"
          }`}
        >
          Sources ({sources.length})
        </button>
      </div>

      {/* Recent Items */}
      {tab === "recent" && (
        <div className="rounded-xl border border-gray-200 bg-white overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b bg-gray-50 text-left text-xs font-medium text-gray-500">
                <th className="px-4 py-3">Date</th>
                <th className="px-4 py-3">Title</th>
                <th className="px-4 py-3">Type</th>
                <th className="px-4 py-3">Source</th>
                <th className="px-4 py-3">Tagged</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {recentItems.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-4 py-8 text-center text-gray-400">
                    No auto-ingested items yet. Click &quot;Run Now&quot; to start.
                  </td>
                </tr>
              ) : (
                recentItems.map((item) => (
                  <tr key={item.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3 text-xs text-gray-500 whitespace-nowrap">
                      {new Date(item.date).toLocaleDateString("en-GB", { day: "numeric", month: "short" })}
                    </td>
                    <td className="px-4 py-3">
                      {item.sourceUrl ? (
                        <a href={item.sourceUrl} target="_blank" rel="noopener noreferrer" className="text-[#003399] hover:underline">
                          {item.title.slice(0, 80)}{item.title.length > 80 ? "..." : ""}
                        </a>
                      ) : (
                        <span>{item.title.slice(0, 80)}{item.title.length > 80 ? "..." : ""}</span>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      <span className={`inline-block rounded-full px-2 py-0.5 text-[10px] font-semibold ${CHANGE_TYPE_COLORS[item.changeType] || "bg-gray-100 text-gray-600"}`}>
                        {item.changeType}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-xs text-gray-500">{item.sourceLabel}</td>
                    <td className="px-4 py-3 text-xs">
                      {item.framework && <span className="text-blue-600">{item.framework}</span>}
                      {item.framework && item.system && <span className="text-gray-300 mx-1">|</span>}
                      {item.system && <span className="text-purple-600">{item.system}</span>}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* Sources */}
      {tab === "sources" && (
        <div className="rounded-xl border border-gray-200 bg-white overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b bg-gray-50 text-left text-xs font-medium text-gray-500">
                <th className="px-4 py-3">Source</th>
                <th className="px-4 py-3">Type</th>
                <th className="px-4 py-3">Category</th>
                <th className="px-4 py-3">Trust</th>
                <th className="px-4 py-3">Region</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {sources.map((source) => (
                <tr key={source.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3 font-medium text-gray-900">{source.name}</td>
                  <td className="px-4 py-3 text-xs text-gray-500 uppercase">{source.type}</td>
                  <td className="px-4 py-3">
                    <span className={`inline-block rounded-full px-2 py-0.5 text-[10px] font-semibold ${CATEGORY_COLORS[source.category] || "bg-gray-100 text-gray-600"}`}>
                      {source.category}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <span className={`inline-block rounded-full px-2 py-0.5 text-[10px] font-semibold ${TRUST_COLORS[source.trustLevel] || "bg-gray-100 text-gray-600"}`}>
                      {source.trustLevel}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-xs text-gray-500 uppercase">{source.region}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </>
  );
}
