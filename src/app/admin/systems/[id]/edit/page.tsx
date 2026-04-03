/**
 * Edit AI System Page
 *
 * Loads the existing system with its scores and industries,
 * plus all available frameworks and industries for the form.
 */

export const dynamic = "force-dynamic";

import { notFound } from "next/navigation";
import { prisma } from "@/lib/db";
import { getAllFrameworks, getAllIndustries } from "@/lib/queries";
import SystemForm from "../../SystemForm";
import { updateSystem } from "../../actions";

interface EditPageProps {
  params: Promise<{ id: string }>;
}

export default async function EditSystemPage({ params }: EditPageProps) {
  const { id } = await params;

  // Fetch the system with its relations, plus all frameworks and industries
  const [system, frameworks, industries] = await Promise.all([
    prisma.aISystem.findUnique({
      where: { id },
      include: {
        industries: true,
        scores: true,
      },
    }),
    getAllFrameworks(),
    getAllIndustries(),
  ]);

  if (!system) notFound();

  const updateWithId = updateSystem.bind(null, system.id);

  return (
    <>
      <h1 className="font-heading text-2xl font-bold text-text-primary">
        Edit: {system.name}
      </h1>
      <p className="mt-1 text-sm text-text-secondary">
        Update details. Changes appear on the website immediately.
      </p>
      <div className="mt-8">
        <SystemForm
          frameworks={frameworks.map((f) => ({ id: f.id, name: f.name }))}
          industries={industries.map((i) => ({ id: i.id, name: i.name }))}
          system={{
            id: system.id,
            vendor: system.vendor,
            name: system.name,
            type: system.type,
            risk: system.risk,
            description: system.description,
            category: system.category,
            featured: system.featured,
            industryIds: system.industries.map((i) => i.id),
            scores: system.scores.map((s) => ({
              frameworkId: s.frameworkId,
              score: s.score,
            })),
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
            assessmentNote: system.assessmentNote,
          }}
          action={updateWithId}
        />
      </div>
    </>
  );
}
