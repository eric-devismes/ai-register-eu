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
  return getPageMetadata(lang as Locale, "aiAct");
}

const wedgeRows = [1, 2, 3, 4, 5, 6] as const;
const deployerObligations = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12] as const;
const providerObligations = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12] as const;
const milestones = [1, 2, 3, 4] as const;
const nextSteps = [1, 2, 3] as const;
const annex3Categories = [1, 2, 3, 4, 5, 6, 7, 8] as const;
const carveOuts = [1, 2, 3, 4] as const;

export default async function AiActPage({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  const locale = lang as Locale;
  const dict = await getDictionary(locale);
  const t = (key: string) =>
    key
      .split(".")
      .reduce(
        (o: Record<string, unknown>, k: string) =>
          (o?.[k] as Record<string, unknown>) ?? {},
        dict as unknown as Record<string, unknown>,
      ) as unknown as string;

  return (
    <>
      <Header />
      <main className="flex-1">
        {/* Hero */}
        <section className="bg-gradient-to-br from-[#0d1b3e] to-[#003399] text-white">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16 lg:py-24">
            <div className="max-w-3xl">
              <p className="text-sm font-semibold text-[#ffc107] tracking-wide uppercase">
                {t("aiAct.hero.badge")}
              </p>
              <h1 className="mt-3 text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl">
                {t("aiAct.hero.title")}{" "}
                <span className="text-[#ffc107]">
                  {t("aiAct.hero.titleHighlight")}
                </span>
              </h1>
              <p className="mt-6 text-lg text-blue-100 leading-relaxed">
                {t("aiAct.hero.subtitle")}
              </p>
              <div className="mt-6 inline-flex items-center gap-3 rounded-lg border border-[#ffc107]/40 bg-white/5 px-4 py-2">
                <span className="text-xs font-semibold uppercase tracking-wide text-[#ffc107]">
                  {t("aiAct.hero.deadlineLabel")}
                </span>
                <span className="text-base font-semibold text-white">
                  {t("aiAct.hero.deadlineDate")}
                </span>
              </div>
              <div className="mt-8 flex flex-wrap gap-3">
                <Link
                  href={`/${lang}/database?regulation=eu-ai-act`}
                  className="inline-flex items-center gap-2 rounded-lg bg-white text-[#003399] px-5 py-3 text-sm font-semibold hover:bg-gray-100"
                >
                  {t("aiAct.hero.ctaPrimary")}
                  <span aria-hidden>→</span>
                </Link>
                <Link
                  href={`/${lang}/methodology`}
                  className="inline-flex items-center gap-2 rounded-lg border border-white/30 bg-white/10 px-5 py-3 text-sm font-semibold text-white hover:bg-white/20"
                >
                  {t("aiAct.hero.ctaSecondary")}
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Scope — define what counts as high-risk before anything else */}
        <section className="py-16 lg:py-24">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="mx-auto max-w-3xl text-center">
              <p className="text-sm font-semibold text-[#003399] tracking-wide uppercase">
                {t("aiAct.scope.badge")}
              </p>
              <h2 className="mt-3 text-2xl font-bold text-[#0d1b3e] sm:text-3xl">
                {t("aiAct.scope.title")}
              </h2>
              <p className="mt-4 text-gray-600 leading-relaxed">
                {t("aiAct.scope.subtitle")}
              </p>
            </div>

            {/* Two paths */}
            <div className="mt-12 grid gap-6 lg:grid-cols-2">
              <div className="rounded-xl border border-[#003399]/15 bg-white p-6 shadow-sm">
                <p className="text-xs font-semibold uppercase tracking-wide text-[#003399]">
                  {t("aiAct.scope.path1Label")}
                </p>
                <h3 className="mt-2 text-lg font-semibold text-[#0d1b3e]">
                  {t("aiAct.scope.path1Title")}
                </h3>
                <p className="mt-3 text-sm text-gray-700 leading-relaxed">
                  {t("aiAct.scope.path1Body")}
                </p>
                <p className="mt-3 text-sm italic text-gray-500">
                  {t("aiAct.scope.path1Example")}
                </p>
                <p className="mt-3 text-xs font-medium text-[#003399]">
                  {t("aiAct.scope.path1Deadline")}
                </p>
              </div>

              <div className="rounded-xl border border-[#003399]/15 bg-white p-6 shadow-sm">
                <p className="text-xs font-semibold uppercase tracking-wide text-[#003399]">
                  {t("aiAct.scope.path2Label")}
                </p>
                <h3 className="mt-2 text-lg font-semibold text-[#0d1b3e]">
                  {t("aiAct.scope.path2Title")}
                </h3>
                <p className="mt-3 text-sm text-gray-700 leading-relaxed">
                  {t("aiAct.scope.path2Body")}
                </p>
                <p className="mt-4 text-xs font-semibold uppercase tracking-wide text-gray-500">
                  {t("aiAct.scope.path2Intro")}
                </p>
                <ol className="mt-2 space-y-2 text-sm text-gray-700">
                  {annex3Categories.map((n) => (
                    <li key={n} className="flex gap-3">
                      <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[#003399]/10 text-[10px] font-semibold text-[#003399]">
                        {n}
                      </span>
                      <span>
                        <span className="font-semibold text-[#0d1b3e]">
                          {t(`aiAct.scope.annex3Cat${n}`)}
                        </span>
                        <span className="text-gray-600">
                          {" — "}
                          {t(`aiAct.scope.annex3Cat${n}Desc`)}
                        </span>
                      </span>
                    </li>
                  ))}
                </ol>
              </div>
            </div>

            {/* Carve-out */}
            <div className="mt-8 rounded-xl border border-gray-200 bg-gray-50 p-6">
              <h3 className="text-base font-semibold text-[#0d1b3e]">
                {t("aiAct.scope.carveOutTitle")}
              </h3>
              <p className="mt-2 text-sm text-gray-700">
                {t("aiAct.scope.carveOutBody")}
              </p>
              <ul className="mt-3 space-y-2 text-sm text-gray-700">
                {carveOuts.map((n) => (
                  <li key={n} className="flex gap-2">
                    <span className="mt-1 inline-block h-1.5 w-1.5 shrink-0 rounded-full bg-gray-500" aria-hidden />
                    <span>{t(`aiAct.scope.carveOut${n}`)}</span>
                  </li>
                ))}
              </ul>
              <p className="mt-4 rounded-md bg-[#fffaeb] border border-[#ffc107]/40 p-3 text-sm text-[#0d1b3e]">
                <span className="font-semibold">⚠ </span>
                {t("aiAct.scope.carveOutException")}
              </p>
            </div>

            {/* Not in scope */}
            <p className="mx-auto mt-8 max-w-3xl text-center text-sm text-gray-600 leading-relaxed">
              {t("aiAct.scope.notInScope")}
            </p>
          </div>
        </section>

        {/* Roles — define provider vs deployer before the wedge */}
        <section className="py-16 lg:py-24 bg-gray-50">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="mx-auto max-w-3xl text-center">
              <p className="text-sm font-semibold text-[#003399] tracking-wide uppercase">
                {t("aiAct.roles.badge")}
              </p>
              <h2 className="mt-3 text-2xl font-bold text-[#0d1b3e] sm:text-3xl">
                {t("aiAct.roles.title")}
              </h2>
              <p className="mt-4 text-gray-600 leading-relaxed">
                {t("aiAct.roles.subtitle")}
              </p>
            </div>

            <div className="mt-12 grid gap-6 lg:grid-cols-2">
              {/* Provider card */}
              <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
                <p className="text-xs font-semibold uppercase tracking-wide text-[#003399]">
                  {t("aiAct.roles.providerLabel")}
                </p>
                <h3 className="mt-2 text-lg font-semibold text-[#0d1b3e]">
                  {t("aiAct.roles.providerDefinition")}
                </h3>
                <p className="mt-3 text-sm italic text-gray-500">
                  {t("aiAct.roles.providerExamples")}
                </p>
                <ul className="mt-4 space-y-2 text-sm text-gray-700">
                  <li className="flex gap-2">
                    <span className="mt-1 inline-block h-1.5 w-1.5 shrink-0 rounded-full bg-[#003399]" aria-hidden />
                    <span>{t("aiAct.roles.providerKnows")}</span>
                  </li>
                  <li className="flex gap-2">
                    <span className="mt-1 inline-block h-1.5 w-1.5 shrink-0 rounded-full bg-gray-400" aria-hidden />
                    <span>{t("aiAct.roles.providerDoesntKnow")}</span>
                  </li>
                </ul>
              </div>

              {/* Deployer card */}
              <div className="rounded-xl border border-[#ffc107]/40 bg-[#fffaeb] p-6 shadow-sm">
                <p className="text-xs font-semibold uppercase tracking-wide text-[#0d1b3e]">
                  {t("aiAct.roles.deployerLabel")}
                </p>
                <h3 className="mt-2 text-lg font-semibold text-[#0d1b3e]">
                  {t("aiAct.roles.deployerDefinition")}
                </h3>
                <p className="mt-3 text-sm italic text-gray-600">
                  {t("aiAct.roles.deployerExamples")}
                </p>
                <ul className="mt-4 space-y-2 text-sm text-gray-700">
                  <li className="flex gap-2">
                    <span className="mt-1 inline-block h-1.5 w-1.5 shrink-0 rounded-full bg-[#ffc107]" aria-hidden />
                    <span>{t("aiAct.roles.deployerKnows")}</span>
                  </li>
                  <li className="flex gap-2">
                    <span className="mt-1 inline-block h-1.5 w-1.5 shrink-0 rounded-full bg-gray-400" aria-hidden />
                    <span>{t("aiAct.roles.deployerDoesntKnow")}</span>
                  </li>
                </ul>
              </div>
            </div>

            <p className="mx-auto mt-10 max-w-3xl text-center text-base font-medium text-[#0d1b3e]">
              {t("aiAct.roles.bridge")}
            </p>
          </div>
        </section>

        {/* The Wedge — mapping table */}
        <section className="py-16 lg:py-24">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="mx-auto max-w-3xl text-center">
              <p className="text-sm font-semibold text-[#003399] tracking-wide uppercase">
                {t("aiAct.wedge.badge")}
              </p>
              <h2 className="mt-3 text-2xl font-bold text-[#0d1b3e] sm:text-3xl">
                {t("aiAct.wedge.title")}
              </h2>
              <p className="mt-4 text-gray-600 leading-relaxed">
                {t("aiAct.wedge.subtitle")}
              </p>
            </div>

            <div className="mt-12 overflow-hidden rounded-xl border border-[#003399]/15 bg-white shadow-sm">
              {/* Header row */}
              <div className="hidden grid-cols-3 gap-4 bg-[#0d1b3e] px-6 py-4 text-white sm:grid">
                <div className="text-xs font-semibold uppercase tracking-wide">
                  {t("aiAct.wedge.deployerHeader")}
                </div>
                <div className="text-xs font-semibold uppercase tracking-wide">
                  {t("aiAct.wedge.providerHeader")}
                </div>
                <div className="text-xs font-semibold uppercase tracking-wide text-[#ffc107]">
                  {t("aiAct.wedge.vendorscopeHeader")}
                </div>
              </div>

              {wedgeRows.map((n, i) => (
                <div
                  key={n}
                  className={`grid gap-4 px-6 py-5 sm:grid-cols-3 ${
                    i % 2 === 0 ? "bg-white" : "bg-gray-50"
                  } ${i !== 0 ? "border-t border-gray-200" : ""}`}
                >
                  <div className="text-sm text-[#0d1b3e]">
                    <p className="font-semibold sm:hidden text-xs uppercase tracking-wide text-gray-500 mb-1">
                      {t("aiAct.wedge.deployerHeader")}
                    </p>
                    {t(`aiAct.wedge.row${n}Deployer`)}
                  </div>
                  <div className="text-sm text-gray-700">
                    <p className="font-semibold sm:hidden text-xs uppercase tracking-wide text-gray-500 mb-1">
                      {t("aiAct.wedge.providerHeader")}
                    </p>
                    {t(`aiAct.wedge.row${n}Provider`)}
                  </div>
                  <div className="text-sm font-medium text-[#003399]">
                    <p className="font-semibold sm:hidden text-xs uppercase tracking-wide text-gray-500 mb-1">
                      {t("aiAct.wedge.vendorscopeHeader")}
                    </p>
                    {t(`aiAct.wedge.row${n}Vendorscope`)}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Deployer obligations */}
        <section className="py-16 lg:py-24 bg-gray-50">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="mx-auto max-w-3xl">
              <p className="text-sm font-semibold text-[#003399] tracking-wide uppercase">
                {t("aiAct.deployer.badge")}
              </p>
              <h2 className="mt-3 text-2xl font-bold text-[#0d1b3e] sm:text-3xl">
                {t("aiAct.deployer.title")}
              </h2>
              <p className="mt-4 text-gray-600 leading-relaxed">
                {t("aiAct.deployer.subtitle")}
              </p>
            </div>

            <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {deployerObligations.map((n) => (
                <div
                  key={n}
                  className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm"
                >
                  <h3 className="text-sm font-semibold text-[#0d1b3e]">
                    {t(`aiAct.deployer.obligation${n}Title`)}
                  </h3>
                  <p className="mt-2 text-sm text-gray-600 leading-relaxed">
                    {t(`aiAct.deployer.obligation${n}Body`)}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Provider obligations */}
        <section className="py-16 lg:py-24">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="mx-auto max-w-3xl">
              <p className="text-sm font-semibold text-[#003399] tracking-wide uppercase">
                {t("aiAct.provider.badge")}
              </p>
              <h2 className="mt-3 text-2xl font-bold text-[#0d1b3e] sm:text-3xl">
                {t("aiAct.provider.title")}
              </h2>
              <p className="mt-4 text-gray-600 leading-relaxed">
                {t("aiAct.provider.subtitle")}
              </p>
            </div>

            <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {providerObligations.map((n) => (
                <div
                  key={n}
                  className="rounded-xl border border-[#003399]/15 bg-white p-5"
                >
                  <h3 className="text-sm font-semibold text-[#0d1b3e]">
                    {t(`aiAct.provider.obligation${n}Title`)}
                  </h3>
                  <p className="mt-2 text-sm text-gray-600 leading-relaxed">
                    {t(`aiAct.provider.obligation${n}Body`)}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Timeline */}
        <section className="py-16 lg:py-24 bg-gray-50">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="mx-auto max-w-3xl text-center">
              <p className="text-sm font-semibold text-[#003399] tracking-wide uppercase">
                {t("aiAct.timeline.badge")}
              </p>
              <h2 className="mt-3 text-2xl font-bold text-[#0d1b3e] sm:text-3xl">
                {t("aiAct.timeline.title")}
              </h2>
            </div>

            <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {milestones.map((n) => (
                <div
                  key={n}
                  className={`rounded-xl border bg-white p-5 ${
                    n === 3
                      ? "border-[#ffc107] ring-2 ring-[#ffc107]/40"
                      : "border-gray-200"
                  }`}
                >
                  <p
                    className={`text-xs font-semibold uppercase tracking-wide ${
                      n === 3 ? "text-[#ffc107]" : "text-[#003399]"
                    }`}
                  >
                    {t(`aiAct.timeline.milestone${n}Date`)}
                  </p>
                  <h3 className="mt-2 text-sm font-semibold text-[#0d1b3e]">
                    {t(`aiAct.timeline.milestone${n}Title`)}
                  </h3>
                  <p className="mt-2 text-xs text-gray-600 leading-relaxed">
                    {t(`aiAct.timeline.milestone${n}Body`)}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* What to do this quarter */}
        <section className="py-16 lg:py-24">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="mx-auto max-w-3xl text-center">
              <p className="text-sm font-semibold text-[#003399] tracking-wide uppercase">
                {t("aiAct.next.badge")}
              </p>
              <h2 className="mt-3 text-2xl font-bold text-[#0d1b3e] sm:text-3xl">
                {t("aiAct.next.title")}
              </h2>
            </div>

            <div className="mt-12 grid gap-6 lg:grid-cols-3">
              {nextSteps.map((n) => (
                <div
                  key={n}
                  className="rounded-xl border border-gray-200 bg-white p-6"
                >
                  <h3 className="text-base font-semibold text-[#0d1b3e]">
                    {t(`aiAct.next.step${n}Title`)}
                  </h3>
                  <p className="mt-2 text-sm text-gray-600 leading-relaxed">
                    {t(`aiAct.next.step${n}Body`)}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Final CTA */}
        <section className="bg-[#0d1b3e] text-white">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16 lg:py-20">
            <div className="mx-auto max-w-2xl text-center">
              <h2 className="text-2xl font-bold sm:text-3xl">
                {t("aiAct.cta.title")}
              </h2>
              <p className="mt-4 text-blue-100 leading-relaxed">
                {t("aiAct.cta.subtitle")}
              </p>
              <div className="mt-8 flex flex-wrap justify-center gap-3">
                <Link
                  href={`/${lang}/database?regulation=eu-ai-act`}
                  className="inline-flex items-center gap-2 rounded-lg bg-[#ffc107] text-[#0d1b3e] px-5 py-3 text-sm font-semibold hover:bg-[#ffca28]"
                >
                  {t("aiAct.cta.primaryButton")}
                  <span aria-hidden>→</span>
                </Link>
                <Link
                  href={`/${lang}/pricing`}
                  className="inline-flex items-center gap-2 rounded-lg border border-white/30 bg-white/10 px-5 py-3 text-sm font-semibold text-white hover:bg-white/20"
                >
                  {t("aiAct.cta.secondaryButton")}
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Disclaimer */}
        <section className="py-8 bg-gray-100">
          <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
            <p className="text-xs text-gray-500 leading-relaxed text-center">
              {t("aiAct.disclaimer")}
            </p>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
