/**
 * Report Detail Page — Full-text research report view.
 *
 * URL: /[lang]/reports/[slug]
 *
 * Access:
 *   - Anonymous: redirected to reports list (must create account)
 *   - Free: first 2 sections visible, rest gated with upgrade CTA
 *   - Pro/Enterprise: full report
 */

export const dynamic = "force-dynamic";

import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { getEffectiveTier } from "@/lib/tier-access";
import {
  getReportBySlug,
  getAllReportSlugs,
  FREE_SECTIONS_COUNT,
  REPORT_DISCLAIMER,
} from "@/data/reports-content";

interface PageProps {
  params: Promise<{ lang: string; slug: string }>;
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

export async function generateStaticParams() {
  return getAllReportSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const report = getReportBySlug(slug);
  if (!report) return { title: "Report Not Found" };

  return {
    title: report.title,
    description: report.subtitle,
    openGraph: {
      title: report.title,
      description: report.subtitle,
      type: "article",
      publishedTime: report.date,
    },
  };
}

/** Simple markdown-like rendering for report content */
function renderContent(text: string): string {
  return text
    .split("\n\n")
    .map((block) => {
      const trimmed = block.trim();
      if (!trimmed) return "";

      // Numbered list items
      if (/^\d+\.\s/.test(trimmed) && trimmed.includes("\n")) {
        const items = trimmed.split("\n").filter((l) => /^\d+\.\s/.test(l.trim()));
        if (items.length > 0) {
          const listHtml = items
            .map(
              (item) =>
                `<li class="ml-4 mb-1">${item
                  .replace(/^\d+\.\s/, "")
                  .replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>")}</li>`
            )
            .join("");
          return `<ol class="list-decimal space-y-1 text-gray-700 leading-relaxed my-3">${listHtml}</ol>`;
        }
      }

      // Bullet list blocks
      if (trimmed.startsWith("- ")) {
        const items = trimmed.split("\n").filter((l) => l.trim().startsWith("- "));
        const listHtml = items
          .map(
            (item) =>
              `<li class="ml-4 mb-1">${item
                .trim()
                .slice(2)
                .replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>")}</li>`
          )
          .join("");
        return `<ul class="list-disc space-y-1 text-gray-700 leading-relaxed my-3">${listHtml}</ul>`;
      }

      // Bold-only lines (sub-headings within content)
      if (/^\*\*.+\*\*$/.test(trimmed) || /^\*\*.+\*\*:?$/.test(trimmed)) {
        return `<p class="font-semibold text-gray-900 mt-6 mb-2">${trimmed.replace(
          /\*\*(.+?)\*\*/g,
          "$1"
        )}</p>`;
      }

      // Regular paragraphs
      return `<p class="text-gray-700 leading-relaxed my-3">${trimmed.replace(
        /\*\*(.+?)\*\*/g,
        "<strong>$1</strong>"
      )}</p>`;
    })
    .join("\n");
}

export default async function ReportDetailPage({ params }: PageProps) {
  const { lang, slug } = await params;
  const report = getReportBySlug(slug);

  if (!report) notFound();

  const tier = await getEffectiveTier();
  const isAnonymous = tier === "anonymous";
  const canReadFull = tier === "pro" || tier === "enterprise";
  const cat = CATEGORY_COLORS[report.category] || CATEGORY_COLORS.compliance;

  // Anonymous users see the page but with a prominent sign-up gate
  // Free users see first 2 sections, rest gated
  // Pro/Enterprise see everything

  return (
    <>
      <Header />
      <main className="flex-1 bg-white">
        {/* Hero */}
        <section className="bg-gradient-to-br from-[#0d1b3e] to-[#003399] text-white">
          <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8 lg:py-16">
            {/* Breadcrumb */}
            <nav className="mb-6 text-sm text-blue-200">
              <Link href={`/${lang}`} className="hover:text-white">
                Home
              </Link>
              <span className="mx-2">/</span>
              <Link href={`/${lang}/reports`} className="hover:text-white">
                Reports
              </Link>
              <span className="mx-2">/</span>
              <span className="text-white line-clamp-1">{report.title}</span>
            </nav>

            {/* Category + meta */}
            <div className="flex flex-wrap items-center gap-3 mb-4">
              <span
                className={`rounded-full px-3 py-1 text-xs font-semibold ${cat.bg} ${cat.text}`}
              >
                {CATEGORY_LABELS[report.category] || report.category}
              </span>
              <span className="text-sm text-blue-200">{report.readingTime}</span>
              <span className="text-sm text-blue-200">|</span>
              <span className="text-sm text-blue-200">{report.date}</span>
            </div>

            {/* Title */}
            <h1 className="text-3xl font-bold tracking-tight sm:text-4xl lg:text-5xl">
              {report.title}
            </h1>
            <p className="mt-3 text-lg text-blue-100 max-w-2xl">
              {report.subtitle}
            </p>

            {/* Author */}
            <p className="mt-4 text-sm text-blue-200">By {report.author}</p>
          </div>
        </section>

        <div className="mx-auto max-w-4xl px-4 py-10 sm:px-6 lg:px-8">
          {/* Disclaimer banner */}
          <div className="mb-8 rounded-lg border border-amber-200 bg-amber-50 p-4">
            <div className="flex gap-3">
              <svg
                className="h-5 w-5 shrink-0 text-amber-500 mt-0.5"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M8.485 2.495c.673-1.167 2.357-1.167 3.03 0l6.28 10.875c.673 1.167-.17 2.625-1.516 2.625H3.72c-1.345 0-2.189-1.458-1.515-2.625L8.485 2.495zM10 6a.75.75 0 01.75.75v3.5a.75.75 0 01-1.5 0v-3.5A.75.75 0 0110 6zm0 9a1 1 0 100-2 1 1 0 000 2z"
                  clipRule="evenodd"
                />
              </svg>
              <p className="text-sm text-amber-800">{REPORT_DISCLAIMER}</p>
            </div>
          </div>

          {/* Anonymous gate */}
          {isAnonymous && (
            <div className="mb-8 rounded-xl border border-[#003399]/15 bg-[#003399]/5 p-6 text-center">
              <h2 className="text-lg font-bold text-[#0d1b3e]">
                Create a Free Account to Read This Report
              </h2>
              <p className="mt-2 text-sm text-gray-600 max-w-md mx-auto">
                Our research reports are free for registered users. Sign up in
                seconds to access the full report.
              </p>
              <Link
                href={`/${lang}/subscribe`}
                className="mt-4 inline-block rounded-lg bg-[#003399] px-6 py-3 text-sm font-semibold text-white hover:bg-[#002277] transition-colors"
              >
                Create Free Account
              </Link>
            </div>
          )}

          {/* Table of Contents */}
          {!isAnonymous && (
            <nav className="mb-10 rounded-lg border border-gray-200 bg-gray-50 p-5">
              <h2 className="text-sm font-bold uppercase tracking-wide text-gray-500 mb-3">
                Table of Contents
              </h2>
              <ol className="space-y-1.5">
                {report.sections.map((section, index) => {
                  const isGated = !canReadFull && index >= FREE_SECTIONS_COUNT;
                  return (
                    <li key={section.id}>
                      {isGated ? (
                        <span className="text-sm text-gray-400 flex items-center gap-2">
                          <svg
                            className="h-3.5 w-3.5"
                            fill="currentColor"
                            viewBox="0 0 20 20"
                          >
                            <path
                              fillRule="evenodd"
                              d="M10 1a4.5 4.5 0 00-4.5 4.5V9H5a2 2 0 00-2 2v6a2 2 0 002 2h10a2 2 0 002-2v-6a2 2 0 00-2-2h-.5V5.5A4.5 4.5 0 0010 1zm3 8V5.5a3 3 0 10-6 0V9h6z"
                              clipRule="evenodd"
                            />
                          </svg>
                          {section.heading}
                        </span>
                      ) : (
                        <a
                          href={`#${section.id}`}
                          className="text-sm text-[#003399] hover:underline"
                        >
                          {index + 1}. {section.heading}
                        </a>
                      )}
                    </li>
                  );
                })}
              </ol>
            </nav>
          )}

          {/* Report sections */}
          <article className="prose-custom">
            {report.sections.map((section, index) => {
              const isGated =
                !canReadFull && !isAnonymous && index >= FREE_SECTIONS_COUNT;
              const isHidden = isAnonymous && index >= FREE_SECTIONS_COUNT;

              // Fully hidden for anonymous users beyond free sections
              if (isHidden) return null;

              // Gated section for free users
              if (isGated) {
                // Show the paywall on the first gated section only
                if (index === FREE_SECTIONS_COUNT) {
                  return (
                    <div key="paywall" className="mt-12">
                      {/* Blurred preview of next section */}
                      <div className="relative">
                        <div
                          className="select-none pointer-events-none"
                          style={{
                            filter: "blur(6px)",
                            WebkitFilter: "blur(6px)",
                          }}
                        >
                          <h2 className="text-2xl font-bold text-gray-900 mt-10 mb-4">
                            {section.heading}
                          </h2>
                          <p className="text-gray-700 leading-relaxed">
                            {section.content.slice(0, 300)}...
                          </p>
                        </div>

                        {/* Gradient overlay */}
                        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-white/70 to-white" />
                      </div>

                      {/* Upgrade CTA */}
                      <div className="relative -mt-8 rounded-xl border border-[#003399]/20 bg-gradient-to-r from-[#003399]/5 to-[#ffc107]/5 p-8 text-center">
                        <svg
                          className="mx-auto h-10 w-10 text-[#003399]/40 mb-3"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path
                            fillRule="evenodd"
                            d="M10 1a4.5 4.5 0 00-4.5 4.5V9H5a2 2 0 00-2 2v6a2 2 0 002 2h10a2 2 0 002-2v-6a2 2 0 00-2-2h-.5V5.5A4.5 4.5 0 0010 1zm3 8V5.5a3 3 0 10-6 0V9h6z"
                            clipRule="evenodd"
                          />
                        </svg>
                        <h3 className="text-lg font-bold text-[#0d1b3e]">
                          Unlock the Full Report
                        </h3>
                        <p className="mt-2 text-sm text-gray-600 max-w-md mx-auto">
                          This report has{" "}
                          {report.sections.length - FREE_SECTIONS_COUNT} more
                          sections. Upgrade to Pro to read the complete analysis,
                          including actionable recommendations and sector-specific
                          guidance.
                        </p>
                        <Link
                          href={`/${lang}/pricing`}
                          className="mt-5 inline-block rounded-lg bg-[#003399] px-8 py-3 text-sm font-semibold text-white hover:bg-[#002277] transition-colors shadow-sm"
                        >
                          Upgrade to Pro — EUR 19/month
                        </Link>
                        <p className="mt-2 text-xs text-gray-400">
                          Full access to all reports, systems, and tools
                        </p>
                      </div>
                    </div>
                  );
                }
                return null;
              }

              // Visible section
              return (
                <section key={section.id} id={section.id} className="mt-10 first:mt-0">
                  <h2 className="text-2xl font-bold text-gray-900 mb-4 scroll-mt-24">
                    {section.heading}
                  </h2>
                  <div
                    dangerouslySetInnerHTML={{
                      __html: renderContent(section.content),
                    }}
                  />
                  {index < report.sections.length - 1 &&
                    (canReadFull || index < FREE_SECTIONS_COUNT - 1) && (
                      <hr className="mt-10 border-gray-200" />
                    )}
                </section>
              );
            })}
          </article>

          {/* Back to reports */}
          <div className="mt-12 pt-8 border-t border-gray-200">
            <Link
              href={`/${lang}/reports`}
              className="inline-flex items-center gap-2 text-sm font-semibold text-[#003399] hover:underline"
            >
              <svg
                className="h-4 w-4"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={2}
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18"
                />
              </svg>
              Back to Reports &amp; White Papers
            </Link>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
