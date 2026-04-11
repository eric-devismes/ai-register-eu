"use client";

/**
 * ExpertPanelClient — Interactive UI for the advisory board system.
 *
 * - Start new discussions with a topic input
 * - View discussion threads with expert responses
 * - Submit CEO decisions on unresolved disagreements
 */

import { useState } from "react";
import { useRouter } from "next/navigation";

interface ExpertResponseData {
  id: string;
  expertId: string;
  expertName: string;
  emoji: string;
  round: number;
  response: string;
  position: string;
}

interface DiscussionData {
  id: string;
  topic: string;
  context: string;
  status: string;
  consensus: boolean;
  summary: string;
  ceoDecision: string;
  createdAt: string;
  responses: ExpertResponseData[];
}

const POSITION_STYLES: Record<string, { badge: string; color: string }> = {
  agree: { badge: "✅ Agree", color: "bg-green-50 border-green-200" },
  concern: { badge: "⚠️ Concern", color: "bg-amber-50 border-amber-200" },
  disagree: { badge: "❌ Disagree", color: "bg-red-50 border-red-200" },
  neutral: { badge: "💬 Neutral", color: "bg-gray-50 border-gray-200" },
  resolved: { badge: "✅ Resolved", color: "bg-green-50 border-green-200" },
};

const STATUS_STYLES: Record<string, string> = {
  in_progress: "bg-blue-100 text-blue-700",
  awaiting_ceo: "bg-amber-100 text-amber-700",
  decided: "bg-green-100 text-green-700",
  closed: "bg-gray-100 text-gray-600",
};

