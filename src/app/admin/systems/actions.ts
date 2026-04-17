/**
 * Server Actions for AI Systems
 *
 * Handles create, update, and delete.
 * Creates/updates AssessmentScore records for per-framework scores.
 * Connects/disconnects Industry relations via checkboxes.
 */

"use server";

import { prisma } from "@/lib/db";
import { getSession } from "@/lib/auth";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

/** Generate a URL slug from vendor + name */
function slugify(vendor: string, name: string): string {
  return `${vendor}-${name}`
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

/** Redirect to login if not authenticated */
async function requireAuth() {
  const authenticated = await getSession();
  if (!authenticated) redirect("/admin/login");
}

/**
 * Extract per-framework scores from form data.
 * Score fields are named "score_<frameworkId>".
 * Returns an array of { frameworkId, score } for non-empty values.
 */
function extractScores(formData: FormData): { frameworkId: string; score: string }[] {
  const scores: { frameworkId: string; score: string }[] = [];
  for (const [key, value] of formData.entries()) {
    if (key.startsWith("score_") && value) {
      const frameworkId = key.replace("score_", "");
      scores.push({ frameworkId, score: value as string });
    }
  }
  return scores;
}

/** Extract all profile text fields from the form */
function extractProfileFields(formData: FormData) {
  return {
    vendorHq: (formData.get("vendorHq") as string) || "",
    euPresence: (formData.get("euPresence") as string) || "",
    useCases: (formData.get("useCases") as string) || "",
    dataStorage: (formData.get("dataStorage") as string) || "",
    dataProcessing: (formData.get("dataProcessing") as string) || "",
    trainingDataUse: (formData.get("trainingDataUse") as string) || "",
    subprocessors: (formData.get("subprocessors") as string) || "",
    dpaDetails: (formData.get("dpaDetails") as string) || "",
    slaDetails: (formData.get("slaDetails") as string) || "",
    dataPortability: (formData.get("dataPortability") as string) || "",
    exitTerms: (formData.get("exitTerms") as string) || "",
    ipTerms: (formData.get("ipTerms") as string) || "",
    certifications: (formData.get("certifications") as string) || "",
    encryptionInfo: (formData.get("encryptionInfo") as string) || "",
    accessControls: (formData.get("accessControls") as string) || "",
    modelDocs: (formData.get("modelDocs") as string) || "",
    explainability: (formData.get("explainability") as string) || "",
    biasTesting: (formData.get("biasTesting") as string) || "",
    aiActStatus: (formData.get("aiActStatus") as string) || "",
    gdprStatus: (formData.get("gdprStatus") as string) || "",
    euResidency: (formData.get("euResidency") as string) || "",
    assessmentNote: (formData.get("assessmentNote") as string) || "",
  };
}

export async function createSystem(formData: FormData) {
  await requireAuth();

  // Basic fields
  const vendor = formData.get("vendor") as string;
  const name = formData.get("name") as string;
  const type = formData.get("type") as string;
  const risk = formData.get("risk") as string;
  const description = formData.get("description") as string;
  const category = formData.get("category") as string;
  const featured = formData.get("featured") === "on";
  const profile = extractProfileFields(formData);

  // Industry IDs from checkboxes
  const industryIds = formData.getAll("industryIds") as string[];

  // Per-framework scores
  const scores = extractScores(formData);

  // Create everything in a transaction for atomicity
  await prisma.$transaction(async (tx) => {
    // 1. Create the AI system with industry connections
    const system = await tx.aISystem.create({
      data: {
        slug: slugify(vendor, name),
        vendor, name, type, risk, description, category, featured,
        ...profile,
        industries: { connect: industryIds.map((id) => ({ id })) },
      },
    });

    // 2. Create assessment scores for each rated framework
    for (const { frameworkId, score } of scores) {
      await tx.assessmentScore.create({
        data: { systemId: system.id, frameworkId, score },
      });
    }
  });

  revalidatePath("/admin/systems");
  revalidatePath("/");
  redirect("/admin/systems");
}

export async function updateSystem(id: string, formData: FormData) {
  await requireAuth();

  const vendor = formData.get("vendor") as string;
  const name = formData.get("name") as string;
  const type = formData.get("type") as string;
  const risk = formData.get("risk") as string;
  const description = formData.get("description") as string;
  const category = formData.get("category") as string;
  const featured = formData.get("featured") === "on";
  const profile = extractProfileFields(formData);
  const industryIds = formData.getAll("industryIds") as string[];
  const scores = extractScores(formData);

  await prisma.$transaction(async (tx) => {
    // 1. Update the system, replacing all industry connections
    await tx.aISystem.update({
      where: { id },
      data: {
        slug: slugify(vendor, name),
        vendor, name, type, risk, description, category, featured,
        ...profile,
        industries: { set: industryIds.map((iid) => ({ id: iid })) },
      },
    });

    // 2. Delete all existing scores for this system
    await tx.assessmentScore.deleteMany({ where: { systemId: id } });

    // 3. Create fresh scores
    for (const { frameworkId, score } of scores) {
      await tx.assessmentScore.create({
        data: { systemId: id, frameworkId, score },
      });
    }
  });

  revalidatePath("/admin/systems");
  revalidatePath("/");
  redirect("/admin/systems");
}

export async function deleteSystem(id: string) {
  await requireAuth();
  await prisma.aISystem.delete({ where: { id } });
  revalidatePath("/admin/systems");
  revalidatePath("/");
}

export async function toggleSystemStatus(id: string) {
  await requireAuth();
  const current = await prisma.aISystem.findUnique({
    where: { id },
    select: { status: true },
  });
  if (!current) return;
  const next = current.status === "active" ? "inactive" : "active";
  await prisma.aISystem.update({
    where: { id },
    data: { status: next },
  });
  revalidatePath("/admin/systems");
  revalidatePath("/");
}
