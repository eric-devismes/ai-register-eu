"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { useT } from "@/lib/locale-context";

const CATEGORY_VALUES = ["general", "correction", "partnership", "press", "services"] as const;
const CATEGORY_LABEL_KEYS = [
  "contact.form.catGeneral",
  "contact.form.catCorrection",
  "contact.form.catPartnership",
  "contact.form.catPress",
  "contact.form.catServices",
] as const;

export function ContactForm() {
  const t = useT();
  const searchParams = useSearchParams();
  const [form, setForm] = useState({ name: "", email: "", category: "general", subject: "", message: "" });

  // Pre-select category from URL param (e.g., /contact?category=services)
  useEffect(() => {
    const cat = searchParams.get("category");
    if (cat && CATEGORY_VALUES.includes(cat as typeof CATEGORY_VALUES[number])) {
      setForm((prev) => ({ ...prev, category: cat }));
    }
  }, [searchParams]);
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState("");

  function update(field: string, value: string) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("loading");
    setErrorMsg("");

    try {
      const res = await fetch("/api/feedback", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || t("contact.form.genericError"));
      }

      setStatus("success");
      setForm({ name: "", email: "", category: "general", subject: "", message: "" });
    } catch (err) {
      setStatus("error");
      setErrorMsg(err instanceof Error ? err.message : t("contact.form.genericError"));
    }
  }

  if (status === "success") {
    return (
      <div className="rounded-xl border border-green-200 bg-green-50 p-8 text-center">
        <h2 className="text-lg font-semibold text-green-800">{t("contact.form.successTitle")}</h2>
        <p className="mt-2 text-sm text-green-700">
          {t("contact.form.successText")}
        </p>
        <button onClick={() => setStatus("idle")} className="mt-4 text-sm font-medium text-[#003399] hover:underline">
          {t("contact.form.sendAnother")}
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="rounded-xl border border-gray-200 bg-white p-8 shadow-sm">
      <h2 className="text-lg font-semibold text-[#0d1b3e]">{t("contact.form.title")}</h2>
      <p className="mt-1 text-sm text-gray-600">{t("contact.form.subtitle")}</p>

      <div className="mt-6 grid gap-4 sm:grid-cols-2">
        <div>
          <label className="block text-sm font-medium text-gray-700">{t("contact.form.name")}</label>
          <input type="text" required value={form.name} onChange={(e) => update("name", e.target.value)}
            className="mt-1 w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm focus:border-[#003399] focus:outline-none focus:ring-1 focus:ring-[#003399]" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">{t("contact.form.email")}</label>
          <input type="email" required value={form.email} onChange={(e) => update("email", e.target.value)}
            className="mt-1 w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm focus:border-[#003399] focus:outline-none focus:ring-1 focus:ring-[#003399]" />
        </div>
      </div>

      <div className="mt-4 grid gap-4 sm:grid-cols-2">
        <div>
          <label className="block text-sm font-medium text-gray-700">{t("contact.form.category")}</label>
          <select value={form.category} onChange={(e) => update("category", e.target.value)}
            className="mt-1 w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm focus:border-[#003399] focus:outline-none focus:ring-1 focus:ring-[#003399]">
            {CATEGORY_VALUES.map((value, i) => (
              <option key={value} value={value}>{t(CATEGORY_LABEL_KEYS[i])}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">{t("contact.form.subject")}</label>
          <input type="text" required value={form.subject} onChange={(e) => update("subject", e.target.value)}
            className="mt-1 w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm focus:border-[#003399] focus:outline-none focus:ring-1 focus:ring-[#003399]" />
        </div>
      </div>

      <div className="mt-4">
        <label className="block text-sm font-medium text-gray-700">{t("contact.form.message")}</label>
        <textarea required rows={5} value={form.message} onChange={(e) => update("message", e.target.value)}
          className="mt-1 w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm focus:border-[#003399] focus:outline-none focus:ring-1 focus:ring-[#003399]" />
      </div>

      {status === "error" && <p className="mt-3 text-sm text-red-600">{errorMsg}</p>}

      <button type="submit" disabled={status === "loading"}
        className="mt-6 w-full rounded-lg bg-[#003399] px-6 py-3 text-sm font-semibold text-white transition hover:bg-[#002277] disabled:opacity-50 sm:w-auto">
        {status === "loading" ? t("contact.form.sending") : t("contact.form.submit")}
      </button>
    </form>
  );
}
