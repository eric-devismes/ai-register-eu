"use client";

/**
 * FrameworkPillars — Structured section grid for regulation detail pages.
 *
 * Replaces the old Greek-temple pillar metaphor with a clean, aligned grid.
 * Each card = one section of the regulation, showing the section name and
 * the number of statements/requirements it contains.
 * Clicking a card scrolls to and opens the corresponding collapsible section.
 */

import { useT } from "@/lib/locale-context";

interface Section {
  id: string;
  title: string;
  statementCount: number;
}

interface FrameworkPillarsProps {
  frameworkName: string;
  sections: Section[];
}

export default function FrameworkPillars({ frameworkName, sections }: FrameworkPillarsProps) {
  const t = useT();
  if (sections.length === 0) return null;

  function scrollToSection(id: string) {
    const el = document.getElementById(`section-${id}`);
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "start" });
      // Open the collapsible section
      const button = el.querySelector("button");
      if (button) button.click();
    }
  }

  const totalStatements = sections.reduce((s, sec) => s + sec.statementCount, 0);

  return (
    <div>
      {/* Header */}
      <div className="flex items-baseline justify-between mb-4">
        <h2 className="text-xl font-bold text-gray-900">{t("frameworks.structure") || "Structure"}</h2>
        <p className="text-sm text-gray-400">
          {sections.length} {sections.length === 1 ? "section" : "sections"} · {totalStatements} {totalStatements === 1 ? t("frameworks.requirement") : t("frameworks.requirements")}
        </p>
      </div>

      {/* Section grid */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
        {sections.map((section, idx) => (
          <button
            key={section.id}
            onClick={() => scrollToSection(section.id)}
            className="group text-left rounded-xl border-2 border-gray-100 bg-white p-4 transition hover:border-[#003399]/40 hover:shadow-md"
          >
            {/* Section number */}
            <span className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-[#003399]/10 text-xs font-bold text-[#003399] group-hover:bg-[#003399] group-hover:text-white transition-colors">
              {idx + 1}
            </span>

            {/* Section name */}
            <p className="mt-2 text-sm font-semibold text-gray-900 leading-snug group-hover:text-[#003399] transition-colors">
              {section.title.replace(/^(Chapter \d+|Section \d+|Article \d+)[:\s—–-]*/i, "").trim() || section.title}
            </p>

            {/* Statement count */}
            <p className="mt-1.5 text-xs text-gray-400">
              {section.statementCount} {section.statementCount === 1 ? t("frameworks.requirement") : t("frameworks.requirements")}
            </p>
          </button>
        ))}
      </div>
    </div>
  );
}
