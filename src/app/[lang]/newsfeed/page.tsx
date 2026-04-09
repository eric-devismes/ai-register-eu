/**
 * Newsfeed Page — Public regulatory & AI compliance news.
 *
 * URL: /newsfeed
 *
 * Shows all changelog entries across frameworks and AI systems.
 * General feed — same for all users (free and paid).
 * Pro users get personalized alerts via their dashboard instead.
 */

export const dynamic = "force-dynamic";

import type { Metadata } from "next";
import Link from "next/link";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { getRecentChangelogs } from "@/lib/queries";

export const metadata: Metadata = {
  title: "AI Compliance Newsfeed — AI Compass EU",
  description:
    "Latest regulatory updates, enforcement actions, and compliance changes affecting AI systems in Europe. EU AI Act, GDPR, DORA, and more.",
};

const CHANGE_TYPE_LABELS: Record<string, { label: string; color: string }> = {
  update: { label: "Update", color: "bg-blue-100 text-blue-700" },
  amendment: { label: "Amendment", color: "bg-purple-100 text-purple-700" },
  jurisprudence: { label: "Ruling", color: "bg-amber-100 text-amber-700" },
  new_version: { label: "New Version", color: "bg-green-100 text-green-700" },
  incident: { label: "Incident", color: "bg-red-100 text-red-700" },
  certification: { label: "Certification", color: "bg-emerald-100 text-emerald-700" },
  correction: { label: "Correction", color: "bg-gray-100 text-gray-700" },
};

function formatDate(date: Date): string {
  return new Intl.DateTimeFormat("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(new Date(date));
}

export default async function NewsfeedPage() {
  const entries = await getRecentChangelogs(100);

  // Group by month for visual structure
  const grouped = new Map<string, typeof entries>();
  for (const entry of entries) {
    const monthKey = new Intl.DateTimeFormat("en-GB", {
      month: "long",
      year: "numeric",
    }).format(new Date(entry.date));
    if (!grouped.has(monthKey)) grouped.set(monthKey, []);
    grouped.get(monthKey)!.push(entry);
  }

  return (
    <>
      <Header />
      <main className="flex-1">
        {/* Hero */}
        <section className="bg-gradient-to-br from-[#0d1b3e] to-[#003399] text-white">
          <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 lg:py-20">
            <div className="max-w-3xl">
              <p className="text-sm font-semibold uppercase tracking-wide text-[#ffc107]">
                Newsfeed
              </p>
              <h1 className="mt-3 text-4xl font-bold tracking-tight sm:text-5xl">
                AI Compliance News
              </h1>
              <p className="mt-4 text-lg leading-relaxed text-blue-100">
                Regulatory updates, enforcement actions, vendor changes, and compliance
                developments affecting AI in Europe. Updated continuously.
              </p>
            </div>
          </div>
        </section>

        {/* Feed */}
        <section className="py-12">
          <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
            {entries.length === 0 ? (
              <p className="text-center text-gray-500 py-16">No news entries yet.</p>
            ) : (
              <div className="space-y-12">
                {Array.from(grouped.entries()).map(([month, items]) => (
                  <div key={month}>
                    <h2 className="text-lg font-semibold text-[#0d1b3e] border-b border-gray-200 pb-2 mb-6">
                      {month}
                    </h2>
                    <div className="space-y-4">
                      {items.map((entry) => {
                        const typeInfo =
                          CHANGE_TYPE_LABELS[entry.changeType] || CHANGE_TYPE_LABELS.update;
                        return (
                          <article
                            key={entry.id}
                            className="rounded-xl border border-gray-200 bg-white p-5 hover:shadow-sm transition-shadow"
                          >
                            <div className="flex items-start gap-4">
                              {/* Date column */}
                              <div className="hidden sm:block text-xs text-gray-400 pt-0.5 w-20 shrink-0">
                                {formatDate(entry.date)}
                              </div>

                              {/* Content */}
                              <div className="flex-1 min-w-0">
                                <div className="flex flex-wrap items-center gap-2 mb-1.5">
                                  <span
                                    className={`inline-block rounded-full px-2.5 py-0.5 text-[10px] font-semibold ${typeInfo.color}`}
                                  >
                                    {typeInfo.label}
                                  </span>
                                  {entry.framework && (
                                    <Link
                                      href={`/en/regulations/${entry.framework.slug}`}
                                      className="text-[10px] font-medium text-[#003399] hover:underline"
                                    >
                                      {entry.framework.name}
                                    </Link>
                                  )}
                                  {entry.system && (
                                    <Link
                                      href={`/en/systems/${entry.system.slug}`}
                                      className="text-[10px] font-medium text-[#003399] hover:underline"
                                    >
                                      {entry.system.vendor} {entry.system.name}
                                    </Link>
                                  )}
                                  <span className="sm:hidden text-[10px] text-gray-400">
                                    {formatDate(entry.date)}
                                  </span>
                                </div>

                                <h3 className="font-medium text-gray-900 text-sm">
                                  {entry.title}
                                </h3>
                                <p className="mt-1 text-sm text-gray-600 line-clamp-2">
                                  {entry.description}
                                </p>

                                {entry.sourceUrl && (
                                  <a
                                    href={entry.sourceUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="mt-2 inline-flex items-center gap-1 text-xs text-[#003399] hover:underline"
                                  >
                                    {entry.sourceLabel || "Source"}
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
                  </div>
                ))}
              </div>
            )}

            {/* Pro upsell — personalized alerts */}
            <div className="mt-16 rounded-xl border border-[#003399]/20 bg-gradient-to-r from-[#003399]/5 to-[#ffc107]/5 p-6 text-center">
              <p className="text-sm font-medium text-[#0d1b3e]">
                Want alerts tailored to your AI stack?
              </p>
              <p className="mt-1 text-xs text-gray-500">
                Pro subscribers get a personalized dashboard and real-time alerts for the AI systems they use.
              </p>
              <Link
                href="/en/pricing"
                className="mt-4 inline-block rounded-lg bg-[#003399] px-6 py-2.5 text-sm font-semibold text-white hover:bg-[#002277] transition-colors"
              >
                Upgrade to Pro &mdash; &euro;19/month
              </Link>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
