/**
 * Cross-Report Page — Detailed assessment of one system against one framework.
 *
 * URL: /en/systems/microsoft-azure-openai-service/gdpr
 *
 * Standardised report structure:
 *   1. Header with overall grade + explanation of applicability
 *   2. Spider chart with clickable dimension scores
 *   3. Highlights: top strengths + critical gaps
 *   4. Detailed per-dimension breakdown (anchored from chart)
 *   5. Disclaimer + navigation
 */

export const dynamic = "force-dynamic";

import { notFound } from "next/navigation";
import Link from "next/link";
import { getSystemFrameworkReport } from "@/lib/queries";
import { gradeToNumber, gradeColor, computeOverallScore } from "@/lib/scoring";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import SpiderChart from "@/components/charts/SpiderChart";

interface PageProps {
  params: Promise<{ lang: string; slug: string; framework: string }>;
}

export default async function CrossReportPage({ params }: PageProps) {
  const { lang, slug, framework: frameworkSlug } = await params;

  const report = await getSystemFrameworkReport(slug, frameworkSlug);
  if (!report) notFound();

  const { system, framework, overallScore, dimensionScores } = report;

  // Build dimension data
  const dimensions = framework.sections.map((section) => {
    const ds = dimensionScores.find((d) => d.sectionId === section.id);
    return {
      sectionId: section.id,
      label: section.title,
      description: section.description,
      score: ds ? gradeToNumber(ds.score) : 0,
      grade: ds?.score || "N/A",
      commentary: ds?.commentary || "",
    };
  });

  const scoredDimensions = dimensions.filter((d) => d.score > 0);
  const hasDimensionScores = scoredDimensions.length > 0;

  // Overall grade
  const overallGrade = hasDimensionScores
    ? computeOverallScore(scoredDimensions.map((d) => d.grade))
    : overallScore?.score || "N/A";

  // Numeric average for display
  const overallNumeric = hasDimensionScores
    ? (scoredDimensions.reduce((sum, d) => sum + d.score, 0) / scoredDimensions.length).toFixed(1)
    : null;

  // Highlights
  const sorted = [...scoredDimensions].sort((a, b) => b.score - a.score);
  const strengths = sorted.slice(0, 2);
  const gaps = [...sorted].reverse().slice(0, 2).filter((d) => d.score < 7);

  // Risk badge
  const riskClass =
    system.risk === "High" ? "bg-red-100 text-red-700" :
    system.risk === "Limited" ? "bg-amber-100 text-amber-700" :
    "bg-green-100 text-green-700";

  return (
    <>
      <Header />
      <main className="flex-1 bg-white">
        <div className="mx-auto max-w-4xl px-4 py-16 sm:px-6 lg:px-8">
          {/* Breadcrumb */}
          <nav className="mb-8 text-sm text-gray-400">
            <Link href={`/${lang}`} className="hover:text-[#003399]">Home</Link>
            <span className="mx-2">/</span>
            <Link href={`/${lang}/database`} className="hover:text-[#003399]">Database</Link>
            <span className="mx-2">/</span>
            <Link href={`/${lang}/systems/${slug}`} className="hover:text-[#003399]">{system.name}</Link>
            <span className="mx-2">/</span>
            <span className="text-gray-600">{framework.name}</span>
          </nav>

          {/* ── Report Header ── */}
          <div>
            <p className="text-sm font-semibold uppercase tracking-wider text-[#003399]">{system.vendor}</p>
            <h1 className="mt-1 text-3xl font-bold text-gray-900 sm:text-4xl">{system.name}</h1>
            <p className="mt-1 text-gray-500">{framework.name} Compliance Assessment</p>

            {/* Overall score + explanation — below title */}
            <div className="mt-6 flex items-center gap-5 rounded-xl bg-gray-50 border border-gray-200 p-5">
              <span className={`inline-flex h-16 w-16 shrink-0 items-center justify-center rounded-full text-xl font-bold text-white ${gradeColor(overallGrade)}`}>
                {overallGrade}
              </span>
              <div>
                <p className="text-base font-bold text-gray-900">
                  Overall {framework.name} Score
                  {overallNumeric && <span className="ml-2 text-sm font-normal text-gray-500">({overallNumeric}/10 average across {scoredDimensions.length} dimensions)</span>}
                </p>
                <p className="mt-1 text-sm text-gray-600">
                  {system.name} is assessed against {framework.name} because it
                  {system.risk === "High"
                    ? ` is classified as high-risk under the EU AI Act, making ${framework.name} compliance requirements particularly stringent.`
                    : ` processes data and provides AI capabilities in sectors where ${framework.name} applies. ${framework.enforcementType ? `This is a ${framework.enforcementType.toLowerCase()}.` : ""}`
                  }
                  {framework.maxPenalty && ` Non-compliance can result in penalties of ${framework.maxPenalty.toLowerCase()}.`}
                </p>
                <div className="mt-2 flex items-center gap-3">
                  <span className={`rounded-full px-2 py-0.5 text-xs font-semibold ${riskClass}`}>{system.risk} Risk</span>
                  {system.assessedAt && (
                    <span className="text-xs text-gray-400">
                      Assessed: {system.assessedAt.toLocaleDateString("en-GB", { month: "short", year: "numeric" })}
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* ── Spider Chart ── */}
          {hasDimensionScores && dimensions.length >= 3 && (
            <div className="mt-14">
              <h2 className="text-lg font-bold text-gray-900 mb-6">Compliance Dimensions</h2>
              <div className="rounded-xl border border-gray-100 bg-white p-6">
                <SpiderChart
                  dimensions={dimensions.map((d) => ({
                    id: d.sectionId,
                    label: d.label,
                    score: d.score,
                    grade: d.grade,
                  }))}
                  size={440}
                />
                <p className="mt-6 text-center text-xs text-gray-400">
                  Click any score or label to jump to the detailed assessment. Larger area = stronger compliance.
                </p>
              </div>
            </div>
          )}

          {/* ── Highlights ── */}
          {hasDimensionScores && (strengths.length > 0 || gaps.length > 0) && (
            <div className="mt-10 grid grid-cols-1 gap-5 sm:grid-cols-2">
              {strengths.length > 0 && (
                <div className="rounded-xl border border-emerald-200 bg-emerald-50/50 p-5">
                  <h3 className="flex items-center gap-2 text-sm font-bold text-emerald-800">
                    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                    </svg>
                    Top Compliance Strengths
                  </h3>
                  <div className="mt-3 space-y-3">
                    {strengths.map((d) => (
                      <a key={d.sectionId} href={`#dim-${d.sectionId}`} className="block hover:bg-emerald-100/50 rounded-lg p-1.5 -mx-1.5 transition">
                        <div className="flex items-center gap-2">
                          <span className={`inline-flex h-6 w-6 items-center justify-center rounded-full text-[10px] font-bold text-white ${gradeColor(d.grade)}`}>
                            {d.grade}
                          </span>
                          <span className="text-sm font-medium text-emerald-900">{d.label}</span>
                        </div>
                        {d.commentary && <p className="mt-1 ml-8 text-xs text-emerald-700 line-clamp-2">{d.commentary}</p>}
                      </a>
                    ))}
                  </div>
                </div>
              )}

              {gaps.length > 0 && (
                <div className="rounded-xl border border-amber-200 bg-amber-50/50 p-5">
                  <h3 className="flex items-center gap-2 text-sm font-bold text-amber-800">
                    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126ZM12 15.75h.007v.008H12v-.008Z" />
                    </svg>
                    Areas Requiring Attention
                  </h3>
                  <div className="mt-3 space-y-3">
                    {gaps.map((d) => (
                      <a key={d.sectionId} href={`#dim-${d.sectionId}`} className="block hover:bg-amber-100/50 rounded-lg p-1.5 -mx-1.5 transition">
                        <div className="flex items-center gap-2">
                          <span className={`inline-flex h-6 w-6 items-center justify-center rounded-full text-[10px] font-bold text-white ${gradeColor(d.grade)}`}>
                            {d.grade}
                          </span>
                          <span className="text-sm font-medium text-amber-900">{d.label}</span>
                        </div>
                        {d.commentary && <p className="mt-1 ml-8 text-xs text-amber-700 line-clamp-2">{d.commentary}</p>}
                      </a>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* ── Detailed Breakdown ── */}
          <div className="mt-14">
            <h2 className="text-lg font-bold text-gray-900 border-b border-gray-200 pb-3">
              Detailed Assessment
            </h2>

            <div className="mt-6 space-y-5">
              {dimensions.map((dim, idx) => (
                <div key={dim.sectionId} id={`dim-${dim.sectionId}`} className="scroll-mt-24 rounded-xl border border-gray-200 overflow-hidden">
                  <div className="flex items-center justify-between bg-gray-50 px-6 py-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-medium text-gray-400">Dimension {idx + 1} of {dimensions.length}</span>
                      </div>
                      <h3 className="mt-0.5 text-base font-bold text-gray-900">{dim.label}</h3>
                      {dim.description && <p className="mt-0.5 text-sm text-gray-500">{dim.description}</p>}
                    </div>
                    <div className="flex flex-col items-center gap-1 ml-4">
                      <span className={`inline-flex h-11 w-11 items-center justify-center rounded-full text-sm font-bold text-white ${gradeColor(dim.grade)}`}>
                        {dim.grade}
                      </span>
                      <span className="text-[10px] text-gray-400">{dim.score > 0 ? `${dim.score}/10` : ""}</span>
                    </div>
                  </div>

                  {dim.commentary && (
                    <div className="px-6 py-5 border-t border-gray-100">
                      <p className="text-sm text-gray-700 leading-relaxed">{dim.commentary}</p>
                    </div>
                  )}

                  {!dim.commentary && dim.score === 0 && (
                    <div className="px-6 py-4 border-t border-gray-100">
                      <p className="text-sm text-gray-400 italic">This dimension has not been assessed yet for this system.</p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* ── Disclaimer ── */}
          <div className="mt-12 rounded-lg bg-gray-50 border border-gray-200 p-5">
            <p className="text-xs text-gray-600">
              <strong>Assessment Disclaimer:</strong> This assessment is based on publicly available information as of the last review date.
              Scores reflect what can be verified from vendor documentation, trust centres, and public certifications.
              This does not constitute legal advice. For a verified assessment tailored to your specific use case,{" "}
              <a href="mailto:consulting@aicompass.eu" className="text-[#003399] underline">contact our consulting team</a>.
            </p>
          </div>

          {/* ── Navigation ── */}
          <div className="mt-8 flex items-center justify-between text-sm">
            <Link href={`/${lang}/systems/${slug}`} className="text-[#003399] hover:underline">
              &larr; All assessments for {system.name}
            </Link>
            <Link href={`/${lang}/regulations/${frameworkSlug}`} className="text-[#003399] hover:underline">
              {framework.name} documentation &rarr;
            </Link>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
