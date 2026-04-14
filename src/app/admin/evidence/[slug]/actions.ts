/**
 * Server actions for the evidence review queue.
 *
 * These are the only paths through which a draft claim can become published.
 * Every action runs auth check, mutates atomically, and revalidates both the
 * admin queue and the public system page.
 */

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
 * Promote a draft claim to published.
 *
 * Transaction:
 *   1. Find any existing published claim on the same (systemId, field)
 *      → demote it to status="retired" with a reason pointing at the
 *      draft that replaced it. We never just overwrite published values;
 *      every superseded claim leaves a paper trail.
 *   2. Flip the draft to status="published", stamp verifiedAt + verifiedBy.
 *   3. Resolve any open source-diff ReviewTask for this source — the
 *      analyst's action IS the resolution.
 */
export async function approveDraft(formData: FormData) {
  await requireAuth();
  const draftId = String(formData.get("draftId") ?? "");
  const editedValue = String(formData.get("editedValue") ?? "").trim();
  const editedConfidence = String(formData.get("editedConfidence") ?? "").trim();
  if (!draftId) return;

  const draft = await prisma.systemClaim.findUnique({
    where: { id: draftId },
    select: {
      id: true,
      systemId: true,
      field: true,
      value: true,
      sourceId: true,
      confidence: true,
      system: { select: { slug: true } },
    },
  });
  if (!draft || !draft.system) return;

  const adminEmail = "analyst"; // TODO: pull from session once admin email surfaces

  await prisma.$transaction(async (tx) => {
    // Demote any current published claim for this field
    const existing = await tx.systemClaim.findUnique({
      where: {
        systemId_field_status: {
          systemId: draft.systemId,
          field: draft.field,
          status: "published",
        },
      },
      select: { id: true },
    });
    if (existing) {
      // Retire the previous published claim. We rename the `field` to include
      // a timestamp suffix so multiple retired versions can coexist (the
      // unique key (systemId, field, status) would otherwise reject a second
      // retirement on the same field). The original field is still recoverable
      // by stripping the `:retired:<ts>` suffix; retiredReason links to the
      // draft that replaced it.
      const ts = Date.now();
      await tx.systemClaim.update({
        where: { id: existing.id },
        data: {
          field: `${draft.field}:retired:${ts}`,
          status: "retired",
          retiredAt: new Date(ts),
          retiredReason: `Superseded by draft ${draft.id}`,
        },
      });
    }

    // Promote the draft (with optional analyst edits)
    await tx.systemClaim.update({
      where: { id: draft.id },
      data: {
        status: "published",
        value: editedValue || draft.value,
        confidence:
          editedConfidence === "high" || editedConfidence === "medium" || editedConfidence === "low"
            ? editedConfidence
            : draft.confidence,
        verifiedBy: adminEmail,
        verifiedAt: new Date(),
      },
    });

    // Close the source-diff review task if any (assume the analyst's
    // approval indicates they reviewed the diff).
    if (draft.sourceId) {
      await tx.reviewTask.updateMany({
        where: {
          sourceId: draft.sourceId,
          type: "source-diff",
          status: "open",
        },
        data: {
          status: "resolved",
          resolvedAt: new Date(),
          resolution: `Promoted draft ${draft.id} to published`,
        },
      });
    }
  });

  revalidatePath(`/admin/evidence/${draft.system.slug}`);
  revalidatePath(`/admin/evidence`);
  // Revalidate every locale of the public system page
  revalidatePath(`/[lang]/systems/${draft.system.slug}`, "page");
}

/**
 * Reject a draft claim — analyst confirms the extractor got it wrong
 * (bad quote, wrong inference, irrelevant). The draft is hard-deleted
 * because there's no value preserving rejected drafts; the snapshot
 * itself is the audit trail of what was available to extract.
 */
export async function rejectDraft(formData: FormData) {
  await requireAuth();
  const draftId = String(formData.get("draftId") ?? "");
  if (!draftId) return;

  const draft = await prisma.systemClaim.findUnique({
    where: { id: draftId },
    select: { system: { select: { slug: true } } },
  });
  await prisma.systemClaim.delete({ where: { id: draftId } });

  if (draft?.system) revalidatePath(`/admin/evidence/${draft.system.slug}`);
  revalidatePath(`/admin/evidence`);
}

/**
 * Reject all drafts for a system in one go — useful when the extractor
 * over-fired or the analyst wants to start fresh after editing the
 * source URL list.
 */
export async function rejectAllDraftsForSystem(formData: FormData) {
  await requireAuth();
  const systemId = String(formData.get("systemId") ?? "");
  const slug = String(formData.get("slug") ?? "");
  if (!systemId) return;

  await prisma.systemClaim.deleteMany({
    where: { systemId, status: "draft" },
  });

  if (slug) revalidatePath(`/admin/evidence/${slug}`);
  revalidatePath(`/admin/evidence`);
}

/**
 * Re-run the LLM extractor against the latest snapshot of every source
 * for this system. Useful when the prompt was tuned or when a source
 * was just refreshed via the fetcher.
 */
export async function reExtractForSystem(formData: FormData) {
  await requireAuth();
  const systemId = String(formData.get("systemId") ?? "");
  const slug = String(formData.get("slug") ?? "");
  if (!systemId) return;

  const { extractClaimsFromSnapshot, persistDraftClaims } = await import("@/lib/claim-extractor");
  const sources = await prisma.source.findMany({
    where: { active: true, systemId },
    include: {
      snapshots: {
        where: { status: "success" },
        orderBy: { fetchedAt: "desc" },
        take: 1,
      },
    },
  });

  for (const src of sources) {
    const snap = src.snapshots[0];
    if (!snap) continue;
    const result = await extractClaimsFromSnapshot({
      rawText: snap.rawText,
      sourceLabel: src.label,
      sourceUrl: src.url,
    });
    if (!result.ok) continue;
    await persistDraftClaims({
      systemId: src.systemId,
      sourceId: src.id,
      snapshotId: snap.id,
      claims: result.claims,
    });
  }

  if (slug) revalidatePath(`/admin/evidence/${slug}`);
  revalidatePath(`/admin/evidence`);
}