export function ExpertPanelClient({
  discussions: initialDiscussions,
}: {
  discussions: DiscussionData[];
}) {
  const router = useRouter();
  const [topic, setTopic] = useState("");
  const [context, setContext] = useState("");
  const [running, setRunning] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [ceoInput, setCeoInput] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [toast, setToast] = useState<string | null>(null);

  const discussions = initialDiscussions;

  function showToast(msg: string) {
    setToast(msg);
    setTimeout(() => setToast(null), 3000);
  }

  async function handleStartDiscussion() {
    if (!topic.trim() || topic.trim().length < 5) {
      setError("Topic must be at least 5 characters");
      return;
    }

    setRunning(true);
    setError(null);

    try {
      const res = await fetch("/api/admin/expert-panel", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ topic: topic.trim(), context: context.trim() }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Failed to start discussion");
      } else {
        setTopic("");
        setContext("");
        showToast(`Discussion complete — ${data.experts.length} experts weighed in`);
        router.refresh();
        // Auto-expand the new discussion
        setExpandedId(data.discussionId);
      }
    } catch (err) {
      setError((err as Error).message);
    }

    setRunning(false);
  }

  async function handleCeoDecision(discussionId: string) {
    if (!ceoInput.trim()) return;
    setSubmitting(true);

    try {
      const res = await fetch("/api/admin/expert-panel", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ discussionId, decision: ceoInput.trim() }),
      });

      if (res.ok) {
        setCeoInput("");
        showToast("Decision recorded and sent to Telegram");
        router.refresh();
      } else {
        showToast("Failed to submit decision");
      }
    } catch {
      showToast("Failed to submit decision");
    }

    setSubmitting(false);
  }

  return (
    <>
      {/* Toast */}
      {toast && (
        <div className="fixed top-4 right-4 z-50 rounded-lg bg-gray-900 px-4 py-2.5 text-sm text-white shadow-lg">
          {toast}
        </div>
      )}

      {/* New Discussion */}
      <div className="mb-8 rounded-xl border border-gray-200 bg-white p-6">
        <h2 className="font-semibold text-gray-900">Start a Discussion</h2>
        <p className="mt-1 text-sm text-gray-500">
          Pose a question or topic. Relevant experts will debate and advise you.
        </p>

        <div className="mt-4 space-y-3">
          <div>
            <label className="block text-xs font-medium text-gray-500 uppercase tracking-wide mb-1">
              Topic / Question
            </label>
            <input
              type="text"
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              placeholder="e.g., Should we switch from Vercel to self-hosted? What's our pricing strategy?"
              className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm text-gray-900 placeholder-gray-400 focus:border-[#003399] focus:outline-none focus:ring-1 focus:ring-[#003399]"
              onKeyDown={(e) => e.key === "Enter" && !running && handleStartDiscussion()}
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-500 uppercase tracking-wide mb-1">
              Context (optional)
            </label>
            <textarea
              value={context}
              onChange={(e) => setContext(e.target.value)}
              placeholder="Any background info, constraints, or specific concerns..."
              rows={2}
              className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm text-gray-900 placeholder-gray-400 focus:border-[#003399] focus:outline-none focus:ring-1 focus:ring-[#003399]"
            />
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={handleStartDiscussion}
              disabled={running || topic.trim().length < 5}
              className="rounded-lg bg-[#003399] px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-[#002277] disabled:opacity-50"
            >
              {running ? (
                <span className="flex items-center gap-2">
                  <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24" fill="none">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                  Experts deliberating...
                </span>
              ) : (
                "🏛️ Convene Board"
              )}
            </button>
            {running && (
              <span className="text-xs text-gray-400">This may take 30-60 seconds</span>
            )}
          </div>
        </div>

        {error && (
          <div className="mt-3 rounded-lg bg-red-50 border border-red-200 p-3 text-sm text-red-700">
            {error}
          </div>
        )}
      </div>

      {/* Discussion History */}
      <h2 className="font-semibold text-gray-900 mb-4">Discussion History</h2>

      {discussions.length === 0 ? (
        <div className="rounded-xl border border-gray-200 bg-white px-6 py-12 text-center text-gray-400">
          No discussions yet. Start one above.
        </div>
      ) : (
        <div className="space-y-4">
          {discussions.map((d) => {
            const isExpanded = expandedId === d.id;
            const round1 = d.responses.filter((r) => r.round === 1);
            const round2 = d.responses.filter((r) => r.round === 2);

            return (
              <div key={d.id} className="rounded-xl border border-gray-200 bg-white overflow-hidden">
                {/* Discussion header — clickable */}
                <button
                  onClick={() => setExpandedId(isExpanded ? null : d.id)}
                  className="w-full px-6 py-4 flex items-center justify-between text-left hover:bg-gray-50 transition"
                >
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-2 mb-1">
                      <span className={`rounded-full px-2.5 py-0.5 text-[10px] font-semibold ${STATUS_STYLES[d.status] || STATUS_STYLES.closed}`}>
                        {d.status === "awaiting_ceo" ? "Awaiting CEO" : d.status.replace("_", " ")}
                      </span>
                      {d.consensus ? (
                        <span className="text-[10px] font-semibold text-green-600">✅ Consensus</span>
                      ) : d.status === "awaiting_ceo" ? (
                        <span className="text-[10px] font-semibold text-amber-600">⚠️ Disagreement</span>
                      ) : null}
                      <span className="text-[10px] text-gray-400">
                        {new Date(d.createdAt).toLocaleDateString("en-GB", {
                          day: "numeric", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit",
                        })}
                      </span>
                    </div>
                    <h3 className="font-semibold text-gray-900 text-sm">{d.topic}</h3>
                    <div className="flex gap-1 mt-1.5">
                      {round1.map((r) => (
                        <span key={r.id} title={`${r.expertName}: ${r.position}`} className="text-base">
                          {r.emoji}
                        </span>
                      ))}
                    </div>
                  </div>
                  <svg
                    className={`h-5 w-5 text-gray-400 transition ${isExpanded ? "rotate-180" : ""}`}
                    fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" d="m19.5 8.25-7.5 7.5-7.5-7.5" />
                  </svg>
                </button>

                {/* Expanded content */}
                {isExpanded && (
                  <div className="border-t border-gray-100 px-6 py-5 space-y-4">
                    {d.context && (
                      <div className="rounded-lg bg-gray-50 p-3">
                        <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-wide mb-1">Context</p>
                        <p className="text-sm text-gray-600">{d.context}</p>
                      </div>
                    )}

                    {/* Round 1 */}
                    <div>
                      <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-3">
                        Round 1 — Initial Positions
                      </p>
                      <div className="space-y-3">
                        {round1.map((r) => {
                          const style = POSITION_STYLES[r.position] || POSITION_STYLES.neutral;
                          return (
                            <div key={r.id} className={`rounded-lg border p-4 ${style.color}`}>
                              <div className="flex items-center justify-between mb-2">
                                <span className="text-sm font-semibold text-gray-900">
                                  {r.emoji} {r.expertName}
                                </span>
                                <span className="text-xs font-medium">{style.badge}</span>
                              </div>
                              <p className="text-sm text-gray-700 leading-relaxed">{r.response}</p>
                            </div>
                          );
                        })}
                      </div>
                    </div>

                    {/* Round 2 */}
                    {round2.length > 0 && (
                      <div>
                        <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-3">
                          Round 2 — Rebuttals
                        </p>
                        <div className="space-y-3">
                          {round2.map((r) => {
                            const style = POSITION_STYLES[r.position] || POSITION_STYLES.neutral;
                            return (
                              <div key={r.id} className={`rounded-lg border p-4 ${style.color}`}>
                                <div className="flex items-center justify-between mb-2">
                                  <span className="text-sm font-semibold text-gray-900">
                                    {r.emoji} {r.expertName}
                                  </span>
                                  <span className="text-xs font-medium">{style.badge}</span>
                                </div>
                                <p className="text-sm text-gray-700 leading-relaxed">{r.response}</p>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    )}

                    {/* CEO Decision */}
                    {d.ceoDecision && (
                      <div className="rounded-lg border border-[#003399]/20 bg-[#003399]/5 p-4">
                        <p className="text-xs font-semibold text-[#003399] uppercase tracking-wide mb-1">
                          👔 CEO Decision
                        </p>
                        <p className="text-sm text-gray-800">{d.ceoDecision}</p>
                      </div>
                    )}

                    {/* CEO Decision Input */}
                    {d.status === "awaiting_ceo" && !d.ceoDecision && (
                      <div className="rounded-lg border border-amber-200 bg-amber-50 p-4">
                        <p className="text-xs font-semibold text-amber-700 uppercase tracking-wide mb-2">
                          Your decision needed
                        </p>
                        <div className="flex gap-2">
                          <input
                            type="text"
                            value={ceoInput}
                            onChange={(e) => setCeoInput(e.target.value)}
                            placeholder="Enter your decision..."
                            className="flex-1 rounded-lg border border-amber-300 px-3 py-2 text-sm text-gray-900 placeholder-gray-400 focus:border-[#003399] focus:outline-none"
                            onKeyDown={(e) => e.key === "Enter" && !submitting && handleCeoDecision(d.id)}
                          />
                          <button
                            onClick={() => handleCeoDecision(d.id)}
                            disabled={submitting || !ceoInput.trim()}
                            className="rounded-lg bg-[#003399] px-4 py-2 text-sm font-semibold text-white hover:bg-[#002277] disabled:opacity-50"
                          >
                            {submitting ? "..." : "Decide"}
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </>
  );
}
