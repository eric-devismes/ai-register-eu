"use client";

/**
 * ChecklistClient — interactive compliance checklist generator.
 *
 * Phase 1: Select frameworks (multi-select)
 * Phase 2: View combined checklist with checkbox tracking
 *
 * State persists in-session. Checked items stored in local state.
 */

import { useState, useCallback, useRef } from "react";
import { useLocale, useT } from "@/lib/locale-context";

// ─── Types ──────────────────────────────────────────────

interface FrameworkOption {
  slug: string;
  name: string;
  badgeType: string | null;
}

interface Statement {
  id: string;
  reference: string | null;
  statement: string;
  commentary: string | null;
}

interface Section {
  id: string;
  title: string;
  description: string | null;
  statements: Statement[];
}

interface ChecklistFramework {
  slug: string;
  name: string;
  badgeType: string | null;
  sections: Section[];
}

type Phase = "select" | "loading" | "checklist";

// ─── Preset Combos ──────────────────────────────────────

const PRESETS: { label: string; description: string; slugs: string[] }[] = [
  {
    label: "AI Procurement (General)",
    description: "EU AI Act + GDPR — the baseline for any AI tool procurement in Europe",
    slugs: ["eu-ai-act", "gdpr"],
  },
  {
    label: "Financial Services AI",
    description: "EU AI Act + GDPR + DORA + EBA/EIOPA — complete financial services coverage",
    slugs: ["eu-ai-act", "gdpr", "dora", "eba-eiopa-guidelines"],
  },
  {
    label: "Healthcare AI / MedTech",
    description: "EU AI Act + GDPR + MDR/IVDR — medical device AI compliance",
    slugs: ["eu-ai-act", "gdpr", "mdr-ivdr"],
  },
  {
    label: "Critical Infrastructure",
    description: "EU AI Act + GDPR + NIS2 — for essential and important entities",
    slugs: ["eu-ai-act", "gdpr", "nis2"],
  },
  {
    label: "Full EU Digital Package",
    description: "AI Act + GDPR + DORA + NIS2 + Data Act — maximum regulatory coverage",
    slugs: ["eu-ai-act", "gdpr", "dora", "nis2", "data-act"],
  },
];

// ─── Badge Colors ───────────────────────────────────────

const BADGE_COLORS: Record<string, string> = {
  EU: "bg-blue-100 text-blue-800",
  Sector: "bg-purple-100 text-purple-800",
  National: "bg-green-100 text-green-800",
  International: "bg-amber-100 text-amber-800",
};

// ─── Component ──────────────────────────────────────────

