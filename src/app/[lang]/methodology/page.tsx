import type { Metadata } from "next";
import Link from "next/link";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import CollapsibleSection from "@/components/ui/CollapsibleSection";
import { getPageMetadata, getDictionary, type Locale } from "@/lib/i18n";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string }>;
}): Promise<Metadata> {
  const { lang } = await params;
  return getPageMetadata(lang as Locale, "methodology");
}

// Dimension config — names and criteria resolved via dictionary keys
const dimensionConfig = [
  {
    number: 1,
    nameKey: "methodology.dim.euAiActReadiness",
    color: "#003399",
    criteriaKeys: [
      "methodology.criteria.euAiAct1",
      "methodology.criteria.euAiAct2",
      "methodology.criteria.euAiAct3",
      "methodology.criteria.euAiAct4",
    ],
  },
  {
    number: 2,
    nameKey: "methodology.dim.gdprCompliance",
    color: "#0055cc",
    criteriaKeys: [
      "methodology.criteria.gdpr1",
      "methodology.criteria.gdpr2",
      "methodology.criteria.gdpr3",
      "methodology.criteria.gdpr4",
    ],
  },
  {
    number: 3,
    nameKey: "methodology.dim.dataSovereignty",
    color: "#003399",
    criteriaKeys: [
      "methodology.criteria.sovereignty1",
      "methodology.criteria.sovereignty2",
      "methodology.criteria.sovereignty3",
      "methodology.criteria.sovereignty4",
    ],
  },
  {
    number: 4,
    nameKey: "methodology.dim.transparencyExplainability",
    color: "#0055cc",
    criteriaKeys: [
      "methodology.criteria.transparency1",
      "methodology.criteria.transparency2",
      "methodology.criteria.transparency3",
      "methodology.criteria.transparency4",
    ],
  },
  {
    number: 5,
    nameKey: "methodology.dim.securityRobustness",
    color: "#003399",
    criteriaKeys: [
      "methodology.criteria.security1",
      "methodology.criteria.security2",
      "methodology.criteria.security3",
      "methodology.criteria.security4",
    ],
  },
  {
    number: 6,
    nameKey: "methodology.dim.biasFairness",
    color: "#0055cc",
    criteriaKeys: [
      "methodology.criteria.bias1",
      "methodology.criteria.bias2",
      "methodology.criteria.bias3",
      "methodology.criteria.bias4",
    ],
  },
  {
    number: 7,
    nameKey: "methodology.dim.humanOversight",
    color: "#003399",
    criteriaKeys: [
      "methodology.criteria.oversight1",
      "methodology.criteria.oversight2",
      "methodology.criteria.oversight3",
      "methodology.criteria.oversight4",
    ],
  },
  {
    number: 8,
    nameKey: "methodology.dim.multilingualQuality",
    color: "#0055cc",
    criteriaKeys: [
      "methodology.criteria.multilingual1",
      "methodology.criteria.multilingual2",
      "methodology.criteria.multilingual3",
      "methodology.criteria.multilingual4",
    ],
  },
];

// Process step keys
const processStepKeys = [
  { stepKey: "methodology.step.evidenceCollection", descKey: "methodology.step.evidenceCollectionDesc" },
  { stepKey: "methodology.step.expertAssessment", descKey: "methodology.step.expertAssessmentDesc" },
  { stepKey: "methodology.step.peerReview", descKey: "methodology.step.peerReviewDesc" },
  { stepKey: "methodology.step.scoreCalculation", descKey: "methodology.step.scoreCalculationDesc" },
  { stepKey: "methodology.step.continuousUpdates", descKey: "methodology.step.continuousUpdatesDesc" },
];

