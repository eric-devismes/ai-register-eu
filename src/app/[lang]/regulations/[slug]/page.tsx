/**
 * Framework Documentation Page — Rich public view of a regulatory framework.
 *
 * URL: /regulations/[slug]  (e.g., /regulations/eu-ai-act)
 *
 * Shows:
 *   1. Meta information (authority, type, penalty, regions, industries)
 *   2. Purpose/overview
 *   3. Structured sections with policy statements + commentary
 *   4. Scored AI systems
 */

export const dynamic = "force-dynamic";

import { notFound } from "next/navigation";
import Link from "next/link";
import { getFrameworkBySlug } from "@/lib/queries";
import { gradeColor } from "@/lib/scoring";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";

interface PageProps {
  params: Promise<{ lang: string; slug: string }>;
}

const BADGE_COLORS: Record<string, string> = {
  EU: "bg-[#003399]/10 text-[#003399]",
  Sector: "bg-emerald-100 text-emerald-700",
  National: "bg-amber-100 text-amber-700",
};

/** Simple markdown to HTML for the overview content field */
function renderMarkdown(md: string): string {
  return md
    .split("\n\n")
    .map((block) => {
      if (block.startsWith("### ")) return `<h3 class="mt-6 mb-2 text-lg font-bold text-gray-900">${block.slice(4)}</h3>`;
      if (block.startsWith("## ")) return `<h2 class="mt-8 mb-3 text-xl font-bold text-gray-900">${block.slice(3)}</h2>`;
      if (block.startsWith("# ")) return `<h1 class="mt-8 mb-4 text-2xl font-bold text-gray-900">${block.slice(2)}</h1>`;
      if (block.includes("\n- ")) {
        const items = block.split("\n").filter((l) => l.startsWith("- "));
        const listHtml = items.map((item) => `<li class="ml-4">${item.slice(2).replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>")}</li>`).join("");
        return `<ul class="list-disc space-y-1 text-gray-600">${listHtml}</ul>`;
      }
      return `<p class="text-gray-600 leading-relaxed">${block.replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>")}</p>`;
    })
    .join("\n");
}

