"use client";

/**
 * PodiumClient — Interactive top-3 AI system recommender.
 *
 * Steps:
 *   1. Fill in requirements (use case, industry, org size, requirements tags, budget)
 *   2. Generate (loading state -> podium display)
 *   3. View results as gold/silver/bronze podium cards
 *   4. Link to full profiles or compare tool
 */

import { useState, useCallback } from "react";
import Link from "next/link";
import { useLocale } from "@/lib/locale-context";
import type { SubscriptionTier } from "@/lib/tier-access";

// ─── Types ────────────────────────────────────────────────

interface PodiumEntry {
  rank: number;
  systemSlug: string;
  systemName: string;
  vendor: string;
  type: string;
  risk: string;
  category: string;
  overallScore: string;
  overallFit: number;
  strengths: string[];
  weaknesses: string[];
  complianceHighlights: string;
  riskFlags: string[];
  recommendation: string;
  scores: { framework: string; score: string }[];
  industries: string[];
}

interface Props {
  tier: SubscriptionTier;
}

// ─── Constants ────────────────────────────────────────────

const INDUSTRIES = [
  { value: "financial", label: "Financial Services" },
  { value: "healthcare", label: "Healthcare" },
  { value: "insurance", label: "Insurance" },
  { value: "public-sector", label: "Public Sector" },
  { value: "manufacturing", label: "Manufacturing" },
  { value: "telecommunications", label: "Telecommunications" },
  { value: "energy", label: "Energy & Utilities" },
  { value: "hr", label: "Human Resources" },
  { value: "legal", label: "Legal" },
  { value: "education", label: "Education" },
  { value: "retail", label: "Retail & E-commerce" },
  { value: "logistics", label: "Logistics & Supply Chain" },
  { value: "other", label: "Other" },
];

const ORG_SIZES = [
  { value: "sme", label: "SME (50–1,000 employees)" },
  { value: "mid-enterprise", label: "Mid Enterprise (1,000–5,000 employees)" },
  { value: "large-enterprise", label: "Large Enterprise (5,000–20,000 employees)" },
  { value: "multinational", label: "Multinational (20,000+ employees)" },
  { value: "public-sector", label: "Public Sector" },
];

const SUGGESTED_REQUIREMENTS = [
  "EU data residency",
  "SOC 2 Type II",
  "On-premises",
  "GDPR Article 28 DPA",
  "ISO 27001",
  "Open source",
  "API access",
  "Multi-language support",
  "SSO / SAML",
  "Audit logging",
];

const PODIUM_STYLES: Record<number, { border: string; bg: string; accent: string; label: string; emoji: string; height: string }> = {
  1: {
    border: "border-yellow-400",
    bg: "bg-gradient-to-b from-yellow-50 to-white",
    accent: "text-yellow-600",
    label: "Gold",
    emoji: "\uD83E\uDD47",
    height: "min-h-[28rem]",
  },
  2: {
    border: "border-gray-400",
    bg: "bg-gradient-to-b from-gray-100 to-white",
    accent: "text-gray-500",
    label: "Silver",
    emoji: "\uD83E\uDD48",
    height: "min-h-[24rem]",
  },
  3: {
    border: "border-amber-600",
    bg: "bg-gradient-to-b from-orange-50 to-white",
    accent: "text-amber-700",
    label: "Bronze",
    emoji: "\uD83E\uDD49",
    height: "min-h-[22rem]",
  },
};

// ─── Component ────────────────────────────────────────────