export function ChecklistClient({
  tier,
  frameworkOptions,
}: {
  tier: string;
  frameworkOptions: FrameworkOption[];
}) {
  const locale = useLocale();
  const t = useT();
  const [phase, setPhase] = useState<Phase>("select");
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [checklist, setChecklist] = useState<ChecklistFramework[]>([]);
  const [checked, setChecked] = useState<Set<string>>(new Set());
  const [expandedSections, setExpandedSections] = useState<Set<string>>(new Set());
  const [expandedCommentary, setExpandedCommentary] = useState<Set<string>>(new Set());
  const [error, setError] = useState<string | null>(null);
  const [filterFramework, setFilterFramework] = useState<string>("all");
  const printRef = useRef<HTMLDivElement>(null);

  const isPro = tier === "pro" || tier === "enterprise";

  // Toggle framework selection
  const toggleFramework = useCallback((slug: string) => {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(slug)) next.delete(slug);
      else next.add(slug);
      return next;
    });
  }, []);

  // Apply preset
  const applyPreset = useCallback(
    (slugs: string[]) => {
      const available = new Set(frameworkOptions.map((f) => f.slug));
      setSelected(new Set(slugs.filter((s) => available.has(s))));
    },
    [frameworkOptions]
  );

  // Generate checklist
  const generate = useCallback(async () => {
    if (selected.size === 0) return;
    setPhase("loading");
    setError(null);

    try {
      const res = await fetch("/api/checklist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ frameworks: Array.from(selected) }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to generate checklist");

      setChecklist(data.frameworks);
      // Expand all sections by default
      const allSectionIds = new Set<string>();
      for (const fw of data.frameworks) {
        for (const sec of fw.sections) {
          allSectionIds.add(`${fw.slug}:${sec.id}`);
        }
      }
      setExpandedSections(allSectionIds);
      setPhase("checklist");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error");
      setPhase("select");
    }
  }, [selected]);

  // Toggle section expand/collapse
  const toggleSection = useCallback((key: string) => {
    setExpandedSections((prev) => {
      const next = new Set(prev);
      if (next.has(key)) next.delete(key);
      else next.add(key);
      return next;
    });
  }, []);

  // Toggle commentary expand
  const toggleCommentary = useCallback((id: string) => {
    setExpandedCommentary((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }, []);

  // Toggle checkbox
  const toggleCheck = useCallback((id: string) => {
    setChecked((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }, []);

  // Stats
  const totalStatements = checklist.reduce(
    (acc, fw) => acc + fw.sections.reduce((a, s) => a + s.statements.length, 0),
    0
  );
  const checkedCount = checked.size;

  // Filtered frameworks
  const visibleFrameworks =
    filterFramework === "all"
      ? checklist
      : checklist.filter((fw) => fw.slug === filterFramework);

  // Print / export
  const handlePrint = useCallback(() => {
    window.print();
  }, []);

  // ── Select Phase ────────────────────────────────────────
  if (phase === "select") {
    return (
      <div className="space-y-8">
        {/* Presets */}
        <div>
          <h2 className="text-lg font-semibold text-gray-900 mb-3">Quick Start — Common Combinations</h2>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {PRESETS.map((preset) => (
              <button
                key={preset.label}
                onClick={() => applyPreset(preset.slugs)}
                className="text-left rounded-lg border border-gray-200 bg-white p-4 hover:border-blue-300 hover:shadow-sm transition-all"
              >
                <p className="font-medium text-gray-900 text-sm">{preset.label}</p>
                <p className="mt-1 text-xs text-gray-500">{preset.description}</p>
                <div className="mt-2 flex flex-wrap gap-1">
                  {preset.slugs.map((s) => (
                    <span key={s} className="inline-block rounded bg-blue-50 px-1.5 py-0.5 text-[10px] text-blue-700">
                      {frameworkOptions.find((f) => f.slug === s)?.name || s}
                    </span>
                  ))}
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Manual selection */}
        <div>
          <h2 className="text-lg font-semibold text-gray-900 mb-3">
            Or Select Frameworks Individually
            {selected.size > 0 && (
              <span className="ml-2 text-sm font-normal text-blue-600">
                ({selected.size} selected)
              </span>
            )}
          </h2>
          <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
            {frameworkOptions.map((fw) => {
              const isSelected = selected.has(fw.slug);
              return (
                <button
                  key={fw.slug}
                  onClick={() => toggleFramework(fw.slug)}
                  className={`flex items-center gap-3 rounded-lg border p-3 text-left transition-all ${
                    isSelected
                      ? "border-blue-500 bg-blue-50 ring-1 ring-blue-500"
                      : "border-gray-200 bg-white hover:border-gray-300"
                  }`}
                >
                  <div
                    className={`flex h-5 w-5 shrink-0 items-center justify-center rounded border ${
                      isSelected ? "border-blue-500 bg-blue-500" : "border-gray-300"
                    }`}
                  >
                    {isSelected && (
                      <svg className="h-3.5 w-3.5 text-white" fill="none" viewBox="0 0 24 24" strokeWidth={3} stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                      </svg>
                    )}
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate">{fw.name}</p>
                    {fw.badgeType && (
                      <span className={`inline-block mt-0.5 rounded px-1.5 py-0.5 text-[10px] font-medium ${BADGE_COLORS[fw.badgeType] || "bg-gray-100 text-gray-700"}`}>
                        {fw.badgeType}
                      </span>
                    )}
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Error */}
        {error && (
          <div className="rounded-lg bg-red-50 border border-red-200 p-4 text-sm text-red-700">
            {error}
          </div>
        )}

        {/* Generate button */}
        <div className="flex items-center gap-4">
          <button
            onClick={generate}
            disabled={selected.size === 0}
            className="rounded-lg bg-[#003399] px-6 py-3 text-sm font-semibold text-white shadow-sm hover:bg-[#002277] disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
          >
            Generate Checklist ({selected.size} framework{selected.size !== 1 ? "s" : ""})
          </button>
          {selected.size > 0 && (
            <button
              onClick={() => setSelected(new Set())}
              className="text-sm text-gray-500 hover:text-gray-700"
            >
              Clear selection
            </button>
          )}
        </div>
      </div>
    );
  }

  // ── Loading Phase ────────────────────────────────────────
  if (phase === "loading") {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-blue-200 border-t-blue-600" />
        <p className="mt-4 text-sm text-gray-600">Generating your compliance checklist…</p>
      </div>
    );
  }

  // ── Checklist Phase ──────────────────────────────────────
  return (
    <div className="space-y-6">
      {/* Toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-4 rounded-lg bg-white border border-gray-200 p-4">
        <div className="flex items-center gap-4">
          {/* Progress */}
          <div className="flex items-center gap-2">
            <div className="h-2 w-32 rounded-full bg-gray-200 overflow-hidden">
              <div
                className="h-full rounded-full bg-green-500 transition-all duration-300"
                style={{ width: totalStatements > 0 ? `${(checkedCount / totalStatements) * 100}%` : "0%" }}
              />
            </div>
            <span className="text-sm font-medium text-gray-700">
              {checkedCount}/{totalStatements}
            </span>
          </div>

          {/* Framework filter */}
          {checklist.length > 1 && (
            <select
              value={filterFramework}
              onChange={(e) => setFilterFramework(e.target.value)}
              className="rounded border border-gray-300 px-2 py-1 text-sm text-gray-700"
            >
              <option value="all">All Frameworks</option>
              {checklist.map((fw) => (
                <option key={fw.slug} value={fw.slug}>
                  {fw.name}
                </option>
              ))}
            </select>
          )}
        </div>

        <div className="flex items-center gap-2">
          {isPro && (
            <button
              onClick={handlePrint}
              className="inline-flex items-center gap-1.5 rounded-lg border border-gray-300 bg-white px-3 py-1.5 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
            >
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6.72 13.829c-.24.03-.48.062-.72.096m.72-.096a42.415 42.415 0 0 1 10.56 0m-10.56 0L6.34 18m10.94-4.171c.24.03.48.062.72.096m-.72-.096L17.66 18m0 0 .229 2.523a1.125 1.125 0 0 1-1.12 1.227H7.231c-.662 0-1.18-.568-1.12-1.227L6.34 18m11.318 0h1.091A2.25 2.25 0 0 0 21 15.75V9.456c0-1.081-.768-2.015-1.837-2.175a48.055 48.055 0 0 0-1.913-.247M6.34 18H5.25A2.25 2.25 0 0 1 3 15.75V9.456c0-1.081.768-2.015 1.837-2.175a48.041 48.041 0 0 1 1.913-.247m10.5 0a48.536 48.536 0 0 0-10.5 0m10.5 0V3.375c0-.621-.504-1.125-1.125-1.125h-8.25c-.621 0-1.125.504-1.125 1.125v3.659M18.75 12h.008v.008h-.008V12Zm-12 0h.008v.008H6.75V12Z" />
              </svg>
              Print / Export PDF
            </button>
          )}
          <button
            onClick={() => {
              setPhase("select");
              setChecked(new Set());
              setChecklist([]);
              setFilterFramework("all");
            }}
            className="rounded-lg border border-gray-300 bg-white px-3 py-1.5 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
          >
            ← New Checklist
          </button>
        </div>
      </div>

      {/* Checklist content */}
      <div ref={printRef} className="space-y-8 print:space-y-6">
        {visibleFrameworks.map((fw) => (
          <div key={fw.slug} className="space-y-4">
            {/* Framework header */}
            <div className="flex items-center gap-3">
              <h2 className="text-xl font-bold text-gray-900 font-serif">{fw.name}</h2>
              {fw.badgeType && (
                <span className={`rounded px-2 py-0.5 text-xs font-medium ${BADGE_COLORS[fw.badgeType] || "bg-gray-100 text-gray-700"}`}>
                  {fw.badgeType}
                </span>
              )}
              <span className="text-xs text-gray-400">
                {fw.sections.reduce((a, s) => a + s.statements.length, 0)} items
              </span>
            </div>

            {/* Sections */}
            {fw.sections.map((section) => {
              const sectionKey = `${fw.slug}:${section.id}`;
              const isExpanded = expandedSections.has(sectionKey);
              const sectionChecked = section.statements.filter((s) => checked.has(s.id)).length;
              const sectionTotal = section.statements.length;

              return (
                <div key={section.id} className="rounded-lg border border-gray-200 bg-white overflow-hidden">
                  {/* Section header */}
                  <button
                    onClick={() => toggleSection(sectionKey)}
                    className="flex w-full items-center justify-between px-4 py-3 text-left hover:bg-gray-50 transition-colors"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <svg
                        className={`h-4 w-4 shrink-0 text-gray-400 transition-transform ${isExpanded ? "rotate-90" : ""}`}
                        fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
                      </svg>
                      <div className="min-w-0">
                        <p className="font-semibold text-gray-900 text-sm truncate">{section.title}</p>
                        {section.description && (
                          <p className="text-xs text-gray-500 truncate mt-0.5">{section.description}</p>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center gap-2 shrink-0 ml-4">
                      <span className={`text-xs font-medium ${sectionChecked === sectionTotal ? "text-green-600" : "text-gray-500"}`}>
                        {sectionChecked}/{sectionTotal}
                      </span>
                      <div className="h-1.5 w-16 rounded-full bg-gray-200 overflow-hidden">
                        <div
                          className="h-full rounded-full bg-green-500 transition-all duration-300"
                          style={{ width: sectionTotal > 0 ? `${(sectionChecked / sectionTotal) * 100}%` : "0%" }}
                        />
                      </div>
                    </div>
                  </button>

                  {/* Statements */}
                  {isExpanded && (
                    <div className="border-t border-gray-100 divide-y divide-gray-50">
                      {section.statements.map((stmt) => {
                        const isChecked = checked.has(stmt.id);
                        const showCommentary = expandedCommentary.has(stmt.id);

                        return (
                          <div
                            key={stmt.id}
                            className={`px-4 py-3 transition-colors ${isChecked ? "bg-green-50/50" : ""}`}
                          >
                            <div className="flex gap-3">
                              {/* Checkbox */}
                              <button
                                onClick={() => toggleCheck(stmt.id)}
                                className={`mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded border transition-colors ${
                                  isChecked
                                    ? "border-green-500 bg-green-500"
                                    : "border-gray-300 hover:border-gray-400"
                                }`}
                              >
                                {isChecked && (
                                  <svg className="h-3.5 w-3.5 text-white" fill="none" viewBox="0 0 24 24" strokeWidth={3} stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                                  </svg>
                                )}
                              </button>

                              <div className="min-w-0 flex-1">
                                {/* Reference badge */}
                                {stmt.reference && (
                                  <span className="inline-block rounded bg-gray-100 px-1.5 py-0.5 text-[10px] font-mono text-gray-600 mb-1">
                                    {stmt.reference}
                                  </span>
                                )}
                                {/* Statement text */}
                                <p className={`text-sm leading-relaxed ${isChecked ? "text-gray-500 line-through" : "text-gray-800"}`}>
                                  {stmt.statement}
                                </p>

                                {/* Commentary toggle */}
                                {stmt.commentary && (
                                  <>
                                    <button
                                      onClick={() => toggleCommentary(stmt.id)}
                                      className="mt-1.5 inline-flex items-center gap-1 text-xs text-blue-600 hover:text-blue-800 transition-colors"
                                    >
                                      <svg className={`h-3 w-3 transition-transform ${showCommentary ? "rotate-90" : ""}`} fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
                                      </svg>
                                      {showCommentary ? "Hide" : "Show"} expert commentary
                                    </button>
                                    {showCommentary && (
                                      <div className={`mt-2 rounded-lg border border-blue-100 bg-blue-50/50 p-3 text-xs leading-relaxed text-gray-700 ${!isPro ? "blur-sm select-none" : ""}`}>
                                        {isPro ? (
                                          stmt.commentary
                                        ) : (
                                          <>
                                            {stmt.commentary.slice(0, 80)}…
                                            <span className="block mt-2 text-blue-600 font-medium">
                                              <a href={`/${locale}/pricing`} className="underline">Upgrade to Pro</a> to read full expert commentary
                                            </span>
                                          </>
                                        )}
                                      </div>
                                    )}
                                  </>
                                )}
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        ))}
      </div>

      {/* Bottom summary */}
      {totalStatements > 0 && (
        <div className="rounded-lg bg-gradient-to-r from-[#0d1b3e] to-[#003399] p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-lg font-bold font-serif">
                {checkedCount === totalStatements
                  ? "All requirements reviewed!"
                  : `${totalStatements - checkedCount} requirements remaining`}
              </p>
              <p className="mt-1 text-sm text-blue-200">
                {checklist.length} framework{checklist.length !== 1 ? "s" : ""} · {totalStatements} total requirements · {Math.round((checkedCount / totalStatements) * 100)}% complete
              </p>
            </div>
            {checkedCount === totalStatements && (
              <div className="flex items-center gap-2 rounded-full bg-green-500/20 px-4 py-2">
                <svg className="h-5 w-5 text-green-300" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                </svg>
                <span className="text-sm font-medium text-green-200">Review Complete</span>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
