"use client";

/**
 * NewsfeedClient — Interactive newsfeed with two tabs:
 *   1. "News" — recent updates (last 7 days) + search for past entries
 *   2. "Calendar" — upcoming regulatory milestones as a timeline
 */

import { useState } from "react";
import Link from "next/link";
import { useLocale, useT } from "@/lib/locale-context";

// ─── Upcoming regulatory milestones ─────────────────────

interface Milestone {
  date: string;       // ISO date
  title: string;
  framework: string;
  description: string;
  impact: "high" | "medium" | "low";
}

// Milestone data — titles and descriptions come from the dictionary
interface MilestoneData {
  date: string;
  titleKey: string;
  framework: string;
  descKey: string;
  impact: "high" | "medium" | "low";
}

const MILESTONE_DATA: MilestoneData[] = [
  { date: "2026-08-02", titleKey: "newsfeed.milestone1Title", framework: "EU AI Act", descKey: "newsfeed.milestone1Desc", impact: "high" },
  { date: "2026-08-02", titleKey: "newsfeed.milestone2Title", framework: "EU AI Act", descKey: "newsfeed.milestone2Desc", impact: "high" },
  { date: "2026-08-02", titleKey: "newsfeed.milestone3Title", framework: "EU AI Act", descKey: "newsfeed.milestone3Desc", impact: "medium" },
  { date: "2027-02-02", titleKey: "newsfeed.milestone4Title", framework: "EU AI Act", descKey: "newsfeed.milestone4Desc", impact: "high" },
  { date: "2027-08-02", titleKey: "newsfeed.milestone5Title", framework: "EU AI Act", descKey: "newsfeed.milestone5Desc", impact: "high" },
  { date: "2026-10-17", titleKey: "newsfeed.milestone6Title", framework: "NIS2", descKey: "newsfeed.milestone6Desc", impact: "medium" },
  { date: "2027-01-17", titleKey: "newsfeed.milestone7Title", framework: "DORA", descKey: "newsfeed.milestone7Desc", impact: "high" },
  { date: "2026-12-31", titleKey: "newsfeed.milestone8Title", framework: "EU Data Act", descKey: "newsfeed.milestone8Desc", impact: "medium" },
];

const IMPACT_COLORS = {
  high: "border-red-300 bg-red-50",
  medium: "border-amber-300 bg-amber-50",
  low: "border-blue-300 bg-blue-50",
};

const IMPACT_BADGES = {
  high: "bg-red-100 text-red-700",
  medium: "bg-amber-100 text-amber-700",
  low: "bg-blue-100 text-blue-700",
};

interface Entry {
  id: string;
  date: string;
  title: string;
  description: string;
  changeType: string;
  sourceUrl: string;
  sourceLabel: string;
  framework: { slug: string; name: string } | null;
  system: { slug: string; name: string; vendor: string } | null;
}

