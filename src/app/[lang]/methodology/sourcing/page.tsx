import type { Metadata } from "next";
import Link from "next/link";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { getPageMetadata, getDictionary, type Locale } from "@/lib/i18n";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string }>;
}): Promise<Metadata> {
  const { lang } = await params;
  return getPageMetadata(lang as Locale, "sourcing");
}

export default function SourcingMethodologyPage({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  return <SourcingContent params={params} />;
}

async function SourcingContent({ params }: { params: Promise<{ lang: string }> }) {
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

  const tiers = [
    {
      tier: 1,
      labelKey: "sourcing.tier1Label",
      descKey: "sourcing.tier1Desc",
      examples: ["trust.anthropic.com", "https://openai.com/enterprise-privacy", "https://trust.salesforce.com/"],
    },
    {
      tier: 2,
      labelKey: "sourcing.tier2Label",
      descKey: "sourcing.tier2Desc",
      examples: ["docs.github.com/copilot/...", "learn.microsoft.com/...", "cloud.google.com/gemini/docs/..."],
    },
    {
      tier: 3,
      labelKey: "sourcing.tier3Label",
      descKey: "sourcing.tier3Desc",
      examples: ["iso.org/certification", "cloudsecurityalliance.org/star"],
    },
    {
      tier: 4,
      labelKey: "sourcing.tier4Label",
      descKey: "sourcing.tier4Desc",
      examples: ["edpb.europa.eu", "cnil.fr/en/enforcement"],
    },
  ];

  const pipeline = [
    { step: 1, titleKey: "sourcing.step1Title", bodyKey: "sourcing.step1Body" },
    { step: 2, titleKey: "sourcing.step2Title", bodyKey: "sourcing.step2Body" },
    { step: 3, titleKey: "sourcing.step3Title", bodyKey: "sourcing.step3Body" },
    { step: 4, titleKey: "sourcing.step4Title", bodyKey: "sourcing.step4Body" },
    { step: 5, titleKey: "sourcing.step5Title", bodyKey: "sourcing.step5Body" },
  ];

  const guarantees = [
    { titleKey: "sourcing.guarantee1Title", bodyKey: "sourcing.guarantee1Body" },
    { titleKey: "sourcing.guarantee2Title", bodyKey: "sourcing.guarantee2Body" },
    { titleKey: "sourcing.guarantee3Title", bodyKey: "sourcing.guarantee3Body" },
    { titleKey: "sourcing.guarantee4Title", bodyKey: "sourcing.guarantee4Body" },
  ];

  return (
    <>
      <Header />
      <main className="flex-1">
        {/* Hero */}
        <section className="bg-gradient-to-br from-[#0d1b3e] to-[#003399] text-white">
          <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 py-16 lg:py-24">
            <p className="text-sm font-semibold text-[#ffc107] tracking-wide uppercase">
              {t("sourcing.badge")}
            </p>
            <h1 className="mt-3 text-4xl font-bold tracking-tight sm:text-5xl">
              {t("sourcing.heroTitle")}
            </h1>
            <p className="mt-4 text-lg text-blue-100 leading-relaxed max-w-3xl">
              {t("sourcing.heroSubtitle")}
            </p>
          </div>
        </section>

        {/* The pipeline */}
        <section className="py-16 lg:py-24">
          <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
            <h2 className="text-2xl font-bold text-[#0d1b3e] sm:text-3xl">
              {t("sourcing.pipelineTitle")}
            </h2>
            <p className="mt-4 text-gray-600 leading-relaxed max-w-3xl">
              {t("sourcing.pipelineSubtitle")}
            </p>

            <ol className="mt-10 space-y-6">
              {pipeline.map((p) => (
                <li key={p.step} className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
                  <div className="flex items-start gap-5">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#003399] text-base font-bold text-white">
                      {p.step}
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-[#0d1b3e]">{t(p.titleKey)}</h3>
                      <p className="mt-2 text-gray-700 leading-relaxed">{t(p.bodyKey)}</p>
                    </div>
                  </div>
                </li>
              ))}
            </ol>
          </div>
        </section>

        {/* Source tiers */}
        <section className="bg-gray-50 py-16 lg:py-24">
          <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
            <h2 className="text-2xl font-bold text-[#0d1b3e] sm:text-3xl">
              {t("sourcing.tiersTitle")}
            </h2>
            <p className="mt-4 text-gray-600 leading-relaxed max-w-3xl">
              {t("sourcing.tiersSubtitle")}
            </p>

            <div className="mt-10 grid gap-5 sm:grid-cols-2">
              {tiers.map((tier) => (
                <div key={tier.tier} className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
                  <div className="flex items-baseline gap-3">
                    <span className="inline-flex h-8 min-w-8 items-center justify-center rounded-full bg-[#003399] px-3 text-sm font-bold text-white">
                      {(t("sourcing.tierLabel") as string).replace("{tier}", String(tier.tier))}
                    </span>
                    <h3 className="text-lg font-semibold text-[#0d1b3e]">{t(tier.labelKey)}</h3>
                  </div>
                  <p className="mt-3 text-gray-700 leading-relaxed">{t(tier.descKey)}</p>
                  <ul className="mt-4 space-y-1 text-sm text-gray-500">
                    {tier.examples.map((ex) => (
                      <li key={ex} className="font-mono">{ex}</li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* What we guarantee */}
        <section className="py-16 lg:py-24">
          <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
            <h2 className="text-2xl font-bold text-[#0d1b3e] sm:text-3xl">
              {t("sourcing.guaranteesTitle")}
            </h2>
            <div className="mt-10 grid gap-5 sm:grid-cols-2">
              {guarantees.map((g) => (
                <div key={g.titleKey} className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
                  <h3 className="text-lg font-semibold text-[#0d1b3e]">{t(g.titleKey)}</h3>
                  <p className="mt-2 text-gray-700 leading-relaxed">{t(g.bodyKey)}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Corrections */}
        <section className="bg-[#0d1b3e] text-white py-16 lg:py-20">
          <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
            <h2 className="text-2xl font-bold sm:text-3xl">
              {t("sourcing.correctionsTitle")}
            </h2>
            <p className="mt-4 text-blue-100 leading-relaxed max-w-3xl">
              {(t("sourcing.correctionsBody") as string).split("{link}")[0]}
              <a href="mailto:corrections@ai-compass.eu" className="underline text-[#ffc107] hover:text-yellow-300">
                corrections@ai-compass.eu
              </a>
              {(t("sourcing.correctionsBody") as string).split("{link}")[1]}
            </p>
            <p className="mt-4 text-blue-100 leading-relaxed max-w-3xl">
              {t("sourcing.correctionsBody2")}
            </p>

            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                href={`/${lang}/methodology`}
                className="inline-flex items-center rounded-lg bg-white text-[#003399] px-5 py-2.5 text-sm font-semibold hover:bg-gray-100"
              >
                &larr; {t("sourcing.backToMethodology")}
              </Link>
              <Link
                href={`/${lang}/database`}
                className="inline-flex items-center rounded-lg border border-white/30 px-5 py-2.5 text-sm font-semibold hover:bg-white/10"
              >
                {t("sourcing.browseAISystems")}
              </Link>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
