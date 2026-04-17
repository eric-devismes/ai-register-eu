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
import CollapsibleSection from "@/components/ui/CollapsibleSection";
import FrameworkPillars from "@/components/ui/FrameworkPillars";
import Footer from "@/components/layout/Footer";
import { getDictionary, type Locale } from "@/lib/i18n";

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
  const locale = lang as Locale;
  const [framework, dict] = await Promise.all([
    getFrameworkBySlug(slug),
    getDictionary(locale),
  ]);
  if (!framework) notFound();
  const t = (key: string) => key.split(".").reduce((o: Record<string, unknown>, k: string) => (o?.[k] as Record<string, unknown>) ?? {}, dict as unknown as Record<string, unknown>) as unknown as string;

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
            <Link href={`/${lang}`} className="hover:text-[#003399]">{t("common.home")}</Link>
            <span className="mx-2">/</span>
            <Link href={`/${lang}/regulations`} className="hover:text-[#003399]">{t("common.regulations")}</Link>
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
                    <span className="text-xs font-semibold uppercase tracking-wider text-gray-400">{t("frameworks.issuedBy")}</span>
                    <p className="mt-0.5 text-sm text-gray-900">{framework.issuingAuthority}</p>
                  </div>
                )}
                {framework.enforcementType && (
                  <div>
                    <span className="text-xs font-semibold uppercase tracking-wider text-gray-400">{t("frameworks.type")}</span>
                    <p className="mt-0.5 text-sm text-gray-900">{framework.enforcementType}</p>
                  </div>
                )}
                {framework.maxPenalty && (
                  <div>
                    <span className="text-xs font-semibold uppercase tracking-wider text-gray-400">{t("frameworks.maxPenalty")}</span>
                    <p className="mt-0.5 text-sm font-semibold text-red-700">{framework.maxPenalty}</p>
                  </div>
                )}
                {framework.applicableRegions && (
                  <div>
                    <span className="text-xs font-semibold uppercase tracking-wider text-gray-400">{t("frameworks.applicableRegions")}</span>
                    <p className="mt-0.5 text-sm text-gray-900">{framework.applicableRegions}</p>
                  </div>
                )}
                <div>
                  <span className="text-xs font-semibold uppercase tracking-wider text-gray-400">{t("frameworks.effectiveDate")}</span>
                  <p className="mt-0.5 text-sm text-gray-900">{framework.effectiveDate}</p>
                </div>
                <div>
                  <span className="text-xs font-semibold uppercase tracking-wider text-gray-400">{t("frameworks.assessmentCriteria")}</span>
                  <p className="mt-0.5 text-sm text-gray-900">{framework.criteriaCount} {t("common.criteria")}</p>
                </div>
              </div>

              {/* Applicable industries */}
              {framework.industries.length > 0 && (
                <div className="mt-4 pt-4 border-t border-gray-200">
                  <span className="text-xs font-semibold uppercase tracking-wider text-gray-400">{t("frameworks.applicableIndustries")}</span>
                  <div className="mt-2 flex flex-wrap gap-2">
                    {framework.industries.map((ind) => (
                      <Link key={ind.id} href={`/${lang}/industries/${ind.slug}`}
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
                    {t("frameworks.officialText")}
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
              <h2 className="text-xl font-bold text-gray-900">{t("frameworks.purpose")}</h2>
              <p className="mt-3 text-gray-600 leading-relaxed">{framework.purpose}</p>
            </div>
          )}

          {/* ── Overview Content (Markdown) — hidden when sections exist (avoids duplication) ── */}
          {framework.content && !hasSections && (
            <div className="mt-10 space-y-4"
              dangerouslySetInnerHTML={{ __html: renderMarkdown(framework.content) }}
            />
          )}

          {/* ── Pillar Visualization ── */}
          {hasSections && (
            <div className="mt-14">
              <FrameworkPillars
                frameworkName={framework.name}
                sections={framework.sections.map((s) => ({
                  id: s.id,
                  title: s.title,
                  statementCount: s.statements.length,
                }))}
              />
            </div>
          )}

          {/* ── Sections & Policy Statements ── */}
          {hasSections && (
            <div className="mt-10">
              <h2 className="text-xl font-bold text-gray-900 border-b border-gray-200 pb-3">
                {t("frameworks.sections")}
              </h2>

              <div className="mt-6 space-y-4">
                {framework.sections.map((section, idx) => (
                  <div key={section.id} id={`section-${section.id}`}>
                  <CollapsibleSection
                    title={section.title}
                    subtitle={section.description}
                    badge={
                      <span className="rounded-full bg-gray-200 px-2 py-0.5 text-[10px] font-semibold text-gray-500">
                        {section.statements.length} {section.statements.length !== 1 ? t("frameworks.requirements") : t("frameworks.requirement")}
                      </span>
                    }
                    defaultOpen={idx === 0}
                  >
                    {section.statements.length > 0 && (
                      <div className="divide-y divide-gray-100">
                        {section.statements.map((stmt) => (
                          <div key={stmt.id} className="px-6 py-4">
                            <div className="flex items-start gap-3">
                              {stmt.reference && (
                                <span className="mt-0.5 shrink-0 rounded bg-[#003399]/10 px-2 py-0.5 text-xs font-semibold text-[#003399]">
                                  {stmt.reference}
                                </span>
                              )}
                              <p className="text-sm text-gray-800">{stmt.statement}</p>
                            </div>
                            {stmt.commentary && (
                              <div className="mt-3 rounded-lg bg-amber-50 border border-amber-100 px-4 py-3">
                                <p className="text-xs font-semibold text-amber-700 mb-1">{t("frameworks.whatThisMeans")}</p>
                                <p className="text-sm text-amber-900">{stmt.commentary}</p>
                              </div>
                            )}
                            {stmt.sourceUrl && (
                              <div className="mt-2">
                                <a href={stmt.sourceUrl} target="_blank" rel="noopener noreferrer"
                                  className="inline-flex items-center gap-1 text-xs text-gray-400 hover:text-[#003399]">
                                  <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M13.19 8.688a4.5 4.5 0 0 1 1.242 7.244l-4.5 4.5a4.5 4.5 0 0 1-6.364-6.364l1.757-1.757m9.86-1.135a4.5 4.5 0 0 0-1.242-7.244l-4.5-4.5a4.5 4.5 0 0 0-6.364 6.364l1.757 1.757" />
                                  </svg>
                                  {stmt.sourceNote || t("common.viewSource")}
                                </a>
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    )}
                  </CollapsibleSection>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ── Scored AI Systems ── */}
          {framework.scores.length > 0 && (
            <div className="mt-16">
              <h2 className="text-xl font-bold text-gray-900 border-b border-gray-200 pb-3">
                {t("frameworks.assessedSystems")}
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
                {t("frameworks.versionHistory")}
              </h2>
              <div className="mt-4 space-y-3">
                {framework.changelog.map((entry) => (
                  <div key={entry.id} className="flex gap-4 text-sm">
                    <div className="shrink-0 pt-0.5">
                      <span className="text-xs text-gray-400">
                        {entry.date.toLocaleDateString(locale, { day: "numeric", month: "short", year: "numeric" })}
                      </span>
                    </div>
                    <div className="flex-1">
                      <p className="font-medium text-gray-900">{entry.title}</p>
                      <p className="mt-0.5 text-gray-600">{entry.description}</p>
                      {entry.sourceUrl && (
                        <a href={entry.sourceUrl} target="_blank" rel="noopener noreferrer"
                          className="mt-1 inline-flex items-center gap-1 text-xs text-[#003399] hover:underline">
                          {entry.sourceLabel || t("common.source")}
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
            {t("common.lastUpdated")} {framework.updatedAt.toLocaleDateString(locale, { day: "numeric", month: "long", year: "numeric" })}
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
