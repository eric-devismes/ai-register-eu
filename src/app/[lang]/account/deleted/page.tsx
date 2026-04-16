import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import Link from "next/link";
import { getDictionary, type Locale } from "@/lib/i18n";

export default async function AccountDeletedPage({
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

  return (
    <>
      <Header />
      <main className="flex-1 bg-white">
        <div className="mx-auto max-w-md px-4 py-24 text-center">
          <h1 className="text-2xl font-bold text-gray-900">{t("account.deletedTitle")}</h1>
          <p className="mt-3 text-gray-600">
            {t("account.deletedDesc")}
          </p>
          <Link href={`/${lang}`} className="mt-8 inline-block rounded-lg bg-[#003399] px-6 py-3 text-sm font-semibold text-white hover:bg-[#003399]/90">
            {t("account.deletedHomepageLink")}
          </Link>
        </div>
      </main>
      <Footer />
    </>
  );
}
