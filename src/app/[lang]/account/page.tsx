"use client";

/**
 * Account Page — Manage preferences, digest settings, and GDPR rights.
 *
 * Shows:
 *   - Selected frameworks and systems (checkboxes)
 *   - Digest frequency toggle
 *   - GDPR actions: export data, delete account
 */

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";

interface Framework { id: string; slug: string; name: string }
interface System { id: string; slug: string; vendor: string; name: string }
interface Subscriber {
  email: string;
  tier: string;
  subscriptionId: string | null;
  tierExpiresAt: string | null;
  digestFrequency: string;
  frameworks: Framework[];
  systems: System[];
}

export default function AccountPage() {
  const router = useRouter();
  const params = useParams();
  const lang = (params?.lang as string) || "en";
  const [loading, setLoading] = useState(true);
  const [subscriber, setSubscriber] = useState<Subscriber | null>(null);
  const [allFrameworks, setAllFrameworks] = useState<Framework[]>([]);
  const [allSystems, setAllSystems] = useState<System[]>([]);
  const [selectedFrameworks, setSelectedFrameworks] = useState<string[]>([]);
  const [selectedSystems, setSelectedSystems] = useState<string[]>([]);
  const [digestFreq, setDigestFreq] = useState("daily");
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [saved, setSaved] = useState(false);
  const [portalLoading, setPortalLoading] = useState(false);

  useEffect(() => {
    // Fetch subscriber data + all options
    Promise.all([
      fetch("/api/feed").then((r) => r.json()),
      fetch("/api/account/options").then((r) => r.json()),
    ]).then(([feedData, options]) => {
      if (!feedData.authenticated) {
        router.push("/subscribe");
        return;
      }
      setSubscriber(options.subscriber);
      setAllFrameworks(options.frameworks);
      setAllSystems(options.systems);
      setSelectedFrameworks(options.subscriber.frameworks.map((f: Framework) => f.id));
      setSelectedSystems(options.subscriber.systems.map((s: System) => s.id));
      setDigestFreq(options.subscriber.digestFrequency);
      setLoading(false);
    });
  }, [router]);

  async function handleSave() {
    setSaving(true);
    setSaved(false);
    await fetch("/api/account/preferences", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        frameworkIds: selectedFrameworks,
        systemIds: selectedSystems,
        digestFrequency: digestFreq,
      }),
    });
    setSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  }

  async function handleDelete() {
    if (!confirm("This will permanently delete your account and all data. This cannot be undone. Continue?")) return;
    setDeleting(true);
    await fetch("/api/account/delete", { method: "DELETE" });
    router.push("/account/deleted");
  }

  async function handleManageSubscription() {
    setPortalLoading(true);
    try {
      const res = await fetch("/api/lemonsqueezy/portal");
      const data = await res.json();
      if (data.url) {
        window.open(data.url, "_blank");
      } else {
        alert(data.error || "Could not open subscription portal");
      }
    } catch {
      alert("Could not connect to payment service");
    }
    setPortalLoading(false);
  }

  async function handleLogout() {
    await fetch("/api/subscribe/logout", { method: "POST" });
    router.push("/");
  }

  function toggleFramework(id: string) {
    setSelectedFrameworks((prev) => prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]);
  }

  function toggleSystem(id: string) {
    setSelectedSystems((prev) => prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]);
  }

  if (loading) {
    return (
      <>
        <Header />
        <main className="flex-1 bg-white"><div className="mx-auto max-w-2xl px-4 py-24 text-center text-gray-500">Loading...</div></main>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Header />
      <main className="flex-1 bg-white">
        <div className="mx-auto max-w-2xl px-4 py-16">
          <h1 className="text-2xl font-bold text-gray-900">Your Account</h1>
          <p className="mt-1 text-sm text-gray-500">{subscriber?.email}</p>

          {/* ── Frameworks ── */}
          <div className="mt-10">
            <h2 className="text-lg font-bold text-gray-900">Regulatory Frameworks</h2>
            <p className="mt-1 text-sm text-gray-500">Select the frameworks you want updates about.</p>
            <div className="mt-4 grid grid-cols-1 gap-2 sm:grid-cols-2">
              {allFrameworks.map((fw) => (
                <label key={fw.id} className={`flex items-center gap-3 rounded-lg border px-4 py-3 cursor-pointer transition ${
                  selectedFrameworks.includes(fw.id) ? "border-[#003399] bg-[#003399]/5" : "border-gray-200 hover:bg-gray-50"
                }`}>
                  <input type="checkbox" checked={selectedFrameworks.includes(fw.id)} onChange={() => toggleFramework(fw.id)}
                    className="h-4 w-4 rounded border-gray-300 text-[#003399] focus:ring-[#003399]" />
                  <span className="text-sm font-medium text-gray-900">{fw.name}</span>
                </label>
              ))}
            </div>
          </div>

          {/* ── AI Systems ── */}
          <div className="mt-10">
            <h2 className="text-lg font-bold text-gray-900">AI Systems</h2>
            <p className="mt-1 text-sm text-gray-500">Select the AI systems you want updates about.</p>
            <div className="mt-4 grid grid-cols-1 gap-2 sm:grid-cols-2">
              {allSystems.map((sys) => (
                <label key={sys.id} className={`flex items-center gap-3 rounded-lg border px-4 py-3 cursor-pointer transition ${
                  selectedSystems.includes(sys.id) ? "border-[#003399] bg-[#003399]/5" : "border-gray-200 hover:bg-gray-50"
                }`}>
                  <input type="checkbox" checked={selectedSystems.includes(sys.id)} onChange={() => toggleSystem(sys.id)}
                    className="h-4 w-4 rounded border-gray-300 text-[#003399] focus:ring-[#003399]" />
                  <div>
                    <span className="text-sm font-medium text-gray-900">{sys.name}</span>
                    <span className="text-xs text-gray-500 ml-1">{sys.vendor}</span>
                  </div>
                </label>
              ))}
            </div>
          </div>

          {/* ── Digest Frequency ── */}
          <div className="mt-10">
            <h2 className="text-lg font-bold text-gray-900">Email Digest</h2>
            <div className="mt-4 flex gap-3">
              {["daily", "weekly", "none"].map((freq) => (
                <button key={freq} onClick={() => setDigestFreq(freq)}
                  className={`rounded-lg px-5 py-2 text-sm font-medium transition ${
                    digestFreq === freq ? "bg-[#003399] text-white" : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                  }`}>
                  {freq === "none" ? "Off" : freq.charAt(0).toUpperCase() + freq.slice(1)}
                </button>
              ))}
            </div>
          </div>

          {/* ── Save ── */}
          <div className="mt-8 flex items-center gap-4">
            <button onClick={handleSave} disabled={saving}
              className="rounded-lg bg-[#003399] px-6 py-3 text-sm font-semibold text-white transition hover:bg-[#003399]/90 disabled:opacity-50">
              {saving ? "Saving..." : "Save Preferences"}
            </button>
            {saved && <span className="text-sm text-green-600">Saved!</span>}
          </div>

          {/* ── Subscription ── */}
          <div className="mt-16 border-t border-gray-200 pt-8">
            <h2 className="text-lg font-bold text-gray-900">Subscription</h2>
            <div className="mt-4 rounded-xl border border-gray-200 p-6">
              <div className="flex items-center justify-between">
                <div>
                  <div className="flex items-center gap-3">
                    <span className={`inline-flex items-center rounded-full px-3 py-1 text-sm font-semibold ${
                      subscriber?.tier === "enterprise" ? "bg-purple-100 text-purple-700" :
                      subscriber?.tier === "pro" ? "bg-blue-100 text-blue-700" :
                      "bg-gray-100 text-gray-600"
                    }`}>
                      {subscriber?.tier === "enterprise" ? "Enterprise" :
                       subscriber?.tier === "pro" ? "Pro" : "Free"}
                    </span>
                    {subscriber?.tier === "pro" && (
                      <span className="text-xs text-gray-500">
                        {subscriber?.tierExpiresAt
                          ? `Renews ${new Date(subscriber.tierExpiresAt).toLocaleDateString()}`
                          : "Active subscription"}
                      </span>
                    )}
                  </div>
                  <p className="mt-2 text-sm text-gray-500">
                    {subscriber?.tier === "pro"
                      ? "Full access to all AI systems, unlimited chat, exports, and real-time alerts."
                      : subscriber?.tier === "enterprise"
                      ? "Everything in Pro plus API access, multi-seat, and dedicated support."
                      : "Access to 5 AI systems. Upgrade to Pro for full access."}
                  </p>
                </div>
              </div>

              <div className="mt-4 flex gap-3">
                {subscriber?.tier === "free" && (
                  <a
                    href={`/${lang}/pricing`}
                    className="rounded-lg bg-[#003399] px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-[#003399]/90"
                  >
                    Upgrade to Pro
                  </a>
                )}
                {subscriber?.tier === "pro" && subscriber?.subscriptionId && (
                  <button
                    onClick={handleManageSubscription}
                    disabled={portalLoading}
                    className="rounded-lg border border-gray-300 px-5 py-2.5 text-sm font-medium text-gray-700 transition hover:bg-gray-50 disabled:opacity-50"
                  >
                    {portalLoading ? "Loading..." : "Manage Billing"}
                  </button>
                )}
                {subscriber?.tier === "enterprise" && (
                  <a
                    href={`/${lang}/contact`}
                    className="rounded-lg border border-gray-300 px-5 py-2.5 text-sm font-medium text-gray-700 transition hover:bg-gray-50"
                  >
                    Contact Account Manager
                  </a>
                )}
              </div>
            </div>
          </div>

          {/* ── GDPR Controls ── */}
          <div className="mt-16 border-t border-gray-200 pt-8">
            <h2 className="text-lg font-bold text-gray-900">Your Data Rights (GDPR)</h2>
            <p className="mt-1 text-sm text-gray-500">We only store your email and topic preferences. No tracking, no profiling.</p>

            <div className="mt-6 space-y-4">
              <div className="flex items-center justify-between rounded-lg border border-gray-200 p-4">
                <div>
                  <p className="text-sm font-medium text-gray-900">Export my data</p>
                  <p className="text-xs text-gray-500">Download all data we hold about you (Art. 20)</p>
                </div>
                <a href="/api/account/export" className="rounded-lg bg-gray-100 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-200">
                  Download JSON
                </a>
              </div>

              <div className="flex items-center justify-between rounded-lg border border-gray-200 p-4">
                <div>
                  <p className="text-sm font-medium text-gray-900">Sign out</p>
                  <p className="text-xs text-gray-500">Clear your session on this device</p>
                </div>
                <button onClick={handleLogout} className="rounded-lg bg-gray-100 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-200">
                  Sign out
                </button>
              </div>

              <div className="flex items-center justify-between rounded-lg border border-red-100 bg-red-50 p-4">
                <div>
                  <p className="text-sm font-medium text-red-700">Delete my account</p>
                  <p className="text-xs text-red-500">Permanently remove all data. Cannot be undone. (Art. 17)</p>
                </div>
                <button onClick={handleDelete} disabled={deleting}
                  className="rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700 disabled:opacity-50">
                  {deleting ? "Deleting..." : "Delete Account"}
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
