/**
 * Regulations Listing Page — Shows all published regulatory frameworks from the DB.
 *
 * URL: /regulations
 * Each card links to /regulations/[slug] for the full documentation page.
 */

export const dynamic = "force-dynamic";

import type { Metadata } from "next";
import Link from "next/link";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { getPublishedFrameworks } from "@/lib/queries";
import { getPageMetadata, getDictionary, type Locale } from "@/lib/i18n";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string }>;
}): Promise<Metadata> {
  const { lang } = await params;
  return getPageMetadata(lang as Locale, "regulations");
}

const BADGE_COLORS: Record<string, string> = {
  EU: "bg-[#003399]/10 text-[#003399]",
  Sector: "bg-emerald-100 text-emerald-700",
  National: "bg-amber-100 text-amber-700",
};

export default async function RegulationsPage({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  const locale = lang as Locale;
  const [frameworks, dict] = await Promise.all([
    getPublishedFrameworks(),
    getDictionary(locale),
  ]);
  const t = (key: string) => key.split(".").reduce((o: Record<string, unknown>, k: string) => (o?.[k] as Record<string, unknown>) ?? {}, dict as unknown as Record<string, unknown>) as unknown as string;

  return (
    <>
      <Header />
      <main className="flex-1">
        {/* Hero */}
        <section className="bg-gradient-to-br from-[#0d1b3e] to-[#003399] text-white">
          <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 lg:py-20">
            <div className="max-w-3xl">
              <p className="text-sm font-semibold uppercase tracking-wide text-[#ffc107]">
                {t("frameworks.title")}
              </p>
              <h1 className="mt-3 text-4xl font-bold tracking-tight sm:text-5xl">
                {t("frameworks.euCompliance")}
              </h1>
              <p className="mt-4 text-lg leading-relaxed text-blue-100">
                {t("frameworks.heroSubtitle").replace("{count}", String(frameworks.length))}
              </p>
            </div>
          </div>
        </section>

        {/* Framework cards */}
        <section className="py-16">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {frameworks.map((fw) => (
                <Link
                  key={fw.id}
                  href={`/${lang}/regulations/${fw.slug}`}
                  className="group flex flex-col rounded-xl border border-gray-200 bg-white p-6 shadow-sm transition hover:border-[#003399]/30 hover:shadow-md"
                >
                  <span className={`inline-block w-fit rounded-full px-3 py-1 text-xs font-semibold ${BADGE_COLORS[fw.badgeType] || BADGE_COLORS.EU}`}>
                    {fw.badgeType}
                  </span>
                  <h2 className="mt-4 text-lg font-bold text-gray-900">{fw.name}</h2>
                  <p className="mt-2 flex-1 text-sm leading-relaxed text-gray-600">
                    {fw.description}
                  </p>
                  <div className="mt-4 flex items-center gap-4 text-xs text-gray-400">
                    <span>{fw.criteriaCount} {t("common.criteria")}</span>
                    <span>{t("common.effective")}: {fw.effectiveDate}</span>
                  </div>
                  <p className="mt-4 text-sm font-semibold text-[#003399] group-hover:underline">
                    {t("frameworks.readDocs")} &rarr;
                  </p>
                </Link>
              ))}
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
