/**
 * Incident Response Plan — Public IRP aligned with DORA and NIS2.
 *
 * URL: /[lang]/incident-response
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
  return getPageMetadata(lang as Locale, "incidentResponse");
}

export default async function IncidentResponsePage({
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
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
                </svg>
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">{t("incident.title")}</h1>
                <p className="mt-1 text-sm text-gray-500">{(t("incident.lastUpdated") as string).replace("{date}", lastUpdated)}</p>
              </div>
            </div>
            <p className="mt-4 text-sm leading-relaxed text-gray-600">{t("incident.introBody")}</p>
            <div className="mt-4 flex flex-wrap gap-2">
              <span className="inline-flex items-center rounded-full bg-blue-100 px-3 py-1 text-xs font-medium text-[#003399]">{t("incident.badgeDora")}</span>
              <span className="inline-flex items-center rounded-full bg-blue-100 px-3 py-1 text-xs font-medium text-[#003399]">{t("incident.badgeNis2")}</span>
              <span className="inline-flex items-center rounded-full bg-blue-100 px-3 py-1 text-xs font-medium text-[#003399]">{t("incident.badgeGdpr")}</span>
            </div>
          </div>

          <div className="mt-10 space-y-12 text-sm leading-relaxed text-gray-700">
            {/* 1. Scope & Purpose */}
            <section>
              <h2 className="flex items-center gap-2 text-lg font-bold text-[#0d1b3e]">
                <span className="flex h-7 w-7 items-center justify-center rounded-full bg-[#003399] text-xs font-bold text-white">1</span>
                {t("incident.section1Title")}
              </h2>
              <p className="mt-4">{t("incident.section1Body")}</p>
              <ul className="mt-3 list-disc space-y-1 pl-5 text-gray-600">
                <li>{t("incident.scope1")}</li>
                <li>{t("incident.scope2")}</li>
                <li>{t("incident.scope3")}</li>
                <li>{t("incident.scope4")}</li>
                <li>{t("incident.scope5")}</li>
              </ul>
              <p className="mt-4">{t("incident.section1Objective")}</p>
            </section>

            {/* 2. Incident Classification */}
            <section>
              <h2 className="flex items-center gap-2 text-lg font-bold text-[#0d1b3e]">
                <span className="flex h-7 w-7 items-center justify-center rounded-full bg-[#003399] text-xs font-bold text-white">2</span>
                {t("incident.section2Title")}
              </h2>
              <p className="mt-4">{t("incident.section2Body")}</p>

              {/* P1 */}
              <div className="mt-6 rounded-lg border-l-4 border-red-600 bg-red-50 p-5">
                <div className="flex items-center gap-2">
                  <span className="inline-flex items-center rounded-full bg-red-600 px-3 py-1 text-xs font-bold text-white">{t("incident.p1Label")}</span>
                </div>
                <p className="mt-3 font-semibold text-gray-900">{t("incident.p1Definition")}</p>
                <p className="mt-1 text-gray-700">{t("incident.p1DefinitionBody")}</p>
                <div className="mt-3 grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-xs font-medium uppercase text-gray-500">{t("incident.examples")}</p>
                    <ul className="mt-1 list-disc space-y-1 pl-5 text-gray-600">
                      <li>{t("incident.p1Example1")}</li>
                      <li>{t("incident.p1Example2")}</li>
                      <li>{t("incident.p1Example3")}</li>
                      <li>{t("incident.p1Example4")}</li>
                    </ul>
                  </div>
                  <div>
                    <p className="text-xs font-medium uppercase text-gray-500">{t("incident.responseTargets")}</p>
                    <ul className="mt-1 space-y-1 text-gray-600">
                      <li><strong>{t("incident.acknowledge")}</strong> 1 hour</li>
                      <li><strong>{t("incident.mitigate")}</strong> 2 hours</li>
                      <li><strong>{t("incident.resolve")}</strong> 4 hours</li>
                      <li><strong>{t("incident.postMortem")}</strong> Within 48 hours</li>
                    </ul>
                  </div>
                </div>
              </div>

              {/* P2 */}
              <div className="mt-4 rounded-lg border-l-4 border-orange-500 bg-orange-50 p-5">
                <div className="flex items-center gap-2">
                  <span className="inline-flex items-center rounded-full bg-orange-500 px-3 py-1 text-xs font-bold text-white">{t("incident.p2Label")}</span>
                </div>
                <p className="mt-3 font-semibold text-gray-900">{t("incident.p1Definition")}</p>
                <p className="mt-1 text-gray-700">{t("incident.p2DefinitionBody")}</p>
                <div className="mt-3 grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-xs font-medium uppercase text-gray-500">{t("incident.examples")}</p>
                    <ul className="mt-1 list-disc space-y-1 pl-5 text-gray-600">
                      <li>{t("incident.p2Example1")}</li>
                      <li>{t("incident.p2Example2")}</li>
                      <li>{t("incident.p2Example3")}</li>
                      <li>{t("incident.p2Example4")}</li>
                    </ul>
                  </div>
                  <div>
                    <p className="text-xs font-medium uppercase text-gray-500">{t("incident.responseTargets")}</p>
                    <ul className="mt-1 space-y-1 text-gray-600">
                      <li><strong>{t("incident.acknowledge")}</strong> 4 hours</li>
                      <li><strong>{t("incident.mitigate")}</strong> 8 hours</li>
                      <li><strong>{t("incident.resolve")}</strong> 24 hours</li>
                      <li><strong>{t("incident.postMortem")}</strong> Within 5 business days</li>
                    </ul>
                  </div>
                </div>
              </div>

              {/* P3 */}
              <div className="mt-4 rounded-lg border-l-4 border-yellow-500 bg-yellow-50 p-5">
                <div className="flex items-center gap-2">
                  <span className="inline-flex items-center rounded-full bg-yellow-500 px-3 py-1 text-xs font-bold text-white">{t("incident.p3Label")}</span>
                </div>
                <p className="mt-3 font-semibold text-gray-900">{t("incident.p1Definition")}</p>
                <p className="mt-1 text-gray-700">{t("incident.p3DefinitionBody")}</p>
                <div className="mt-3 grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-xs font-medium uppercase text-gray-500">{t("incident.examples")}</p>
                    <ul className="mt-1 list-disc space-y-1 pl-5 text-gray-600">
                      <li>{t("incident.p3Example1")}</li>
                      <li>{t("incident.p3Example2")}</li>
                      <li>{t("incident.p3Example3")}</li>
                      <li>{t("incident.p3Example4")}</li>
                    </ul>
                  </div>
                  <div>
                    <p className="text-xs font-medium uppercase text-gray-500">{t("incident.responseTargets")}</p>
                    <ul className="mt-1 space-y-1 text-gray-600">
                      <li><strong>{t("incident.acknowledge")}</strong> 24 hours</li>
                      <li><strong>{t("incident.mitigate")}</strong> 48 hours</li>
                      <li><strong>{t("incident.resolve")}</strong> 72 hours</li>
                      <li><strong>{t("incident.postMortem")}</strong> {t("incident.optional")}</li>
                    </ul>
                  </div>
                </div>
              </div>

              {/* P4 */}
              <div className="mt-4 rounded-lg border-l-4 border-gray-400 bg-gray-50 p-5">
                <div className="flex items-center gap-2">
                  <span className="inline-flex items-center rounded-full bg-gray-500 px-3 py-1 text-xs font-bold text-white">{t("incident.p4Label")}</span>
                </div>
                <p className="mt-3 font-semibold text-gray-900">{t("incident.p1Definition")}</p>
                <p className="mt-1 text-gray-700">{t("incident.p4DefinitionBody")}</p>
                <div className="mt-3 grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-xs font-medium uppercase text-gray-500">{t("incident.examples")}</p>
                    <ul className="mt-1 list-disc space-y-1 pl-5 text-gray-600">
                      <li>{t("incident.p4Example1")}</li>
                      <li>{t("incident.p4Example2")}</li>
                      <li>{t("incident.p4Example3")}</li>
                      <li>{t("incident.p4Example4")}</li>
                    </ul>
                  </div>
                  <div>
                    <p className="text-xs font-medium uppercase text-gray-500">{t("incident.responseTargets")}</p>
                    <ul className="mt-1 space-y-1 text-gray-600">
                      <li><strong>{t("incident.acknowledge")}</strong> {t("incident.bestEffort")}</li>
                      <li><strong>{t("incident.resolve")}</strong> {t("incident.bestEffort")}</li>
                      <li><strong>{t("incident.postMortem")}</strong> {t("incident.notRequired")}</li>
                    </ul>
                  </div>
                </div>
              </div>
            </section>

            {/* 3. Response Lifecycle */}
            <section>
              <h2 className="flex items-center gap-2 text-lg font-bold text-[#0d1b3e]">
                <span className="flex h-7 w-7 items-center justify-center rounded-full bg-[#003399] text-xs font-bold text-white">3</span>
                {t("incident.section3Title")}
              </h2>
              <p className="mt-4">{t("incident.section3Body")}</p>
              <div className="mt-6 space-y-4">
                {([
                  { num: 1, titleKey: "incident.lifecycle1Title", bodyKey: "incident.lifecycle1Body", last: false },
                  { num: 2, titleKey: "incident.lifecycle2Title", bodyKey: "incident.lifecycle2Body", last: false },
                  { num: 3, titleKey: "incident.lifecycle3Title", bodyKey: "incident.lifecycle3Body", last: false },
                  { num: 4, titleKey: "incident.lifecycle4Title", bodyKey: "incident.lifecycle4Body", last: false },
                  { num: 5, titleKey: "incident.lifecycle5Title", bodyKey: "incident.lifecycle5Body", last: true },
                ] as const).map((step) => (
                  <div key={step.num} className="flex gap-4">
                    <div className="flex flex-col items-center">
                      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#003399] text-xs font-bold text-white">{step.num}</div>
                      {!step.last && <div className="mt-1 h-full w-0.5 bg-gray-200" />}
                    </div>
                    <div className={step.last ? "" : "pb-6"}>
                      <p className="font-semibold text-gray-900">{t(step.titleKey)}</p>
                      <p className="mt-1 text-gray-600">{t(step.bodyKey)}</p>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* 4. Communication Protocol */}
            <section>
              <h2 className="flex items-center gap-2 text-lg font-bold text-[#0d1b3e]">
                <span className="flex h-7 w-7 items-center justify-center rounded-full bg-[#003399] text-xs font-bold text-white">4</span>
                {t("incident.section4Title")}
              </h2>
              <p className="mt-4">{t("incident.section4Body")}</p>
              <div className="mt-6 overflow-hidden rounded-lg border border-gray-200">
                <table className="w-full text-left text-sm">
                  <thead className="bg-[#0d1b3e] text-xs uppercase text-white">
                    <tr>
                      <th className="px-4 py-3">{t("security.tableSeverity")}</th>
                      <th className="px-4 py-3">{t("incident.tableInternal")}</th>
                      <th className="px-4 py-3">{t("incident.tableUsers")}</th>
                      <th className="px-4 py-3">{t("incident.tableRegulators")}</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    <tr className="bg-red-50">
                      <td className="px-4 py-3 font-bold text-red-700">P1</td>
                      <td className="px-4 py-3">{t("incident.p1Internal")}</td>
                      <td className="px-4 py-3">{t("incident.p1Users")}</td>
                      <td className="px-4 py-3">{t("incident.p1Regulators")}</td>
                    </tr>
                    <tr className="bg-orange-50">
                      <td className="px-4 py-3 font-bold text-orange-700">P2</td>
                      <td className="px-4 py-3">{t("incident.p2Internal")}</td>
                      <td className="px-4 py-3">{t("incident.p2Users")}</td>
                      <td className="px-4 py-3">{t("incident.p2Regulators")}</td>
                    </tr>
                    <tr className="bg-yellow-50">
                      <td className="px-4 py-3 font-bold text-yellow-700">P3</td>
                      <td className="px-4 py-3">{t("incident.p3Internal")}</td>
                      <td className="px-4 py-3">{t("incident.p3Users")}</td>
                      <td className="px-4 py-3">{t("incident.p3Regulators")}</td>
                    </tr>
                    <tr>
                      <td className="px-4 py-3 font-bold text-gray-600">P4</td>
                      <td className="px-4 py-3">{t("incident.p4Internal")}</td>
                      <td className="px-4 py-3">{t("incident.p4Users")}</td>
                      <td className="px-4 py-3">{t("incident.p4Regulators")}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <div className="mt-4 rounded-lg border-l-4 border-[#ffc107] bg-amber-50 p-4">
                <p className="font-semibold text-gray-900">{t("incident.dataBreachTitle")}</p>
                <p className="mt-1 text-gray-600">{t("incident.dataBreachBody")}</p>
              </div>
            </section>

            {/* 5. Post-Incident Review */}
            <section>
              <h2 className="flex items-center gap-2 text-lg font-bold text-[#0d1b3e]">
                <span className="flex h-7 w-7 items-center justify-center rounded-full bg-[#003399] text-xs font-bold text-white">5</span>
                {t("incident.section5Title")}
              </h2>
              <p className="mt-4">{t("incident.section5Body")}</p>
              <div className="mt-6 space-y-4">
                <div className="rounded-lg border border-gray-200 p-4">
                  <p className="font-semibold text-gray-900">{t("incident.blamelessTitle")}</p>
                  <p className="mt-1 text-gray-600">{t("incident.blamelessBody")}</p>
                </div>
                <div className="rounded-lg border border-gray-200 p-4">
                  <p className="font-semibold text-gray-900">{t("incident.reviewTemplateTitle")}</p>
                  <div className="mt-2 rounded-lg bg-gray-50 p-4 font-mono text-xs text-gray-600">
                    {([
                      { label: "templateIncidentId", val: "templateIncidentIdVal" },
                      { label: "templateSeverity", val: "templateSeverityVal" },
                      { label: "templateDuration", val: "templateDurationVal" },
                      { label: "templateImpact", val: "templateImpactVal" },
                      { label: "templateTimeline", val: "templateTimelineVal" },
                      { label: "templateRootCause", val: "templateRootCauseVal" },
                      { label: "templateContributing", val: "templateContributingVal" },
                      { label: "templateActions", val: "templateActionsVal" },
                      { label: "templateLessons", val: "templateLessonsVal" },
                    ] as const).map((row) => (
                      <p key={row.label}>
                        <strong className="text-gray-900">{t(`incident.${row.label}`)}</strong>{" "}
                        {t(`incident.${row.val}`)}
                      </p>
                    ))}
                  </div>
                </div>
                <div className="rounded-lg border border-gray-200 p-4">
                  <p className="font-semibold text-gray-900">{t("incident.actionTrackingTitle")}</p>
                  <p className="mt-1 text-gray-600">{t("incident.actionTrackingBody")}</p>
                </div>
              </div>
            </section>

            {/* 6. Regulatory Reporting */}
            <section>
              <h2 className="flex items-center gap-2 text-lg font-bold text-[#0d1b3e]">
                <span className="flex h-7 w-7 items-center justify-center rounded-full bg-[#003399] text-xs font-bold text-white">6</span>
                {t("incident.section6Title")}
              </h2>
              <div className="mt-6 space-y-6">
                <div className="rounded-lg border border-blue-200 bg-blue-50 p-5">
                  <p className="text-xs font-medium uppercase tracking-wide text-[#003399]">{t("incident.doraRef")}</p>
                  <p className="mt-2 font-semibold text-gray-900">{t("incident.doraTitle")}</p>
                  <ul className="mt-2 list-disc space-y-1 pl-5 text-gray-600">
                    <li>{t("incident.doraInitial")}</li>
                    <li>{t("incident.doraIntermediate")}</li>
                    <li>{t("incident.doraFinal")}</li>
                    <li>{t("incident.doraTemplates")}</li>
                  </ul>
                </div>
                <div className="rounded-lg border border-blue-200 bg-blue-50 p-5">
                  <p className="text-xs font-medium uppercase tracking-wide text-[#003399]">{t("incident.nis2Ref")}</p>
                  <p className="mt-2 font-semibold text-gray-900">{t("incident.nis2Title")}</p>
                  <ul className="mt-2 list-disc space-y-1 pl-5 text-gray-600">
                    <li>{t("incident.nis2EarlyWarning")}</li>
                    <li>{t("incident.nis2Notification")}</li>
                    <li>{t("incident.nis2Final")}</li>
                    <li>{t("incident.nis2CrossBorder")}</li>
                  </ul>
                </div>
                <div className="rounded-lg border border-blue-200 bg-blue-50 p-5">
                  <p className="text-xs font-medium uppercase tracking-wide text-[#003399]">{t("incident.gdprRef")}</p>
                  <p className="mt-2 font-semibold text-gray-900">{t("incident.gdprTitle")}</p>
                  <ul className="mt-2 list-disc space-y-1 pl-5 text-gray-600">
                    <li>{t("incident.gdprAuthority")}</li>
                    <li>{t("incident.gdprSubjects")}</li>
                    <li>{t("incident.gdprContent")}</li>
                  </ul>
                </div>
              </div>
            </section>

            {/* 7. Plan Testing */}
            <section>
              <h2 className="flex items-center gap-2 text-lg font-bold text-[#0d1b3e]">
                <span className="flex h-7 w-7 items-center justify-center rounded-full bg-[#003399] text-xs font-bold text-white">7</span>
                {t("incident.section7Title")}
              </h2>
              <div className="mt-6 space-y-4">
                <div className="rounded-lg border border-gray-200 p-4">
                  <p className="font-semibold text-gray-900">{t("incident.annualReviewTitle")}</p>
                  <p className="mt-1 text-gray-600">{t("incident.annualReviewBody")}</p>
                </div>
                <div className="rounded-lg border border-gray-200 p-4">
                  <p className="font-semibold text-gray-900">{t("incident.tabletopTitle")}</p>
                  <p className="mt-1 text-gray-600">{t("incident.tabletopBody")}</p>
                </div>
                <div className="rounded-lg border border-gray-200 p-4">
                  <p className="font-semibold text-gray-900">{t("incident.postIncidentUpdatesTitle")}</p>
                  <p className="mt-1 text-gray-600">{t("incident.postIncidentUpdatesBody")}</p>
                </div>
              </div>
            </section>

            {/* 8. Contact */}
            <section className="rounded-lg border-2 border-[#003399] bg-blue-50 p-6">
              <h2 className="text-lg font-bold text-[#0d1b3e]">{t("incident.contactTitle")}</h2>
              <p className="mt-2 text-gray-700">{t("incident.contactBody")}</p>
              <p className="mt-3">
                <a href="mailto:incidents@aicompass.eu" className="inline-flex items-center gap-2 rounded-lg bg-[#003399] px-4 py-2 text-sm font-semibold text-white transition hover:bg-[#0d1b3e]">
                  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
                  </svg>
                  incidents@aicompass.eu
                </a>
              </p>
              <p className="mt-4 text-gray-600">
                {(t("incident.contactSecurityBody") as string).split("{securityLink}")[0]}
                <a href="mailto:security@aicompass.eu" className="text-[#003399] hover:underline">security@aicompass.eu</a>
                {((t("incident.contactSecurityBody") as string).split("{securityLink}")[1] || "").split("{policyLink}")[0]}
                <a href={`/${lang}/security`} className="text-[#003399] hover:underline">{t("incident.contactSecurityLinkText")}</a>
                {((t("incident.contactSecurityBody") as string).split("{securityLink}")[1] || "").split("{policyLink}")[1]}
              </p>
              <p className="mt-4 text-xs text-gray-500">{t("incident.contactFooter")}</p>
            </section>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
