"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";

const CATEGORIES = [
  { value: "general", label: "General Enquiry" },
  { value: "correction", label: "Rating Correction" },
  { value: "partnership", label: "Partnership" },
  { value: "press", label: "Press / Media" },
  { value: "services", label: "Services Enquiry" },
];

export function ContactForm() {
  const searchParams = useSearchParams();
  const [form, setForm] = useState({ name: "", email: "", category: "general", subject: "", message: "" });

  // Pre-select category from URL param (e.g., /contact?category=services)
  useEffect(() => {
    const cat = searchParams.get("category");
    if (cat && CATEGORIES.some((c) => c.value === cat)) {
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
        throw new Error(data.error || "Something went wrong");
      }

      setStatus("success");
      setForm({ name: "", email: "", category: "general", subject: "", message: "" });
    } catch (err) {
      setStatus("error");
      setErrorMsg(err instanceof Error ? err.message : "Something went wrong");
    }
  }

  if (status === "success") {
    return (
      <div className="rounded-xl border border-green-200 bg-green-50 p-8 text-center">
        <h2 className="text-lg font-semibold text-green-800">Message sent</h2>
        <p className="mt-2 text-sm text-green-700">
          Thank you for reaching out. We&apos;ll get back to you as soon as possible.
        </p>
        <button onClick={() => setStatus("idle")} className="mt-4 text-sm font-medium text-[#003399] hover:underline">
          Send another message
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="rounded-xl border border-gray-200 bg-white p-8 shadow-sm">
      <h2 className="text-lg font-semibold text-[#0d1b3e]">Send us a message</h2>
      <p className="mt-1 text-sm text-gray-600">Fill in the form below and we&apos;ll respond within 2 business days.</p>

      <div className="mt-6 grid gap-4 sm:grid-cols-2">
        <div>
          <label className="block text-sm font-medium text-gray-700">Name</label>
          <input type="text" required value={form.name} onChange={(e) => update("name", e.target.value)}
            className="mt-1 w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm focus:border-[#003399] focus:outline-none focus:ring-1 focus:ring-[#003399]" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Email</label>
          <input type="email" required value={form.email} onChange={(e) => update("email", e.target.value)}
            className="mt-1 w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm focus:border-[#003399] focus:outline-none focus:ring-1 focus:ring-[#003399]" />
        </div>
      </div>

      <div className="mt-4 grid gap-4 sm:grid-cols-2">
        <div>
          <label className="block text-sm font-medium text-gray-700">Category</label>
          <select value={form.category} onChange={(e) => update("category", e.target.value)}
            className="mt-1 w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm focus:border-[#003399] focus:outline-none focus:ring-1 focus:ring-[#003399]">
            {CATEGORIES.map((c) => <option key={c.value} value={c.value}>{c.label}</option>)}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Subject</label>
          <input type="text" required value={form.subject} onChange={(e) => update("subject", e.target.value)}
            className="mt-1 w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm focus:border-[#003399] focus:outline-none focus:ring-1 focus:ring-[#003399]" />
        </div>
      </div>

      <div className="mt-4">
        <label className="block text-sm font-medium text-gray-700">Message</label>
        <textarea required rows={5} value={form.message} onChange={(e) => update("message", e.target.value)}
          className="mt-1 w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm focus:border-[#003399] focus:outline-none focus:ring-1 focus:ring-[#003399]" />
      </div>

      {status === "error" && <p className="mt-3 text-sm text-red-600">{errorMsg}</p>}

      <button type="submit" disabled={status === "loading"}
        className="mt-6 w-full rounded-lg bg-[#003399] px-6 py-3 text-sm font-semibold text-white transition hover:bg-[#002277] disabled:opacity-50 sm:w-auto">
        {status === "loading" ? "Sending..." : "Send Message"}
      </button>
    </form>
  );
}
