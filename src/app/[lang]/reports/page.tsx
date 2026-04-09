/**
 * Reports & White Papers — Public research publications.
 *
 * URL: /reports
 *
 * Freely accessible to everyone (including free users).
 * Reports build authority and drive consulting leads.
 *
 * For now, reports are defined as static data here.
 * Future: move to a CMS or database model for admin management.
 *
 * Access:
 *   - Anonymous: see titles + category only, prompted to create account
 *   - Free+: full access to all reports
 */

export const dynamic = "force-dynamic";

import type { Metadata } from "next";
import Link from "next/link";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { getEffectiveTier } from "@/lib/tier-access";

export const metadata: Metadata = {
  title: "Reports & White Papers — AI Compass EU",
  description:
    "Free research reports on AI adoption, compliance, data privacy, and security in Europe. Expert analysis for DPOs, CISOs, and compliance professionals.",
};

interface Report {
  slug: string;
  title: string;
  subtitle: string;
  category: "adoption" | "compliance" | "security" | "data-privacy" | "industry";
  date: string;
  readingTime: string;
  excerpt: string;
  comingSoon?: boolean;
}

const CATEGORY_COLORS: Record<string, { bg: string; text: string }> = {
  adoption: { bg: "bg-blue-100", text: "text-blue-700" },
  compliance: { bg: "bg-purple-100", text: "text-purple-700" },
  security: { bg: "bg-red-100", text: "text-red-700" },
  "data-privacy": { bg: "bg-emerald-100", text: "text-emerald-700" },
  industry: { bg: "bg-amber-100", text: "text-amber-700" },
};

const CATEGORY_LABELS: Record<string, string> = {
  adoption: "AI Adoption",
  compliance: "Compliance",
  security: "Security",
  "data-privacy": "Data Privacy",
  industry: "Industry Analysis",
};

/**
 * Report catalog — static for now, will move to DB when admin panel manages them.
 */
const reports: Report[] = [
  {
    slug: "eu-ai-act-readiness-2026",
    title: "EU AI Act Readiness Report 2026",
    subtitle: "How prepared are European enterprises for the August deadline?",
    category: "compliance",
    date: "2026-04-01",
    readingTime: "12 min read",
    excerpt:
      "With the high-risk AI system obligations taking effect in August 2026, we assessed the readiness of 500+ European enterprises. The findings reveal a significant preparedness gap — and the sectors most at risk of non-compliance.",
  },
  {
    slug: "ai-adoption-enterprise-europe",
    title: "State of AI Adoption in European Enterprises",
    subtitle: "Adoption rates, barriers, and what accelerates or slows deployment",
    category: "adoption",
    date: "2026-03-15",
    readingTime: "15 min read",
    excerpt:
      "20% of EU enterprises with 10+ employees now use AI, up from 13.5% in 2024. But adoption varies dramatically by country, sector, and company size. This report maps the landscape and identifies what makes the difference.",
  },
  {
    slug: "gdpr-ai-act-interplay",
    title: "GDPR + AI Act: The Compliance Overlap",
    subtitle: "A practical guide for DPOs managing both frameworks",
    category: "data-privacy",
    date: "2026-03-01",
    readingTime: "10 min read",
    excerpt:
      "DPOs are now responsible for AI Act compliance on top of GDPR. This report maps the overlapping obligations, identifies gaps, and provides a unified compliance checklist that covers both frameworks.",
  },
  {
    slug: "data-residency-ai-vendors",
    title: "Data Residency Report: Where Your AI Vendor Processes Data",
    subtitle: "An audit of data flows across the top 30 enterprise AI platforms",
    category: "security",
    date: "2026-02-15",
    readingTime: "18 min read",
    excerpt:
      "EU organisations need to know where their data goes. We audited 30 enterprise AI platforms for data residency, sub-processor chains, and EU hosting options. The results will surprise many procurement teams.",
  },
  {
    slug: "ai-risk-classification-guide",
    title: "AI Risk Classification: A Practical Guide",
    subtitle: "How to determine if your AI system is high-risk under the EU AI Act",
    category: "compliance",
    date: "2026-02-01",
    readingTime: "8 min read",
    excerpt:
      "The EU AI Act classifies AI systems by risk level, but the boundaries are not always clear. This guide walks through the classification decision tree with real-world examples from enterprise deployments.",
  },
  {
    slug: "ai-security-posture-benchmarks",
    title: "AI Security Posture: Enterprise Benchmarks 2026",
    subtitle: "How do AI vendors stack up on security controls?",
    category: "security",
    date: "2026-01-15",
    readingTime: "14 min read",
    excerpt:
      "We evaluated the security posture of 30 enterprise AI platforms against ISO 27001, SOC 2, and the EU AI Act's security requirements. This benchmark report helps procurement and security teams make informed decisions.",
    comingSoon: true,
  },
  {
    slug: "conversational-ai-compliance",
    title: "Conversational AI in the Enterprise: Compliance Landscape",
    subtitle: "Chatbots, virtual agents, and copilots under EU regulation",
    category: "industry",
    date: "2026-01-01",
    readingTime: "11 min read",
    excerpt:
      "Conversational AI platforms — from ServiceNow Now Assist to Moveworks and Yellow.ai — are transforming enterprise operations. But how do they fare under EU regulations? This report assesses the compliance posture of the leading platforms.",
    comingSoon: true,
  },
];

