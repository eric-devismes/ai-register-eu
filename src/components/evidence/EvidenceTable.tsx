"use client";

/**
 * EvidenceTable — Clean factsheet view of published claims.
 *
 * Replaces the old card-per-claim list. Claims are grouped by category,
 * shown as compact rows. Each source link uses the Web Text Fragment API
 * (URL#:~:text=...) so the browser scrolls to and highlights the exact
 * passage on the vendor trust page when the user clicks through.
 * Opens in a new tab — no iframe needed.
 */

import type { ClaimRow } from "@/types/claims";

// ─── Category display names ──────────────────────────────

const CATEGORY_LABELS: Record<string, string> = {
  accessControls:  "Access Controls",
  certifications:  "Certifications",
  dpa:             "Data Processing Agreement",
  euResidency:     "EU Data Residency",
  subprocessors:   "Sub-processors",
  trainingDataUse: "Training Data Use",
  encryption:      "Encryption",
  aiActStatus:     "EU AI Act",
  gdprStatus:      "GDPR Compliance",
  dataPortability: "Data Portability",
  exitTerms:       "Exit Terms",
  sla:             "SLA & Uptime",
  ipTerms:         "IP & Ownership",
  biasTesting:     "Bias & Fairness",
  explainability:  "Explainability",
  modelDocs:       "Model Documentation",
};

const CATEGORY_ORDER = [
  "euResidency", "certifications", "dpa", "accessControls",
  "encryption", "subprocessors", "trainingDataUse",
  "aiActStatus", "gdprStatus", "dataPortability", "exitTerms",
  "sla", "biasTesting", "explainability", "modelDocs", "ipTerms",
];

// ─── Tier badge colours ──────────────────────────────────

const TIER_STYLES: Record<number, { ring: string; dot: string; label: string }> = {
  1: { ring: "border-emerald-200 bg-emerald-50 text-emerald-700 hover:bg-emerald-100", dot: "bg-emerald-500", label: "T1" },
  2: { ring: "border-sky-200 bg-sky-50 text-sky-700 hover:bg-sky-100",               dot: "bg-sky-500",     label: "T2" },
  3: { ring: "border-violet-200 bg-violet-50 text-violet-700 hover:bg-violet-100",   dot: "bg-violet-500",  label: "T3" },
  4: { ring: "border-gray-200 bg-gray-50 text-gray-600 hover:bg-gray-100",           dot: "bg-gray-400",    label: "T4" },
};

// ─── Text fragment URL generator ────────────────────────

function fragmentUrl(url: string, quote: string): string {
  // Take the first ~120 chars of the verbatim quote — enough for the browser
  // to locate the passage without being fragile to minor formatting differences.
  const snippet = quote.trim().slice(0, 120).replace(/\s+/g, " ");
  try {
    return `${url}#:~:text=${encodeURIComponent(snippet)}`;
  } catch {
    return url;
  }
}

// ─── Sub-label formatter ─────────────────────────────────

function subLabel(field: string): string {
  const parts = field.split(".").slice(1);
  return parts.join(" · ").toUpperCase();
}

// ─── Component ───────────────────────────────────────────

interface Props {
  claims: ClaimRow[];
  systemName: string;
  locale: string;
}

