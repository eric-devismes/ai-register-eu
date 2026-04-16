import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import Link from "next/link";
import { getDictionary, type Locale } from "@/lib/i18n";

export default async function UnsubscribedPage({
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

  const reEnableText = t("subscribe.unsubscribedReEnable") as string;
  const reEnableParts = reEnableText.split("{accountLink}");

  return (
    <>
      <Header />
      <main className="flex-1 bg-white">
        <div className="mx-auto max-w-md px-4 py-24 text-center">
          <h1 className="text-2xl font-bold text-gray-900">{t("subscribe.unsubscribedTitle")}</h1>
          <p className="mt-3 text-gray-600">
            {t("subscribe.unsubscribedDesc")}
          </p>
          <p className="mt-6 text-sm text-gray-400">
            {reEnableParts[0]}
            <Link href={`/${lang}/account`} className="text-[#003399] hover:underline">
              {t("subscribe.unsubscribedAccountLink")}
            </Link>
            {reEnableParts[1]}
          </p>
        </div>
      </main>
      <Footer />
    </>
  );
}
