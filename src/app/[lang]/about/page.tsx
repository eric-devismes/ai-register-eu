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
  return getPageMetadata(lang as Locale, "about");
}

export default function AboutPage({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  return <AboutContent params={params} />;
}

async function AboutContent({ params }: { params: Promise<{ lang: string }> }) {
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

  const values = [
    { titleKey: "about.value1Title", descKey: "about.value1Desc" },
    { titleKey: "about.value2Title", descKey: "about.value2Desc" },
    { titleKey: "about.value3Title", descKey: "about.value3Desc" },
    { titleKey: "about.value4Title", descKey: "about.value4Desc" },
  ];

  return (
    <>
      <Header />
      <main className="flex-1">
        {/* Hero */}
        <section className="bg-gradient-to-br from-[#0d1b3e] to-[#003399] text-white">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16 lg:py-24">
            <div className="max-w-3xl">
              <p className="text-sm font-semibold text-[#ffc107] tracking-wide uppercase">
                {t("about.badge")}
              </p>
              <h1 className="mt-3 text-4xl font-bold tracking-tight sm:text-5xl">
                {t("about.heroTitle")}
              </h1>
              <p className="mt-4 text-lg text-blue-100 leading-relaxed">
                {t("about.heroSubtitle")}
              </p>
            </div>
          </div>
        </section>

        {/* Mission */}
        <section className="py-16 lg:py-24">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="mx-auto max-w-3xl">
              <h2 className="text-2xl font-bold text-[#0d1b3e] sm:text-3xl">
                {t("about.missionTitle")}
              </h2>
              <p className="mt-4 text-gray-600 leading-relaxed">
                {t("about.missionP1")}
              </p>
              <p className="mt-4 text-gray-600 leading-relaxed">
                {t("about.missionP2")}
              </p>
            </div>

            {/* Values */}
            <div className="mt-16">
              <h2 className="text-center text-2xl font-bold text-[#0d1b3e] sm:text-3xl">
                {t("about.valuesTitle")}
              </h2>
              <div className="mt-10 grid gap-8 sm:grid-cols-2">
                {values.map((value) => (
                  <div
                    key={value.titleKey}
                    className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm"
                  >
                    <div className="h-1 w-10 rounded-full bg-[#ffc107]" />
                    <h3 className="mt-4 text-lg font-semibold text-[#0d1b3e]">
                      {t(value.titleKey)}
                    </h3>
                    <p className="mt-2 text-sm text-gray-600 leading-relaxed">
                      {t(value.descKey)}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Contact */}
            <div className="mt-16 mx-auto max-w-2xl text-center">
              <h2 className="text-2xl font-bold text-[#0d1b3e] sm:text-3xl">
                {t("about.contactTitle")}
              </h2>
              <p className="mt-4 text-gray-600 leading-relaxed">
                {t("about.contactText").split("{email}")[0]}
                <a
                  href="mailto:contact@vendorscope.eu"
                  className="font-semibold text-[#003399] hover:underline"
                >
                  contact@vendorscope.eu
                </a>
                {t("about.contactText").split("{email}")[1]}
              </p>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