export default function EvidenceTable({ claims, systemName, locale }: Props) {
  // Group by field prefix, sort by CATEGORY_ORDER
  const grouped = new Map<string, ClaimRow[]>();
  for (const c of claims) {
    const prefix = c.field.split(".")[0];
    if (!grouped.has(prefix)) grouped.set(prefix, []);
    grouped.get(prefix)!.push(c);
  }

  const orderedGroups: [string, ClaimRow[]][] = [
    ...CATEGORY_ORDER.filter((k) => grouped.has(k)).map((k) => [k, grouped.get(k)!] as [string, ClaimRow[]]),
    ...Array.from(grouped.entries()).filter(([k]) => !CATEGORY_ORDER.includes(k)),
  ];

  const latestDate = claims
    .map((c) => c.verifiedAt)
    .filter(Boolean)
    .sort()
    .at(-1);

  return (
    <div className="mt-6 rounded-2xl border border-gray-200 bg-white overflow-hidden shadow-sm">

      {/* ── Header ── */}
      <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 bg-white">
        <div className="flex items-center gap-2.5">
          <span className="flex h-7 w-7 items-center justify-center rounded-full bg-emerald-100">
            <svg className="h-3.5 w-3.5 text-emerald-600" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75M21 12c0 1.268-.63 2.39-1.593 3.068a3.745 3.745 0 0 1-1.043 3.296 3.745 3.745 0 0 1-3.296 1.043A3.745 3.745 0 0 1 12 21c-1.268 0-2.39-.63-3.068-1.593a3.746 3.746 0 0 1-3.296-1.043 3.745 3.745 0 0 1-1.043-3.296A3.745 3.745 0 0 1 3 12c0-1.268.63-2.39 1.593-3.068a3.745 3.745 0 0 1 1.043-3.296 3.746 3.746 0 0 1 3.296-1.043A3.746 3.746 0 0 1 12 3c1.268 0 2.39.63 3.068 1.593a3.746 3.746 0 0 1 3.296 1.043 3.746 3.746 0 0 1 1.043 3.296A3.745 3.745 0 0 1 21 12Z" />
            </svg>
          </span>
          <div>
            <span className="text-sm font-semibold text-gray-900">
              {claims.length} verified facts
            </span>
            {latestDate && (
              <span className="ml-2 text-xs text-gray-400">
                · checked {new Date(latestDate).toLocaleDateString(locale, { day: "numeric", month: "short", year: "numeric" })}
              </span>
            )}
          </div>
        </div>
        <div className="flex items-center gap-4">
          {/* Tier legend */}
          <div className="hidden sm:flex items-center gap-3 text-[10px] text-gray-400">
            {[1, 2, 3].map((t) => (
              <span key={t} className="flex items-center gap-1">
                <span className={`h-1.5 w-1.5 rounded-full ${TIER_STYLES[t].dot}`} />
                T{t} {t === 1 ? "Trust portal" : t === 2 ? "Product docs" : "Corporate comms"}
              </span>
            ))}
          </div>
          <a
            href={`mailto:corrections@ai-compass.eu?subject=Outdated%20information%20—%20${encodeURIComponent(systemName)}`}
            className="text-xs text-gray-400 hover:text-gray-600 transition"
          >
            Report outdated →
          </a>
        </div>
      </div>

      {/* ── Grouped rows ── */}
      {orderedGroups.map(([prefix, rows], gi) => (
        <div key={prefix} className={gi > 0 ? "border-t border-gray-100" : ""}>

          {/* Category header */}
          <div className="px-6 py-2 bg-gray-50/80">
            <span className="text-[10px] font-bold uppercase tracking-widest text-gray-400">
              {CATEGORY_LABELS[prefix] || prefix}
            </span>
          </div>

          {/* Claim rows */}
          <div className="divide-y divide-gray-50/80">
            {rows.map((c) => {
              const sub = subLabel(c.field);
              const tier = c.source?.tier ?? 4;
              const ts = TIER_STYLES[tier] ?? TIER_STYLES[4];
              const href = c.source
                ? (c.evidenceQuote ? fragmentUrl(c.source.url, c.evidenceQuote) : c.source.url)
                : null;

              return (
                <div
                  key={c.id}
                  className="flex items-center justify-between gap-4 px-6 py-3 hover:bg-blue-50/20 transition-colors"
                >
                  <div className="flex-1 min-w-0">
                    {sub && (
                      <p className="text-[10px] font-semibold text-[#003399]/50 uppercase tracking-wide mb-0.5">
                        {sub}
                      </p>
                    )}
                    <p className="text-sm text-gray-800 leading-snug">{c.value}</p>
                  </div>

                  {href && c.source && (
                    <a
                      href={href}
                      target="_blank"
                      rel="noopener noreferrer"
                      title={`Open ${c.source.label} — browser will highlight the exact passage`}
                      className={`shrink-0 inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[11px] font-medium transition ${ts.ring}`}
                    >
                      <span className={`h-1.5 w-1.5 rounded-full shrink-0 ${ts.dot}`} />
                      <span className="max-w-[120px] truncate">{c.source.label}</span>
                      <svg className="h-3 w-3 shrink-0 opacity-60" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 6H5.25A2.25 2.25 0 0 0 3 8.25v10.5A2.25 2.25 0 0 0 5.25 21h10.5A2.25 2.25 0 0 0 18 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25" />
                      </svg>
                    </a>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
}
