"use client";

/**
 * NewsMonitorClient — Admin UI for the news monitoring system.
 *
 * Shows:
 *  - Manual "Run Now" trigger with live results
 *  - Recent items as cards with title + editable summary
 *  - Configured news sources list
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
  description: string;
  changeType: string;
  sourceLabel: string;
  sourceUrl: string;
  author: string;
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
  grok?: {
    enabled: boolean;
    rawItems: number;
    newItems: number;
    ingestedItems: number;
    errors: string[];
    duration: number;
  };
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
  vendor: "bg-purple-100 text-purple-700",
};

export function NewsMonitorClient({
  sources,
  recentItems: initialItems,
}: {
  sources: Source[];
  recentItems: RecentItem[];
}) {
  const router = useRouter();
  const [running, setRunning] = useState(false);
  const [result, setResult] = useState<RunResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [tab, setTab] = useState<"recent" | "sources">("recent");

  // Editable items state
  const [items, setItems] = useState<RecentItem[]>(initialItems);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editText, setEditText] = useState("");
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState<string | null>(null);

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
        router.refresh();
      }
    } catch (err) {
      setError((err as Error).message);
    }

    setRunning(false);
  }

  function startEdit(item: RecentItem) {
    setEditingId(item.id);
    setEditText(item.description);
  }

  function cancelEdit() {
    setEditingId(null);
    setEditText("");
  }

  async function saveEdit(id: string) {
    setSaving(true);
    try {
      const res = await fetch("/api/admin/changelog", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, description: editText }),
      });

      if (res.ok) {
        setItems((prev) =>
          prev.map((item) =>
            item.id === id ? { ...item, description: editText } : item
          )
        );
        setEditingId(null);
        showToast("Summary saved");
      } else {
        showToast("Failed to save");
      }
    } catch {
      showToast("Failed to save");
    }
    setSaving(false);
  }

  async function deleteItem(id: string) {
    if (!confirm("Delete this news item?")) return;
    try {
      const res = await fetch(`/api/admin/changelog?id=${id}`, { method: "DELETE" });
      if (res.ok) {
        setItems((prev) => prev.filter((item) => item.id !== id));
        showToast("Deleted");
        router.refresh();
      }
    } catch {
      showToast("Failed to delete");
    }
  }

  const grokItems = items.filter((item) => item.author?.includes("Grok"));

  async function deleteAllGrokItems() {
    if (!confirm(`Delete all ${grokItems.length} Grok/X items?`)) return;
    let deleted = 0;
    for (const item of grokItems) {
      try {
        const res = await fetch(`/api/admin/changelog?id=${item.id}`, { method: "DELETE" });
        if (res.ok) deleted++;
      } catch { /* continue */ }
    }
    setItems((prev) => prev.filter((item) => !item.author?.includes("Grok")));
    showToast(`Deleted ${deleted} Grok items`);
    router.refresh();
  }

  function showToast(msg: string) {
    setToast(msg);
    setTimeout(() => setToast(null), 2500);
  }

  return (
    <>
      {/* Toast */}
      {toast && (
        <div className="fixed top-4 right-4 z-50 rounded-lg bg-gray-900 px-4 py-2.5 text-sm text-white shadow-lg">
          {toast}
        </div>
      )}

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
              <div><strong className="text-green-900">{result.sourcesFetched}</strong> <span className="text-green-700">sources fetched</span></div>
              <div><strong className="text-green-900">{result.rawItems}</strong> <span className="text-green-700">raw items</span></div>
              <div><strong className="text-green-900">{result.relevantItems}</strong> <span className="text-green-700">keyword-matched</span></div>
              <div><strong className="text-green-900">{result.newItems}</strong> <span className="text-green-700">new (after dedup)</span></div>
              <div><strong className="text-green-900">{result.classifiedItems}</strong> <span className="text-green-700">AI-classified</span></div>
              <div><strong className="text-green-900">{result.ingestedItems}</strong> <span className="text-green-700">ingested</span></div>
            </div>
            {result.grok && (
              <div className={`mt-3 rounded-md p-3 ${result.grok.enabled ? "bg-blue-50 border border-blue-200" : "bg-gray-50 border border-gray-200"}`}>
                <p className="text-xs font-semibold text-blue-800 flex items-center gap-1.5">
                  <span>&#x1D54F;</span> Grok / Twitter Scanner
                  {!result.grok.enabled && <span className="text-gray-500 font-normal">(not configured — add XAI_API_KEY)</span>}
                </p>
                {result.grok.enabled && (
                  <div className="mt-1 flex gap-4 text-xs">
                    <span><strong>{result.grok.rawItems}</strong> found</span>
                    <span><strong>{result.grok.newItems}</strong> new</span>
                    <span><strong>{result.grok.ingestedItems}</strong> ingested</span>
                    <span className="text-gray-400">{result.grok.duration}ms</span>
                  </div>
                )}
                {result.grok.errors.length > 0 && (
                  <p className="mt-1 text-xs text-red-600">{result.grok.errors[0]}</p>
                )}
              </div>
            )}
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
          Recent Items ({items.length})
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

      {/* ─── Recent Items (Cards with editable summaries) ─── */}
      {tab === "recent" && (
        <div className="space-y-4">
          {/* Grok warning + bulk delete */}
          {grokItems.length > 0 && (
            <div className="rounded-xl border border-sky-200 bg-sky-50 p-4 flex items-start justify-between gap-4">
              <div className="flex items-start gap-3">
                <span className="text-lg mt-0.5">𝕏</span>
                <div>
                  <p className="text-sm font-semibold text-sky-800">
                    {grokItems.length} item{grokItems.length !== 1 ? "s" : ""} from X/Twitter via Grok Search
                  </p>
                  <p className="mt-0.5 text-xs text-sky-600">
                    Sourced via grounded X search. Review summaries before publishing — edit inline or remove items that aren&apos;t relevant.
                  </p>
                </div>
              </div>
              <button
                onClick={deleteAllGrokItems}
                className="shrink-0 rounded-md bg-sky-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-sky-700 transition"
              >
                Clear all Grok items
              </button>
            </div>
          )}

          {items.length === 0 ? (
            <div className="rounded-xl border border-gray-200 bg-white px-6 py-12 text-center text-gray-400">
              No auto-ingested items yet. Click &quot;Run Now&quot; to start.
            </div>
          ) : (
            items.map((item) => {
              const isGrok = item.author?.includes("Grok");
              return (
                <div
                  key={item.id}
                  className="rounded-xl border border-gray-200 bg-white p-5 hover:shadow-sm transition-shadow"
                >
                  {/* Header row */}
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1 min-w-0">
                      <div className="flex flex-wrap items-center gap-2 mb-1.5">
                        <span className="text-xs font-semibold text-gray-400">
                          {new Date(item.date).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })}
                        </span>
                        <span className={`rounded-full px-2 py-0.5 text-[10px] font-semibold ${CHANGE_TYPE_COLORS[item.changeType] || "bg-gray-100 text-gray-600"}`}>
                          {item.changeType}
                        </span>
                        {isGrok && (
                          <span className="rounded-full bg-sky-100 text-sky-700 px-2 py-0.5 text-[10px] font-semibold">
                            𝕏 Grok Search
                          </span>
                        )}
                        {item.framework && (
                          <span className="text-[10px] font-medium text-blue-600 bg-blue-50 rounded-full px-2 py-0.5">
                            {item.framework}
                          </span>
                        )}
                        {item.system && (
                          <span className="text-[10px] font-medium text-purple-600 bg-purple-50 rounded-full px-2 py-0.5">
                            {item.system}
                          </span>
                        )}
                      </div>

                      {/* Title */}
                      <h3 className="font-semibold text-gray-900 text-sm leading-snug">
                        {item.sourceUrl ? (
                          <a href={item.sourceUrl} target="_blank" rel="noopener noreferrer" className="hover:text-[#003399] hover:underline">
                            {item.title}
                          </a>
                        ) : (
                          item.title
                        )}
                      </h3>
                      <p className="text-[11px] text-gray-400 mt-0.5">{item.sourceLabel}</p>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-1 shrink-0">
                      {editingId !== item.id && (
                        <button
                          onClick={() => startEdit(item)}
                          className="rounded-md p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 transition"
                          title="Edit summary"
                        >
                          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10" />
                          </svg>
                        </button>
                      )}
                      <button
                        onClick={() => deleteItem(item.id)}
                        className="rounded-md p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 transition"
                        title="Delete"
                      >
                        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
                        </svg>
                      </button>
                    </div>
                  </div>

                  {/* Summary — view or edit mode */}
                  <div className="mt-3">
                    {editingId === item.id ? (
                      <div className="space-y-2">
                        <label className="text-[11px] font-medium text-gray-500 uppercase tracking-wide">
                          Summary (plain language, actionable)
                        </label>
                        <textarea
                          value={editText}
                          onChange={(e) => setEditText(e.target.value)}
                          rows={4}
                          className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-800 focus:border-[#003399] focus:outline-none focus:ring-1 focus:ring-[#003399]"
                          placeholder="Write a clear, plain-language summary. What happened? Why does it matter? What should the reader do?"
                        />
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => saveEdit(item.id)}
                            disabled={saving}
                            className="rounded-md bg-[#003399] px-3 py-1.5 text-xs font-semibold text-white hover:bg-[#002277] disabled:opacity-50"
                          >
                            {saving ? "Saving..." : "Save"}
                          </button>
                          <button
                            onClick={cancelEdit}
                            className="rounded-md px-3 py-1.5 text-xs font-medium text-gray-500 hover:text-gray-700 hover:bg-gray-100"
                          >
                            Cancel
                          </button>
                          <span className="text-[10px] text-gray-400 ml-auto">
                            {editText.length} chars
                          </span>
                        </div>
                      </div>
                    ) : (
                      <div
                        onClick={() => startEdit(item)}
                        className="cursor-pointer rounded-lg bg-gray-50 px-4 py-3 hover:bg-blue-50/50 transition group"
                      >
                        <p className="text-sm text-gray-700 leading-relaxed whitespace-pre-wrap">
                          {item.description || <span className="italic text-gray-400">No summary — click to add one</span>}
                        </p>
                        <p className="mt-1.5 text-[10px] text-gray-400 opacity-0 group-hover:opacity-100 transition">
                          Click to edit
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              );
            })
          )}
        </div>
      )}

      {/* ─── Sources ─────────────────────────────────────── */}
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
