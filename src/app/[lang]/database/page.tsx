/**
 * AI Database Page — Searchable listing of all AI systems from the database.
 *
 * URL: /database
 *
 * Tier gating:
 *   - Free: sees all systems in the grid but only free-tier systems link to full assessments.
 *     Pro-only systems show a lock icon and upgrade prompt.
 *   - Pro / Enterprise: full access to all systems and assessments.
 */

export const dynamic = "force-dynamic";

import type { Metadata } from "next";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { getAllSystems, getPublishedFrameworks } from "@/lib/queries";
import { computeOverallScore } from "@/lib/scoring";
import { FREE_TIER_SYSTEM_SLUGS, getEffectiveTier, type SubscriptionTier } from "@/lib/tier-access";
import { DatabaseGrid } from "./DatabaseGrid";
import { getPageMetadata, type Locale } from "@/lib/i18n";
import { getTranslatedBatch } from "@/lib/get-translation";
import { getDictionary } from "@/lib/i18n";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string }>;
}): Promise<Metadata> {
  const { lang } = await params;
  return getPageMetadata(lang as Locale, "database");
}

export default async function DatabasePage({ params, searchParams }: { params: Promise<{ lang: string }>; searchParams: Promise<{ q?: string }> }) {
  const [{ lang }, { q: searchQuery }] = await Promise.all([params, searchParams]);
  const locale = lang as Locale;
  const [systems, tier, dict] = await Promise.all([
    getAllSystems(),
    getEffectiveTier(),
    getDictionary(locale),
  ]);
  const freeSlugs = FREE_TIER_SYSTEM_SLUGS as readonly string[];
  const t = (key: string) => key.split(".").reduce((o: Record<string, unknown>, k: string) => (o?.[k] as Record<string, unknown>) ?? {}, dict as unknown as Record<string, unknown>) as unknown as string;

  // Translate system descriptions
  const systemTranslations = await getTranslatedBatch(
    "system",
    systems.map((s) => s.id),
    locale,
    ["description"],
  );

  // Convert to plain objects for client component
  const plainSystems = systems.map((s) => {
    const tr = systemTranslations.get(s.id) || {};
    return {
      id: s.id,
      slug: s.slug,
      vendor: s.vendor,
      name: s.name,
      type: s.type,
      risk: s.risk,
      description: tr.description || s.description,
      category: s.category,
      industries: s.industries.map((i) => i.name),
      scores: s.scores.map((sc) => ({
        frameworkName: sc.framework.name,
        score: sc.score,
      })),
      overallScore: computeOverallScore(s.scores.map((sc) => sc.score)),
      updatedAt: s.updatedAt.toISOString().split("T")[0],
      isFree: freeSlugs.includes(s.slug),
    };
  });

  return (
    <>
      <Header />
      <main className="flex-1">
        {/* Hero */}
        <section className="bg-gradient-to-br from-[#0d1b3e] to-[#003399] text-white">
          <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 lg:py-20">
            <div className="max-w-3xl">
              <p className="text-sm font-semibold uppercase tracking-wide text-[#ffc107]">
                {t("database.heroLabel")}
              </p>
              <h1 className="mt-3 text-4xl font-bold tracking-tight sm:text-5xl">
                {t("database.heroTitle")}
              </h1>
              <p className="mt-4 text-lg leading-relaxed text-blue-100">
                {t("database.heroSubtitle").replace("{count}", String(plainSystems.length))}
              </p>
            </div>
          </div>
        </section>

        {/* Database grid */}
        <section className="py-12">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <DatabaseGrid systems={plainSystems} initialSearch={searchQuery || ""} tier={tier} />
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
