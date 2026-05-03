"use client";

/**
 * SourceChip — Renders a clickable evidence-source badge next to a claim.
 *
 * This is VendorScope's core differentiator versus unsourced analyst
 * reports: every claim on the site links to the vendor's own trust centre
 * (or the regulatory filing) that backs it, with the date we verified.
 *
 * Design intent: LOUD, not hidden. Citations are the feature.
 */

import { useT } from "@/lib/locale-context";

export interface SourceChipData {
  url: string;           // "https://trust.openai.com/compliance"
  label: string;         // "OpenAI Trust Portal"
  tier: number;          // 1-4 (see Source.tier in schema)
  verifiedAt: string | null; // ISO date string; null => unverified
  stale?: boolean;       // true when verifiedAt > 180 days ago
}

const tierStyles: Record<number, string> = {
  1: "border-emerald-300 bg-emerald-50 text-emerald-800",
  2: "border-sky-300 bg-sky-50 text-sky-800",
  3: "border-violet-300 bg-violet-50 text-violet-800",
  4: "border-slate-300 bg-slate-50 text-slate-800",
};

const tierKeys: Record<number, string> = {
  1: "evidence.tier1",
  2: "evidence.tier2",
  3: "evidence.tier3",
  4: "evidence.tier4",
};

function formatDate(iso: string | null, locale: string = "en"): string | null {
  if (!iso) return null;
  try {
    return new Date(iso).toLocaleDateString(locale, {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  } catch {
    return null;
  }
}

export default function SourceChip({ source }: { source: SourceChipData }) {
  const t = useT();
  const style = tierStyles[source.tier] ?? tierStyles[2];
  const tierLabel = t(tierKeys[source.tier] ?? tierKeys[2]);
  const dateLabel = formatDate(source.verifiedAt);

  return (
    <a
      href={source.url}
      target="_blank"
      rel="noopener noreferrer"
      title={`${tierLabel} · ${source.label}${dateLabel ? ` · ${t("evidence.verifiedOn")} ${dateLabel}` : ""}`}
      className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-[11px] font-medium transition hover:underline ${style}`}
    >
      <svg
        className="h-3 w-3 shrink-0"
        fill="none"
        viewBox="0 0 24 24"
        strokeWidth={2}
        stroke="currentColor"
        aria-hidden="true"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M13.19 8.688a4.5 4.5 0 0 1 1.242 7.244l-4.5 4.5a4.5 4.5 0 0 1-6.364-6.364l1.757-1.757m13.35-.622 1.757-1.757a4.5 4.5 0 0 0-6.364-6.364l-4.5 4.5a4.5 4.5 0 0 0 1.242 7.244"
        />
      </svg>
      <span>{source.label}</span>
      {dateLabel && !source.stale && (
        <span className="opacity-70">· {dateLabel}</span>
      )}
      {source.stale && (
        <span className="ml-0.5 rounded bg-amber-200 px-1 py-px text-[10px] text-amber-900">
          {t("evidence.stale")}
        </span>
      )}
      {!source.verifiedAt && (
        <span className="ml-0.5 rounded bg-gray-200 px-1 py-px text-[10px] text-gray-700">
          {t("evidence.unverified")}
        </span>
      )}
    </a>
  );
}

/**
 * ClaimWithSources — Wraps a claim value and renders its source chips inline.
 * Use whenever a database field has been migrated to the evidence model.
 */
export function ClaimWithSources({
  label,
  value,
  sources,
}: {
  label?: string;
  value: string;
  sources: SourceChipData[];
}) {
  if (!value) return null;
  return (
    <div className="py-2.5 border-b border-gray-50 last:border-0">
      {label && (
        <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
          {label}
        </span>
      )}
      <p className="mt-0.5 text-sm text-gray-700 leading-relaxed">{value}</p>
      {sources.length > 0 && (
        <div className="mt-2 flex flex-wrap gap-1.5">
          {sources.map((s) => (
            <SourceChip key={s.url} source={s} />
          ))}
        </div>
      )}
    </div>
  );
}
