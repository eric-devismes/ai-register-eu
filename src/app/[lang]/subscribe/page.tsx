"use client";

/**
 * Subscribe / Sign In Page — Email-only magic link authentication.
 * New users see a consent checkbox. Returning users just enter email.
 */

import { useState } from "react";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { useT, useLocale } from "@/lib/locale-context";

export default function SubscribePage() {
  const t = useT();
  const locale = useLocale();
  const [email, setEmail] = useState("");
  const [consent, setConsent] = useState(false);
  const [status, setStatus] = useState<"idle" | "loading" | "sent" | "error">("idle");
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("loading");
    setError("");

    const res = await fetch("/api/subscribe", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, consent }),
    });

    if (res.ok) {
      setStatus("sent");
    } else {
      const data = await res.json();
      setError(data.error || "Something went wrong");
      setStatus("error");
    }
  }

  if (status === "sent") {
    return (
      <>
        <Header />
        <main className="flex-1 bg-white">
          <div className="mx-auto max-w-md px-4 py-24 text-center">
            <div className="inline-flex h-16 w-16 items-center justify-center rounded-full bg-[#003399]/10 mb-6">
              <svg className="h-8 w-8 text-[#003399]" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 0 1-2.25 2.25h-15a2.25 2.25 0 0 1-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0 0 19.5 4.5h-15a2.25 2.25 0 0 0-2.25 2.25m19.5 0v.243a2.25 2.25 0 0 1-1.07 1.916l-7.5 4.615a2.25 2.25 0 0 1-2.36 0L3.32 8.91a2.25 2.25 0 0 1-1.07-1.916V6.75" />
              </svg>
            </div>
            <h1 className="text-2xl font-bold text-gray-900">{t("subscribe.checkEmail")}</h1>
            <p className="mt-3 text-gray-600">
              {t("subscribe.sentLinkTo").replace("{email}", "")}
              <strong>{email}</strong>.
              {" "}{t("subscribe.sentLinkExpiry")}
            </p>
            <p className="mt-6 text-sm text-gray-400">
              {t("subscribe.didntReceive")}{" "}
              <button onClick={() => setStatus("idle")} className="text-[#003399] hover:underline">{t("subscribe.tryAgain")}</button>.
            </p>
          </div>
        </main>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Header />
      <main className="flex-1 bg-white">
        <div className="mx-auto max-w-md px-4 py-24">
          <div className="text-center mb-8">
            <h1 className="text-2xl font-bold text-gray-900">{t("subscribe.logIn")}</h1>
            <p className="mt-2 text-gray-600">
              {t("subscribe.logInSubtitle")}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">{t("subscribe.emailLabel")}</label>
              <input
                id="email" type="email" required value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder={t("subscribe.emailPlaceholder")}
                className="mt-1 block w-full rounded-lg border border-gray-300 px-4 py-3 text-sm focus:border-[#003399] focus:outline-none focus:ring-1 focus:ring-[#003399]"
              />
            </div>

            {/* Consent — shown for all, but the API only enforces it for new accounts */}
            <label className="flex items-start gap-3 rounded-lg border border-gray-200 bg-gray-50 p-3">
              <input
                type="checkbox" checked={consent}
                onChange={(e) => setConsent(e.target.checked)}
                className="mt-0.5 h-4 w-4 rounded border-gray-300 text-[#003399] focus:ring-[#003399]"
              />
              <span className="text-xs text-gray-600 leading-relaxed"
                dangerouslySetInnerHTML={{
                  __html: t("subscribe.consentFirstTime").replace(
                    "{privacyLink}",
                    `<a href="/${locale}/privacy" class="text-[#003399] underline">${t("subscribe.privacyLink")}</a>`
                  ),
                }}
              />
            </label>

            {error && (
              <p className="text-sm text-red-600">{error}</p>
            )}

            <button
              type="submit"
              disabled={status === "loading"}
              className="w-full rounded-lg bg-[#003399] px-6 py-3 text-sm font-semibold text-white transition hover:bg-[#003399]/90 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {status === "loading" ? t("subscribe.sendingLink") : t("subscribe.sendMagicLink")}
            </button>
          </form>

          <div className="mt-8 rounded-lg border border-blue-100 bg-blue-50/50 p-4 text-center">
            <p className="text-sm text-gray-700">
              <strong>{t("subscribe.noAccountYet")}</strong> {t("subscribe.noAccountDesc")}
            </p>
            <p className="mt-1 text-xs text-gray-500">
              {t("subscribe.freePlanDesc")}
            </p>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}

