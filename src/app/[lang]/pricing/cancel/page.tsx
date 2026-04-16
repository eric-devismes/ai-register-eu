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
  return getPageMetadata(lang as Locale, "pricingCancel");
}

export default function PricingCancelPage({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  return <CancelContent params={params} />;
}

async function CancelContent({ params }: { params: Promise<{ lang: string }> }) {
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
        <section className="py-24 lg:py-32">
          <div className="mx-auto max-w-2xl px-4 text-center sm:px-6 lg:px-8">
            <h1 className="text-3xl font-bold tracking-tight text-[#0d1b3e] sm:text-4xl">
              {t("pricing.cancel.title")}
            </h1>
            <p className="mt-4 text-lg leading-relaxed text-gray-600">
              {t("pricing.cancel.description")}
            </p>

            <div className="mt-10 flex items-center justify-center gap-4">
              <Link
                href={`/${lang}/pricing`}
                className="inline-flex items-center rounded-lg bg-[#003399] px-6 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-[#002277]"
              >
                {t("pricing.cancel.ctaPricing")}
              </Link>
              <Link
                href={`/${lang}/database`}
                className="inline-flex items-center rounded-lg px-6 py-3 text-sm font-semibold text-[#003399] ring-1 ring-inset ring-[#003399] transition hover:bg-[#003399]/5"
              >
                {t("pricing.cancel.ctaDatabase")}
              </Link>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
