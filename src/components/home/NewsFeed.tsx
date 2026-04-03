"use client";

/**
 * NewsFeed — Personalised news pane on the homepage.
 *
 * Logged in: shows recent changelog entries for followed topics.
 * Logged out: shows a compact CTA to sign up.
 * Collapsible/expandable.
 */

import { useEffect, useState } from "react";
import Link from "next/link";
import { useT, useLocale } from "@/lib/locale-context";

interface FeedItem {
  id: string;
  date: string;
  title: string;
  description: string;
  changeType: string;
  sourceUrl: string;
  sourceLabel: string;
  framework: { name: string; slug: string } | null;
  system: { vendor: string; name: string; slug: string } | null;
}

const TYPE_COLORS: Record<string, string> = {
  update: "bg-blue-100 text-blue-700",
  amendment: "bg-purple-100 text-purple-700",
  jurisprudence: "bg-amber-100 text-amber-700",
  new_version: "bg-emerald-100 text-emerald-700",
  incident: "bg-red-100 text-red-700",
  certification: "bg-cyan-100 text-cyan-700",
  correction: "bg-gray-100 text-gray-700",
};

export default function NewsFeed() {
  const [items, setItems] = useState<FeedItem[]>([]);
  const [authenticated, setAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const [expanded, setExpanded] = useState(true);
  const t = useT();
  const locale = useLocale();

  useEffect(() => {
    fetch("/api/feed")
      .then((r) => r.json())
      .then((data) => {
        setItems(data.items || []);
        setAuthenticated(data.authenticated);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  if (loading) return null;

  // Not logged in: show CTA
  if (!authenticated) {
    return (
      <section className="bg-[#003399]/5 border-y border-[#003399]/10">
        <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="h-8 w-8 rounded-full bg-[#003399]/10 flex items-center justify-center">
                <svg className="h-4 w-4 text-[#003399]" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M14.857 17.082a23.848 23.848 0 0 0 5.454-1.31A8.967 8.967 0 0 1 18 9.75V9A6 6 0 0 0 6 9v.75a8.967 8.967 0 0 1-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 0 1-5.714 0m5.714 0a3 3 0 1 1-5.714 0" />
                </svg>
              </div>
              <div>
                <p className="text-sm font-semibold text-gray-900">{t("feed.cta")}</p>
                <p className="text-xs text-gray-500">{t("feed.ctaSub")}</p>
              </div>
            </div>
            <Link href={`/${locale}/subscribe`}
              className="shrink-0 rounded-lg bg-[#003399] px-5 py-2 text-sm font-semibold text-white transition hover:bg-[#003399]/90">
              {t("common.signUp")}
            </Link>
          </div>
        </div>
      </section>
    );
  }

  // Logged in but no items
  if (items.length === 0) {
    return (
      <section className="bg-[#003399]/5 border-y border-[#003399]/10">
        <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8 text-center">
          <p className="text-sm text-gray-500">{t("feed.noUpdates")}</p>
          <Link href={`/${locale}/account`} className="text-sm text-[#003399] hover:underline">{t("feed.managePrefs")}</Link>
        </div>
      </section>
    );
  }

  // Logged in with items: show feed
  return (
    <section className="bg-[#003399]/5 border-y border-[#003399]/10">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header bar */}
        <button
          onClick={() => setExpanded(!expanded)}
          className="flex w-full items-center justify-between py-4"
        >
          <div className="flex items-center gap-2">
            <svg className="h-4 w-4 text-[#003399]" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M14.857 17.082a23.848 23.848 0 0 0 5.454-1.31A8.967 8.967 0 0 1 18 9.75V9A6 6 0 0 0 6 9v.75a8.967 8.967 0 0 1-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 0 1-5.714 0m5.714 0a3 3 0 1 1-5.714 0" />
            </svg>
            <span className="text-sm font-semibold text-gray-900">{t("feed.title")}</span>
            <span className="rounded-full bg-[#003399] px-2 py-0.5 text-xs font-bold text-white">{items.length}</span>
          </div>
          <svg className={`h-4 w-4 text-gray-400 transition ${expanded ? "rotate-180" : ""}`} fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="m19.5 8.25-7.5 7.5-7.5-7.5" />
          </svg>
        </button>

        {/* Feed items */}
        {expanded && (
          <div className="pb-6 space-y-3">
            {items.slice(0, 8).map((item) => (
              <div key={item.id} className="rounded-lg bg-white border border-gray-200 px-4 py-3">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-xs text-gray-400">
                        {new Date(item.date).toLocaleDateString("en-GB", { day: "numeric", month: "short" })}
                      </span>
                      <span className={`rounded-full px-2 py-0.5 text-[10px] font-semibold ${TYPE_COLORS[item.changeType] || TYPE_COLORS.update}`}>
                        {item.changeType.replace("_", " ")}
                      </span>
                      {item.framework && (
                        <Link href={`/${locale}/regulations/${item.framework.slug}`} className="text-[10px] font-medium text-[#003399] hover:underline">
                          {item.framework.name}
                        </Link>
                      )}
                      {item.system && (
                        <Link href={`/${locale}/systems/${item.system.slug}`} className="text-[10px] font-medium text-gray-600 hover:underline">
                          {item.system.vendor} {item.system.name}
                        </Link>
                      )}
                    </div>
                    <p className="mt-1 text-sm font-medium text-gray-900">{item.title}</p>
                  </div>
                  {item.sourceUrl && (
                    <a href={item.sourceUrl} target="_blank" rel="noopener noreferrer"
                      className="shrink-0 text-xs text-gray-400 hover:text-[#003399]">
                      <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 6H5.25A2.25 2.25 0 0 0 3 8.25v10.5A2.25 2.25 0 0 0 5.25 21h10.5A2.25 2.25 0 0 0 18 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25" />
                      </svg>
                    </a>
                  )}
                </div>
              </div>
            ))}
            <div className="text-center pt-2">
              <Link href={`/${locale}/account`} className="text-xs text-[#003399] hover:underline">{t("feed.managePrefs")}</Link>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