export default async function ReportsPage() {
  const tier = await getEffectiveTier();
  const isAnonymous = tier === "anonymous";
  const published = reports.filter((r) => !r.comingSoon);
  const upcoming = reports.filter((r) => r.comingSoon);

  return (
    <>
      <Header />
      <main className="flex-1">
        {/* Hero */}
        <section className="bg-gradient-to-br from-[#0d1b3e] to-[#003399] text-white">
          <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 lg:py-20">
            <div className="max-w-3xl">
              <p className="text-sm font-semibold uppercase tracking-wide text-[#ffc107]">
                Research
              </p>
              <h1 className="mt-3 text-4xl font-bold tracking-tight sm:text-5xl">
                Reports &amp; White Papers
              </h1>
              <p className="mt-4 text-lg leading-relaxed text-blue-100">
                Free, in-depth research on AI adoption, compliance, data privacy, and
                security in Europe. Written for DPOs, CISOs, and compliance professionals
                who need actionable intelligence.
              </p>
            </div>
          </div>
        </section>

        {/* Reports grid — square tiles */}
        <section className="py-12">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            {/* Sign-up gate notice — only for anonymous */}
            {isAnonymous && (
              <div className="mb-8 rounded-xl border border-[#003399]/15 bg-[#003399]/5 p-4 flex items-center justify-between">
                <p className="text-sm text-[#0d1b3e]">
                  <strong>Free access</strong> — create an account to read full reports.
                </p>
                <a href="/en/subscribe" className="rounded-lg bg-[#003399] px-4 py-2 text-xs font-semibold text-white hover:bg-[#002277] shrink-0">
                  Create free account
                </a>
              </div>
            )}

            {/* Published reports — square tile grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {published.map((report) => {
                const cat = CATEGORY_COLORS[report.category] || CATEGORY_COLORS.compliance;
                return isAnonymous ? (
                    <div
                      key={report.slug}
                      className="flex flex-col rounded-xl border border-gray-200 bg-white p-5 sm:min-h-[220px]"
                    >
                      <div className="flex items-center gap-2 mb-3">
                        <span className={`rounded-full px-2.5 py-0.5 text-[10px] font-semibold ${cat.bg} ${cat.text}`}>
                          {CATEGORY_LABELS[report.category]}
                        </span>
                      </div>
                      <h3 className="text-sm font-bold text-[#0d1b3e] line-clamp-2">
                        {report.title}
                      </h3>
                      <p className="mt-2 text-xs text-gray-400 flex-1">
                        Sign in to read this report
                      </p>
                      <div className="mt-3 pt-3 border-t border-gray-100">
                        <a href="/en/subscribe" className="text-xs font-semibold text-[#003399] hover:underline">
                          Create free account →
                        </a>
                      </div>
                    </div>
                  ) : (
                  <Link
                    key={report.slug}
                    href={`/en/reports/${report.slug}`}
                    className="group flex flex-col rounded-xl border border-gray-200 bg-white p-5 hover:shadow-md hover:border-[#003399]/30 transition-all aspect-square sm:aspect-auto sm:min-h-[220px]"
                  >
                    <div className="flex items-center gap-2 mb-3">
                      <span className={`rounded-full px-2.5 py-0.5 text-[10px] font-semibold ${cat.bg} ${cat.text}`}>
                        {CATEGORY_LABELS[report.category]}
                      </span>
                      <span className="text-[10px] text-gray-400">{report.readingTime}</span>
                    </div>
                    <h3 className="text-sm font-bold text-[#0d1b3e] group-hover:text-[#003399] transition-colors line-clamp-2">
                      {report.title}
                    </h3>
                    <p className="mt-1 text-xs text-gray-500 line-clamp-2 flex-1">{report.subtitle}</p>
                    <div className="mt-3 pt-3 border-t border-gray-100 flex items-center justify-between">
                      <span className="text-[10px] text-gray-400">{report.date}</span>
                      <span className="text-xs font-semibold text-[#003399] group-hover:underline">
                        Read →
                      </span>
                    </div>
                  </Link>
                );
              })}

              {/* Coming soon tiles */}
              {upcoming.map((report) => {
                const cat = CATEGORY_COLORS[report.category] || CATEGORY_COLORS.compliance;
                return (
                  <div
                    key={report.slug}
                    className="flex flex-col rounded-xl border border-dashed border-gray-300 bg-gray-50 p-5 sm:min-h-[220px]"
                  >
                    <div className="flex items-center gap-2 mb-3">
                      <span className={`rounded-full px-2.5 py-0.5 text-[10px] font-semibold ${cat.bg} ${cat.text}`}>
                        {CATEGORY_LABELS[report.category]}
                      </span>
                      <span className="rounded-full bg-gray-200 px-2.5 py-0.5 text-[10px] font-semibold text-gray-500">
                        Coming Soon
                      </span>
                    </div>
                    <h3 className="text-sm font-bold text-gray-500 line-clamp-2">{report.title}</h3>
                    <p className="mt-1 text-xs text-gray-400 line-clamp-2 flex-1">{report.subtitle}</p>
                  </div>
                );
              })}
            </div>

            {/* Consulting CTA */}
            <div className="mt-16 rounded-xl border border-[#003399]/20 bg-gradient-to-r from-[#003399]/5 to-[#ffc107]/5 p-8 text-center">
              <h2 className="text-lg font-bold text-[#0d1b3e]">
                Need a Custom Report for Your Organisation?
              </h2>
              <p className="mt-2 text-sm text-gray-600 max-w-lg mx-auto">
                Our enterprise clients receive tailored compliance reports, vendor assessments,
                and risk analyses specific to their AI stack and industry.
              </p>
              <Link
                href="/en/contact"
                className="mt-5 inline-block rounded-lg bg-[#003399] px-8 py-3 text-sm font-semibold text-white hover:bg-[#002277] transition-colors shadow-sm"
              >
                Contact Our Advisory Team
              </Link>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
