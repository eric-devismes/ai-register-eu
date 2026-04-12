/**
 * Pro Dashboard — Personalized compliance intelligence.
 *
 * URL: /dashboard
 *
 * Pro/Enterprise feature. Shows:
 *   - Compliance overview for the user's selected AI systems
 *   - Recent changes affecting their stack
 *   - Quick access to comparison tool and exports
 *
 * Free users are redirected to the pricing page.
 */

export const dynamic = "force-dynamic";

import type { Metadata } from "next";
import Link from "next/link";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { getSubscriber } from "@/lib/subscriber-auth";
import { getRecentChangelogs } from "@/lib/queries";
import { prisma } from "@/lib/db";
import { computeOverallScore, gradeColor } from "@/lib/scoring";
import { getEffectiveTier } from "@/lib/tier-access";
import { redirect } from "next/navigation";

export const metadata: Metadata = {
  title: "My Dashboard",
  description: "Your personalized AI compliance dashboard. Track compliance scores, regulatory changes, and alerts for your AI stack.",
};

export default async function DashboardPage() {
  const [subscriber, tier] = await Promise.all([
    getSubscriber(),
    getEffectiveTier(),
  ]);

  if (tier !== "pro" && tier !== "enterprise") {
    redirect("/en/pricing");
  }

  // Get the user's followed AI systems with scores
  const followedSystems = subscriber ? await prisma.aISystem.findMany({
    where: {
      subscribers: { some: { id: subscriber.id } },
    },
    include: {
      scores: { include: { framework: { select: { name: true, slug: true } } } },
      industries: { select: { name: true } },
    },
    orderBy: { name: "asc" },
  }) : [];

  // Get recent changelog entries for the user's systems
  const recentChanges = await getRecentChangelogs(100);
  const followedSlugs = new Set(followedSystems.map((s) => s.slug));
  const followedFrameworkSlugs = new Set(
    (subscriber?.frameworks || []).map((f: { slug: string }) => f.slug)
  );

  const relevantChanges = recentChanges.filter((c) => {
    if (c.system && followedSlugs.has(c.system.slug)) return true;
    if (c.framework && followedFrameworkSlugs.has(c.framework.slug)) return true;
    return false;
  }).slice(0, 10);

  // All recent changes (for general awareness)
  const generalChanges = recentChanges.slice(0, 5);

  return (
    <>
      <Header />
      <main className="flex-1 bg-gray-50">
        {/* Hero */}
        <section className="bg-gradient-to-br from-[#0d1b3e] to-[#003399] text-white">
          <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold text-[#ffc107] uppercase tracking-wide">
                  Pro Dashboard
                </p>
                <h1 className="mt-1 text-2xl font-bold tracking-tight sm:text-3xl">
                  Your AI Compliance Overview
                </h1>
              </div>
              <Link
                href="/en/compare"
                className="hidden sm:inline-flex rounded-lg bg-white/10 px-4 py-2 text-sm font-medium text-white hover:bg-white/20 transition-colors"
              >
                Compare Systems
              </Link>
            </div>
          </div>
        </section>

        <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
          {followedSystems.length === 0 ? (
            /* Empty state — no systems followed yet */
            <div className="rounded-2xl border-2 border-dashed border-gray-300 bg-white p-12 text-center">
              <svg className="mx-auto h-12 w-12 text-gray-300" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v6m3-3H9m12 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
              </svg>
              <h2 className="mt-4 text-lg font-semibold text-gray-700">
                Set Up Your Dashboard
              </h2>
              <p className="mt-2 text-sm text-gray-500 max-w-md mx-auto">
                Follow the AI systems your organisation uses to see their compliance scores,
                recent changes, and alerts — all in one place.
              </p>
              <Link
                href="/en/database"
                className="mt-6 inline-block rounded-lg bg-[#003399] px-6 py-2.5 text-sm font-semibold text-white hover:bg-[#002277] transition-colors"
              >
                Browse AI Systems
              </Link>
            </div>
          ) : (
            <div className="grid gap-8 lg:grid-cols-3">
              {/* Main content — 2 columns */}
              <div className="lg:col-span-2 space-y-8">
                {/* Systems grid */}
                <div>
                  <h2 className="text-lg font-semibold text-[#0d1b3e] mb-4">Your AI Systems</h2>
                  <div className="grid gap-4 sm:grid-cols-2">
                    {followedSystems.map((system) => {
                      const overall = computeOverallScore(system.scores.map((sc) => sc.score));
                      return (
                        <Link
                          key={system.id}
                          href={`/en/systems/${system.slug}`}
                          className="rounded-xl border border-gray-200 bg-white p-5 hover:shadow-md hover:border-[#003399]/30 transition-all group"
                        >
                          <div className="flex items-start justify-between">
                            <div>
                              <p className="font-medium text-gray-900 group-hover:text-[#003399]">
                                {system.name}
                              </p>
                              <p className="text-xs text-gray-500">{system.vendor}</p>
                            </div>
                            <span className={`inline-flex h-9 w-9 items-center justify-center rounded-full text-sm font-bold text-white ${gradeColor(overall)}`}>
                              {overall}
                            </span>
                          </div>
                          <div className="mt-3 flex gap-2">
                            {system.scores.slice(0, 4).map((sc) => (
                              <div key={sc.framework.slug} className="flex flex-col items-center gap-0.5">
                                <span className={`inline-flex h-5 w-5 items-center justify-center rounded-full text-[9px] font-bold text-white ${gradeColor(sc.score)}`}>
                                  {sc.score}
                                </span>
                                <span className="text-[8px] text-gray-400 max-w-[40px] truncate">
                                  {sc.framework.name}
                                </span>
                              </div>
                            ))}
                          </div>
                        </Link>
                      );
                    })}
                  </div>
                  <Link
                    href="/en/database"
                    className="mt-3 inline-flex items-center gap-1 text-xs font-medium text-[#003399] hover:underline"
                  >
                    + Add more systems
                  </Link>
                </div>

                {/* Changes affecting your stack */}
                {relevantChanges.length > 0 && (
                  <div>
                    <h2 className="text-lg font-semibold text-[#0d1b3e] mb-4">
                      Changes Affecting Your Stack
                    </h2>
                    <div className="space-y-3">
                      {relevantChanges.map((change) => (
                        <div key={change.id} className="rounded-lg border border-gray-200 bg-white p-4">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="rounded-full bg-blue-100 px-2 py-0.5 text-[10px] font-semibold text-blue-700">
                              {change.changeType}
                            </span>
                            {change.system && (
                              <span className="text-[10px] text-[#003399] font-medium">
                                {change.system.name}
                              </span>
                            )}
                            {change.framework && (
                              <span className="text-[10px] text-[#003399] font-medium">
                                {change.framework.name}
                              </span>
                            )}
                            <span className="text-[10px] text-gray-400">
                              {new Date(change.date).toLocaleDateString("en-GB", { day: "numeric", month: "short" })}
                            </span>
                          </div>
                          <p className="text-sm font-medium text-gray-900">{change.title}</p>
                          <p className="mt-0.5 text-xs text-gray-500 line-clamp-1">{change.description}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Sidebar */}
              <div className="space-y-6">
                {/* Quick actions */}
                <div className="rounded-xl border border-gray-200 bg-white p-5">
                  <h3 className="text-sm font-semibold text-[#0d1b3e] mb-3">Quick Actions</h3>
                  <div className="space-y-2">
                    <Link
                      href="/en/compare"
                      className="flex items-center gap-3 rounded-lg p-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                    >
                      <svg className="h-5 w-5 text-[#003399]" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6A2.25 2.25 0 0 1 6 3.75h2.25A2.25 2.25 0 0 1 10.5 6v2.25a2.25 2.25 0 0 1-2.25 2.25H6a2.25 2.25 0 0 1-2.25-2.25V6ZM3.75 15.75A2.25 2.25 0 0 1 6 13.5h2.25a2.25 2.25 0 0 1 2.25 2.25V18a2.25 2.25 0 0 1-2.25 2.25H6A2.25 2.25 0 0 1 3.75 18v-2.25ZM13.5 6a2.25 2.25 0 0 1 2.25-2.25H18A2.25 2.25 0 0 1 20.25 6v2.25A2.25 2.25 0 0 1 18 10.5h-2.25a2.25 2.25 0 0 1-2.25-2.25V6ZM13.5 15.75a2.25 2.25 0 0 1 2.25-2.25H18a2.25 2.25 0 0 1 2.25 2.25V18A2.25 2.25 0 0 1 18 20.25h-2.25A2.25 2.25 0 0 1 13.5 18v-2.25Z" />
                      </svg>
                      Compare AI Systems
                    </Link>
                    <Link
                      href="/en/database"
                      className="flex items-center gap-3 rounded-lg p-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                    >
                      <svg className="h-5 w-5 text-[#003399]" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
                      </svg>
                      Browse All Systems
                    </Link>
                    <Link
                      href="/en/reports"
                      className="flex items-center gap-3 rounded-lg p-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                    >
                      <svg className="h-5 w-5 text-[#003399]" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z" />
                      </svg>
                      Reports &amp; White Papers
                    </Link>
                  </div>
                </div>

                {/* Latest general news */}
                <div className="rounded-xl border border-gray-200 bg-white p-5">
                  <h3 className="text-sm font-semibold text-[#0d1b3e] mb-3">Latest News</h3>
                  <div className="space-y-3">
                    {generalChanges.map((change) => (
                      <div key={change.id} className="border-b border-gray-100 pb-2 last:border-0 last:pb-0">
                        <p className="text-xs font-medium text-gray-800 line-clamp-2">{change.title}</p>
                        <p className="text-[10px] text-gray-400 mt-0.5">
                          {new Date(change.date).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })}
                        </p>
                      </div>
                    ))}
                  </div>
                  <Link
                    href="/en/newsfeed"
                    className="mt-3 inline-flex text-xs font-medium text-[#003399] hover:underline"
                  >
                    View all news
                  </Link>
                </div>

                {/* Subscription info */}
                <div className="rounded-xl border border-[#003399]/20 bg-[#003399]/5 p-5">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="rounded-full bg-[#003399] px-2.5 py-0.5 text-[10px] font-semibold text-white uppercase">
                      {tier}
                    </span>
                  </div>
                  <p className="text-xs text-gray-600">
                    You have full access to all AI systems, comparison tools, exports,
                    and personalized alerts.
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}
