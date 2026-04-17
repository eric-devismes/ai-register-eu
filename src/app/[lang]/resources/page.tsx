import type { Metadata } from "next";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { getPageMetadata, getDictionary, type Locale } from "@/lib/i18n";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string }>;
}): Promise<Metadata> {
  const { lang } = await params;
  return getPageMetadata(lang as Locale, "resources");
}

export default function ResourcesPage({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  return <ResourcesContent params={params} />;
}

async function ResourcesContent({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  const dict = await getDictionary(lang as Locale);
  const t = (key: string) =>
    key
      .split(".")
      .reduce(
        (o: Record<string, unknown>, k: string) =>
          (o?.[k] as Record<string, unknown>) ?? {},
        dict as unknown as Record<string, unknown>
      ) as unknown as string;

  const officialSources = [
    { titleKey: "resources.sourceAiActTitle", descKey: "resources.sourceAiActDesc", badgeKey: "resources.sourceAiActBadge", url: "https://eur-lex.europa.eu/eli/reg/2024/1689/oj" },
    { titleKey: "resources.sourceAiOfficeTitle", descKey: "resources.sourceAiOfficeDesc", badgeKey: "resources.sourceAiOfficeBadge", url: "https://digital-strategy.ec.europa.eu/en/policies/european-approach-artificial-intelligence" },
    { titleKey: "resources.sourceGdprTitle", descKey: "resources.sourceGdprDesc", badgeKey: "resources.sourceGdprBadge", url: "https://eur-lex.europa.eu/eli/reg/2016/679/oj" },
    { titleKey: "resources.sourceEnisaTitle", descKey: "resources.sourceEnisaDesc", badgeKey: "resources.sourceEnisaBadge", url: "https://www.enisa.europa.eu/topics/artificial-intelligence" },
    { titleKey: "resources.sourceDoraTitle", descKey: "resources.sourceDoraDesc", badgeKey: "resources.sourceDoraBadge", url: "https://eur-lex.europa.eu/eli/reg/2022/2554/oj" },
    { titleKey: "resources.sourceHlegTitle", descKey: "resources.sourceHlegDesc", badgeKey: "resources.sourceHlegBadge", url: "https://digital-strategy.ec.europa.eu/en/policies/expert-group-ai" },
    { titleKey: "resources.sourceOecdTitle", descKey: "resources.sourceOecdDesc", badgeKey: "resources.sourceOecdBadge", url: "https://oecd.ai/en/" },
    { titleKey: "resources.sourceNis2Title", descKey: "resources.sourceNis2Desc", badgeKey: "resources.sourceNis2Badge", url: "https://eur-lex.europa.eu/eli/dir/2022/2555/oj" },
  ];

  const BADGE_COLORS: Record<string, string> = {
    "EU AI Act": "bg-blue-100 text-blue-700",
    "EU Commission": "bg-blue-100 text-blue-700",
    "GDPR": "bg-purple-100 text-purple-700",
    "Security": "bg-red-100 text-red-700",
    "Financial": "bg-amber-100 text-amber-700",
    "Ethics": "bg-green-100 text-green-700",
    "International": "bg-gray-100 text-gray-700",
  };

  return (
    <>
      <Header />
      <main className="flex-1">
        {/* Hero */}
        <section className="bg-gradient-to-br from-[#0d1b3e] to-[#003399] text-white">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16 lg:py-24">
            <div className="max-w-3xl">
              <p className="text-sm font-semibold text-[#ffc107] tracking-wide uppercase">
                {t("resources.badge")}
              </p>
              <h1 className="mt-3 text-4xl font-bold tracking-tight sm:text-5xl">
                {t("resources.heroTitle")}
              </h1>
              <p className="mt-4 text-lg text-blue-100 leading-relaxed">
                {t("resources.heroSubtitle")}
              </p>
            </div>
          </div>
        </section>

        {/* Official sources */}
        <section className="py-16 lg:py-24">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="mx-auto max-w-2xl text-center">
              <h2 className="text-2xl font-bold text-[#0d1b3e] sm:text-3xl">
                {t("resources.officialTitle")}
              </h2>
              <p className="mt-4 text-gray-600 leading-relaxed">
                {t("resources.officialSubtitle")}
              </p>
            </div>

            <div className="mt-12 grid gap-6 sm:grid-cols-2">
              {officialSources.map((source) => {
                const badge = t(source.badgeKey);
                return (
                  <a
                    key={source.titleKey}
                    href={source.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group flex flex-col rounded-xl border border-gray-200 bg-white p-6 shadow-sm transition hover:border-[#003399]/30 hover:shadow-md"
                  >
                    <div className="flex items-start justify-between">
                      <h3 className="text-lg font-semibold text-[#0d1b3e] group-hover:text-[#003399] transition-colors">
                        {t(source.titleKey)}
                      </h3>
                      <span className={`shrink-0 rounded-full px-2.5 py-0.5 text-xs font-medium ${BADGE_COLORS[badge] || "bg-gray-100 text-gray-700"}`}>
                        {badge}
                      </span>
                    </div>
                    <p className="mt-2 flex-1 text-sm text-gray-600 leading-relaxed">
                      {t(source.descKey)}
                    </p>
                    <span className="mt-4 inline-flex items-center text-sm font-semibold text-[#003399]">
                      {t("resources.visitSource")}
                      <svg className="ml-1 h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 6H5.25A2.25 2.25 0 0 0 3 8.25v10.5A2.25 2.25 0 0 0 5.25 21h10.5A2.25 2.25 0 0 0 18 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25" />
                      </svg>
                    </span>
                  </a>
                );
              })}
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
