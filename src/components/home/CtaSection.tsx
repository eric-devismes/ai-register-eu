"use client";

import { useState } from "react";
import { useT } from "@/lib/locale-context";

export default function CtaSection() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState("");
  const t = useT();

  async function handleSubscribe() {
    if (!email || !email.includes("@")) return;

    setStatus("loading");
    setErrorMsg("");

    try {
      const res = await fetch("/api/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, consent: true }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Something went wrong");
      }

      setStatus("success");
      setEmail("");
    } catch (err) {
      setStatus("error");
      setErrorMsg(err instanceof Error ? err.message : "Something went wrong");
    }
  }

  return (
    <section className="bg-[#003399]">
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-2xl font-bold text-white sm:text-3xl">{t("cta.title")}</h2>
          <p className="mt-3 text-blue-100/80">{t("cta.subtitle")}</p>

          {status === "success" ? (
            <p className="mt-8 text-sm font-medium text-[#ffc107]">
              {t("cta.confirmationMessage")}
            </p>
          ) : (
            <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSubscribe()}
                placeholder={t("cta.placeholder")}
                className="w-full rounded-lg bg-white/10 px-5 py-3.5 text-sm text-white placeholder-blue-200/50 ring-1 ring-white/20 backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-[#ffc107]/50 sm:max-w-sm"
              />
              <button
                type="button"
                onClick={handleSubscribe}
                disabled={status === "loading"}
                className="rounded-lg bg-[#ffc107] px-8 py-3.5 text-sm font-semibold text-[#0d1b3e] transition hover:bg-[#ffcd38] disabled:opacity-50"
              >
                {status === "loading" ? "..." : t("cta.button")}
              </button>
            </div>
          )}

          {status === "error" && (
            <p className="mt-3 text-sm text-red-300">{errorMsg}</p>
          )}

          <p className="mt-4 text-xs text-blue-200/50">{t("cta.disclaimer")}</p>
        </div>
      </div>
    </section>
  );
}
