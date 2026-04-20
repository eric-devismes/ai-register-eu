"use client";

import { useState, useEffect } from "react";
import type { ClaimRow } from "@/types/claims";

// ─── Verified-at badge (shared with RoleDrillDown) ──────

export function VerifiedBadge({ dateStr }: { dateStr: string | null }) {
  if (!dateStr) return null;
  const days = Math.floor((Date.now() - new Date(dateStr).getTime()) / 86_400_000);
  const color = days <= 30
    ? "text-emerald-600 bg-emerald-50 border-emerald-200"
    : days <= 90
    ? "text-amber-600 bg-amber-50 border-amber-200"
    : "text-red-600 bg-red-50 border-red-200";
  const label = new Date(dateStr).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" });
  return (
    <span className={`inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-[10px] font-medium ${color}`}>
      <svg className="h-2.5 w-2.5" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
      </svg>
      {label}
    </span>
  );
}

// ─── Text fragment URL ───────────────────────────────────

function fragmentUrl(url: string, quote: string): string {
  try {
    return `${url}#:~:text=${encodeURIComponent(quote.trim().slice(0, 150))}`;
  } catch {
    return url;
  }
}

// ─── Inline highlight of claim value inside quote text ──

function HighlightedQuote({ quote, value }: { quote: string; value: string }) {
  const needle = value.trim().slice(0, 30).toLowerCase();
  const lower = quote.toLowerCase();
  const idx = needle.length > 3 ? lower.indexOf(needle) : -1;

  if (idx === -1) {
    return (
      <span>
        <mark className="bg-yellow-200 rounded px-0.5 not-italic">{quote}</mark>
      </span>
    );
  }

  return (
    <span>
      {quote.slice(0, idx)}
      <mark className="bg-yellow-200 rounded px-0.5 not-italic font-medium">
        {quote.slice(idx, idx + needle.length)}
      </mark>
      {quote.slice(idx + needle.length)}
    </span>
  );
}

// ─── Evidence overlay ────────────────────────────────────

function EvidenceOverlay({ claim, onClose }: { claim: ClaimRow; onClose: () => void }) {
  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [onClose]);

  const TIER_LABELS: Record<number, string> = {
    1: "Vendor Trust Portal",
    2: "Product Documentation",
    3: "Corporate Communications",
    4: "Regulatory Filing",
  };

  const sourceHref = claim.source?.url
    ? (claim.evidenceQuote ? fragmentUrl(claim.source.url, claim.evidenceQuote) : claim.source.url)
    : null;

  const displayUrl = claim.source?.url
    ? claim.source.url.replace(/^https?:\/\//, "").split("?")[0].slice(0, 60)
    : null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ backgroundColor: "rgba(0,0,0,0.45)", backdropFilter: "blur(4px)" }}
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-lg rounded-2xl bg-white shadow-2xl flex flex-col overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header: source */}
        <div className="px-6 py-4 border-b border-gray-100 bg-gray-50">
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <span className="inline-flex items-center rounded-full bg-emerald-100 border border-emerald-200 px-2 py-0.5 text-[10px] font-bold text-emerald-700 uppercase tracking-wide">
                  {TIER_LABELS[claim.source?.tier ?? 1] ?? "Source"}
                </span>
              </div>
              {displayUrl && (
                <p className="mt-1.5 text-xs font-mono text-gray-600 truncate" title={claim.source?.url}>
                  {displayUrl}
                </p>
              )}
              {claim.source?.label && (
                <p className="mt-0.5 text-xs text-gray-400">{claim.source.label}</p>
              )}
            </div>
            <button
              type="button"
              onClick={onClose}
              className="shrink-0 flex h-7 w-7 items-center justify-center rounded-full hover:bg-gray-200 transition text-gray-400 hover:text-gray-700"
              aria-label="Close"
            >
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        {/* Claim value + date */}
        <div className="px-6 pt-5">
          <p className="text-base font-semibold text-gray-900 leading-snug">{claim.value}</p>
          {claim.verifiedAt && (
            <p className="mt-1 text-xs text-gray-400">
              Verified {new Date(claim.verifiedAt).toLocaleDateString("en-GB", {
                day: "numeric", month: "long", year: "numeric",
              })}
              {claim.stale && (
                <span className="ml-2 text-amber-600 font-medium">· re-verification pending</span>
              )}
            </p>
          )}
        </div>

        {/* Evidence quote */}
        {claim.evidenceQuote && (
          <div className="px-6 pt-4 pb-2">
            <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-2">
              Verbatim from source
            </p>
            <blockquote className="rounded-lg border border-yellow-200 bg-yellow-50 px-4 py-3 text-sm text-gray-700 leading-relaxed italic">
              &ldquo;
              <HighlightedQuote quote={claim.evidenceQuote} value={claim.value} />
              &rdquo;
            </blockquote>
          </div>
        )}

        {/* CTA */}
        <div className="px-6 py-4 mt-2">
          {sourceHref ? (
            <a
              href={sourceHref}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 w-full rounded-xl bg-[#003399] px-4 py-3 text-sm font-semibold text-white hover:bg-[#0044cc] transition"
            >
              Open on source page — browser highlights this passage
              <svg className="h-4 w-4 shrink-0" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 6H5.25A2.25 2.25 0 0 0 3 8.25v10.5A2.25 2.25 0 0 0 5.25 21h10.5A2.25 2.25 0 0 0 18 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25" />
              </svg>
            </a>
          ) : (
            <p className="text-xs text-gray-400 text-center">No source URL available for this claim.</p>
          )}
        </div>
      </div>
    </div>
  );
}

// ─── Claim chip (inline link style) ─────────────────────

export function ClaimChip({ claim }: { claim: ClaimRow }) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="inline text-[#003399] underline underline-offset-2 hover:text-[#0044cc] transition-colors cursor-pointer"
        title="Click to view source evidence"
      >
        {claim.value}
      </button>
      {open && <EvidenceOverlay claim={claim} onClose={() => setOpen(false)} />}
    </>
  );
}
