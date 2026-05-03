import type { Metadata } from "next";
import { Suspense } from "react";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { ContactForm } from "./ContactForm";
import { getPageMetadata, getDictionary, type Locale } from "@/lib/i18n";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string }>;
}): Promise<Metadata> {
  const { lang } = await params;
  return getPageMetadata(lang as Locale, "contact");
}

export default function ContactPage({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  return <ContactContent params={params} />;
}

async function ContactContent({ params }: { params: Promise<{ lang: string }> }) {
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

  return (
    <>
      <Header />
      <main className="flex-1">
        <section className="bg-gradient-to-br from-[#0d1b3e] to-[#003399] text-white">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16 lg:py-24">
            <div className="max-w-3xl">
              <p className="text-sm font-semibold text-[#ffc107] tracking-wide uppercase">
                {t("contact.badge")}
              </p>
              <h1 className="mt-3 text-4xl font-bold tracking-tight sm:text-5xl">
                {t("contact.heroTitle")}
              </h1>
              <p className="mt-4 text-lg text-blue-100 leading-relaxed">
                {t("contact.heroSubtitle")}
              </p>
            </div>
          </div>
        </section>

        <section className="py-16 lg:py-24">
          <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
            <Suspense fallback={null}>
              <ContactForm />
            </Suspense>

            <div className="mt-16 grid gap-8 sm:grid-cols-2">
              <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
                <h2 className="text-lg font-semibold text-[#0d1b3e]">
                  {t("contact.generalTitle")}
                </h2>
                <p className="mt-2 text-sm text-gray-600 leading-relaxed">
                  {t("contact.generalDesc")}
                </p>
                <a href="mailto:contact@vendorscope.eu" className="mt-4 inline-flex items-center text-sm font-semibold text-[#003399] hover:underline">
                  contact@vendorscope.eu
                </a>
              </div>
              <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
                <h2 className="text-lg font-semibold text-[#0d1b3e]">
                  {t("contact.correctionsTitle")}
                </h2>
                <p className="mt-2 text-sm text-gray-600 leading-relaxed">
                  {t("contact.correctionsDesc")}
                </p>
                <a href="mailto:corrections@vendorscope.eu" className="mt-4 inline-flex items-center text-sm font-semibold text-[#003399] hover:underline">
                  corrections@vendorscope.eu
                </a>
              </div>
              <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
                <h2 className="text-lg font-semibold text-[#0d1b3e]">
                  {t("contact.partnershipsTitle")}
                </h2>
                <p className="mt-2 text-sm text-gray-600 leading-relaxed">
                  {t("contact.partnershipsDesc")}
                </p>
                <a href="mailto:partnerships@vendorscope.eu" className="mt-4 inline-flex items-center text-sm font-semibold text-[#003399] hover:underline">
                  partnerships@vendorscope.eu
                </a>
              </div>
              <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
                <h2 className="text-lg font-semibold text-[#0d1b3e]">
                  {t("contact.pressTitle")}
                </h2>
                <p className="mt-2 text-sm text-gray-600 leading-relaxed">
                  {t("contact.pressDesc")}
                </p>
                <a href="mailto:press@vendorscope.eu" className="mt-4 inline-flex items-center text-sm font-semibold text-[#003399] hover:underline">
                  press@vendorscope.eu
                </a>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
