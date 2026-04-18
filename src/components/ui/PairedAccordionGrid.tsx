"use client";

import { useState } from "react";

interface Dimension {
  number: number;
  color: string;
  title: string;
  criteria: string[];
}

export default function PairedAccordionGrid({ dimensions }: { dimensions: Dimension[] }) {
  const [open, setOpen] = useState<Set<number>>(new Set());

  function toggle(idx: number) {
    const partner = idx % 2 === 0 ? idx + 1 : idx - 1;
    setOpen((prev) => {
      const next = new Set(prev);
      if (next.has(idx)) {
        next.delete(idx);
        if (partner >= 0 && partner < dimensions.length) next.delete(partner);
      } else {
        next.add(idx);
        if (partner >= 0 && partner < dimensions.length) next.add(partner);
      }
      return next;
    });
  }

  return (
    <div className="mt-12 grid gap-4 sm:grid-cols-2">
      {dimensions.map((dim, idx) => {
        const isOpen = open.has(idx);
        return (
          <div key={dim.number} className="rounded-xl border border-gray-200 overflow-hidden">
            <button
              type="button"
              onClick={() => toggle(idx)}
              className="w-full flex items-center justify-between bg-gray-50 px-6 py-4 border-b border-gray-200 text-left hover:bg-gray-100 transition-colors"
            >
              <div className="flex-1 min-w-0 flex items-center gap-2">
                <span
                  className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-xs font-bold text-white"
                  style={{ backgroundColor: dim.color }}
                >
                  {dim.number}
                </span>
                <h3 className="text-base font-bold text-gray-900">{dim.title}</h3>
              </div>
              <svg
                className={`h-5 w-5 shrink-0 text-gray-400 transition-transform ${isOpen ? "rotate-180" : ""}`}
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={2}
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="m19.5 8.25-7.5 7.5-7.5-7.5" />
              </svg>
            </button>
            {isOpen && (
              <ul className="px-6 py-4 space-y-2">
                {dim.criteria.map((criterion, cIdx) => (
                  <li key={cIdx} className="flex items-start gap-2 text-sm text-gray-600">
                    <svg className="h-4 w-4 shrink-0 mt-0.5 text-[#003399]/40" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
                    </svg>
                    {criterion}
                  </li>
                ))}
              </ul>
            )}
          </div>
        );
      })}
    </div>
  );
}
