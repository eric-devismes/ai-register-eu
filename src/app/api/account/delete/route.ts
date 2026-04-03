/**
 * DELETE /api/account/delete — Permanently delete subscriber and all data.
 * GDPR Article 17: Right to erasure.
 */

import { NextResponse } from "next/server";
import { getSubscriber, logoutSubscriber } from "@/lib/subscriber-auth";
import { prisma } from "@/lib/db";

export async function DELETE() {
  const subscriber = await getSubscriber();
  if (!subscriber) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  // Delete all related data
  await prisma.digestLog.deleteMany({ where: { subscriberId: subscriber.id } });
  await prisma.subscriber.delete({ where: { id: subscriber.id } });

  // Clear session
  await logoutSubscriber();

  return NextResponse.json({ success: true });
}
