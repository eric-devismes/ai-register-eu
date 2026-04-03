/**
 * Server Actions for Dimension Scores — per-section scoring for cross-reports.
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

export async function saveDimensionScores(systemId: string, formData: FormData) {
  await requireAuth();

  // Extract all score_<sectionId> and commentary_<sectionId> fields
  const entries: { sectionId: string; score: string; commentary: string }[] = [];

  for (const [key, value] of formData.entries()) {
    if (key.startsWith("score_")) {
      const sectionId = key.replace("score_", "");
      const commentary = (formData.get(`commentary_${sectionId}`) as string) || "";
      if (value) {
        entries.push({ sectionId, score: value as string, commentary });
      }
    }
  }

  // Upsert all dimension scores in a transaction
  await prisma.$transaction(async (tx) => {
    for (const { sectionId, score, commentary } of entries) {
      await tx.dimensionScore.upsert({
        where: { systemId_sectionId: { systemId, sectionId } },
        update: { score, commentary },
        create: { systemId, sectionId, score, commentary },
      });
    }

    // Delete scores for sections that were cleared (not in entries)
    const scoredSectionIds = entries.map((e) => e.sectionId);
    await tx.dimensionScore.deleteMany({
      where: {
        systemId,
        sectionId: { notIn: scoredSectionIds },
      },
    });
  });

  revalidatePath(`/admin/systems/${systemId}/scores`);
  revalidatePath("/");
  redirect(`/admin/systems/${systemId}/scores`);
}
