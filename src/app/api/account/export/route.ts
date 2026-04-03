/**
 * GET /api/account/export — Export all subscriber data as JSON.
 * GDPR Article 20: Right to data portability.
 */

import { NextResponse } from "next/server";
import { getSubscriber } from "@/lib/subscriber-auth";
import { prisma } from "@/lib/db";

export async function GET() {
  const subscriber = await getSubscriber();
  if (!subscriber) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  // Fetch complete subscriber data
  const fullData = await prisma.subscriber.findUnique({
    where: { id: subscriber.id },
    include: {
      frameworks: { select: { name: true, slug: true } },
      systems: { select: { vendor: true, name: true, slug: true } },
    },
  });

  const digestLogs = await prisma.digestLog.findMany({
    where: { subscriberId: subscriber.id },
    orderBy: { sentAt: "desc" },
  });

  const exportData = {
    exportDate: new Date().toISOString(),
    exportedBy: "AI Compass EU — GDPR Data Export (Article 20)",
    subscriber: {
      email: fullData?.email,
      verified: fullData?.verified,
      digestEnabled: fullData?.digestEnabled,
      digestFrequency: fullData?.digestFrequency,
      consentDate: fullData?.consentDate,
      consentText: fullData?.consentText,
      createdAt: fullData?.createdAt,
    },
    preferences: {
      frameworks: fullData?.frameworks || [],
      systems: fullData?.systems || [],
    },
    digestHistory: digestLogs.map((log) => ({
      sentAt: log.sentAt,
      itemCount: log.itemCount,
      status: log.status,
    })),
  };

  return new NextResponse(JSON.stringify(exportData, null, 2), {
    headers: {
      "Content-Type": "application/json",
      "Content-Disposition": `attachment; filename="aicompass-data-export-${new Date().toISOString().split("T")[0]}.json"`,
    },
  });
}
