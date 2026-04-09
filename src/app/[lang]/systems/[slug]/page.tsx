/**
 * System Assessment Page — Drill-down view of an AI system's compliance profile.
 *
 * URL: /[lang]/systems/[slug]
 *
 * Server component: fetches data, serialises it, passes to SystemDetailClient
 * for the interactive drill-down UI (accordion sections, score dashboard).
 */

export const dynamic = "force-dynamic";

import { notFound } from "next/navigation";
import { getSystemBySlug } from "@/lib/queries";
import { computeOverallScore, computeAllDimensionScores } from "@/lib/scoring";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import SystemDetailClient from "./SystemDetailClient";
import type { Locale } from "@/lib/i18n";

interface PageProps {
  params: Promise<{ lang: string; slug: string }>;
}

export default async function SystemAssessmentPage({ params }: PageProps) {
  const { lang, slug } = await params;
  const locale = lang as Locale;
  const system = await getSystemBySlug(slug);

  if (!system) notFound();

  const grades = system.scores.map((s) => s.score);
  const overall = computeOverallScore(grades);

  // Compute dimension scores for the spider chart
  const dimensionScores = computeAllDimensionScores({
    scores: system.scores.map((s) => ({ score: s.score })),
    certifications: system.certifications,
    encryptionInfo: system.encryptionInfo,
    accessControls: system.accessControls,
    foundedYear: system.foundedYear,
    employeeCount: system.employeeCount,
    marketPresence: system.marketPresence,
    customerCount: system.customerCount,
    fundingStatus: system.fundingStatus,
    euResidency: system.euResidency,
    dataStorage: system.dataStorage,
    dataProcessing: system.dataProcessing,
    modelDocs: system.modelDocs,
    explainability: system.explainability,
    biasTesting: system.biasTesting,
  });

  // Serialise for client component (dates → strings, strip Prisma internals)
  const systemData = {
    slug: system.slug,
    vendor: system.vendor,
    name: system.name,
    type: system.type,
    risk: system.risk,
    description: system.description,
    capabilityType: system.capabilityType,
    vendorHq: system.vendorHq,
    euPresence: system.euPresence,
    useCases: system.useCases,
    dataStorage: system.dataStorage,
    dataProcessing: system.dataProcessing,
    trainingDataUse: system.trainingDataUse,
    subprocessors: system.subprocessors,
    dpaDetails: system.dpaDetails,
    slaDetails: system.slaDetails,
    dataPortability: system.dataPortability,
    exitTerms: system.exitTerms,
    ipTerms: system.ipTerms,
    certifications: system.certifications,
    encryptionInfo: system.encryptionInfo,
    accessControls: system.accessControls,
    modelDocs: system.modelDocs,
    explainability: system.explainability,
    biasTesting: system.biasTesting,
    aiActStatus: system.aiActStatus,
    gdprStatus: system.gdprStatus,
    euResidency: system.euResidency,
    assessedAt: system.assessedAt?.toISOString() || null,
    assessmentNote: system.assessmentNote,
    industries: system.industries.map((ind) => ({
      id: ind.id,
      slug: ind.slug,
      name: ind.name,
    })),
    scores: system.scores.map((s) => ({
      id: s.id,
      score: s.score,
      framework: {
        slug: s.framework.slug,
        name: s.framework.name,
        criteriaCount: s.framework.criteriaCount,
      },
    })),
  };

  return (
    <>
      <Header />
      <main className="flex-1 bg-gray-50">
        <SystemDetailClient system={systemData} overall={overall} locale={locale} dimensionScores={dimensionScores} />
      </main>
      <Footer />
    </>
  );
}
