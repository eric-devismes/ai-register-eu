/**
 * Newsfeed Page — Public regulatory & AI compliance news.
 *
 * URL: /newsfeed
 *
 * Shows recent news by default (last 7 days).
 * Search bar to find past news by keyword.
 */

export const dynamic = "force-dynamic";

import type { Metadata } from "next";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { getRecentChangelogs } from "@/lib/queries";
import { getEffectiveTier } from "@/lib/tier-access";
import { NewsfeedClient } from "./NewsfeedClient";

export const metadata: Metadata = {
  title: "AI Compliance Newsfeed — AI Compass EU",
  description:
    "Latest regulatory updates, enforcement actions, and compliance changes affecting AI systems in Europe. EU AI Act, GDPR, DORA, and more.",
};

export default async function NewsfeedPage() {
  const [entries, tier] = await Promise.all([
    getRecentChangelogs(200),
    getEffectiveTier(),
  ]);

  const plainEntries = entries.map((e) => ({
    id: e.id,
    date: e.date.toISOString(),
    title: e.title,
    description: e.description,
    changeType: e.changeType,
    sourceUrl: e.sourceUrl,
    sourceLabel: e.sourceLabel,
    framework: e.framework ? { slug: e.framework.slug, name: e.framework.name } : null,
    system: e.system ? { slug: e.system.slug, name: e.system.name, vendor: e.system.vendor } : null,
  }));

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
                Regulatory updates, enforcement actions, and compliance
                developments affecting AI in Europe.
              </p>
            </div>
          </div>
        </section>

        {/* Feed */}
        <section className="py-12">
          <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
            <NewsfeedClient entries={plainEntries} tier={tier} />
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
