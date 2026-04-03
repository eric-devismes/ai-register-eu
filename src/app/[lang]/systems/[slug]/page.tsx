/**
 * Full Assessment Page — Comprehensive public view of an AI system's compliance profile.
 *
 * URL: /systems/[slug]  (e.g., /systems/microsoft-azure-openai-service)
 *
 * Shows: overall score, per-framework scores, vendor profile,
 * data handling, security, contractual, transparency, and compliance sections.
 */

export const dynamic = "force-dynamic";

import { notFound } from "next/navigation";
import Link from "next/link";
import { getSystemBySlug } from "@/lib/queries";
import { computeOverallScore, gradeColor } from "@/lib/scoring";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";

interface PageProps {
  params: Promise<{ lang: string; slug: string }>;
}

/** Render a detail section only if the field has content */
function DetailSection({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <h3 className="text-sm font-semibold uppercase tracking-wider text-gray-400">{title}</h3>
      <div className="mt-2 text-sm leading-relaxed text-gray-700">{children}</div>
    </div>
  );
}

/** Render a field label + value pair */
function Field({ label, value }: { label: string; value: string }) {
  if (!value) return null;
  return (
    <div className="py-2 border-b border-gray-100 last:border-0">
      <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">{label}</span>
      <p className="mt-0.5 text-sm text-gray-800">{value}</p>
    </div>
  );
}

