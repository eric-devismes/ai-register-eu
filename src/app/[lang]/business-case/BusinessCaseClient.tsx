"use client";

/**
 * BusinessCaseClient — Interactive business case generator.
 *
 * Steps:
 *   1. Select an AI system (searchable dropdown)
 *   2. Fill in context (use case, industry, org size, team size, current process)
 *   3. Generate (loading state → display business case)
 *   4. Download as PDF (window.print) or copy to clipboard
 */

import { useState, useMemo } from "react";
import { useLocale, useT } from "@/lib/locale-context";
import type { SubscriptionTier } from "@/lib/tier-access";

// ─── Types ────────────────────────────────────────────────

interface SystemOption {
  slug: string;
  vendor: string;
  name: string;
}

interface BusinessCaseSection {
  id: string;
  title: string;
  content: string;
}

interface Props {
  tier: SubscriptionTier;
  systems: SystemOption[];
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

// ─── Section Icons ────────────────────────────────────────

const SECTION_ICONS: Record<string, string> = {
  "executive-summary": "M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z",
  "current-state": "M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z",
  "proposed-solution": "M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z",
  "eu-compliance": "M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z",
  "cost-analysis": "M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z",
  "risk-assessment": "M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z",
  "implementation-timeline": "M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z",
  "roi-projection": "M13 7h8m0 0v8m0-8l-8 8-4-4-6 6",
  "recommendation": "M5 13l4 4L19 7",
};

// ─── Component ────────────────────────────────────────────

export function BusinessCaseClient({ tier, systems }: Props) {
  const locale = useLocale();
  const t = useT();
  const hasAccess = tier === "pro" || tier === "enterprise";

  // Form state
  const [systemSlug, setSystemSlug] = useState("");
  const [systemSearch, setSystemSearch] = useState("");
  const [showDropdown, setShowDropdown] = useState(false);
  const [useCase, setUseCase] = useState("");
  const [industry, setIndustry] = useState("");
  const [orgSize, setOrgSize] = useState("");
  const [teamSize, setTeamSize] = useState<number>(10);
  const [currentProcess, setCurrentProcess] = useState("");

  // Generation state
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [sections, setSections] = useState<BusinessCaseSection[]>([]);
  const [copied, setCopied] = useState(false);

  // Filtered systems for dropdown
  const filteredSystems = useMemo(() => {
    if (!systemSearch.trim()) return systems;
    const q = systemSearch.toLowerCase();
    return systems.filter(
      (s) =>
        s.name.toLowerCase().includes(q) ||
        s.vendor.toLowerCase().includes(q),
    );
  }, [systems, systemSearch]);

  // Selected system label
  const selectedSystem = systems.find((s) => s.slug === systemSlug);

  // ─── Generate Business Case ─────────────────────────────

  async function handleGenerate() {
    if (!systemSlug || !useCase || !industry || !orgSize || !currentProcess) {
      setError("Please fill in all fields.");
      return;
    }

    setLoading(true);
    setError("");
    setSections([]);

    try {
      const res = await fetch("/api/business-case", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          systemSlug,
          useCase,
          industry,
          orgSize,
          teamSize,
          currentProcess,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Failed to generate business case.");
        return;
      }

      setSections(data.sections);
    } catch {
      setError("Network error. Please check your connection and try again.");
    } finally {
      setLoading(false);
    }
  }

  // ─── Copy to Clipboard ─────────────────────────────────

  async function handleCopy() {
    const text = sections
      .map((s) => `# ${s.title}\n\n${s.content}`)
      .join("\n\n---\n\n");

    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Fallback
      const textarea = document.createElement("textarea");
      textarea.value = text;
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand("copy");
      document.body.removeChild(textarea);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  }

  // ─── Print / PDF ────────────────────────────────────────

  function handlePrint() {
    window.print();
  }

  // ─── Free Tier Gate ─────────────────────────────────────

  if (!hasAccess) {
    return (
      <div className="relative">
        {/* Blurred preview */}
        <div className="pointer-events-none select-none blur-sm opacity-50">
          <div className="grid gap-6 md:grid-cols-2">
            <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
              <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-4">
                1. Select AI System
              </h3>
              <div className="h-10 bg-gray-100 rounded-lg" />
            </div>
            <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
              <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-4">
                2. Describe Your Use Case
              </h3>
              <div className="space-y-3">
                <div className="h-20 bg-gray-100 rounded-lg" />
                <div className="h-10 bg-gray-100 rounded-lg" />
                <div className="h-10 bg-gray-100 rounded-lg" />
              </div>
            </div>
          </div>
          <div className="mt-6 rounded-xl border border-gray-200 bg-white p-8 shadow-sm">
            <h3 className="font-serif text-xl font-bold text-gray-800 mb-4">
              Executive Summary
            </h3>
            <div className="space-y-2">
              <div className="h-4 bg-gray-100 rounded w-full" />
              <div className="h-4 bg-gray-100 rounded w-5/6" />
              <div className="h-4 bg-gray-100 rounded w-4/6" />
            </div>
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
              Unlock the Business Case Generator
            </h2>
            <p className="mt-3 text-gray-600 text-sm leading-relaxed">
              Generate board-ready business cases with EU compliance assessment,
              cost analysis, and ROI projections. Available on Pro and Enterprise plans.
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

  // ─── Results View ───────────────────────────────────────

  if (sections.length > 0) {
    return (
      <div>
        {/* Disclaimer banner */}
        <div className="mb-6 rounded-lg border border-amber-300 bg-amber-50 px-4 py-3.5 print:mb-4">
          <div className="flex gap-3">
            <span className="mt-0.5 shrink-0 text-lg leading-none" aria-hidden="true">&#x26A0;&#xFE0F;</span>
            <div className="text-sm text-amber-900">
              <p className="font-semibold mb-1">Disclaimer</p>
              <p className="leading-relaxed">
                This business case is an AI-generated estimate for educational and indicative purposes only.
                Figures are based on publicly available information and industry benchmarks.
                AI Compass EU accepts no liability for the accuracy of these estimates.
                This should not be used as the sole basis for procurement decisions.
                We recommend validating all figures with vendor quotes and internal financial analysis.
              </p>
            </div>
          </div>
        </div>

        {/* Action bar */}
        <div className="mb-6 flex flex-wrap items-center justify-between gap-3 print:hidden">
          <button
            onClick={() => setSections([])}
            className="inline-flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
          >
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
            </svg>
            Generate Another
          </button>

          <div className="flex items-center gap-2">
            <button
              onClick={handleCopy}
              className="inline-flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
            >
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.666 3.888A2.25 2.25 0 0013.5 2.25h-3c-1.03 0-1.9.693-2.166 1.638m7.332 0c.055.194.084.4.084.612v0a.75.75 0 01-.75.75H9.75a.75.75 0 01-.75-.75v0c0-.212.03-.418.084-.612m7.332 0c.646.049 1.288.11 1.927.184 1.1.128 1.907 1.077 1.907 2.185V19.5a2.25 2.25 0 01-2.25 2.25H6.75A2.25 2.25 0 014.5 19.5V6.257c0-1.108.806-2.057 1.907-2.185a48.208 48.208 0 011.927-.184" />
              </svg>
              {copied ? "Copied!" : "Copy to Clipboard"}
            </button>
            <button
              onClick={handlePrint}
              className="inline-flex items-center gap-2 rounded-lg bg-[#003399] px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-[#002266] transition-colors"
            >
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M6.72 13.829c-.24.03-.48.062-.72.096m.72-.096a42.415 42.415 0 0110.56 0m-10.56 0L6.34 18m10.94-4.171c.24.03.48.062.72.096m-.72-.096L17.66 18m0 0l.229 2.523a1.125 1.125 0 01-1.12 1.227H7.231c-.662 0-1.18-.568-1.12-1.227L6.34 18m11.318 0h1.091A2.25 2.25 0 0021 15.75V9.456c0-1.081-.768-2.015-1.837-2.175a48.055 48.055 0 00-1.913-.247M6.34 18H5.25A2.25 2.25 0 013 15.75V9.456c0-1.081.768-2.015 1.837-2.175a48.041 48.041 0 011.913-.247m10.5 0a48.536 48.536 0 00-10.5 0m10.5 0V3.375c0-.621-.504-1.125-1.125-1.125h-8.25c-.621 0-1.125.504-1.125 1.125v3.659M18 10.5h.008v.008H18V10.5zm-3 0h.008v.008H15V10.5z" />
              </svg>
              Download as PDF
            </button>
          </div>
        </div>

        {/* Business Case Header (visible in print) */}
        <div className="mb-8 rounded-xl border border-[#003399]/20 bg-gradient-to-r from-[#003399]/5 to-transparent p-6 print:border-0 print:p-0 print:mb-4">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-xs font-medium uppercase tracking-wider text-[#003399] mb-1">
                AI Compass EU — Business Case
              </p>
              <h2 className="text-2xl font-bold text-[#0d1b3e] font-serif">
                {selectedSystem ? `${selectedSystem.vendor} ${selectedSystem.name}` : "AI System"}
              </h2>
              <p className="mt-1 text-sm text-gray-500">
                Generated {new Date().toLocaleDateString(locale, { day: "numeric", month: "long", year: "numeric" })}
              </p>
            </div>
            <div className="hidden print:block text-right text-xs text-gray-400">
              <p>AI Compass EU</p>
              <p>aicompass.eu</p>
            </div>
          </div>
        </div>

        {/* Sections */}
        <div className="space-y-6">
          {sections.map((section) => (
            <section
              key={section.id}
              className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm print:border-0 print:shadow-none print:p-4 print:break-inside-avoid"
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-[#003399]/10 print:hidden">
                  <svg className="h-4 w-4 text-[#003399]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d={SECTION_ICONS[section.id] || SECTION_ICONS["executive-summary"]} />
                  </svg>
                </div>
                <h3 className="text-lg font-bold text-[#0d1b3e] font-serif">
                  {section.title}
                </h3>
              </div>
              <div
                className="prose prose-sm max-w-none text-gray-700 prose-headings:text-[#0d1b3e] prose-headings:font-serif prose-strong:text-[#0d1b3e] prose-a:text-[#003399]"
                dangerouslySetInnerHTML={{ __html: markdownToHtml(section.content) }}
              />
            </section>
          ))}
        </div>

        {/* Bottom disclaimer (compact repeat for print) */}
        <div className="mt-8 rounded-lg bg-amber-50 border border-amber-200 p-4 text-xs text-amber-800 print:mt-4">
          <p className="font-semibold mb-1">Disclaimer</p>
          <p>
            This business case is an AI-generated estimate for educational and indicative purposes only.
            Figures are based on publicly available information and industry benchmarks.
            AI Compass EU accepts no liability for the accuracy of these estimates.
            This should not be used as the sole basis for procurement decisions.
            We recommend validating all figures with vendor quotes and internal financial analysis.
          </p>
        </div>
      </div>
    );
  }

  // ─── Form View ──────────────────────────────────────────

  return (
    <div>
      {/* Short disclaimer */}
      <div className="mb-5 rounded-lg border border-amber-200 bg-amber-50/70 px-4 py-2.5 text-xs text-amber-800 flex items-center gap-2">
        <span aria-hidden="true">&#x26A0;&#xFE0F;</span>
        <span>Estimates are indicative and AI-generated. Not financial advice.</span>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Left: System Selection */}
        <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
          <h3 className="text-sm font-semibold text-[#003399] uppercase tracking-wider mb-4 flex items-center gap-2">
            <span className="flex h-6 w-6 items-center justify-center rounded-full bg-[#003399] text-xs font-bold text-white">
              1
            </span>
            Select AI System
          </h3>

          {/* Searchable system dropdown */}
          <div className="relative">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              AI System
            </label>
            <div className="relative">
              <input
                type="text"
                value={selectedSystem ? `${selectedSystem.vendor} — ${selectedSystem.name}` : systemSearch}
                onChange={(e) => {
                  setSystemSearch(e.target.value);
                  setSystemSlug("");
                  setShowDropdown(true);
                }}
                onFocus={() => {
                  if (!systemSlug) setShowDropdown(true);
                }}
                placeholder="Search by vendor or system name..."
                className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm text-gray-900 placeholder-gray-400 focus:border-[#003399] focus:ring-1 focus:ring-[#003399] transition-colors"
              />
              {systemSlug && (
                <button
                  onClick={() => {
                    setSystemSlug("");
                    setSystemSearch("");
                    setShowDropdown(true);
                  }}
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              )}
            </div>

            {/* Dropdown */}
            {showDropdown && !systemSlug && (
              <div className="absolute z-20 mt-1 max-h-60 w-full overflow-auto rounded-lg border border-gray-200 bg-white shadow-lg">
                {filteredSystems.length === 0 ? (
                  <div className="px-3 py-4 text-sm text-gray-500 text-center">
                    No systems found
                  </div>
                ) : (
                  filteredSystems.map((s) => (
                    <button
                      key={s.slug}
                      onClick={() => {
                        setSystemSlug(s.slug);
                        setSystemSearch("");
                        setShowDropdown(false);
                      }}
                      className="w-full px-3 py-2.5 text-left text-sm hover:bg-[#003399]/5 transition-colors border-b border-gray-50 last:border-0"
                    >
                      <span className="font-medium text-gray-900">{s.vendor}</span>
                      <span className="text-gray-400 mx-1.5">—</span>
                      <span className="text-gray-700">{s.name}</span>
                    </button>
                  ))
                )}
              </div>
            )}
          </div>

          {selectedSystem && (
            <div className="mt-3 rounded-lg bg-[#003399]/5 border border-[#003399]/10 px-3 py-2 text-sm text-[#003399]">
              Selected: <span className="font-semibold">{selectedSystem.vendor} {selectedSystem.name}</span>
            </div>
          )}
        </div>

        {/* Right: Context Form */}
        <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
          <h3 className="text-sm font-semibold text-[#003399] uppercase tracking-wider mb-4 flex items-center gap-2">
            <span className="flex h-6 w-6 items-center justify-center rounded-full bg-[#003399] text-xs font-bold text-white">
              2
            </span>
            Describe Your Context
          </h3>

          <div className="space-y-4">
            {/* Use Case */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Intended Use Case
              </label>
              <textarea
                value={useCase}
                onChange={(e) => setUseCase(e.target.value)}
                placeholder="e.g. Automate contract review for our legal team, flagging non-standard clauses and GDPR issues..."
                rows={3}
                className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm text-gray-900 placeholder-gray-400 focus:border-[#003399] focus:ring-1 focus:ring-[#003399] transition-colors resize-none"
              />
            </div>

            {/* Industry + Org Size (side by side) */}
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

            {/* Team Size */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Estimated Team Size
                <span className="ml-1 text-gray-400 font-normal">(users who will use the tool)</span>
              </label>
              <input
                type="number"
                min={1}
                max={10000}
                value={teamSize}
                onChange={(e) => setTeamSize(Math.max(1, parseInt(e.target.value) || 1))}
                className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm text-gray-900 focus:border-[#003399] focus:ring-1 focus:ring-[#003399] transition-colors"
              />
            </div>

            {/* Current Process */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Current Process
              </label>
              <textarea
                value={currentProcess}
                onChange={(e) => setCurrentProcess(e.target.value)}
                placeholder="e.g. Manual review by 3 junior lawyers, takes 2-3 days per contract, high error rate..."
                rows={2}
                className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm text-gray-900 placeholder-gray-400 focus:border-[#003399] focus:ring-1 focus:ring-[#003399] transition-colors resize-none"
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
          disabled={loading || !systemSlug}
          className="inline-flex items-center gap-2 rounded-lg bg-[#003399] px-8 py-3 text-base font-semibold text-white shadow-md hover:bg-[#002266] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {loading ? (
            <>
              <svg className="h-5 w-5 animate-spin" viewBox="0 0 24 24" fill="none">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
              </svg>
              Generating Business Case...
            </>
          ) : (
            <>
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.455 2.456L21.75 6l-1.036.259a3.375 3.375 0 00-2.455 2.456z" />
              </svg>
              Generate Business Case
            </>
          )}
        </button>
      </div>

      {/* Loading indicator with progress */}
      {loading && (
        <div className="mt-6 rounded-xl border border-[#003399]/20 bg-[#003399]/5 p-6 text-center">
          <div className="inline-flex items-center gap-3 text-[#003399]">
            <svg className="h-6 w-6 animate-spin" viewBox="0 0 24 24" fill="none">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
            </svg>
            <span className="font-medium">Analysing compliance data and generating your business case...</span>
          </div>
          <p className="mt-2 text-sm text-[#003399]/70">
            This typically takes 15-30 seconds
          </p>
        </div>
      )}
    </div>
  );
}

// ─── Simple Markdown → HTML Converter ─────────────────────

function markdownToHtml(md: string): string {
  return md
    // Headers
    .replace(/^#### (.+)$/gm, '<h4 class="text-sm font-semibold mt-4 mb-1">$1</h4>')
    .replace(/^### (.+)$/gm, '<h3 class="text-base font-semibold mt-4 mb-2">$1</h3>')
    .replace(/^## (.+)$/gm, '<h2 class="text-lg font-semibold mt-4 mb-2">$1</h2>')
    // Bold
    .replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>")
    // Italic
    .replace(/\*(.+?)\*/g, "<em>$1</em>")
    // Unordered lists
    .replace(/^- (.+)$/gm, '<li class="ml-4 list-disc">$1</li>')
    // Numbered lists
    .replace(/^\d+\. (.+)$/gm, '<li class="ml-4 list-decimal">$1</li>')
    // Line breaks → paragraphs
    .replace(/\n\n/g, "</p><p>")
    // Wrap in paragraph
    .replace(/^(.+)/, "<p>$1")
    .replace(/(.+)$/, "$1</p>");
}
