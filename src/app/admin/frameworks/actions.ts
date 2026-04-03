/**
 * Server Actions for Regulatory Frameworks
 *
 * Handles create, update, and delete for frameworks.
 * Includes meta fields (issuing authority, enforcement, penalty, etc.)
 * and industry connections.
 */

"use server";

import { prisma } from "@/lib/db";
import { getSession } from "@/lib/auth";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

function slugify(name: string): string {
  return name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
}

async function requireAuth() {
  const authenticated = await getSession();
  if (!authenticated) redirect("/admin/login");
}

/** Extract all framework fields from form data */
function extractFields(formData: FormData) {
  return {
    name: formData.get("name") as string,
    description: formData.get("description") as string,
    content: (formData.get("content") as string) || "",
    badgeType: formData.get("badgeType") as string,
    criteriaCount: parseInt(formData.get("criteriaCount") as string) || 0,
    effectiveDate: (formData.get("effectiveDate") as string) || "",
    published: formData.get("published") === "on",
    issuingAuthority: (formData.get("issuingAuthority") as string) || "",
    enforcementType: (formData.get("enforcementType") as string) || "",
    maxPenalty: (formData.get("maxPenalty") as string) || "",
    applicableRegions: (formData.get("applicableRegions") as string) || "",
    purpose: (formData.get("purpose") as string) || "",
    officialUrl: (formData.get("officialUrl") as string) || "",
  };
}

export async function createFramework(formData: FormData) {
  await requireAuth();
  const fields = extractFields(formData);
  const industryIds = formData.getAll("industryIds") as string[];

  await prisma.regulatoryFramework.create({
    data: {
      slug: slugify(fields.name),
      ...fields,
      industries: { connect: industryIds.map((id) => ({ id })) },
    },
  });

  revalidatePath("/admin/frameworks");
  revalidatePath("/");
  redirect("/admin/frameworks");
}

export async function updateFramework(id: string, formData: FormData) {
  await requireAuth();
  const fields = extractFields(formData);
  const industryIds = formData.getAll("industryIds") as string[];

  await prisma.regulatoryFramework.update({
    where: { id },
    data: {
      slug: slugify(fields.name),
      ...fields,
      industries: { set: industryIds.map((id) => ({ id })) },
    },
  });

  revalidatePath("/admin/frameworks");
  revalidatePath("/");
  redirect("/admin/frameworks");
}

export async function deleteFramework(id: string) {
  await requireAuth();
  await prisma.regulatoryFramework.delete({ where: { id } });
  revalidatePath("/admin/frameworks");
  revalidatePath("/");
}