export default async function SystemAssessmentPage({ params }: PageProps) {
  const { lang, slug } = await params;
  const system = await getSystemBySlug(slug);

  if (!system) notFound();

  const grades = system.scores.map((s) => s.score);
  const overall = computeOverallScore(grades);

  const riskClass =
    system.risk === "High" ? "bg-red-100 text-red-700 border-red-200" :
    system.risk === "Limited" ? "bg-amber-100 text-amber-700 border-amber-200" :
    "bg-green-100 text-green-700 border-green-200";

  const hasProfile = system.vendorHq || system.euPresence || system.dataStorage;

  return (
    <>
      <Header />
      <main className="flex-1 bg-white">
        <div className="mx-auto max-w-5xl px-4 py-16 sm:px-6 lg:px-8">
          {/* Breadcrumb */}
          <nav className="mb-8 text-sm text-gray-400">
            <Link href="/" className="hover:text-[#003399]">Home</Link>
            <span className="mx-2">/</span>
            <Link href="/database" className="hover:text-[#003399]">Database</Link>
            <span className="mx-2">/</span>
            <span className="text-gray-600">{system.name}</span>
          </nav>

          {/* ── Header ── */}
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-sm font-semibold uppercase tracking-wider text-[#003399]">{system.vendor}</p>
              <h1 className="mt-1 text-3xl font-bold text-gray-900 sm:text-4xl">{system.name}</h1>
              <p className="mt-1 text-gray-500">{system.type}</p>
              {system.vendorHq && <p className="mt-2 text-sm text-gray-400">HQ: {system.vendorHq}</p>}
            </div>
            <div className="flex flex-col items-end gap-2">
              <span className={`rounded-full border px-3 py-1 text-sm font-semibold ${riskClass}`}>
                {system.risk} Risk
              </span>
              <span className={`inline-flex h-16 w-16 items-center justify-center rounded-full text-xl font-bold text-white ${gradeColor(overall)}`}>
                {overall}
              </span>
            </div>
          </div>

          {/* Description */}
          <p className="mt-6 text-lg leading-relaxed text-gray-600">{system.description}</p>

          {/* Industries + Use Cases */}
          <div className="mt-6 flex flex-wrap gap-2">
            {system.industries.map((ind) => (
              <Link key={ind.id} href={`/industries/${ind.slug}`}
                className="rounded-full bg-gray-100 px-3 py-1 text-sm text-gray-600 hover:bg-gray-200">
                {ind.name}
              </Link>
            ))}
          </div>

          {system.useCases && (
            <div className="mt-6">
              <h3 className="text-sm font-semibold uppercase tracking-wider text-gray-400">Key Use Cases</h3>
              <ul className="mt-2 grid grid-cols-1 gap-1 sm:grid-cols-2">
                {system.useCases.split("\n").filter(Boolean).map((uc, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm text-gray-700">
                    <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-[#003399]" />
                    {uc}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* ── Compliance Scores ── */}
          <div className="mt-12">
            <h2 className="text-xl font-bold text-gray-900">Compliance Assessment</h2>

            {/* Overall */}
            <div className="mt-6 flex items-center gap-6 rounded-xl bg-gray-50 p-6">
              <span className={`inline-flex h-20 w-20 items-center justify-center rounded-full text-2xl font-bold text-white ${gradeColor(overall)}`}>
                {overall}
              </span>
              <div>
                <p className="text-lg font-bold text-gray-900">Overall Score</p>
                <p className="text-sm text-gray-500">Average across {system.scores.length} regulatory frameworks</p>
              </div>
            </div>

            {/* Per-framework */}
            <div className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
              {system.scores.map((s) => (
                <Link key={s.id} href={`/${lang}/systems/${slug}/${s.framework.slug}`}
                  className="flex items-center gap-3 rounded-xl border border-gray-200 p-4 transition hover:border-[#003399]/30 hover:shadow-sm">
                  <span className={`inline-flex h-12 w-12 items-center justify-center rounded-full text-sm font-bold text-white ${gradeColor(s.score)}`}>
                    {s.score}
                  </span>
                  <div>
                    <p className="text-sm font-semibold text-gray-900">{s.framework.name}</p>
                    <p className="text-xs text-gray-400">{s.framework.criteriaCount} criteria</p>
                  </div>
                </Link>
              ))}
            </div>
          </div>

          {/* ── Full Vendor Profile ── */}
          {hasProfile && (
            <div className="mt-16 space-y-12">
              {/* Data Handling */}
              {(system.dataStorage || system.dataProcessing || system.trainingDataUse) && (
                <div>
                  <h2 className="text-xl font-bold text-gray-900 border-b border-gray-200 pb-3">Data Handling</h2>
                  <div className="mt-4 space-y-0">
                    <Field label="Storage Locations" value={system.dataStorage} />
                    <Field label="Processing Locations" value={system.dataProcessing} />
                    <Field label="Training Data Usage" value={system.trainingDataUse} />
                    <Field label="Subprocessors" value={system.subprocessors} />
                  </div>
                </div>
              )}

              {/* Contractual */}
              {(system.dpaDetails || system.slaDetails) && (
                <div>
                  <h2 className="text-xl font-bold text-gray-900 border-b border-gray-200 pb-3">Contractual Commitments</h2>
                  <div className="mt-4 space-y-0">
                    <Field label="Data Processing Agreement" value={system.dpaDetails} />
                    <Field label="Service Level Agreements" value={system.slaDetails} />
                    <Field label="Data Portability" value={system.dataPortability} />
                    <Field label="Exit Terms" value={system.exitTerms} />
                    <Field label="IP Terms" value={system.ipTerms} />
                  </div>
                </div>
              )}

              {/* Security */}
              {(system.certifications || system.encryptionInfo) && (
                <div>
                  <h2 className="text-xl font-bold text-gray-900 border-b border-gray-200 pb-3">Security Posture</h2>
                  <div className="mt-4 space-y-0">
                    <Field label="Certifications" value={system.certifications} />
                    <Field label="Encryption" value={system.encryptionInfo} />
                    <Field label="Access Controls" value={system.accessControls} />
                  </div>
                </div>
              )}

              {/* AI Transparency */}
              {(system.modelDocs || system.explainability) && (
                <div>
                  <h2 className="text-xl font-bold text-gray-900 border-b border-gray-200 pb-3">AI Transparency</h2>
                  <div className="mt-4 space-y-0">
                    <Field label="Model Documentation" value={system.modelDocs} />
                    <Field label="Explainability" value={system.explainability} />
                    <Field label="Bias Testing" value={system.biasTesting} />
                  </div>
                </div>
              )}

              {/* EU Compliance */}
              {(system.aiActStatus || system.gdprStatus) && (
                <div>
                  <h2 className="text-xl font-bold text-gray-900 border-b border-gray-200 pb-3">EU Compliance Status</h2>
                  <div className="mt-4 space-y-0">
                    <Field label="EU AI Act" value={system.aiActStatus} />
                    <Field label="GDPR" value={system.gdprStatus} />
                    <Field label="EU Data Residency" value={system.euResidency} />
                    <Field label="EU Presence" value={system.euPresence} />
                  </div>
                </div>
              )}

              {/* Disclaimer */}
              <div className="rounded-lg bg-amber-50 border border-amber-200 p-4">
                <p className="text-xs text-amber-800">
                  <strong>Assessment Disclaimer:</strong> This assessment is based on publicly available information as of the last review date. Scores reflect what can be verified from vendor documentation, trust centers, and public certifications. For a verified assessment tailored to your specific use case, contact us about our consulting services.
                </p>
              </div>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}
