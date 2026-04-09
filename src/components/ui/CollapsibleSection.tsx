"use client";

/**
 * CollapsibleSection — Click-to-expand section with chevron toggle.
 *
 * Used across regulation pages, methodology, and anywhere content
 * needs progressive disclosure. Header always visible, body toggles.
 */

import { useState, type ReactNode } from "react";

interface CollapsibleSectionProps {
  title: string;
  subtitle?: string;
  badge?: ReactNode;
  defaultOpen?: boolean;
  children: ReactNode;
}

export default function CollapsibleSection({
  title,
  subtitle,
  badge,
  defaultOpen = false,
  children,
}: CollapsibleSectionProps) {
  const [open, setOpen] = useState(defaultOpen);

  return (
    <div className="rounded-xl border border-gray-200 overflow-hidden">
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between bg-gray-50 px-6 py-4 border-b border-gray-200 text-left hover:bg-gray-100 transition-colors"
      >
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <h3 className="text-base font-bold text-gray-900">{title}</h3>
            {badge}
          </div>
          {subtitle && (
            <p className="mt-0.5 text-sm text-gray-600 line-clamp-1">{subtitle}</p>
          )}
        </div>
        <svg
          className={`h-5 w-5 shrink-0 text-gray-400 transition-transform ${open ? "rotate-180" : ""}`}
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={2}
          stroke="currentColor"
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="m19.5 8.25-7.5 7.5-7.5-7.5" />
        </svg>
      </button>
      {open && <div>{children}</div>}
    </div>
  );
}
