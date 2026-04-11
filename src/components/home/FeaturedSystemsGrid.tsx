"use client";

/**
 * FeaturedSystemsGrid — Client component for the interactive AI systems grid.
 *
 * Receives systems and frameworks data from the server component parent.
 * Handles filter pills and card rendering with dynamic per-framework scores.
 */

import { useState } from "react";
import { gradeColor } from "@/lib/scoring";
import { useT, useLocale } from "@/lib/locale-context";
import { Tooltip } from "@/components/ui/Tooltip";
import { RISK_TOOLTIPS, SCORE_TOOLTIPS } from "@/lib/constants";

// ─── Types ───────────────────────────────────────────────

interface Score {
  frameworkName: string;
  frameworkSlug: string;
  score: string;
}

interface AISystem {
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
}

interface Framework {
  name: string;
  slug: string;
}

// ─── Constants ───────────────────────────────────────────

// Filter values stay in English (they match DB categories), but labels are translated
const FILTER_KEYS = [
  { value: "All", dictKey: "common.all" },
  { value: "Financial", dictKey: "featured.financial" },
  { value: "Healthcare", dictKey: "featured.healthcare" },
  { value: "Insurance", dictKey: "featured.insurance" },
  { value: "Public Sector", dictKey: "featured.publicSector" },
  { value: "HR", dictKey: "featured.hr" },
];

const RISK_COLORS: Record<string, string> = {
  High: "bg-red-100 text-red-700 border-red-200",
  Limited: "bg-amber-100 text-amber-700 border-amber-200",
  Minimal: "bg-green-100 text-green-700 border-green-200",
};

/** Translate risk level using dictionary */
function useRiskLabel() {
  const tFn = useT();
  return (risk: string) => {
    const map: Record<string, string> = {
      High: tFn("common.high"),
      Limited: tFn("common.limited"),
      Minimal: tFn("common.minimal"),
    };
    return map[risk] || risk;
  };
}

// ─── Component ───────────────────────────────────────────

export function FeaturedSystemsGrid({
  systems,
  frameworks: _frameworks,
}: {
  systems: AISystem[];
  frameworks: Framework[];
}) {
  const [activeFilter, setActiveFilter] = useState("All");
  const t = useT();
  const locale = useLocale();
  const riskLabel = useRiskLabel();

  const filtered =
    activeFilter === "All"
      ? systems
      : systems.filter((s) => s.category === activeFilter);

  return (
    <section className="bg-white py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section heading */}
        <div className="text-center">
          <h2 className="text-3xl font-bold tracking-tight text-gray-900">
            {t("featured.title")}
          </h2>
          <p className="mx-auto mt-3 max-w-2xl text-lg text-gray-500">
            {t("featured.subtitle")}
          </p>
        </div>

        {/* Filter pills */}
        <div className="mt-10 flex flex-wrap justify-center gap-2">
          {FILTER_KEYS.map((filter) => (
            <button
              key={filter.value}
              type="button"
              onClick={() => setActiveFilter(filter.value)}
              className={`rounded-full px-5 py-2 text-sm font-medium transition ${
                activeFilter === filter.value
                  ? "bg-[#003399] text-white shadow-sm"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
            >
              {t(filter.dictKey)}
            </button>
          ))}
        </div>

        {/* Cards grid */}
        <div className="mt-10 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filtered.map((system) => (
            <div
              key={system.id}
              className="group flex flex-col rounded-xl border border-gray-200 bg-white p-6 shadow-sm transition hover:border-[#003399]/30 hover:shadow-md"
            >
              {/* Card header */}
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wider text-[#003399]">
                    {system.vendor}
                  </p>
                  <h3 className="mt-1 text-lg font-bold text-gray-900">{system.name}</h3>
                  <p className="mt-0.5 text-xs text-gray-500">{system.type}</p>
                </div>
                <Tooltip
                  text={RISK_TOOLTIPS[system.risk]?.short || "EU AI Act Risk Level"}
                  detail={RISK_TOOLTIPS[system.risk]?.detail}
                  clickable
                  position="bottom"
                >
                  <span className={`cursor-pointer rounded-full border px-2.5 py-0.5 text-xs font-semibold ${RISK_COLORS[system.risk] || RISK_COLORS.High}`}>
                    {riskLabel(system.risk)} {t("common.risk")} ⓘ
                  </span>
                </Tooltip>
              </div>

              {/* Description — clamped to 3 lines for balanced card heights */}
              <p className="mt-4 flex-1 text-sm leading-relaxed text-gray-600 line-clamp-3">
                {system.description}
              </p>

              {/* Industry tags */}
              <div className="mt-4 flex flex-wrap gap-1.5">
                {system.industries.map((name) => (
                  <span key={name} className="rounded-full bg-gray-100 px-2.5 py-0.5 text-xs text-gray-600">
                    {name}
                  </span>
                ))}
              </div>

              {/* Compliance scores — dynamic per-framework */}
              <div className="mt-5 border-t border-gray-100 pt-4">
                <p className="mb-2 text-xs font-medium uppercase tracking-wider text-gray-400">
                  {t("featured.complianceScores")}
                </p>
                <div className="flex items-center gap-3 flex-wrap">
                  {/* Overall score first */}
                  <Tooltip
                    text={`Overall: ${system.overallScore} — ${SCORE_TOOLTIPS[system.overallScore] || "Average across all frameworks"}`}
                    position="bottom"
                  >
                    <div className="flex flex-col items-center gap-1">
                      <span className={`inline-flex h-9 w-9 items-center justify-center rounded-full text-xs font-bold text-white ring-2 ring-gray-200 ${gradeColor(system.overallScore)}`}>
                        {system.overallScore}
                      </span>
                      <span className="text-[10px] font-semibold text-gray-500">{t("featured.overall")}</span>
                    </div>
                  </Tooltip>

                  {/* Separator */}
                  <div className="h-8 w-px bg-gray-200" />

                  {/* Per-framework scores */}
                  {system.scores.map((s) => (
                    <Tooltip
                      key={s.frameworkSlug}
                      text={`${s.frameworkName}: ${s.score} — ${SCORE_TOOLTIPS[s.score] || "Assessment score"}`}
                      position="bottom"
                    >
                      <div className="flex flex-col items-center gap-1">
                        <span className={`inline-flex h-8 w-8 items-center justify-center rounded-full text-xs font-bold text-white ${gradeColor(s.score)}`}>
                          {s.score}
                        </span>
                        <span className="text-[10px] text-gray-400">{s.frameworkName}</span>
                      </div>
                    </Tooltip>
                  ))}
                </div>
              </div>

              {/* Link to full assessment */}
              <a
                href={`/${locale}/systems/${system.slug}`}
                className="mt-4 inline-flex items-center text-sm font-semibold text-[#003399] transition hover:text-[#003399]/70"
              >
                {t("featured.fullAssessment")}
                <svg className="ml-1 h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
                </svg>
              </a>
            </div>
          ))}
        </div>

        {/* Browse all button */}
        <div className="mt-12 text-center">
          <a href={`/${locale}/database`} className="inline-flex items-center rounded-lg border-2 border-[#003399] px-8 py-3.5 text-sm font-semibold text-[#003399] transition hover:bg-[#003399] hover:text-white">
            {t("featured.browseAll")}
            <svg className="ml-2 h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
            </svg>
          </a>
        </div>
      </div>
    </section>
  );
}
