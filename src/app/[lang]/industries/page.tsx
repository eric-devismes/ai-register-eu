/**
 * Industries Listing Page — Shows all industries from the DB with real system counts.
 *
 * URL: /industries
 * Each card links to /industries/[slug] to see systems in that industry.
 */

export const dynamic = "force-dynamic";

import type { Metadata } from "next";
import Link from "next/link";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { getIndustriesWithCounts } from "@/lib/queries";
import { getPageMetadata, getDictionary, type Locale } from "@/lib/i18n";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string }>;
}): Promise<Metadata> {
  const { lang } = await params;
  return getPageMetadata(lang as Locale, "industries");
}

export default async function IndustriesPage({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  const locale = lang as Locale;
  const [industries, dict] = await Promise.all([
    getIndustriesWithCounts(),
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
                {t("common.industries")}
              </p>
              <h1 className="mt-3 text-4xl font-bold tracking-tight sm:text-5xl">
                {t("browseIndustry.heroTitle")}
              </h1>
              <p className="mt-4 text-lg leading-relaxed text-blue-100">
                {t("browseIndustry.heroSubtitle").replace("{count}", String(industries.length))}
              </p>
            </div>
          </div>
        </section>

        {/* Industry cards */}
        <section className="py-16">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-2 gap-6 sm:grid-cols-3 lg:grid-cols-4">
              {industries.map((ind) => (
                <Link
                  key={ind.id}
                  href={`/${lang}/industries/${ind.slug}`}
                  className="group flex flex-col items-center rounded-xl border border-gray-200 bg-white p-8 text-center shadow-sm transition hover:border-[#003399]/30 hover:shadow-md"
                >
                  <span className={`inline-flex h-16 w-16 items-center justify-center rounded-2xl text-2xl font-bold ${ind.colorClass}`}>
                    {ind._count.systems}
                  </span>
                  <h2 className="mt-4 text-base font-semibold text-gray-900">
                    {ind.name}
                  </h2>
                  <p className="mt-1 text-sm text-gray-500">
                    {ind._count.systems} {ind._count.systems === 1 ? t("browseIndustry.systemAssessed") : t("browseIndustry.systemsAssessedPlural")}
                  </p>
                  <p className="mt-3 text-xs font-semibold text-[#003399] opacity-0 transition group-hover:opacity-100">
                    {t("common.viewSystems")} &rarr;
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
