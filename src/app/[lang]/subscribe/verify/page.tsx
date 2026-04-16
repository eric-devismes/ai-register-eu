/**
 * Magic link verification handler.
 * This page is hit when the user clicks the link in their email.
 * The actual verification is done by the API route — this page just shows status.
 */

import Link from "next/link";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { getDictionary, type Locale } from "@/lib/i18n";

export default async function VerifyPage({
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

  const redirectText = t("subscribe.verifyRedirect") as string;
  const parts = redirectText.split("{retryLink}");

  // The API route /api/subscribe/verify handles the actual verification
  // and redirects to /account on success or back here on failure.
  return (
    <>
      <Header />
      <main className="flex-1 bg-white">
        <div className="mx-auto max-w-md px-4 py-24 text-center">
          <h1 className="text-2xl font-bold text-gray-900">{t("subscribe.verifyTitle")}</h1>
          <p className="mt-3 text-gray-600">
            {parts[0]}
            <Link href={`/${lang}/subscribe`} className="text-[#003399] hover:underline">
              {t("subscribe.verifyRetryText")}
            </Link>
            {parts[1]}
          </p>
        </div>
      </main>
      <Footer />
    </>
  );
}
