/**
 * Security Policy Page — DORA & NIS2 aligned security posture for VendorScope.
 *
 * URL: /[lang]/security
 */

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
  return getPageMetadata(lang as Locale, "security");
}

export default async function SecurityPage({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
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

  const lastUpdated = "11 April 2026";

  return (
    <>
      <Header />
      <main className="flex-1 bg-white">
        <div className="mx-auto max-w-4xl px-4 py-16 sm:px-6 lg:px-8">
          {/* Page header */}
          <div className="border-b border-gray-200 pb-8">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#003399]">
                <svg className="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
                </svg>
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">{t("security.title")}</h1>
                <p className="mt-1 text-sm text-gray-500">{(t("security.lastUpdated") as string).replace("{date}", lastUpdated)}</p>
              </div>
            </div>
            <p className="mt-4 text-sm leading-relaxed text-gray-600">{t("security.introBody")}</p>
          </div>

          <div className="mt-10 space-y-12 text-sm leading-relaxed text-gray-700">
            {/* 1. ICT Risk Management Framework */}
            <section>
              <h2 className="flex items-center gap-2 text-lg font-bold text-[#0d1b3e]">
                <span className="flex h-7 w-7 items-center justify-center rounded-full bg-[#003399] text-xs font-bold text-white">1</span>
                {t("security.section1Title")}
              </h2>
              <p className="mt-1 text-xs font-medium uppercase tracking-wide text-gray-400">{t("security.section1Ref")}</p>
              <p className="mt-4">{t("security.section1Body")}</p>
              <div className="mt-6 space-y-4">
                {([
                  { titleKey: "security.riskIdentificationTitle", bodyKey: "security.riskIdentificationBody" },
                  { titleKey: "security.riskAssessmentTitle", bodyKey: "security.riskAssessmentBody" },
                  { titleKey: "security.riskMitigationTitle", bodyKey: "security.riskMitigationBody" },
                  { titleKey: "security.governanceTitle", bodyKey: "security.governanceBody" },
                ] as const).map((card, i) => (
                  <div key={i} className="rounded-lg border border-gray-200 p-4">
                    <p className="font-semibold text-gray-900">{t(card.titleKey)}</p>
                    <p className="mt-1 text-gray-600">{t(card.bodyKey)}</p>
                  </div>
                ))}
              </div>
            </section>

            {/* 2. Incident Response Procedure */}
            <section>
              <h2 className="flex items-center gap-2 text-lg font-bold text-[#0d1b3e]">
                <span className="flex h-7 w-7 items-center justify-center rounded-full bg-[#003399] text-xs font-bold text-white">2</span>
                {t("security.section2Title")}
              </h2>
              <p className="mt-1 text-xs font-medium uppercase tracking-wide text-gray-400">{t("security.section2Ref")}</p>
              <p className="mt-4">
                {(t("security.section2Body") as string).split("{link}")[0]}
                <a href={`/${lang}/incident-response`} className="text-[#003399] hover:underline">{t("security.section2LinkText")}</a>
                {(t("security.section2Body") as string).split("{link}")[1]}
              </p>
              <div className="mt-6 overflow-hidden rounded-lg border border-gray-200">
                <table className="w-full text-left text-sm">
                  <thead className="bg-[#0d1b3e] text-xs uppercase text-white">
                    <tr>
                      <th className="px-4 py-3">{t("security.tableSeverity")}</th>
                      <th className="px-4 py-3">{t("security.tableDefinition")}</th>
                      <th className="px-4 py-3">{t("security.tableAcknowledge")}</th>
                      <th className="px-4 py-3">{t("security.tableResolve")}</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    <tr className="bg-red-50">
                      <td className="px-4 py-3 font-bold text-red-700">{t("security.criticalP1")}</td>
                      <td className="px-4 py-3">{t("security.criticalP1Def")}</td>
                      <td className="px-4 py-3 font-medium">1 hour</td>
                      <td className="px-4 py-3 font-medium">4 hours</td>
                    </tr>
                    <tr className="bg-orange-50">
                      <td className="px-4 py-3 font-bold text-orange-700">{t("security.majorP2")}</td>
                      <td className="px-4 py-3">{t("security.majorP2Def")}</td>
                      <td className="px-4 py-3 font-medium">4 hours</td>
                      <td className="px-4 py-3 font-medium">24 hours</td>
                    </tr>
                    <tr className="bg-yellow-50">
                      <td className="px-4 py-3 font-bold text-yellow-700">{t("security.minorP3")}</td>
                      <td className="px-4 py-3">{t("security.minorP3Def")}</td>
                      <td className="px-4 py-3 font-medium">24 hours</td>
                      <td className="px-4 py-3 font-medium">72 hours</td>
                    </tr>
                    <tr>
                      <td className="px-4 py-3 font-bold text-gray-600">{t("security.infoP4")}</td>
                      <td className="px-4 py-3">{t("security.infoP4Def")}</td>
                      <td className="px-4 py-3 font-medium">{t("security.bestEffort")}</td>
                      <td className="px-4 py-3 font-medium">{t("security.bestEffort")}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <div className="mt-4 rounded-lg border-l-4 border-[#ffc107] bg-amber-50 p-4">
                <p className="font-semibold text-gray-900">{t("security.escalationTitle")}</p>
                <p className="mt-1 text-gray-600">{t("security.escalationBody")}</p>
              </div>
            </section>

            {/* 3. Supply Chain */}
            <section>
              <h2 className="flex items-center gap-2 text-lg font-bold text-[#0d1b3e]">
                <span className="flex h-7 w-7 items-center justify-center rounded-full bg-[#003399] text-xs font-bold text-white">3</span>
                {t("security.section3Title")}
              </h2>
              <p className="mt-1 text-xs font-medium uppercase tracking-wide text-gray-400">{t("security.section3Ref")}</p>
              <p className="mt-4">{t("security.section3Body")}</p>
              <div className="mt-6 overflow-x-auto rounded-lg border border-gray-200">
                <table className="w-full text-left text-sm">
                  <thead className="bg-[#0d1b3e] text-xs uppercase text-white">
                    <tr>
                      <th className="px-4 py-3">{t("security.tableProvider")}</th>
                      <th className="px-4 py-3">{t("security.tableService")}</th>
                      <th className="px-4 py-3">{t("security.tableDataProcessed")}</th>
                      <th className="px-4 py-3">{t("security.tableSecurityPosture")}</th>
                      <th className="px-4 py-3">{t("security.tableLocation")}</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {([
                      { name: "providerAnthropic", svc: "providerAnthropicService", data: "providerAnthropicData", sec: "providerAnthropicSecurity", loc: "US" },
                      { name: "providerVercel", svc: "providerVercelService", data: "providerVercelData", sec: "providerVercelSecurity", loc: "EU (fra1)" },
                      { name: "providerNeon", svc: "providerNeonService", data: "providerNeonData", sec: "providerNeonSecurity", loc: "EU" },
                      { name: "providerResend", svc: "providerResendService", data: "providerResendData", sec: "providerResendSecurity", loc: "US" },
                      { name: "providerLemonSqueezy", svc: "providerLemonSqueezyService", data: "providerLemonSqueezyData", sec: "providerLemonSqueezySecurity", loc: "US" },
                    ] as const).map((row) => (
                      <tr key={row.name}>
                        <td className="px-4 py-3 font-semibold text-gray-900">{t(`security.${row.name}`)}</td>
                        <td className="px-4 py-3">{t(`security.${row.svc}`)}</td>
                        <td className="px-4 py-3">{t(`security.${row.data}`)}</td>
                        <td className="px-4 py-3">{t(`security.${row.sec}`)}</td>
                        <td className="px-4 py-3">{row.loc}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className="mt-4 rounded-lg bg-gray-50 p-4">
                <p className="font-semibold text-gray-900">{t("security.concentrationRiskTitle")}</p>
                <p className="mt-1 text-gray-600">{t("security.concentrationRiskBody")}</p>
              </div>
            </section>

            {/* 4. Business Continuity */}
            <section>
              <h2 className="flex items-center gap-2 text-lg font-bold text-[#0d1b3e]">
                <span className="flex h-7 w-7 items-center justify-center rounded-full bg-[#003399] text-xs font-bold text-white">4</span>
                {t("security.section4Title")}
              </h2>
              <p className="mt-1 text-xs font-medium uppercase tracking-wide text-gray-400">{t("security.section4Ref")}</p>
              <div className="mt-6 space-y-4">
                {([
                  { titleKey: "security.hostingFailoverTitle", bodyKey: "security.hostingFailoverBody" },
                  { titleKey: "security.databaseResilienceTitle", bodyKey: "security.databaseResilienceBody" },
                  { titleKey: "security.codeConfigTitle", bodyKey: "security.codeConfigBody" },
                  { titleKey: "security.gracefulDegradationTitle", bodyKey: "security.gracefulDegradationBody" },
                ] as const).map((card, i) => (
                  <div key={i} className="rounded-lg border border-gray-200 p-4">
                    <p className="font-semibold text-gray-900">{t(card.titleKey)}</p>
                    <p className="mt-1 text-gray-600">{t(card.bodyKey)}</p>
                  </div>
                ))}
              </div>
            </section>

            {/* 5. Security Testing */}
            <section>
              <h2 className="flex items-center gap-2 text-lg font-bold text-[#0d1b3e]">
                <span className="flex h-7 w-7 items-center justify-center rounded-full bg-[#003399] text-xs font-bold text-white">5</span>
                {t("security.section5Title")}
              </h2>
              <p className="mt-1 text-xs font-medium uppercase tracking-wide text-gray-400">{t("security.section5Ref")}</p>
              <div className="mt-6 overflow-hidden rounded-lg border border-gray-200">
                <table className="w-full text-left text-sm">
                  <thead className="bg-gray-50 text-xs uppercase text-gray-500">
                    <tr>
                      <th className="px-4 py-3">{t("security.tableControl")}</th>
                      <th className="px-4 py-3">{t("security.tableImplementation")}</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {([
                      { ctrl: "controlEncTransit", impl: "controlEncTransitImpl" },
                      { ctrl: "controlEncRest", impl: "controlEncRestImpl" },
                      { ctrl: "controlInputVal", impl: "controlInputValImpl" },
                      { ctrl: "controlInjection", impl: "controlInjectionImpl" },
                      { ctrl: "controlRateLimit", impl: "controlRateLimitImpl" },
                      { ctrl: "controlDeps", impl: "controlDepsImpl" },
                      { ctrl: "controlHeaders", impl: "controlHeadersImpl" },
                    ] as const).map((row) => (
                      <tr key={row.ctrl}>
                        <td className="px-4 py-3 font-medium text-gray-900">{t(`security.${row.ctrl}`)}</td>
                        <td className="px-4 py-3">{t(`security.${row.impl}`)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>

            {/* 6. NIS2 Alignment */}
            <section>
              <h2 className="flex items-center gap-2 text-lg font-bold text-[#0d1b3e]">
                <span className="flex h-7 w-7 items-center justify-center rounded-full bg-[#003399] text-xs font-bold text-white">6</span>
                {t("security.section6Title")}
              </h2>
              <p className="mt-1 text-xs font-medium uppercase tracking-wide text-gray-400">{t("security.section6Ref")}</p>
              <p className="mt-4">{t("security.section6Body")}</p>
              <div className="mt-6 space-y-4">
                <div className="rounded-lg border border-gray-200 p-4">
                  <p className="font-semibold text-gray-900">{t("security.cyberHygieneTitle")}</p>
                  <ul className="mt-2 list-disc space-y-1 pl-5 text-gray-600">
                    {(t("security.cyberHygieneItems") as unknown as string[]).map((item, i) => (
                      <li key={i}>{item}</li>
                    ))}
                  </ul>
                </div>
                <div className="rounded-lg border border-gray-200 p-4">
                  <p className="font-semibold text-gray-900">{t("security.vulnHandlingTitle")}</p>
                  <ul className="mt-2 list-disc space-y-1 pl-5 text-gray-600">
                    {(t("security.vulnHandlingItems") as unknown as string[]).map((item, i) => (
                      <li key={i}>{item}</li>
                    ))}
                    <li>
                      {(t("security.vulnDisclosure") as string).split("{link}")[0]}
                      <a href="mailto:security@vendorscope.eu" className="text-[#003399] hover:underline">security@vendorscope.eu</a>
                      {(t("security.vulnDisclosure") as string).split("{link}")[1]}
                    </li>
                  </ul>
                </div>
                <div className="rounded-lg border border-gray-200 p-4">
                  <p className="font-semibold text-gray-900">{t("security.accessMgmtTitle")}</p>
                  <ul className="mt-2 list-disc space-y-1 pl-5 text-gray-600">
                    {(t("security.accessMgmtItems") as unknown as string[]).map((item, i) => (
                      <li key={i}>{item}</li>
                    ))}
                  </ul>
                </div>
                <div className="rounded-lg border border-gray-200 p-4">
                  <p className="font-semibold text-gray-900">{t("security.incidentHandlingTitle")}</p>
                  <p className="mt-1 text-gray-600">
                    {(t("security.incidentHandlingBody") as string).split("{link}")[0]}
                    <a href={`/${lang}/incident-response`} className="text-[#003399] hover:underline">{t("security.incidentHandlingLinkText")}</a>
                    {(t("security.incidentHandlingBody") as string).split("{link}")[1]}
                  </p>
                </div>
              </div>
            </section>

            {/* 7. Responsible AI Security */}
            <section>
              <h2 className="flex items-center gap-2 text-lg font-bold text-[#0d1b3e]">
                <span className="flex h-7 w-7 items-center justify-center rounded-full bg-[#003399] text-xs font-bold text-white">7</span>
                {t("security.section7Title")}
              </h2>
              <p className="mt-4">{t("security.section7Body")}</p>
              <ul className="mt-4 list-disc space-y-2 pl-5 text-gray-600">
                <li>{t("security.aiNoTraining")}</li>
                <li>{t("security.aiPiiMin")}</li>
                <li>{t("security.aiPromptDefense")}</li>
                <li>{t("security.aiOutputVal")}</li>
              </ul>
            </section>

            {/* 8. Contact */}
            <section className="rounded-lg border-2 border-[#003399] bg-blue-50 p-6">
              <h2 className="text-lg font-bold text-[#0d1b3e]">{t("security.contactTitle")}</h2>
              <p className="mt-2 text-gray-700">{t("security.contactBody")}</p>
              <p className="mt-3">
                <a href="mailto:security@vendorscope.eu" className="inline-flex items-center gap-2 rounded-lg bg-[#003399] px-4 py-2 text-sm font-semibold text-white transition hover:bg-[#0d1b3e]">
                  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
                  </svg>
                  security@vendorscope.eu
                </a>
              </p>
              <p className="mt-4 text-xs text-gray-500">{t("security.contactFooter")}</p>
            </section>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
