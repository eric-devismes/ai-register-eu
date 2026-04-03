/**
 * Server Actions for Framework Sections and Policy Statements.
 *
 * Sections belong to a framework. Statements belong to a section.
 * Both support create, update, and delete with sort ordering.
 */

"use server";

import { prisma } from "@/lib/db";
import { getSession } from "@/lib/auth";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

async function requireAuth() {
  const authenticated = await getSession();
  if (!authenticated) redirect("/admin/login");
}

// ─── Sections ────────────────────────────────────────────

export async function createSection(frameworkId: string, formData: FormData) {
  await requireAuth();
  const title = formData.get("title") as string;
  const description = (formData.get("description") as string) || "";
  const sortOrder = parseInt(formData.get("sortOrder") as string) || 0;

  await prisma.frameworkSection.create({
    data: { frameworkId, title, description, sortOrder },
  });

  revalidatePath(`/admin/frameworks/${frameworkId}/sections`);
  revalidatePath("/");
  redirect(`/admin/frameworks/${frameworkId}/sections`);
}

export async function updateSection(sectionId: string, frameworkId: string, formData: FormData) {
  await requireAuth();
  const title = formData.get("title") as string;
  const description = (formData.get("description") as string) || "";
  const sortOrder = parseInt(formData.get("sortOrder") as string) || 0;

  await prisma.frameworkSection.update({
    where: { id: sectionId },
    data: { title, description, sortOrder },
  });

  revalidatePath(`/admin/frameworks/${frameworkId}/sections`);
  revalidatePath("/");
  redirect(`/admin/frameworks/${frameworkId}/sections`);
}

export async function deleteSection(sectionId: string, frameworkId: string) {
  await requireAuth();
  await prisma.frameworkSection.delete({ where: { id: sectionId } });
  revalidatePath(`/admin/frameworks/${frameworkId}/sections`);
  revalidatePath("/");
}

// ─── Policy Statements ───────────────────────────────────

export async function createStatement(sectionId: string, frameworkId: string, formData: FormData) {
  await requireAuth();
  const reference = (formData.get("reference") as string) || "";
  const statement = formData.get("statement") as string;
  const commentary = (formData.get("commentary") as string) || "";
  const sourceUrl = (formData.get("sourceUrl") as string) || "";
  const sourceNote = (formData.get("sourceNote") as string) || "";
  const sortOrder = parseInt(formData.get("sortOrder") as string) || 0;

  await prisma.policyStatement.create({
    data: { sectionId, reference, statement, commentary, sourceUrl, sourceNote, sortOrder },
  });

  revalidatePath(`/admin/frameworks/${frameworkId}/sections`);
  revalidatePath("/");
  redirect(`/admin/frameworks/${frameworkId}/sections/${sectionId}/statements`);
}

export async function updateStatement(statementId: string, sectionId: string, frameworkId: string, formData: FormData) {
  await requireAuth();
  const reference = (formData.get("reference") as string) || "";
  const statement = formData.get("statement") as string;
  const commentary = (formData.get("commentary") as string) || "";
  const sourceUrl = (formData.get("sourceUrl") as string) || "";
  const sourceNote = (formData.get("sourceNote") as string) || "";
  const sortOrder = parseInt(formData.get("sortOrder") as string) || 0;

  await prisma.policyStatement.update({
    where: { id: statementId },
    data: { reference, statement, commentary, sourceUrl, sourceNote, sortOrder },
  });

  revalidatePath(`/admin/frameworks/${frameworkId}/sections`);
  revalidatePath("/");
  redirect(`/admin/frameworks/${frameworkId}/sections/${sectionId}/statements`);
}

export async function deleteStatement(statementId: string, sectionId: string, frameworkId: string) {
  await requireAuth();
  await prisma.policyStatement.delete({ where: { id: statementId } });
  revalidatePath(`/admin/frameworks/${frameworkId}/sections/${sectionId}/statements`);
  revalidatePath("/");
}
