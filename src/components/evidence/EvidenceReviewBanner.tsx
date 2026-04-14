"use client";

/**
 * EvidenceReviewBanner — Interim liability disclosure for pages that display
 * vendor assessment claims that haven't yet been backfilled through the
 * evidence pipeline (Source → SourceSnapshot → SystemClaim).
 *
 * Shown at the top of:
 *   - /[lang]/systems/[slug]         (system detail pages)
 *   - /[lang]/database               (listing)
 *   - /[lang]/compare (results)
 *
 * Remove once every displayed claim is backed by a published SystemClaim
 * with a verified source.
 */

import Link from "next/link";
import { useT, useLocale } from "@/lib/locale-context";

interface Props {
  /** If set, hides the "learn more" link (useful in dense contexts like cards). */
  compact?: boolean;
}

export default function EvidenceReviewBanner({ compact = false }: Props) {
  const t = useT();
  const locale = useLocale();

  return (
    <div
      role="note"
      className="rounded-xl border border-amber-300 bg-amber-50 p-4 text-amber-900"
      data-testid="evidence-review-banner"
    >
      <div className="flex items-start gap-3">
        <svg
          className="h-5 w-5 shrink-0 text-amber-600 mt-0.5"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={1.5}
          stroke="currentColor"
          aria-hidden="true"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M12 9v3.75m9-.75a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9 3.75h.008v.008H12v-.008Z"
          />
        </svg>
        <div className="flex-1">
          <p className="text-sm font-semibold">{t("evidenceBanner.title")}</p>
          {!compact && (
            <p className="mt-1 text-xs leading-relaxed">
              {t("evidenceBanner.body")}{" "}
              <Link
                href={`/${locale}/methodology`}
                className="font-semibold underline hover:text-amber-700"
              >
                {t("evidenceBanner.learnMore")}
              </Link>
              .
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