export default async function FrameworkPage({ params }: PageProps) {
  const { lang, slug } = await params;
  const framework = await getFrameworkBySlug(slug);
  if (!framework) notFound();

  const badgeClass = BADGE_COLORS[framework.badgeType] || BADGE_COLORS.EU;
  const hasMeta = framework.issuingAuthority || framework.enforcementType || framework.maxPenalty;
  const hasSections = framework.sections.length > 0;

  return (
    <>
      <Header />
      <main className="flex-1 bg-white">
        <div className="mx-auto max-w-4xl px-4 py-16 sm:px-6 lg:px-8">
          {/* Breadcrumb */}
          <nav className="mb-8 text-sm text-gray-400">
            <Link href="/" className="hover:text-[#003399]">Home</Link>
            <span className="mx-2">/</span>
            <Link href="/regulations" className="hover:text-[#003399]">Regulations</Link>
            <span className="mx-2">/</span>
            <span className="text-gray-600">{framework.name}</span>
          </nav>

          {/* Header */}
          <div className="flex items-start gap-4">
            <span className={`rounded-full px-3 py-1 text-xs font-semibold ${badgeClass}`}>
              {framework.badgeType}
            </span>
          </div>
          <h1 className="mt-3 text-3xl font-bold text-gray-900 sm:text-4xl">
            {framework.name}
          </h1>
          <p className="mt-3 text-lg text-gray-600">{framework.description}</p>

          {/* ── Meta Information ── */}
          {hasMeta && (
            <div className="mt-8 rounded-xl border border-gray-200 bg-gray-50 p-6">
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                {framework.issuingAuthority && (
                  <div>
                    <span className="text-xs font-semibold uppercase tracking-wider text-gray-400">Issued by</span>
                    <p className="mt-0.5 text-sm text-gray-900">{framework.issuingAuthority}</p>
                  </div>
                )}
                {framework.enforcementType && (
                  <div>
                    <span className="text-xs font-semibold uppercase tracking-wider text-gray-400">Type</span>
                    <p className="mt-0.5 text-sm text-gray-900">{framework.enforcementType}</p>
                  </div>
                )}
                {framework.maxPenalty && (
                  <div>
                    <span className="text-xs font-semibold uppercase tracking-wider text-gray-400">Maximum Penalty</span>
                    <p className="mt-0.5 text-sm font-semibold text-red-700">{framework.maxPenalty}</p>
                  </div>
                )}
                {framework.applicableRegions && (
                  <div>
                    <span className="text-xs font-semibold uppercase tracking-wider text-gray-400">Applicable Regions</span>
                    <p className="mt-0.5 text-sm text-gray-900">{framework.applicableRegions}</p>
                  </div>
                )}
                <div>
                  <span className="text-xs font-semibold uppercase tracking-wider text-gray-400">Effective Date</span>
                  <p className="mt-0.5 text-sm text-gray-900">{framework.effectiveDate}</p>
                </div>
                <div>
                  <span className="text-xs font-semibold uppercase tracking-wider text-gray-400">Assessment Criteria</span>
                  <p className="mt-0.5 text-sm text-gray-900">{framework.criteriaCount} criteria</p>
                </div>
              </div>

              {/* Applicable industries */}
              {framework.industries.length > 0 && (
                <div className="mt-4 pt-4 border-t border-gray-200">
                  <span className="text-xs font-semibold uppercase tracking-wider text-gray-400">Applicable Industries</span>
                  <div className="mt-2 flex flex-wrap gap-2">
                    {framework.industries.map((ind) => (
                      <Link key={ind.id} href={`/industries/${ind.slug}`}
                        className="rounded-full bg-white border border-gray-200 px-3 py-1 text-xs font-medium text-gray-700 hover:border-[#003399]/30">
                        {ind.name}
                      </Link>
                    ))}
                  </div>
                </div>
              )}

              {/* Official URL */}
              {framework.officialUrl && (
                <div className="mt-4 pt-4 border-t border-gray-200">
                  <a href={framework.officialUrl} target="_blank" rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-sm font-medium text-[#003399] hover:underline">
                    View official regulation text
                    <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 6H5.25A2.25 2.25 0 0 0 3 8.25v10.5A2.25 2.25 0 0 0 5.25 21h10.5A2.25 2.25 0 0 0 18 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25" />
                    </svg>
                  </a>
                </div>
              )}
            </div>
          )}

          {/* ── Purpose ── */}
          {framework.purpose && (
            <div className="mt-10">
              <h2 className="text-xl font-bold text-gray-900">Purpose</h2>
              <p className="mt-3 text-gray-600 leading-relaxed">{framework.purpose}</p>
            </div>
          )}

          {/* ── Overview Content (Markdown) ── */}
          {framework.content && (
            <div className="mt-10 space-y-4"
              dangerouslySetInnerHTML={{ __html: renderMarkdown(framework.content) }}
            />
          )}

          {/* ── Sections & Policy Statements ── */}
          {hasSections && (
            <div className="mt-14">
              <h2 className="text-xl font-bold text-gray-900 border-b border-gray-200 pb-3">
                Sections &amp; Requirements
              </h2>

              <div className="mt-6 space-y-8">
                {framework.sections.map((section) => (
                  <div key={section.id} className="rounded-xl border border-gray-200 overflow-hidden">
                    {/* Section header */}
                    <div className="bg-gray-50 px-6 py-4 border-b border-gray-200">
                      <h3 className="text-base font-bold text-gray-900">{section.title}</h3>
                      {section.description && (
                        <p className="mt-1 text-sm text-gray-600">{section.description}</p>
                      )}
                    </div>

                    {/* Policy statements */}
                    {section.statements.length > 0 && (
                      <div className="divide-y divide-gray-100">
                        {section.statements.map((stmt) => (
                          <div key={stmt.id} className="px-6 py-4">
                            {/* Reference badge + statement */}
                            <div className="flex items-start gap-3">
                              {stmt.reference && (
                                <span className="mt-0.5 shrink-0 rounded bg-[#003399]/10 px-2 py-0.5 text-xs font-semibold text-[#003399]">
                                  {stmt.reference}
                                </span>
                              )}
                              <p className="text-sm text-gray-800">{stmt.statement}</p>
                            </div>

                            {/* Commentary */}
                            {stmt.commentary && (
                              <div className="mt-3 ml-0 rounded-lg bg-amber-50 border border-amber-100 px-4 py-3">
                                <p className="text-xs font-semibold text-amber-700 mb-1">What this means for your organisation</p>
                                <p className="text-sm text-amber-900">{stmt.commentary}</p>
                              </div>
                            )}

                            {/* Source citation */}
                            {stmt.sourceUrl && (
                              <div className="mt-2">
                                <a href={stmt.sourceUrl} target="_blank" rel="noopener noreferrer"
                                  className="inline-flex items-center gap-1 text-xs text-gray-400 hover:text-[#003399]">
                                  <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M13.19 8.688a4.5 4.5 0 0 1 1.242 7.244l-4.5 4.5a4.5 4.5 0 0 1-6.364-6.364l1.757-1.757m9.86-1.135a4.5 4.5 0 0 0-1.242-7.244l-4.5-4.5a4.5 4.5 0 0 0-6.364 6.364l1.757 1.757" />
                                  </svg>
                                  {stmt.sourceNote || "View source"}
                                </a>
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ── Scored AI Systems ── */}
          {framework.scores.length > 0 && (
            <div className="mt-16">
              <h2 className="text-xl font-bold text-gray-900 border-b border-gray-200 pb-3">
                Assessed AI Systems
              </h2>
              <div className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-2">
                {framework.scores.map((s) => (
                  <Link key={s.id} href={`/${lang}/systems/${s.system.slug}/${slug}`}
                    className="flex items-center gap-4 rounded-xl border border-gray-200 p-4 transition hover:border-[#003399]/30 hover:shadow-sm">
                    <span className={`inline-flex h-10 w-10 items-center justify-center rounded-full text-sm font-bold text-white ${gradeColor(s.score)}`}>
                      {s.score}
                    </span>
                    <div>
                      <p className="text-sm font-semibold text-gray-900">{s.system.name}</p>
                      <p className="text-xs text-gray-500">{s.system.vendor}</p>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}

          {/* ── Version History ── */}
          {framework.changelog && framework.changelog.length > 0 && (
            <div className="mt-16">
              <h2 className="text-xl font-bold text-gray-900 border-b border-gray-200 pb-3">
                Version History
              </h2>
              <div className="mt-4 space-y-3">
                {framework.changelog.map((entry) => (
                  <div key={entry.id} className="flex gap-4 text-sm">
                    <div className="shrink-0 pt-0.5">
                      <span className="text-xs text-gray-400">
                        {entry.date.toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })}
                      </span>
                    </div>
                    <div className="flex-1">
                      <p className="font-medium text-gray-900">{entry.title}</p>
                      <p className="mt-0.5 text-gray-600">{entry.description}</p>
                      {entry.sourceUrl && (
                        <a href={entry.sourceUrl} target="_blank" rel="noopener noreferrer"
                          className="mt-1 inline-flex items-center gap-1 text-xs text-[#003399] hover:underline">
                          {entry.sourceLabel || "Source"}
                          <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 6H5.25A2.25 2.25 0 0 0 3 8.25v10.5A2.25 2.25 0 0 0 5.25 21h10.5A2.25 2.25 0 0 0 18 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25" />
                          </svg>
                        </a>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Last updated footer */}
          <div className="mt-12 pt-6 border-t border-gray-100 text-xs text-gray-400">
            Last updated: {framework.updatedAt.toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" })}
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
