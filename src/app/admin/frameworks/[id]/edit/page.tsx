/**
 * Edit Regulatory Framework Page
 */

export const dynamic = "force-dynamic";

import { notFound } from "next/navigation";
import { prisma } from "@/lib/db";
import { getAllIndustries } from "@/lib/queries";
import FrameworkForm from "../../FrameworkForm";
import { updateFramework } from "../../actions";

interface EditPageProps {
  params: Promise<{ id: string }>;
}

export default async function EditFrameworkPage({ params }: EditPageProps) {
  const { id } = await params;

  const [framework, industries] = await Promise.all([
    prisma.regulatoryFramework.findUnique({
      where: { id },
      include: { industries: true },
    }),
    getAllIndustries(),
  ]);

  if (!framework) notFound();

  const updateWithId = updateFramework.bind(null, framework.id);

  return (
    <>
      <h1 className="font-heading text-2xl font-bold text-text-primary">
        Edit: {framework.name}
      </h1>
      <p className="mt-1 text-sm text-text-secondary">
        Update framework details. Changes appear on the website immediately.
      </p>
      <div className="mt-8">
        <FrameworkForm
          industries={industries.map((i) => ({ id: i.id, name: i.name }))}
          framework={{
            id: framework.id,
            name: framework.name,
            description: framework.description,
            content: framework.content,
            badgeType: framework.badgeType,
            criteriaCount: framework.criteriaCount,
            effectiveDate: framework.effectiveDate,
            published: framework.published,
            issuingAuthority: framework.issuingAuthority,
            enforcementType: framework.enforcementType,
            maxPenalty: framework.maxPenalty,
            applicableRegions: framework.applicableRegions,
            purpose: framework.purpose,
            officialUrl: framework.officialUrl,
            industryIds: framework.industries.map((i) => i.id),
          }}
          action={updateWithId}
        />
      </div>
    </>
  );
}
