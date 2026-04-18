"use server";

import { prisma } from "@/lib/db";
import { getSession } from "@/lib/auth";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

async function requireAuth() {
  const ok = await getSession();
  if (!ok) redirect("/admin/login");
}

/**
 * Approve every high-confidence draft across ALL systems in one shot.
 * Safety gate: skips any draft where a DIFFERENT published value already
 * exists on the same field — those still need per-claim analyst review.
 */
export async function approveAllHighConfidenceDrafts(): Promise<void> {
  await requireAuth();

  const drafts = await prisma.systemClaim.findMany({
    where: { status: "draft", confidence: "high" },
    select: { id: true, systemId: true, field: true, value: true, sourceId: true },
  });
  if (drafts.length === 0) {
    revalidatePath("/admin/evidence");
    return;
  }

  // Build a lookup of existing published claims keyed by systemId+field
  const systemIds = [...new Set(drafts.map((d) => d.systemId))];
  const fields = [...new Set(drafts.map((d) => d.field))];
  const published = await prisma.systemClaim.findMany({
    where: { status: "published", systemId: { in: systemIds }, field: { in: fields } },
    select: { id: true, systemId: true, field: true, value: true },
  });
  const pubMap = new Map(published.map((p) => [`${p.systemId}::${p.field}`, p]));

  let promoted = 0;
  let skipped = 0;

  for (const d of drafts) {
    const key = `${d.systemId}::${d.field}`;
    const pub = pubMap.get(key);

    if (pub && pub.value.trim() !== d.value.trim()) {
      skipped++;
      continue;
    }

    await prisma.$transaction(async (tx) => {
      if (pub) {
        const ts = Date.now();
        await tx.systemClaim.update({
          where: { id: pub.id },
          data: {
            field: `${d.field}:retired:${ts}`,
            status: "retired",
            retiredAt: new Date(ts),
            retiredReason: `Superseded by high-confidence draft ${d.id} (global bulk)`,
          },
        });
      }
      await tx.systemClaim.update({
        where: { id: d.id },
        data: { status: "published", verifiedBy: "analyst:global-bulk-high", verifiedAt: new Date() },
      });
      if (d.sourceId) {
        await tx.reviewTask.updateMany({
          where: { sourceId: d.sourceId, status: "open" },
          data: { status: "resolved", resolvedAt: new Date() },
        });
      }
    });
    promoted++;
  }

  revalidatePath("/admin/evidence");
  // Revalidate public pages for every affected system
  const slugs = await prisma.aISystem.findMany({
    where: { id: { in: systemIds } },
    select: { slug: true },
  });
  for (const { slug } of slugs) revalidatePath(`/en/systems/${slug}`);

  redirect(`/admin/evidence?bulk=Promoted+${promoted}+claims%2C+skipped+${skipped}+conflicts`);
}
