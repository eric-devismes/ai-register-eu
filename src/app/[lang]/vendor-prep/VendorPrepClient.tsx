"use client";

/**
 * VendorPrepClient — Interactive vendor discussion prep generator.
 *
 * Steps:
 *   1. Select an AI system (searchable dropdown)
 *   2. Choose meeting type, attendee roles, concerns, optional budget
 *   3. Generate (loading state -> display prep materials)
 *   4. Copy All / Print buttons
 */

import { useState, useMemo } from "react";
import { useLocale } from "@/lib/locale-context";
import type { SubscriptionTier } from "@/lib/tier-access";

// ─── Types ────────────────────────────────────────────────

interface SystemOption {
  slug: string;
  vendor: string;
  name: string;
}

interface VendorPrepSection {
  id: string;
  title: string;
  content: string;
}

interface Props {
  tier: SubscriptionTier;
  systems: SystemOption[];
}

// ─── Constants ────────────────────────────────────────────

const MEETING_TYPES = [
  { value: "initial-demo", label: "Initial Demo / Discovery" },
  { value: "technical-deep-dive", label: "Technical Deep-Dive" },
  { value: "commercial-negotiation", label: "Commercial Negotiation" },
  { value: "compliance-review", label: "Compliance Review" },
  { value: "contract-review", label: "Contract Review" },
];

const ATTENDEE_ROLES = [
  { value: "cto", label: "CTO" },
  { value: "ciso", label: "CISO" },
  { value: "dpo", label: "DPO" },
  { value: "procurement", label: "Procurement" },
  { value: "legal", label: "Legal" },
  { value: "executive", label: "Executive" },
];

const ROLE_COLORS: Record<string, { bg: string; text: string; border: string }> = {
  cto: { bg: "bg-blue-50", text: "text-blue-800", border: "border-blue-200" },
  ciso: { bg: "bg-purple-50", text: "text-purple-800", border: "border-purple-200" },
  dpo: { bg: "bg-green-50", text: "text-green-800", border: "border-green-200" },
  procurement: { bg: "bg-amber-50", text: "text-amber-800", border: "border-amber-200" },
  legal: { bg: "bg-rose-50", text: "text-rose-800", border: "border-rose-200" },
  executive: { bg: "bg-indigo-50", text: "text-indigo-800", border: "border-indigo-200" },
};

const SUGGESTED_CONCERNS = [
  "Data sovereignty",
  "Vendor lock-in",
  "Pricing transparency",
  "EU compliance",
  "Contract flexibility",
  "Integration complexity",
  "SLA guarantees",
  "Exit strategy",
  "Sub-processors",
  "Model transparency",
];

// ─── Section Config ──────────────────────────────────────

const SECTION_CONFIG: Record<string, { emoji: string; color: string; bgColor: string; borderColor: string }> = {
  "talking-points": { emoji: "\ud83d\udccb", color: "text-[#003399]", bgColor: "bg-[#003399]/10", borderColor: "border-[#003399]/20" },
  "questions": { emoji: "\u2753", color: "text-[#003399]", bgColor: "bg-[#003399]/10", borderColor: "border-[#003399]/20" },
  "leverage": { emoji: "\ud83d\udcaa", color: "text-emerald-700", bgColor: "bg-emerald-50", borderColor: "border-emerald-200" },
  "red-flags": { emoji: "\u26a0\ufe0f", color: "text-red-700", bgColor: "bg-red-50", borderColor: "border-red-200" },
  "compliance-checklist": { emoji: "\u2705", color: "text-[#003399]", bgColor: "bg-[#003399]/10", borderColor: "border-[#003399]/20" },
  "follow-up": { emoji: "\ud83d\udcdd", color: "text-[#003399]", bgColor: "bg-[#003399]/10", borderColor: "border-[#003399]/20" },
};

// ─── Component ────────────────────────────────────────────

