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
  return getPageMetadata(lang as Locale, "terms");
}

export default function TermsPage({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  return <TermsContent params={params} />;
}

async function TermsContent({ params }: { params: Promise<{ lang: string }> }) {
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

  const sections = [
    { titleKey: "terms.section1Title", bodyKey: "terms.section1Body" },
    { titleKey: "terms.section2Title", bodyKey: "terms.section2Body" },
    { titleKey: "terms.section3Title", bodyKey: "terms.section3Body" },
    { titleKey: "terms.section4Title", bodyKey: "terms.section4Body" },
    { titleKey: "terms.section5Title", bodyKey: "terms.section5Body" },
    { titleKey: "terms.section6Title", bodyKey: "terms.section6Body" },
    { titleKey: "terms.section7Title", bodyKey: "terms.section7Body" },
    { titleKey: "terms.section8Title", bodyKey: "terms.section8Body" },
    { titleKey: "terms.section9Title", bodyKey: "terms.section9Body" },
  ];

  return (
    <>
      <Header />
      <main className="flex-1">
        <section className="bg-gradient-to-br from-[#0d1b3e] to-[#003399] text-white">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16 lg:py-24">
            <div className="max-w-3xl">
              <p className="text-sm font-semibold text-[#ffc107] tracking-wide uppercase">
                {t("terms.badge")}
              </p>
              <h1 className="mt-3 text-4xl font-bold tracking-tight sm:text-5xl">
                {t("terms.title")}
              </h1>
              <p className="mt-4 text-lg text-blue-100 leading-relaxed">
                {t("terms.lastUpdated")}
              </p>
            </div>
          </div>
        </section>

        <section className="py-16 lg:py-24">
          <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 prose prose-gray">
            {sections.map((s, i) => (
              <div key={i}>
                <h2 className={`${i > 0 ? "mt-10 " : ""}text-xl font-bold text-[#0d1b3e]`}>
                  {t(s.titleKey)}
                </h2>
                <p className="mt-3 text-gray-600 leading-relaxed">{t(s.bodyKey)}</p>
              </div>
            ))}

            <h2 className="mt-10 text-xl font-bold text-[#0d1b3e]">{t("terms.section10Title")}</h2>
            <p className="mt-3 text-gray-600 leading-relaxed">
              {(t("terms.section10Body") as string).split("{link}")[0]}
              <a
                href="mailto:contact@aicompass.eu"
                className="font-semibold text-[#003399] hover:underline"
              >
                contact@aicompass.eu
              </a>
              {(t("terms.section10Body") as string).split("{link}")[1]}
            </p>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