export function NewsfeedClient({ entries, tier = "anonymous", lang = "en" }: { entries: Entry[]; tier?: string; lang?: string }) {
  const locale = useLocale();
  const t = useT();
  const [tab, setTab] = useState<"news" | "calendar">("news");
  const [search, setSearch] = useState("");
  const [showAll, setShowAll] = useState(false);
  const isAnonymous = tier === "anonymous";

  const CHANGE_TYPE_LABELS: Record<string, { label: string; color: string }> = {
    update: { label: t("newsfeed.changeTypeUpdate"), color: "bg-blue-100 text-blue-700" },
    amendment: { label: t("newsfeed.changeTypeAmendment"), color: "bg-purple-100 text-purple-700" },
    jurisprudence: { label: t("newsfeed.changeTypeJurisprudence"), color: "bg-amber-100 text-amber-700" },
    new_version: { label: t("newsfeed.changeTypeNewVersion"), color: "bg-green-100 text-green-700" },
    incident: { label: t("newsfeed.changeTypeIncident"), color: "bg-red-100 text-red-700" },
    certification: { label: t("newsfeed.changeTypeCertification"), color: "bg-emerald-100 text-emerald-700" },
    correction: { label: t("newsfeed.changeTypeCorrection"), color: "bg-gray-100 text-gray-700" },
  };

  function formatDate(iso: string): string {
    return new Intl.DateTimeFormat(locale, { day: "numeric", month: "short", year: "numeric" }).format(new Date(iso));
  }

  // Recent = last 7 days
  const sevenDaysAgo = new Date();
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

  // Filter logic
  const filtered = entries.filter((e) => {
    // Time filter: recent by default, all if searching or showAll
    if (!showAll && !search) {
      if (new Date(e.date) < sevenDaysAgo) return false;
    }

    // Search filter
    if (search) {
      const q = search.toLowerCase();
      const searchable = [
        e.title,
        e.description,
        e.framework?.name || "",
        e.system?.name || "",
        e.system?.vendor || "",
        e.changeType,
      ].join(" ").toLowerCase();
      return searchable.includes(q);
    }

    return true;
  });

  const recentCount = entries.filter((e) => new Date(e.date) >= sevenDaysAgo).length;

  // Build milestones from data + dictionary
  const milestones: Milestone[] = MILESTONE_DATA.map((md) => ({
    date: md.date,
    title: t(md.titleKey),
    framework: md.framework,
    description: t(md.descKey),
    impact: md.impact,
  }));

  // Sort milestones by date, filter future only
  const now = new Date();
  const upcomingMilestones = milestones
    .filter((m) => new Date(m.date) >= now)
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

  const daysUntil = (date: string) => {
    const diff = new Date(date).getTime() - now.getTime();
    return Math.ceil(diff / (1000 * 60 * 60 * 24));
  };

  return (
    <>
      {/* Tab switcher */}
      <div className="flex gap-1 mb-8 rounded-lg bg-gray-100 p-1 w-fit">
        <button
          onClick={() => setTab("news")}
          className={`rounded-md px-4 py-2 text-sm font-medium transition ${
            tab === "news" ? "bg-white text-[#0d1b3e] shadow-sm" : "text-gray-500 hover:text-gray-700"
          }`}
        >
          {t("newsfeed.tabNews")}
        </button>
        <button
          onClick={() => setTab("calendar")}
          className={`rounded-md px-4 py-2 text-sm font-medium transition ${
            tab === "calendar" ? "bg-white text-[#0d1b3e] shadow-sm" : "text-gray-500 hover:text-gray-700"
          }`}
        >
          {t("newsfeed.tabCalendar")}
        </button>
      </div>

      {/* ─── Calendar Tab ─────────────────────────────── */}
      {tab === "calendar" && (
        <div className="space-y-4">
          <p className="text-xs text-gray-400 mb-2">
            {upcomingMilestones.length === 1
              ? t("newsfeed.upcomingMilestones").replace("{count}", String(upcomingMilestones.length))
              : t("newsfeed.upcomingMilestonesPlural").replace("{count}", String(upcomingMilestones.length))}
          </p>

          {upcomingMilestones.map((m, i) => {
            const days = daysUntil(m.date);
            return (
              <div
                key={`${m.date}-${i}`}
                className={`rounded-xl border-l-4 bg-white p-5 shadow-sm ${IMPACT_COLORS[m.impact]}`}
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex flex-wrap items-center gap-2 mb-1.5">
                      <span className="text-xs font-bold text-gray-900">
                        {new Intl.DateTimeFormat(locale, { day: "numeric", month: "long", year: "numeric" }).format(new Date(m.date))}
                      </span>
                      <span className={`rounded-full px-2 py-0.5 text-[10px] font-semibold ${IMPACT_BADGES[m.impact]}`}>
                        {t("newsfeed.impactLabel").replace("{impact}", m.impact)}
                      </span>
                      <span className="text-[10px] text-gray-400">{m.framework}</span>
                    </div>
                    <h3 className="font-semibold text-sm text-gray-900">{m.title}</h3>
                    <p className="mt-1 text-sm text-gray-600">{m.description}</p>
                  </div>
                  <div className="shrink-0 text-right">
                    <span className={`text-2xl font-bold ${days <= 30 ? "text-red-600" : days <= 90 ? "text-amber-600" : "text-gray-400"}`}>
                      {days}
                    </span>
                    <p className="text-[10px] text-gray-400">{t("newsfeed.days")}</p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* ─── News Tab ─────────────────────────────────── */}
      {tab === "news" && <>
      {/* Search + controls */}
      <div className="flex flex-col sm:flex-row gap-3 mb-8">
        <div className="relative flex-1">
          <svg className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
          </svg>
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder={t("newsfeed.searchPlaceholder")}
            className="w-full rounded-lg border border-gray-300 pl-10 pr-4 py-2.5 text-sm focus:border-[#003399] focus:outline-none focus:ring-1 focus:ring-[#003399]"
          />
        </div>
        {!search && (
          <button
            onClick={() => setShowAll(!showAll)}
            className={`rounded-lg px-4 py-2.5 text-sm font-medium transition shrink-0 ${
              showAll
                ? "bg-[#003399] text-white"
                : "bg-white text-gray-600 border border-gray-300 hover:bg-gray-50"
            }`}
          >
            {showAll ? t("newsfeed.showRecent") : t("newsfeed.showAll").replace("{count}", String(entries.length))}
          </button>
        )}
      </div>

      {/* Results count */}
      <p className="text-xs text-gray-400 mb-4">
        {search
          ? (filtered.length === 1
              ? t("newsfeed.resultsFor").replace("{count}", String(filtered.length)).replace("{query}", search)
              : t("newsfeed.resultsForPlural").replace("{count}", String(filtered.length)).replace("{query}", search))
          : showAll
          ? t("newsfeed.entriesCount").replace("{count}", String(filtered.length))
          : (recentCount === 1
              ? t("newsfeed.recentUpdates").replace("{count}", String(recentCount))
              : t("newsfeed.recentUpdatesPlural").replace("{count}", String(recentCount)))}
      </p>

      {/* Entries */}
      {filtered.length === 0 ? (
        <div className="text-center py-16">
          <p className="text-gray-500 text-sm">
            {search ? t("newsfeed.noMatchingNews") : t("newsfeed.noRecentNews")}
          </p>
          {!showAll && !search && (
            <button
              onClick={() => setShowAll(true)}
              className="mt-3 text-sm text-[#003399] underline hover:text-[#002277]"
            >
              {t("newsfeed.viewAllPastNews")}
            </button>
          )}
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map((entry) => {
            const typeInfo = CHANGE_TYPE_LABELS[entry.changeType] || CHANGE_TYPE_LABELS.update;
            return (
              <article
                key={entry.id}
                className="rounded-xl border border-gray-200 bg-white p-4 hover:shadow-sm transition-shadow"
              >
                <div className="flex items-start gap-3">
                  {/* Date */}
                  <div className="hidden sm:block text-xs text-gray-400 pt-0.5 w-20 shrink-0">
                    {formatDate(entry.date)}
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-2 mb-1">
                      <span className={`inline-block rounded-full px-2.5 py-0.5 text-[10px] font-semibold ${typeInfo.color}`}>
                        {typeInfo.label}
                      </span>
                      {entry.framework && (
                        <Link href={`/${locale}/regulations/${entry.framework.slug}`} className="text-[10px] font-medium text-[#003399] hover:underline">
                          {entry.framework.name}
                        </Link>
                      )}
                      {entry.system && (
                        <Link href={`/${locale}/systems/${entry.system.slug}`} className="text-[10px] font-medium text-[#003399] hover:underline">
                          {entry.system.vendor} {entry.system.name}
                        </Link>
                      )}
                      <span className="sm:hidden text-[10px] text-gray-400">{formatDate(entry.date)}</span>
                    </div>
                    <h3 className="font-medium text-gray-900 text-sm">{entry.title}</h3>
                    {isAnonymous ? (
                      <p className="mt-1 text-xs text-[#003399]">
                        <a href={`/${locale}/subscribe`} className="underline hover:text-[#002277]">{t("common.signIn")}</a> {t("newsfeed.signInToRead")}
                      </p>
                    ) : (
                      <p className="mt-1 text-sm text-gray-600 line-clamp-2">{entry.description}</p>
                    )}

                    {!isAnonymous && entry.sourceUrl && (
                      <a href={entry.sourceUrl} target="_blank" rel="noopener noreferrer" className="mt-1.5 inline-flex items-center gap-1 text-xs text-[#003399] hover:underline">
                        {entry.sourceLabel || t("common.source")}
                        <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 6H5.25A2.25 2.25 0 0 0 3 8.25v10.5A2.25 2.25 0 0 0 5.25 21h10.5A2.25 2.25 0 0 0 18 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25" />
                        </svg>
                      </a>
                    )}
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      )}

      {/* Pro upsell */}
      <div className="mt-12 rounded-xl border border-[#003399]/20 bg-gradient-to-r from-[#003399]/5 to-[#ffc107]/5 p-5 text-center">
        <p className="text-sm font-medium text-[#0d1b3e]">
          {t("newsfeed.proAlertTitle")}
        </p>
        <p className="mt-1 text-xs text-gray-500">
          {t("newsfeed.proAlertDesc")}
        </p>
        <Link href={`/${locale}/pricing`} className="mt-3 inline-block rounded-lg bg-[#003399] px-5 py-2 text-xs font-semibold text-white hover:bg-[#002277]">
          {t("newsfeed.upgradeProMonth")}
        </Link>
      </div>
      </>}
    </>
  );
}
