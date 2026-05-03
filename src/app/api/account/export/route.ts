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

  const [digestLogs, chatLogs] = await Promise.all([
    prisma.digestLog.findMany({
      where: { subscriberId: subscriber.id },
      orderBy: { sentAt: "desc" },
    }),
    prisma.chatLog.findMany({
      where: { subscriberId: subscriber.id },
      orderBy: { createdAt: "desc" },
      select: {
        question: true,
        answer: true,
        locale: true,
        blocked: true,
        createdAt: true,
      },
    }),
  ]);

  const exportData = {
    exportDate: new Date().toISOString(),
    exportedBy: "VendorScope — GDPR Data Export (Article 20)",
    subscriber: {
      email: fullData?.email,
      name: fullData?.name || undefined,
      verified: fullData?.verified,
      role: fullData?.role || undefined,
      industry: fullData?.industry || undefined,
      orgSize: fullData?.orgSize || undefined,
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
    chatHistory: chatLogs.map((log) => ({
      question: log.question,
      answer: log.answer,
      locale: log.locale,
      blocked: log.blocked,
      date: log.createdAt,
    })),
    digestHistory: digestLogs.map((log) => ({
      sentAt: log.sentAt,
      itemCount: log.itemCount,
      status: log.status,
    })),
  };

  return new NextResponse(JSON.stringify(exportData, null, 2), {
    headers: {
      "Content-Type": "application/json",
      "Content-Disposition": `attachment; filename="vendorscope-data-export-${new Date().toISOString().split("T")[0]}.json"`,
    },
  });
}
