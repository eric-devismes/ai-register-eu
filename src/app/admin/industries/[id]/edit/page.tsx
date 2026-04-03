export const dynamic = "force-dynamic";

import { notFound } from "next/navigation";
import { prisma } from "@/lib/db";
import IndustryForm from "../../IndustryForm";
import { updateIndustry } from "../../actions";

interface EditPageProps {
  params: Promise<{ id: string }>;
}

export default async function EditIndustryPage({ params }: EditPageProps) {
  const { id } = await params;
  const industry = await prisma.industry.findUnique({ where: { id } });
  if (!industry) notFound();

  const updateWithId = updateIndustry.bind(null, industry.id);

  return (
    <>
      <h1 className="font-heading text-2xl font-bold text-text-primary">Edit: {industry.name}</h1>
      <div className="mt-8">
        <IndustryForm industry={industry} action={updateWithId} />
      </div>
    </>
  );
}
