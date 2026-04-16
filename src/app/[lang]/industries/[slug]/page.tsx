/**
 * Industry Detail Page — Shows all AI systems in a specific industry.
 *
 * URL: /industries/[slug]  (e.g., /industries/financial-services)
 */

export const dynamic = "force-dynamic";

import { notFound } from "next/navigation";
import Link from "next/link";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { prisma } from "@/lib/db";
import { computeOverallScore, gradeColor } from "@/lib/scoring";
import { getDictionary, type Locale } from "@/lib/i18n";

interface PageProps {
  params: Promise<{ lang: string; slug: string }>;
}

export default async function IndustryDetailPage({ params }: PageProps) {
  const { lang, slug } = await params;
  const locale = lang as Locale;
  const dict = await getDictionary(locale);
  const t = (key: string) => key.split(".").reduce((o: Record<string, unknown>, k: string) => (o?.[k] as Record<string, unknown>) ?? {}, dict as unknown as Record<string, unknown>) as unknown as string;

  const industry = await prisma.industry.findUnique({
    where: { slug },
    include: {
      systems: {
        include: {
          scores: { include: { framework: true } },
          industries: true,
        },
      },
    },
  });

  if (!industry) notFound();

  return (
    <>
      <Header />
      <main className="flex-1">
        {/* Hero */}
        <section className="bg-gradient-to-br from-[#0d1b3e] to-[#003399] text-white">
          <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
            <nav className="mb-6 text-sm text-blue-200">
              <Link href={`/${lang}`} className="hover:text-white">{t("common.home")}</Link>
              <span className="mx-2">/</span>
              <Link href={`/${lang}/industries`} className="hover:text-white">{t("common.industries")}</Link>
              <span className="mx-2">/</span>
              <span className="text-white">{industry.name}</span>
            </nav>
            <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
              {industry.name}
            </h1>
            <p className="mt-4 text-lg text-blue-100">
              {t("browseIndustry.detailSubtitle").replace("{count}", String(industry.systems.length)).replace("{systems}", industry.systems.length === 1 ? t("browseIndustry.systemSingular") : t("browseIndustry.systemPlural"))}
            </p>
          </div>
        </section>

        {/* Systems list */}
        <section className="py-12">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            {industry.systems.length === 0 ? (
              <p className="text-center text-gray-500">{t("common.noSystemsYet")}</p>
            ) : (
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
                {industry.systems.map((system) => {
                  const overall = computeOverallScore(system.scores.map((s) => s.score));
                  return (
                    <Link
                      key={system.id}
                      href={`/${lang}/systems/${system.slug}`}
                      className="group flex flex-col rounded-xl border border-gray-200 bg-white p-6 shadow-sm transition hover:border-[#003399]/30 hover:shadow-md"
                    >
                      <div className="flex items-start justify-between">
                        <div>
                          <p className="text-xs font-semibold uppercase tracking-wider text-[#003399]">{system.vendor}</p>
                          <h3 className="mt-1 text-lg font-bold text-gray-900">{system.name}</h3>
                          <p className="text-xs text-gray-500">{system.type}</p>
                        </div>
                        <span className={`inline-flex h-10 w-10 items-center justify-center rounded-full text-sm font-bold text-white ${gradeColor(overall)}`}>
                          {overall}
                        </span>
                      </div>
                      <p className="mt-3 flex-1 text-sm text-gray-600 line-clamp-2">{system.description}</p>
                      <div className="mt-4 flex gap-2">
                        {system.scores.slice(0, 4).map((s) => (
                          <div key={s.id} className="flex flex-col items-center gap-0.5">
                            <span className={`inline-flex h-7 w-7 items-center justify-center rounded-full text-[10px] font-bold text-white ${gradeColor(s.score)}`}>
                              {s.score}
                            </span>
                            <span className="text-[9px] text-gray-400">{s.framework.name}</span>
                          </div>
                        ))}
                      </div>
                    </Link>
                  );
                })}
              </div>
            )}
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
