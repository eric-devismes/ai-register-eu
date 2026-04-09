"use client";

/**
 * FrameworkPillars — Visual clickable pillar navigation for regulation pages.
 *
 * Renders framework sections as pillars of an institutional building.
 * Clicking a pillar scrolls to that section's collapsible content below.
 * The pillars sit on a base (framework name) under a pediment (purpose).
 */

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
  if (sections.length === 0) return null;

  function scrollToSection(id: string) {
    // CollapsibleSection components have the section title as an anchor
    const el = document.getElementById(`section-${id}`);
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "start" });
      // Try to open the collapsible section by clicking its button
      const button = el.querySelector("button");
      if (button) button.click();
    }
  }

  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-6 overflow-hidden">
      {/* Pediment (triangle top) */}
      <div className="text-center mb-4">
        <div className="mx-auto w-0 h-0 border-l-[80px] border-r-[80px] border-b-[30px] border-l-transparent border-r-transparent border-b-[#003399]/10" />
        <p className="mt-2 text-xs font-bold text-[#003399] uppercase tracking-wider">{frameworkName}</p>
      </div>

      {/* Pillars */}
      <div className="flex items-end justify-center gap-1 sm:gap-2">
        {sections.map((section) => {
          // Pillar height based on statement count (min 60px, max 140px)
          const height = Math.max(60, Math.min(140, 40 + section.statementCount * 8));

          return (
            <button
              key={section.id}
              onClick={() => scrollToSection(section.id)}
              className="group flex flex-col items-center"
              title={section.title}
            >
              {/* Capital (top decoration) */}
              <div className="w-full h-2 rounded-t bg-[#003399]/30 group-hover:bg-[#003399] transition-colors" />

              {/* Shaft */}
              <div
                className="w-8 sm:w-10 bg-[#003399]/10 group-hover:bg-[#003399]/20 transition-colors border-x border-[#003399]/20"
                style={{ height: `${height}px` }}
              />

              {/* Base */}
              <div className="w-full h-2 bg-[#003399]/30 group-hover:bg-[#003399] transition-colors" />

              {/* Label */}
              <p className="mt-2 text-[8px] sm:text-[9px] text-gray-500 group-hover:text-[#003399] text-center max-w-[60px] sm:max-w-[80px] leading-tight transition-colors line-clamp-2">
                {section.title.replace(/^(Chapter \d+|Section \d+|Article \d+)[:\s—–-]*/i, "").trim() || section.title}
              </p>
            </button>
          );
        })}
      </div>

      {/* Base platform */}
      <div className="mt-2 h-3 rounded-b bg-[#003399]/20" />

      <p className="mt-3 text-center text-[10px] text-gray-400">
        Click a pillar to explore that section
      </p>
    </div>
  );
}
