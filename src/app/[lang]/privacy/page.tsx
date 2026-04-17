/**
 * Privacy Policy Page — GDPR-compliant privacy practices for AI Compass EU.
 *
 * URL: /[lang]/privacy
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
  return getPageMetadata(lang as Locale, "privacy");
}

export default function PrivacyPage({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  return <PrivacyContent params={params} />;
}

async function PrivacyContent({ params }: { params: Promise<{ lang: string }> }) {
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
        <div className="mx-auto max-w-3xl px-4 py-16 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold text-gray-900">{t("privacy.title")}</h1>
          <p className="mt-2 text-sm text-gray-500">{(t("privacy.lastUpdated") as string).replace("{date}", lastUpdated)}</p>

          <div className="mt-10 space-y-10 text-sm leading-relaxed text-gray-700">

            {/* 1. Who we are */}
            <section>
              <h2 className="text-lg font-bold text-gray-900">{t("privacy.section1Title")}</h2>
              <p className="mt-3">{t("privacy.section1Body")}</p>
              <p className="mt-2">
                {(t("privacy.section1Controller") as string).split("{link}")[0]}
                <a href="mailto:privacy@aicompass.eu" className="text-[#003399] hover:underline">privacy@aicompass.eu</a>
                {(t("privacy.section1Controller") as string).split("{link}")[1]}
              </p>
            </section>

            {/* 2. What data we collect */}
            <section>
              <h2 className="text-lg font-bold text-gray-900">{t("privacy.section2Title")}</h2>
              <p className="mt-3">{t("privacy.section2Intro")}</p>
              <div className="mt-4 overflow-hidden rounded-lg border border-gray-200">
                <table className="w-full text-left text-sm">
                  <thead className="bg-gray-50 text-xs uppercase text-gray-500">
                    <tr>
                      <th className="px-4 py-3">{t("privacy.tableHeaderData")}</th>
                      <th className="px-4 py-3">{t("privacy.tableHeaderPurpose")}</th>
                      <th className="px-4 py-3">{t("privacy.tableHeaderLegalBasis")}</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    <tr>
                      <td className="px-4 py-3 font-medium">{t("privacy.dataEmail")}</td>
                      <td className="px-4 py-3">{t("privacy.dataEmailPurpose")}</td>
                      <td className="px-4 py-3">{t("privacy.dataEmailBasis")}</td>
                    </tr>
                    <tr>
                      <td className="px-4 py-3 font-medium">{t("privacy.dataTopics")}</td>
                      <td className="px-4 py-3">{t("privacy.dataTopicsPurpose")}</td>
                      <td className="px-4 py-3">{t("privacy.dataTopicsBasis")}</td>
                    </tr>
                    <tr>
                      <td className="px-4 py-3 font-medium">{t("privacy.dataProfile")}</td>
                      <td className="px-4 py-3">{t("privacy.dataProfilePurpose")}</td>
                      <td className="px-4 py-3">{t("privacy.dataProfileBasis")}</td>
                    </tr>
                    <tr>
                      <td className="px-4 py-3 font-medium">{t("privacy.dataChatbot")}</td>
                      <td className="px-4 py-3">{t("privacy.dataChatbotPurpose")}</td>
                      <td className="px-4 py-3">{t("privacy.dataChatbotBasis")}</td>
                    </tr>
                    <tr>
                      <td className="px-4 py-3 font-medium">{t("privacy.dataConsent")}</td>
                      <td className="px-4 py-3">{t("privacy.dataConsentPurpose")}</td>
                      <td className="px-4 py-3">{t("privacy.dataConsentBasis")}</td>
                    </tr>
                    <tr>
                      <td className="px-4 py-3 font-medium">{t("privacy.dataDigest")}</td>
                      <td className="px-4 py-3">{t("privacy.dataDigestPurpose")}</td>
                      <td className="px-4 py-3">{t("privacy.dataDigestBasis")}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <p className="mt-4 font-semibold text-gray-900">{t("privacy.notCollectTitle")}</p>
              <ul className="mt-2 list-disc pl-5 space-y-1">
                <li>{t("privacy.notCollect1")}</li>
                <li>{t("privacy.notCollect2")}</li>
                <li>{t("privacy.notCollect3")}</li>
                <li>{t("privacy.notCollect4")}</li>
                <li>{t("privacy.notCollect5")}</li>
              </ul>
            </section>

            {/* 3. How we use your data */}
            <section>
              <h2 className="text-lg font-bold text-gray-900">{t("privacy.section3Title")}</h2>
              <p className="mt-3">{t("privacy.section3Intro")}</p>
              <ul className="mt-2 list-disc pl-5 space-y-1">
                <li>{t("privacy.usage1")}</li>
                <li>{t("privacy.usage2")}</li>
                <li>{t("privacy.usage3")}</li>
                <li>{t("privacy.usage4")}</li>
              </ul>
              <p className="mt-3">{t("privacy.section3NoSale")}</p>
            </section>

            {/* 4. Your rights */}
            <section>
              <h2 className="text-lg font-bold text-gray-900">{t("privacy.section4Title")}</h2>
              <p className="mt-3">{t("privacy.section4Intro")}</p>
              <div className="mt-4 space-y-4">
                {([
                  { titleKey: "privacy.rightAccessTitle", bodyKey: "privacy.rightAccessBody", hasLink: true },
                  { titleKey: "privacy.rightPortabilityTitle", bodyKey: "privacy.rightPortabilityBody", hasLink: true },
                  { titleKey: "privacy.rightErasureTitle", bodyKey: "privacy.rightErasureBody", hasLink: true },
                  { titleKey: "privacy.rightWithdrawTitle", bodyKey: "privacy.rightWithdrawBody", hasLink: true },
                  { titleKey: "privacy.rightRectificationTitle", bodyKey: "privacy.rightRectificationBody", hasLink: false },
                  { titleKey: "privacy.rightComplaintTitle", bodyKey: "privacy.rightComplaintBody", hasLink: false },
                ] as const).map((right, i) => (
                  <div key={i} className="rounded-lg border border-gray-200 p-4">
                    <p className="font-semibold text-gray-900">{t(right.titleKey)}</p>
                    <p className="mt-1 text-gray-600">
                      {right.titleKey === "privacy.rightComplaintTitle" ? (
                        <>
                          {(t(right.bodyKey) as string).split("{link}")[0]}
                          <a href="https://www.cnil.fr" target="_blank" rel="noopener noreferrer" className="text-[#003399] hover:underline">CNIL</a>
                          {(t(right.bodyKey) as string).split("{link}")[1]}
                        </>
                      ) : right.hasLink ? (
                        <>
                          {(t(right.bodyKey) as string).split("{link}")[0]}
                          <a href={`/${lang}/account`} className="text-[#003399] hover:underline">{t("privacy.rightAccessLink")}</a>
                          {(t(right.bodyKey) as string).split("{link}")[1]}
                        </>
                      ) : (
                        t(right.bodyKey)
                      )}
                    </p>
                  </div>
                ))}
              </div>
            </section>

            {/* 5. Data storage and security */}
            <section>
              <h2 className="text-lg font-bold text-gray-900">{t("privacy.section5Title")}</h2>
              <ul className="mt-3 list-disc pl-5 space-y-1">
                {(t("privacy.section5Items") as unknown as string[]).map((item, i) => (
                  <li key={i}>{item}</li>
                ))}
              </ul>
            </section>

            {/* 6. Data retention */}
            <section>
              <h2 className="text-lg font-bold text-gray-900">{t("privacy.section6Title")}</h2>
              <ul className="mt-3 list-disc pl-5 space-y-1">
                {(t("privacy.section6Items") as unknown as string[]).map((item, i) => (
                  <li key={i}>{item}</li>
                ))}
              </ul>
            </section>

            {/* 7. Third-party processors */}
            <section>
              <h2 className="text-lg font-bold text-gray-900">{t("privacy.section7Title")}</h2>
              <p className="mt-3">{t("privacy.section7Intro")}</p>
              <div className="mt-4 overflow-hidden rounded-lg border border-gray-200">
                <table className="w-full text-left text-sm">
                  <thead className="bg-gray-50 text-xs uppercase text-gray-500">
                    <tr>
                      <th className="px-4 py-3">{t("privacy.tableHeaderService")}</th>
                      <th className="px-4 py-3">{t("privacy.tableHeaderPurpose")}</th>
                      <th className="px-4 py-3">{t("privacy.tableHeaderDataProcessed")}</th>
                      <th className="px-4 py-3">{t("privacy.tableHeaderLocation")}</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    <tr>
                      <td className="px-4 py-3 font-medium">{t("privacy.processorVercel")}</td>
                      <td className="px-4 py-3">{t("privacy.processorVercelPurpose")}</td>
                      <td className="px-4 py-3">{t("privacy.processorVercelData")}</td>
                      <td className="px-4 py-3">{t("privacy.processorVercelLocation")}</td>
                    </tr>
                    <tr>
                      <td className="px-4 py-3 font-medium">{t("privacy.processorResend")}</td>
                      <td className="px-4 py-3">{t("privacy.processorResendPurpose")}</td>
                      <td className="px-4 py-3">{t("privacy.processorResendData")}</td>
                      <td className="px-4 py-3">{t("privacy.processorResendLocation")}</td>
                    </tr>
                    <tr>
                      <td className="px-4 py-3 font-medium">{t("privacy.processorAnthropic")}</td>
                      <td className="px-4 py-3">{t("privacy.processorAnthropicPurpose")}</td>
                      <td className="px-4 py-3">{t("privacy.processorAnthropicData")}</td>
                      <td className="px-4 py-3">{t("privacy.processorAnthropicLocation")}</td>
                    </tr>
                    <tr>
                      <td className="px-4 py-3 font-medium">{t("privacy.processorLemonSqueezy")}</td>
                      <td className="px-4 py-3">{t("privacy.processorLemonSqueezyPurpose")}</td>
                      <td className="px-4 py-3">{t("privacy.processorLemonSqueezyData")}</td>
                      <td className="px-4 py-3">{t("privacy.processorLemonSqueezyLocation")}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <p className="mt-3">{t("privacy.section7Bound")}</p>
            </section>

            {/* 8. International transfers */}
            <section>
              <h2 className="text-lg font-bold text-gray-900">{t("privacy.section8Title")}</h2>
              <p className="mt-3">{t("privacy.section8Body")}</p>
            </section>

            {/* 9. Cookies */}
            <section>
              <h2 className="text-lg font-bold text-gray-900">{t("privacy.section9Title")}</h2>
              <p className="mt-3">{t("privacy.section9Intro")}</p>
              <div className="mt-4 overflow-hidden rounded-lg border border-gray-200">
                <table className="w-full text-left text-sm">
                  <thead className="bg-gray-50 text-xs uppercase text-gray-500">
                    <tr>
                      <th className="px-4 py-3">{t("privacy.tableHeaderCookie")}</th>
                      <th className="px-4 py-3">{t("privacy.tableHeaderPurpose")}</th>
                      <th className="px-4 py-3">{t("privacy.tableHeaderDuration")}</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    <tr>
                      <td className="px-4 py-3 font-mono text-xs">{t("privacy.cookieSession")}</td>
                      <td className="px-4 py-3">{t("privacy.cookieSessionPurpose")}</td>
                      <td className="px-4 py-3">{t("privacy.cookieSessionDuration")}</td>
                    </tr>
                    <tr>
                      <td className="px-4 py-3 font-mono text-xs">{t("privacy.cookieFingerprint")}</td>
                      <td className="px-4 py-3">{t("privacy.cookieFingerprintPurpose")}</td>
                      <td className="px-4 py-3">{t("privacy.cookieFingerprintDuration")}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <p className="mt-3">{t("privacy.section9NoCookies")}</p>
            </section>

            {/* 10. Changes */}
            <section>
              <h2 className="text-lg font-bold text-gray-900">{t("privacy.section10Title")}</h2>
              <p className="mt-3">{t("privacy.section10Body")}</p>
            </section>

            {/* 11. Contact */}
            <section>
              <h2 className="text-lg font-bold text-gray-900">{t("privacy.section11Title")}</h2>
              <p className="mt-3">{t("privacy.section11Body")}</p>
              <p className="mt-2">
                <a href="mailto:privacy@aicompass.eu" className="text-[#003399] hover:underline">privacy@aicompass.eu</a>
              </p>
              <p className="mt-4 text-xs text-gray-400">{t("privacy.section11Complaint")}</p>
            </section>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