export function VendorPrepClient({ tier, systems }: Props) {
  const locale = useLocale();
  const hasAccess = tier === "pro" || tier === "enterprise";

  // Form state
  const [systemSlug, setSystemSlug] = useState("");
  const [systemSearch, setSystemSearch] = useState("");
  const [showDropdown, setShowDropdown] = useState(false);
  const [meetingType, setMeetingType] = useState("");
  const [attendeeRoles, setAttendeeRoles] = useState<string[]>([]);
  const [concerns, setConcerns] = useState<string[]>([]);
  const [concernInput, setConcernInput] = useState("");
  const [budget, setBudget] = useState("");

  // Generation state
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [sections, setSections] = useState<VendorPrepSection[]>([]);
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

  // ─── Role Toggle ───────────────────────────────────────

  function toggleRole(role: string) {
    setAttendeeRoles((prev) =>
      prev.includes(role) ? prev.filter((r) => r !== role) : [...prev, role],
    );
  }

  // ─── Concern Management ────────────────────────────────

  function addConcern(concern: string) {
    const trimmed = concern.trim();
    if (trimmed && !concerns.includes(trimmed)) {
      setConcerns((prev) => [...prev, trimmed]);
    }
    setConcernInput("");
  }

  function removeConcern(concern: string) {
    setConcerns((prev) => prev.filter((c) => c !== concern));
  }

  function handleConcernKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault();
      addConcern(concernInput);
    }
    if (e.key === "Backspace" && !concernInput && concerns.length > 0) {
      setConcerns((prev) => prev.slice(0, -1));
    }
  }

  // ─── Generate ──────────────────────────────────────────

  async function handleGenerate() {
    if (!systemSlug || !meetingType || attendeeRoles.length === 0 || concerns.length === 0) {
      setError("Please fill in all required fields: system, meeting type, at least one attendee role, and at least one concern.");
      return;
    }

    setLoading(true);
    setError("");
    setSections([]);

    try {
      const res = await fetch("/api/vendor-prep", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          systemSlug,
          meetingType,
          attendeeRoles,
          concerns,
          budget: budget || undefined,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Failed to generate vendor prep materials.");
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
                2. Meeting Details
              </h3>
              <div className="space-y-3">
                <div className="h-10 bg-gray-100 rounded-lg" />
                <div className="h-10 bg-gray-100 rounded-lg" />
                <div className="h-20 bg-gray-100 rounded-lg" />
              </div>
            </div>
          </div>
          <div className="mt-6 rounded-xl border border-gray-200 bg-white p-8 shadow-sm">
            <h3 className="font-serif text-xl font-bold text-gray-800 mb-4">
              Talking Points by Role
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
              Unlock Vendor Discussion Prep
            </h2>
            <p className="mt-3 text-gray-600 text-sm leading-relaxed">
              Generate structured talking points, negotiation leverage, and red-flag
              questions for your procurement meetings. Available on Pro and Enterprise plans.
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
        {/* Action bar */}
        <div className="mb-6 flex flex-wrap items-center justify-between gap-3 print:hidden">
          <button
            onClick={() => setSections([])}
            className="inline-flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
          >
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
            </svg>
            Prepare Another
          </button>

          <div className="flex items-center gap-2">
            <button
              onClick={handleCopy}
              className="inline-flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
            >
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.666 3.888A2.25 2.25 0 0013.5 2.25h-3c-1.03 0-1.9.693-2.166 1.638m7.332 0c.055.194.084.4.084.612v0a.75.75 0 01-.75.75H9.75a.75.75 0 01-.75-.75v0c0-.212.03-.418.084-.612m7.332 0c.646.049 1.288.11 1.927.184 1.1.128 1.907 1.077 1.907 2.185V19.5a2.25 2.25 0 01-2.25 2.25H6.75A2.25 2.25 0 014.5 19.5V6.257c0-1.108.806-2.057 1.907-2.185a48.208 48.208 0 011.927-.184" />
              </svg>
              {copied ? "Copied!" : "Copy All"}
            </button>
            <button
              onClick={handlePrint}
              className="inline-flex items-center gap-2 rounded-lg bg-[#003399] px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-[#002266] transition-colors"
            >
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M6.72 13.829c-.24.03-.48.062-.72.096m.72-.096a42.415 42.415 0 0110.56 0m-10.56 0L6.34 18m10.94-4.171c.24.03.48.062.72.096m-.72-.096L17.66 18m0 0l.229 2.523a1.125 1.125 0 01-1.12 1.227H7.231c-.662 0-1.18-.568-1.12-1.227L6.34 18m11.318 0h1.091A2.25 2.25 0 0021 15.75V9.456c0-1.081-.768-2.015-1.837-2.175a48.055 48.055 0 00-1.913-.247M6.34 18H5.25A2.25 2.25 0 013 15.75V9.456c0-1.081.768-2.015 1.837-2.175a48.041 48.041 0 011.913-.247m10.5 0a48.536 48.536 0 00-10.5 0m10.5 0V3.375c0-.621-.504-1.125-1.125-1.125h-8.25c-.621 0-1.125.504-1.125 1.125v3.659M18 10.5h.008v.008H18V10.5zm-3 0h.008v.008H15V10.5z" />
              </svg>
              Print
            </button>
          </div>
        </div>

        {/* Header (visible in print) */}
        <div className="mb-8 rounded-xl border border-[#003399]/20 bg-gradient-to-r from-[#003399]/5 to-transparent p-6 print:border-0 print:p-0 print:mb-4">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-xs font-medium uppercase tracking-wider text-[#003399] mb-1">
                AI Compass EU — Vendor Discussion Prep
              </p>
              <h2 className="text-2xl font-bold text-[#0d1b3e] font-serif">
                {selectedSystem ? `${selectedSystem.vendor} ${selectedSystem.name}` : "AI System"}
              </h2>
              <p className="mt-1 text-sm text-gray-500">
                {MEETING_TYPES.find((m) => m.value === meetingType)?.label || meetingType}
                {" — "}
                Generated {new Date().toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" })}
              </p>
              <div className="mt-2 flex flex-wrap gap-1.5">
                {attendeeRoles.map((role) => {
                  const colors = ROLE_COLORS[role] || { bg: "bg-gray-50", text: "text-gray-800", border: "border-gray-200" };
                  return (
                    <span
                      key={role}
                      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium border ${colors.bg} ${colors.text} ${colors.border}`}
                    >
                      {ATTENDEE_ROLES.find((r) => r.value === role)?.label || role}
                    </span>
                  );
                })}
              </div>
            </div>
            <div className="hidden print:block text-right text-xs text-gray-400">
              <p>AI Compass EU</p>
              <p>aicompass.eu</p>
            </div>
          </div>
        </div>

        {/* Sections */}
        <div className="space-y-6">
          {sections.map((section) => {
            const config = SECTION_CONFIG[section.id] || SECTION_CONFIG["talking-points"];
            return (
              <section
                key={section.id}
                className={`rounded-xl border bg-white p-6 shadow-sm print:border-0 print:shadow-none print:p-4 print:break-inside-avoid ${config.borderColor}`}
              >
                <div className="flex items-center gap-3 mb-4">
                  <div className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg print:hidden ${config.bgColor}`}>
                    <span className="text-base">{config.emoji}</span>
                  </div>
                  <h3 className={`text-lg font-bold font-serif ${config.color}`}>
                    {section.title}
                  </h3>
                </div>
                <div
                  className="prose prose-sm max-w-none text-gray-700 prose-headings:text-[#0d1b3e] prose-headings:font-serif prose-strong:text-[#0d1b3e] prose-a:text-[#003399]"
                  dangerouslySetInnerHTML={{ __html: markdownToHtml(section.content) }}
                />
              </section>
            );
          })}
        </div>

        {/* Disclaimer */}
        <div className="mt-8 rounded-lg bg-amber-50 border border-amber-200 p-4 text-xs text-amber-800 print:mt-4">
          <p className="font-semibold mb-1">Disclaimer</p>
          <p>
            This vendor prep material is generated by AI based on AI Compass EU assessment data.
            It should be used as a starting point for meeting preparation, not as legal or procurement advice.
            Verify all compliance claims and scores directly with the vendor.
          </p>
        </div>
      </div>
    );
  }

  // ─── Form View ──────────────────────────────────────────

  return (
    <div>
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Left: System Selection + Meeting Type */}
        <div className="space-y-6">
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
                  value={selectedSystem ? `${selectedSystem.vendor} \u2014 ${selectedSystem.name}` : systemSearch}
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
                        <span className="text-gray-400 mx-1.5">\u2014</span>
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

          {/* Meeting Type */}
          <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
            <h3 className="text-sm font-semibold text-[#003399] uppercase tracking-wider mb-4 flex items-center gap-2">
              <span className="flex h-6 w-6 items-center justify-center rounded-full bg-[#003399] text-xs font-bold text-white">
                2
              </span>
              Meeting Type
            </h3>
            <select
              value={meetingType}
              onChange={(e) => setMeetingType(e.target.value)}
              className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm text-gray-900 focus:border-[#003399] focus:ring-1 focus:ring-[#003399] transition-colors"
            >
              <option value="">Select meeting type...</option>
              {MEETING_TYPES.map((m) => (
                <option key={m.value} value={m.value}>
                  {m.label}
                </option>
              ))}
            </select>
          </div>

          {/* Budget (optional) */}
          <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
            <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-4 flex items-center gap-2">
              Optional
              <span className="text-xs font-normal normal-case text-gray-400">Budget Context</span>
            </h3>
            <input
              type="text"
              value={budget}
              onChange={(e) => setBudget(e.target.value)}
              placeholder="e.g. EUR 50k annual budget, 3-year contract preferred..."
              className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm text-gray-900 placeholder-gray-400 focus:border-[#003399] focus:ring-1 focus:ring-[#003399] transition-colors"
            />
          </div>
        </div>

        {/* Right: Attendees + Concerns */}
        <div className="space-y-6">
          {/* Attendee Roles */}
          <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
            <h3 className="text-sm font-semibold text-[#003399] uppercase tracking-wider mb-4 flex items-center gap-2">
              <span className="flex h-6 w-6 items-center justify-center rounded-full bg-[#003399] text-xs font-bold text-white">
                3
              </span>
              Attendee Roles
            </h3>
            <p className="text-xs text-gray-500 mb-3">
              Select who will attend the meeting. Talking points will be tailored to each role.
            </p>
            <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
              {ATTENDEE_ROLES.map((role) => {
                const isSelected = attendeeRoles.includes(role.value);
                const colors = ROLE_COLORS[role.value];
                return (
                  <button
                    key={role.value}
                    onClick={() => toggleRole(role.value)}
                    className={`rounded-lg border px-3 py-2.5 text-sm font-medium transition-all ${
                      isSelected
                        ? `${colors.bg} ${colors.text} ${colors.border} ring-1 ring-current/20`
                        : "border-gray-200 bg-white text-gray-600 hover:border-gray-300 hover:bg-gray-50"
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <div
                        className={`h-4 w-4 rounded border-2 flex items-center justify-center transition-colors ${
                          isSelected ? `${colors.border} ${colors.bg}` : "border-gray-300"
                        }`}
                      >
                        {isSelected && (
                          <svg className="h-3 w-3" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                          </svg>
                        )}
                      </div>
                      {role.label}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Concerns */}
          <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
            <h3 className="text-sm font-semibold text-[#003399] uppercase tracking-wider mb-4 flex items-center gap-2">
              <span className="flex h-6 w-6 items-center justify-center rounded-full bg-[#003399] text-xs font-bold text-white">
                4
              </span>
              Key Concerns
            </h3>

            {/* Active concern tags */}
            <div className="flex flex-wrap gap-1.5 mb-3 min-h-[28px]">
              {concerns.map((concern) => (
                <span
                  key={concern}
                  className="inline-flex items-center gap-1 rounded-full bg-[#003399]/10 border border-[#003399]/20 px-2.5 py-1 text-xs font-medium text-[#003399]"
                >
                  {concern}
                  <button
                    onClick={() => removeConcern(concern)}
                    className="ml-0.5 text-[#003399]/60 hover:text-[#003399] transition-colors"
                  >
                    <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </span>
              ))}
            </div>

            {/* Concern input */}
            <input
              type="text"
              value={concernInput}
              onChange={(e) => setConcernInput(e.target.value)}
              onKeyDown={handleConcernKeyDown}
              placeholder="Type a concern and press Enter..."
              className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm text-gray-900 placeholder-gray-400 focus:border-[#003399] focus:ring-1 focus:ring-[#003399] transition-colors"
            />

            {/* Suggested tags */}
            <div className="mt-3">
              <p className="text-xs text-gray-500 mb-2">Suggested:</p>
              <div className="flex flex-wrap gap-1.5">
                {SUGGESTED_CONCERNS.filter((c) => !concerns.includes(c)).map((concern) => (
                  <button
                    key={concern}
                    onClick={() => addConcern(concern)}
                    className="rounded-full border border-gray-200 bg-gray-50 px-2.5 py-1 text-xs text-gray-600 hover:border-[#003399]/30 hover:bg-[#003399]/5 hover:text-[#003399] transition-colors"
                  >
                    + {concern}
                  </button>
                ))}
              </div>
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
          disabled={loading || !systemSlug || !meetingType || attendeeRoles.length === 0 || concerns.length === 0}
          className="inline-flex items-center gap-2 rounded-lg bg-[#003399] px-8 py-3 text-base font-semibold text-white shadow-md hover:bg-[#002266] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {loading ? (
            <>
              <svg className="h-5 w-5 animate-spin" viewBox="0 0 24 24" fill="none">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
              </svg>
              Preparing Discussion Materials...
            </>
          ) : (
            <>
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.455 2.456L21.75 6l-1.036.259a3.375 3.375 0 00-2.455 2.456z" />
              </svg>
              Generate Vendor Prep
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
            <span className="font-medium">Analysing compliance data and preparing your discussion materials...</span>
          </div>
          <p className="mt-2 text-sm text-[#003399]/70">
            This typically takes 15-30 seconds
          </p>
        </div>
      )}
    </div>
  );
}

// ─── Simple Markdown -> HTML Converter ─────────────────────

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
    // Checkboxes
    .replace(/^- \[x\] (.+)$/gm, '<li class="ml-4 list-none flex items-center gap-2"><input type="checkbox" checked disabled class="rounded border-gray-300 text-[#003399]" />$1</li>')
    .replace(/^- \[ \] (.+)$/gm, '<li class="ml-4 list-none flex items-center gap-2"><input type="checkbox" disabled class="rounded border-gray-300" />$1</li>')
    // Unordered lists
    .replace(/^- (.+)$/gm, '<li class="ml-4 list-disc">$1</li>')
    // Numbered lists
    .replace(/^\d+\. (.+)$/gm, '<li class="ml-4 list-decimal">$1</li>')
    // Line breaks -> paragraphs
    .replace(/\n\n/g, "</p><p>")
    // Wrap in paragraph
    .replace(/^(.+)/, "<p>$1")
    .replace(/(.+)$/, "$1</p>");
}