export function PodiumClient({ tier }: Props) {
  const locale = useLocale();
  const hasAccess = tier === "pro" || tier === "enterprise";

  // Form state
  const [useCase, setUseCase] = useState("");
  const [industry, setIndustry] = useState("");
  const [orgSize, setOrgSize] = useState("");
  const [requirements, setRequirements] = useState<string[]>([]);
  const [reqInput, setReqInput] = useState("");
  const [budget, setBudget] = useState("");

  // Generation state
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [podium, setPodium] = useState<PodiumEntry[]>([]);
  const [systemCount, setSystemCount] = useState(0);

  // ─── Tag Input Handlers ─────────────────────────────────

  const addRequirement = useCallback((tag: string) => {
    const trimmed = tag.trim();
    if (trimmed && !requirements.includes(trimmed)) {
      setRequirements((prev) => [...prev, trimmed]);
    }
    setReqInput("");
  }, [requirements]);

  const removeRequirement = useCallback((tag: string) => {
    setRequirements((prev) => prev.filter((r) => r !== tag));
  }, []);

  function handleReqKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Enter") {
      e.preventDefault();
      addRequirement(reqInput);
    }
    if (e.key === "Backspace" && reqInput === "" && requirements.length > 0) {
      removeRequirement(requirements[requirements.length - 1]);
    }
  }

  // ─── Generate Podium ───────────────────────────────────

  async function handleGenerate() {
    if (!useCase || !industry || !orgSize || requirements.length === 0) {
      setError("Please fill in all required fields and add at least one requirement.");
      return;
    }

    setLoading(true);
    setError("");
    setPodium([]);

    try {
      const res = await fetch("/api/podium", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          useCase,
          industry,
          orgSize,
          requirements,
          budget: budget || undefined,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Failed to generate recommendations.");
        return;
      }

      setPodium(data.podium);
      setSystemCount(data.systemCount);
    } catch {
      setError("Network error. Please check your connection and try again.");
    } finally {
      setLoading(false);
    }
  }

  // ─── Free Tier Gate ─────────────────────────────────────

  if (!hasAccess) {
    return (
      <div className="relative">
        {/* Blurred preview */}
        <div className="pointer-events-none select-none blur-sm opacity-50">
          <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
            <div className="space-y-4">
              <div className="h-24 bg-gray-100 rounded-lg" />
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="h-10 bg-gray-100 rounded-lg" />
                <div className="h-10 bg-gray-100 rounded-lg" />
              </div>
              <div className="h-10 bg-gray-100 rounded-lg" />
            </div>
          </div>
          <div className="mt-8 flex items-end justify-center gap-4">
            <div className="w-64 h-72 rounded-xl border-2 border-gray-300 bg-gray-50 p-4" />
            <div className="w-64 h-80 rounded-xl border-2 border-yellow-400 bg-yellow-50 p-4" />
            <div className="w-64 h-64 rounded-xl border-2 border-gray-300 bg-gray-50 p-4" />
          </div>
        </div>

        {/* Upgrade CTA overlay */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="rounded-2xl bg-white/95 backdrop-blur-sm border border-[#003399]/20 shadow-xl px-8 py-10 text-center max-w-lg mx-4">
            <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-[#003399]/10">
              <svg className="h-7 w-7 text-[#003399]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" />
              </svg>
            </div>
            <h2 className="text-xl font-bold text-[#0d1b3e] font-serif">
              Unlock AI System Recommendations
            </h2>
            <p className="mt-3 text-gray-600 text-sm leading-relaxed">
              Get personalised top-3 recommendations with compliance scoring,
              strengths/weaknesses analysis, and risk flags.
              Available on Pro and Enterprise plans.
            </p>
            <a
              href={`/${locale}/pricing`}
              className="mt-6 inline-flex items-center gap-2 rounded-lg bg-[#003399] px-6 py-3 text-sm font-semibold text-white shadow-sm hover:bg-[#002266] transition-colors"
            >
              Upgrade to Pro
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
              </svg>
            </a>
            <p className="mt-3 text-xs text-gray-400">
              Starting at EUR 19/month
            </p>
          </div>
        </div>
      </div>
    );
  }

  // ─── Results View — Podium ─────────────────────────────

  if (podium.length > 0) {
    // Reorder for podium layout: silver (2nd) | gold (1st) | bronze (3rd)
    const gold = podium.find((p) => p.rank === 1);
    const silver = podium.find((p) => p.rank === 2);
    const bronze = podium.find((p) => p.rank === 3);
    const podiumOrder = [silver, gold, bronze].filter(Boolean) as PodiumEntry[];
    const compareSlugs = podium.map((p) => p.systemSlug).join(",");

    return (
      <div>
        {/* Action bar */}
        <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
          <button
            onClick={() => setPodium([])}
            className="inline-flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
          >
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
            </svg>
            New Search
          </button>
          <p className="text-sm text-gray-500">
            Analysed {systemCount} AI systems
          </p>
        </div>

        {/* Podium */}
        <div className="flex flex-col lg:flex-row items-end justify-center gap-6 mb-10">
          {podiumOrder.map((entry) => {
            const style = PODIUM_STYLES[entry.rank];
            return (
              <div
                key={entry.systemSlug}
                className={`w-full lg:w-80 ${style.height} rounded-2xl border-2 ${style.border} ${style.bg} p-6 shadow-lg flex flex-col transition-all ${entry.rank === 1 ? "lg:-mt-8 ring-2 ring-yellow-300/50" : ""}`}
              >
                {/* Rank badge */}
                <div className="flex items-center justify-between mb-4">
                  <span className="text-3xl">{style.emoji}</span>
                  <span className={`text-xs font-bold uppercase tracking-wider ${style.accent}`}>
                    {style.label} — #{entry.rank}
                  </span>
                </div>

                {/* System info */}
                <h3 className="text-lg font-bold text-[#0d1b3e] font-serif leading-tight">
                  {entry.systemName}
                </h3>
                <p className="text-sm text-gray-500 mb-1">{entry.vendor}</p>

                {/* Fit score */}
                <div className="my-3 flex items-center gap-3">
                  <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-700 ${
                        entry.overallFit >= 80
                          ? "bg-green-500"
                          : entry.overallFit >= 60
                            ? "bg-yellow-500"
                            : "bg-red-500"
                      }`}
                      style={{ width: `${entry.overallFit}%` }}
                    />
                  </div>
                  <span className="text-sm font-bold text-[#0d1b3e] tabular-nums">
                    {entry.overallFit}%
                  </span>
                </div>

                <p className="text-xs text-gray-500 mb-3">
                  Overall: {entry.overallScore} | Risk: {entry.risk}
                </p>

                {/* Strengths */}
                <div className="mb-3">
                  <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Strengths</p>
                  <ul className="space-y-1">
                    {entry.strengths.map((s, i) => (
                      <li key={i} className="flex items-start gap-1.5 text-xs text-gray-700">
                        <svg className="h-3.5 w-3.5 shrink-0 mt-0.5 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                        </svg>
                        {s}
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Weaknesses */}
                <div className="mb-3">
                  <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Weaknesses</p>
                  <ul className="space-y-1">
                    {entry.weaknesses.map((w, i) => (
                      <li key={i} className="flex items-start gap-1.5 text-xs text-gray-700">
                        <svg className="h-3.5 w-3.5 shrink-0 mt-0.5 text-amber-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
                        </svg>
                        {w}
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Risk Flags */}
                {entry.riskFlags.length > 0 && (
                  <div className="mb-3">
                    <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Risk Flags</p>
                    <ul className="space-y-1">
                      {entry.riskFlags.map((r, i) => (
                        <li key={i} className="flex items-start gap-1.5 text-xs text-red-700">
                          <svg className="h-3.5 w-3.5 shrink-0 mt-0.5 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m0 3.75h.008v.008H12v-.008zM3 3v1.5M21 21v-1.5" />
                          </svg>
                          {r}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Compliance Highlights */}
                <div className="mb-3 rounded-lg bg-[#003399]/5 border border-[#003399]/10 px-3 py-2">
                  <p className="text-xs text-[#003399] leading-relaxed">
                    {entry.complianceHighlights}
                  </p>
                </div>

                {/* Recommendation */}
                <p className="text-xs text-gray-600 italic mb-4 flex-1">
                  {entry.recommendation}
                </p>

                {/* Actions */}
                <div className="mt-auto">
                  <Link
                    href={`/${locale}/systems/${entry.systemSlug}`}
                    className="block w-full text-center rounded-lg bg-[#003399] px-4 py-2 text-sm font-semibold text-white hover:bg-[#002266] transition-colors"
                  >
                    View Full Profile
                  </Link>
                </div>
              </div>
            );
          })}
        </div>

        {/* Compare button */}
        <div className="flex justify-center mb-8">
          <Link
            href={`/${locale}/compare?slugs=${compareSlugs}`}
            className="inline-flex items-center gap-2 rounded-lg border-2 border-[#003399] bg-white px-6 py-3 text-sm font-semibold text-[#003399] hover:bg-[#003399] hover:text-white transition-colors"
          >
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 3.75v4.5m0-4.5h4.5m-4.5 0L9 9M3.75 20.25v-4.5m0 4.5h4.5m-4.5 0L9 15M20.25 3.75h-4.5m4.5 0v4.5m0-4.5L15 9m5.25 11.25h-4.5m4.5 0v-4.5m0 4.5L15 15" />
            </svg>
            Compare These 3 Systems
          </Link>
        </div>

        {/* Disclaimer */}
        <div className="rounded-lg bg-amber-50 border border-amber-200 p-4 text-xs text-amber-800">
          <p className="font-semibold mb-1">Disclaimer</p>
          <p>
            AI-generated recommendations based on our regulatory database.
            Verify with vendor directly before procurement decisions.
            Scores and compliance data are based on publicly available information
            and may not reflect the latest vendor updates.
          </p>
        </div>
      </div>
    );
  }

  // ─── Form View ──────────────────────────────────────────

  return (
    <div>
      <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
        <h3 className="text-sm font-semibold text-[#003399] uppercase tracking-wider mb-6 flex items-center gap-2">
          <span className="flex h-6 w-6 items-center justify-center rounded-full bg-[#003399] text-xs font-bold text-white">
            1
          </span>
          Describe Your Requirements
        </h3>

        <div className="space-y-5">
          {/* Use Case */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              What do you need the AI for?
            </label>
            <textarea
              value={useCase}
              onChange={(e) => setUseCase(e.target.value)}
              placeholder="e.g. Automate contract review for our legal team, flagging non-standard clauses and GDPR issues across 500+ contracts per month..."
              rows={3}
              className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm text-gray-900 placeholder-gray-400 focus:border-[#003399] focus:ring-1 focus:ring-[#003399] transition-colors resize-none"
            />
          </div>

          {/* Industry + Org Size */}
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Industry
              </label>
              <select
                value={industry}
                onChange={(e) => setIndustry(e.target.value)}
                className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm text-gray-900 focus:border-[#003399] focus:ring-1 focus:ring-[#003399] transition-colors"
              >
                <option value="">Select industry...</option>
                {INDUSTRIES.map((i) => (
                  <option key={i.value} value={i.value}>
                    {i.label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Organisation Size
              </label>
              <select
                value={orgSize}
                onChange={(e) => setOrgSize(e.target.value)}
                className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm text-gray-900 focus:border-[#003399] focus:ring-1 focus:ring-[#003399] transition-colors"
              >
                <option value="">Select size...</option>
                {ORG_SIZES.map((o) => (
                  <option key={o.value} value={o.value}>
                    {o.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Requirements Tags */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Key Requirements
              <span className="ml-1 text-gray-400 font-normal">(type and press Enter to add)</span>
            </label>

            {/* Tags display */}
            <div className="flex flex-wrap gap-2 mb-2">
              {requirements.map((tag) => (
                <button
                  key={tag}
                  onClick={() => removeRequirement(tag)}
                  className="inline-flex items-center gap-1 rounded-full bg-[#003399]/10 px-3 py-1 text-xs font-medium text-[#003399] hover:bg-[#003399]/20 transition-colors group"
                >
                  {tag}
                  <svg className="h-3 w-3 text-[#003399]/50 group-hover:text-[#003399]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              ))}
            </div>

            {/* Tag input */}
            <input
              type="text"
              value={reqInput}
              onChange={(e) => setReqInput(e.target.value)}
              onKeyDown={handleReqKeyDown}
              placeholder="Type a requirement and press Enter..."
              className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm text-gray-900 placeholder-gray-400 focus:border-[#003399] focus:ring-1 focus:ring-[#003399] transition-colors"
            />

            {/* Suggestions */}
            <div className="mt-2 flex flex-wrap gap-1.5">
              <span className="text-xs text-gray-400 mr-1 mt-0.5">Suggestions:</span>
              {SUGGESTED_REQUIREMENTS.filter((s) => !requirements.includes(s)).map((sug) => (
                <button
                  key={sug}
                  onClick={() => addRequirement(sug)}
                  className="rounded-full border border-dashed border-gray-300 px-2.5 py-0.5 text-xs text-gray-500 hover:border-[#003399] hover:text-[#003399] hover:bg-[#003399]/5 transition-colors"
                >
                  + {sug}
                </button>
              ))}
            </div>
          </div>

          {/* Budget */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Budget Range
              <span className="ml-1 text-gray-400 font-normal">(optional)</span>
            </label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm font-medium text-gray-500">EUR</span>
              <input
                type="text"
                value={budget}
                onChange={(e) => setBudget(e.target.value)}
                placeholder="e.g. 10,000-50,000/year"
                className="w-full rounded-lg border border-gray-300 pl-12 pr-3 py-2.5 text-sm text-gray-900 placeholder-gray-400 focus:border-[#003399] focus:ring-1 focus:ring-[#003399] transition-colors"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Error */}
      {error && (
        <div className="mt-4 rounded-lg bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}

      {/* Generate Button */}
      <div className="mt-6 flex justify-center">
        <button
          onClick={handleGenerate}
          disabled={loading}
          className="inline-flex items-center gap-2 rounded-lg bg-[#003399] px-8 py-3 text-base font-semibold text-white shadow-md hover:bg-[#002266] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {loading ? (
            <>
              <svg className="h-5 w-5 animate-spin" viewBox="0 0 24 24" fill="none">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
              </svg>
              Finding Best Matches...
            </>
          ) : (
            <>
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 18.75h-9m9 0a3 3 0 013 3h-15a3 3 0 013-3m9 0v-3.375c0-.621-.503-1.125-1.125-1.125h-.871M7.5 18.75v-3.375c0-.621.504-1.125 1.125-1.125h.872m5.007 0H9.497m5.007 0a7.454 7.454 0 01-.982-3.172M9.497 14.25a7.454 7.454 0 00.981-3.172M5.25 4.236c-.982.143-1.954.317-2.916.52A6.003 6.003 0 007.73 9.728M5.25 4.236V4.5c0 2.108.966 3.99 2.48 5.228M5.25 4.236V2.721C7.456 2.41 9.71 2.25 12 2.25c2.291 0 4.545.16 6.75.47v1.516M18.75 4.236c.982.143 1.954.317 2.916.52A6.003 6.003 0 0016.27 9.728M18.75 4.236V4.5c0 2.108-.966 3.99-2.48 5.228m0 0a6.003 6.003 0 01-3.77 1.522m0 0a6.003 6.003 0 01-3.77-1.522" />
              </svg>
              Get Podium Recommendations
            </>
          )}
        </button>
      </div>

      {/* Loading indicator */}
      {loading && (
        <div className="mt-6 rounded-xl border border-[#003399]/20 bg-[#003399]/5 p-6 text-center">
          <div className="inline-flex items-center gap-3 text-[#003399]">
            <svg className="h-6 w-6 animate-spin" viewBox="0 0 24 24" fill="none">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
            </svg>
            <span className="font-medium">Analysing AI systems against your requirements...</span>
          </div>
          <p className="mt-2 text-sm text-[#003399]/70">
            This typically takes 15-30 seconds
          </p>
        </div>
      )}
    </div>
  );
}
