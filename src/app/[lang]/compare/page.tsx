/**
 * AI System Comparison Tool
 *
 * URL: /compare
 *
 * Available to all users:
 * - Free: can compare, but results limited to free-tier systems (5 most popular)
 * - Pro/Enterprise: full access to all systems
 * - Admin owner: full access (bypasses tier)
 */

export const dynamic = "force-dynamic";

import type { Metadata } from "next";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { getEffectiveTier } from "@/lib/tier-access";
import { getPageMetadata, type Locale, isValidLocale } from "@/lib/i18n";
import { CompareClient } from "./CompareClient";

interface PageProps {
  params: Promise<{ lang: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { lang } = await params;
  const locale = isValidLocale(lang) ? lang : "en";
  return getPageMetadata(locale as Locale, "compare");
}

export default async function ComparePage({ params }: PageProps) {
  const { lang } = await params;
  const locale = isValidLocale(lang) ? lang : "en";
  const tier = await getEffectiveTier();
  const hasFullAccess = tier === "pro" || tier === "enterprise";
  const { getDictionary } = await import("@/lib/i18n");
  const dict = await getDictionary(locale as Locale);
  const t = (key: string) => {
    const [section, ...rest] = key.split(".");
    const field = rest.join(".");
    return dict?.[section]?.[field] || key;
  };

  return (
    <>
      <Header />
      <main className="flex-1 bg-gray-50 min-h-screen">
        {/* Hero */}
        <section className="bg-gradient-to-br from-[#0d1b3e] to-[#003399] text-white">
          <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
            <div className="max-w-3xl">
              <div className="mb-3 inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1 text-xs font-medium uppercase tracking-wider text-blue-200">
                {t("compare.badge")}
              </div>
              <h1 className="text-3xl font-bold tracking-tight sm:text-4xl font-serif">
                {t("compare.heroTitle")}
              </h1>
              <p className="mt-4 text-lg text-blue-100 max-w-2xl">
                {t("compare.heroSubtitle")}
              </p>
              {!hasFullAccess && (
                <p className="mt-2 text-sm text-blue-200/70">
                  {t("compare.freeNotice")}{" "}
                  <a href={`/${locale}/pricing`} className="underline hover:text-white">{t("compare.freeUpgradeLink")}</a>{" "}
                  {t("compare.freeUpgradeSuffix")}
                </p>
              )}
            </div>
          </div>
        </section>

        {/* Comparison tool — available to all tiers */}
        <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
          <CompareClient tier={tier} />
        </div>
      </main>
      <Footer />
    </>
  );
}