export default async function MethodologyPage({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  const locale = lang as Locale;
  const dict = await getDictionary(locale);
  const t = (key: string) => key.split(".").reduce((o: Record<string, unknown>, k: string) => (o?.[k] as Record<string, unknown>) ?? {}, dict as unknown as Record<string, unknown>) as unknown as string;

  return (
    <>
      <Header />
      <main className="flex-1">
        {/* Hero */}
        <section className="bg-gradient-to-br from-[#0d1b3e] to-[#003399] text-white">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16 lg:py-24">
            <div className="max-w-3xl">
              <p className="text-sm font-semibold text-[#ffc107] tracking-wide uppercase">
                {t("methodology.badge")}
              </p>
              <h1 className="mt-3 text-4xl font-bold tracking-tight sm:text-5xl">
                {t("methodology.heroTitle")}
              </h1>
              <p className="mt-4 text-lg text-blue-100 leading-relaxed">
                {t("methodology.heroSubtitle")}
              </p>
              <div className="mt-6 flex flex-wrap gap-3">
                <Link
                  href="methodology/sourcing"
                  className="inline-flex items-center gap-2 rounded-lg bg-white text-[#003399] px-4 py-2 text-sm font-semibold hover:bg-gray-100"
                >
                  {t("methodology.verifyLink")}
                  <span aria-hidden>→</span>
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Three Promises — trust proof */}
        <section className="py-16 lg:py-24">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="mx-auto max-w-3xl text-center">
              <p className="text-sm font-semibold text-[#003399] tracking-wide uppercase">
                {t("methodology.promises.badge")}
              </p>
              <h2 className="mt-3 text-2xl font-bold text-[#0d1b3e] sm:text-3xl">
                {t("methodology.promises.title")}
              </h2>
              <p className="mt-4 text-gray-600 leading-relaxed">
                {t("methodology.promises.subtitle")}
              </p>
            </div>

            <div className="mt-12 grid gap-6 lg:grid-cols-3">
              {[
                { titleKey: "methodology.promises.sourceTitle", descKey: "methodology.promises.sourceDesc" },
                { titleKey: "methodology.promises.dateTitle", descKey: "methodology.promises.dateDesc" },
                { titleKey: "methodology.promises.challengeTitle", descKey: "methodology.promises.challengeDesc" },
              ].map((p, i) => (
                <div
                  key={p.titleKey}
                  className="rounded-xl border border-[#003399]/15 bg-white p-6 shadow-sm"
                >
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#003399] text-lg font-bold text-white">
                    {i + 1}
                  </div>
                  <h3 className="mt-4 text-lg font-semibold text-[#0d1b3e]">
                    {t(p.titleKey)}
                  </h3>
                  <p className="mt-2 text-sm text-gray-600 leading-relaxed">
                    {t(p.descKey)}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Source Hierarchy — 4 tiers */}
        <section className="py-16 lg:py-24 bg-gray-50">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="mx-auto max-w-3xl text-center">
              <p className="text-sm font-semibold text-[#003399] tracking-wide uppercase">
                {t("methodology.sourceTiers.badge")}
              </p>
              <h2 className="mt-3 text-2xl font-bold text-[#0d1b3e] sm:text-3xl">
                {t("methodology.sourceTiers.title")}
              </h2>
              <p className="mt-4 text-gray-600 leading-relaxed">
                {t("methodology.sourceTiers.subtitle")}
              </p>
            </div>

            <div className="mt-12 space-y-4">
              {[
                { n: 1, labelKey: "methodology.sourceTiers.tier1Label", descKey: "methodology.sourceTiers.tier1Desc", exKey: "methodology.sourceTiers.tier1Examples" },
                { n: 2, labelKey: "methodology.sourceTiers.tier2Label", descKey: "methodology.sourceTiers.tier2Desc", exKey: "methodology.sourceTiers.tier2Examples" },
                { n: 3, labelKey: "methodology.sourceTiers.tier3Label", descKey: "methodology.sourceTiers.tier3Desc", exKey: "methodology.sourceTiers.tier3Examples" },
                { n: 4, labelKey: "methodology.sourceTiers.tier4Label", descKey: "methodology.sourceTiers.tier4Desc", exKey: "methodology.sourceTiers.tier4Examples" },
              ].map((tier) => (
                <div
                  key={tier.n}
                  className="flex flex-col gap-4 rounded-xl border border-gray-200 bg-white p-6 sm:flex-row sm:items-start"
                >
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-[#003399]/10 text-sm font-bold text-[#003399]">
                    T{tier.n}
                  </div>
                  <div className="flex-1">
                    <h3 className="text-base font-semibold text-[#0d1b3e]">
                      {t(tier.labelKey)}
                    </h3>
                    <p className="mt-1 text-sm text-gray-600 leading-relaxed">
                      {t(tier.descKey)}
                    </p>
                    <p className="mt-2 text-xs text-gray-500 italic">
                      {t(tier.exKey)}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Refresh cadence */}
        <section className="py-16 lg:py-24">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="mx-auto max-w-3xl text-center">
              <p className="text-sm font-semibold text-[#003399] tracking-wide uppercase">
                {t("methodology.refresh.badge")}
              </p>
              <h2 className="mt-3 text-2xl font-bold text-[#0d1b3e] sm:text-3xl">
                {t("methodology.refresh.title")}
              </h2>
              <p className="mt-4 text-gray-600 leading-relaxed">
                {t("methodology.refresh.subtitle")}
              </p>
            </div>

            <div className="mt-12 grid gap-6 lg:grid-cols-3">
              {[
                { titleKey: "methodology.refresh.weeklyTitle", descKey: "methodology.refresh.weeklyDesc" },
                { titleKey: "methodology.refresh.quarterlyTitle", descKey: "methodology.refresh.quarterlyDesc" },
                { titleKey: "methodology.refresh.escalationTitle", descKey: "methodology.refresh.escalationDesc" },
              ].map((r) => (
                <div
                  key={r.titleKey}
                  className="rounded-xl border border-gray-200 bg-white p-6"
                >
                  <h3 className="text-base font-semibold text-[#0d1b3e]">
                    {t(r.titleKey)}
                  </h3>
                  <p className="mt-2 text-sm text-gray-600 leading-relaxed">
                    {t(r.descKey)}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Challenge a claim */}
        <section className="py-16 lg:py-24 bg-gray-50">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="mx-auto max-w-3xl text-center">
              <p className="text-sm font-semibold text-[#003399] tracking-wide uppercase">
                {t("methodology.challengeClaim.badge")}
              </p>
              <h2 className="mt-3 text-2xl font-bold text-[#0d1b3e] sm:text-3xl">
                {t("methodology.challengeClaim.title")}
              </h2>
              <p className="mt-4 text-gray-600 leading-relaxed">
                {t("methodology.challengeClaim.subtitle")}
              </p>
            </div>

            <div className="mt-12 grid gap-6 lg:grid-cols-3">
              {[
                { n: 1, titleKey: "methodology.challengeClaim.step1Title", descKey: "methodology.challengeClaim.step1Desc" },
                { n: 2, titleKey: "methodology.challengeClaim.step2Title", descKey: "methodology.challengeClaim.step2Desc" },
                { n: 3, titleKey: "methodology.challengeClaim.step3Title", descKey: "methodology.challengeClaim.step3Desc" },
              ].map((s) => (
                <div
                  key={s.n}
                  className="relative rounded-xl border border-gray-200 bg-white p-6"
                >
                  <div className="absolute -top-3 left-6 flex h-7 w-7 items-center justify-center rounded-full bg-[#ffc107] text-xs font-bold text-[#0d1b3e]">
                    {s.n}
                  </div>
                  <h3 className="mt-2 text-base font-semibold text-[#0d1b3e]">
                    {t(s.titleKey)}
                  </h3>
                  <p className="mt-2 text-sm text-gray-600 leading-relaxed">
                    {t(s.descKey)}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Assessment Process */}
        <section className="py-16 lg:py-24 bg-gray-50">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="mx-auto max-w-2xl text-center">
              <h2 className="text-2xl font-bold text-[#0d1b3e] sm:text-3xl">
                {t("methodology.processTitle")}
              </h2>
              <p className="mt-4 text-gray-600 leading-relaxed">
                {t("methodology.processSubtitle")}
              </p>
            </div>

            <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-5">
              {processStepKeys.map((item, index) => (
                <div key={item.stepKey} className="relative text-center">
                  <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-[#003399] text-lg font-bold text-white shadow-sm">
                    {index + 1}
                  </div>
                  <h3 className="mt-4 text-sm font-semibold text-[#0d1b3e]">
                    {t(item.stepKey)}
                  </h3>
                  <p className="mt-2 text-xs text-gray-600 leading-relaxed">
                    {t(item.descKey)}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* 8 Dimensions */}
        <section className="py-16 lg:py-24">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="mx-auto max-w-2xl text-center">
              <h2 className="text-2xl font-bold text-[#0d1b3e] sm:text-3xl">
                {t("methodology.dimensionsTitle")}
              </h2>
              <p className="mt-4 text-gray-600 leading-relaxed">
                {t("methodology.dimensionsSubtitle")}
              </p>
            </div>

            <div className="mt-12 grid gap-4 sm:grid-cols-2">
              {dimensionConfig.map((dim) => (
                <CollapsibleSection
                  key={dim.nameKey}
                  title={t(dim.nameKey)}
                  badge={
                    <span
                      className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-xs font-bold text-white"
                      style={{ backgroundColor: dim.color }}
                    >
                      {dim.number}
                    </span>
                  }
                >
                  <ul className="px-6 py-4 space-y-2">
                    {dim.criteriaKeys.map((criterionKey) => (
                      <li key={criterionKey} className="flex items-start gap-2 text-sm text-gray-600">
                        <svg className="h-4 w-4 shrink-0 mt-0.5 text-[#003399]/40" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
                        </svg>
                        {t(criterionKey)}
                      </li>
                    ))}
                  </ul>
                </CollapsibleSection>
              ))}
            </div>

            {/* Grading scale */}
            <div className="mt-16 mx-auto max-w-2xl text-center">
              <h2 className="text-2xl font-bold text-[#0d1b3e] sm:text-3xl">
                {t("methodology.gradingTitle")}
              </h2>
              <p className="mt-4 text-sm text-gray-600">
                {t("methodology.gradingSubtitle")}
              </p>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
