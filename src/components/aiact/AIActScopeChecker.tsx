"use client";

import { useState } from "react";

type Citation = {
  article: string;
  snippet: string;
};

type CheckerResult = {
  classification: "in" | "out" | "borderline";
  reasoning: string;
  citations: Citation[];
};

type Props = {
  lang: string;
  badge: string;
  title: string;
  desc: string;
  placeholder: string;
  submitLabel: string;
  workingLabel: string;
  errorLabel: string;
  resultIn: string;
  resultOut: string;
  resultBorderline: string;
  citationsLabel: string;
  disclaimer: string;
};

export default function AIActScopeChecker({
  lang,
  badge,
  title,
  desc,
  placeholder,
  submitLabel,
  workingLabel,
  errorLabel,
  resultIn,
  resultOut,
  resultBorderline,
  citationsLabel,
  disclaimer,
}: Props) {
  const [useCase, setUseCase] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<CheckerResult | null>(null);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!useCase.trim() || loading) return;
    setLoading(true);
    setError(null);
    setResult(null);
    try {
      const resp = await fetch("/api/ai-act-scope-check", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ useCase: useCase.trim(), lang }),
      });
      if (!resp.ok) {
        throw new Error(`HTTP ${resp.status}`);
      }
      const data = (await resp.json()) as CheckerResult;
      if (
        !data ||
        !["in", "out", "borderline"].includes(data.classification) ||
        typeof data.reasoning !== "string"
      ) {
        throw new Error("Malformed response");
      }
      setResult(data);
    } catch (err) {
      console.error("scope-check failed", err);
      setError(errorLabel);
    } finally {
      setLoading(false);
    }
  }

  const resultLabel =
    result?.classification === "in"
      ? resultIn
      : result?.classification === "out"
        ? resultOut
        : resultBorderline;

  const resultStyles =
    result?.classification === "in"
      ? "border-[#ffc107] bg-[#fffaeb]"
      : result?.classification === "out"
        ? "border-green-300 bg-green-50"
        : "border-orange-300 bg-orange-50";

  const resultBadgeStyles =
    result?.classification === "in"
      ? "bg-[#ffc107] text-[#0d1b3e]"
      : result?.classification === "out"
        ? "bg-green-600 text-white"
        : "bg-orange-500 text-white";

  return (
    <div className="rounded-xl border border-[#003399]/20 bg-white p-6 shadow-sm">
      <div className="mx-auto max-w-3xl">
        <p className="text-xs font-semibold uppercase tracking-wide text-[#003399]">
          {badge}
        </p>
        <h3 className="mt-2 text-xl font-bold text-[#0d1b3e]">{title}</h3>
        <p className="mt-2 text-sm text-gray-600 leading-relaxed">{desc}</p>

        <form onSubmit={onSubmit} className="mt-5">
          <textarea
            value={useCase}
            onChange={(e) => setUseCase(e.target.value)}
            placeholder={placeholder}
            rows={4}
            maxLength={1000}
            disabled={loading}
            className="block w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-sm text-[#0d1b3e] placeholder:text-gray-400 focus:border-[#003399] focus:outline-none focus:ring-2 focus:ring-[#003399]/20 disabled:bg-gray-100"
          />
          <div className="mt-2 flex items-center justify-between text-xs text-gray-500">
            <span>{useCase.length}/1000</span>
          </div>
          <button
            type="submit"
            disabled={loading || !useCase.trim()}
            className="mt-3 inline-flex items-center gap-2 rounded-lg bg-[#003399] px-5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-[#0044bb] disabled:cursor-not-allowed disabled:bg-gray-400"
          >
            {loading ? (
              <>
                <span
                  className="inline-block h-3 w-3 animate-spin rounded-full border-2 border-white border-t-transparent"
                  aria-hidden
                />
                {workingLabel}
              </>
            ) : (
              <>
                {submitLabel}
                <span aria-hidden>→</span>
              </>
            )}
          </button>
        </form>

        {error && (
          <div className="mt-4 rounded-md border border-red-200 bg-red-50 p-3 text-sm text-red-800">
            {error}
          </div>
        )}

        {result && (
          <div className={`mt-6 rounded-lg border-2 p-5 ${resultStyles}`}>
            <span
              className={`inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-semibold ${resultBadgeStyles}`}
            >
              {resultLabel}
            </span>
            <p className="mt-3 text-sm text-[#0d1b3e] leading-relaxed whitespace-pre-wrap">
              {result.reasoning}
            </p>
            {result.citations && result.citations.length > 0 && (
              <div className="mt-4">
                <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">
                  {citationsLabel}
                </p>
                <ul className="mt-2 space-y-2 text-sm text-gray-700">
                  {result.citations.map((c, i) => (
                    <li key={i} className="rounded-md border border-gray-200 bg-white p-3">
                      <p className="text-xs font-semibold text-[#003399]">
                        {c.article}
                      </p>
                      <p className="mt-1 italic">&ldquo;{c.snippet}&rdquo;</p>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}

        <p className="mt-4 text-xs italic text-gray-500">{disclaimer}</p>
      </div>
    </div>
  );
}
