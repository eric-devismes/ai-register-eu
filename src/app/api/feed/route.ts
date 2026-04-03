/**
 * GET /api/feed — Personalised changelog feed for the logged-in subscriber.
 * Returns recent changelog entries for frameworks and systems the user follows.
 */

import { NextResponse } from "next/server";
import { getSubscriber } from "@/lib/subscriber-auth";
import { prisma } from "@/lib/db";

export async function GET() {
  const subscriber = await getSubscriber();
  if (!subscriber) {
    return NextResponse.json({ items: [], authenticated: false });
  }

  const frameworkIds = subscriber.frameworks.map((f) => f.id);
  const systemIds = subscriber.systems.map((s) => s.id);

  // If no preferences set, return recent items from all sources
  const hasPreferences = frameworkIds.length > 0 || systemIds.length > 0;

  const items = await prisma.changeLog.findMany({
    where: hasPreferences
      ? {
          OR: [
            { frameworkId: { in: frameworkIds } },
            { systemId: { in: systemIds } },
          ],
        }
      : {},
    orderBy: { date: "desc" },
    take: 20,
    include: {
      framework: { select: { name: true, slug: true } },
      system: { select: { vendor: true, name: true, slug: true } },
    },
  });

  return NextResponse.json({
    items: items.map((item) => ({
      id: item.id,
      date: item.date,
      title: item.title,
      description: item.description,
      changeType: item.changeType,
      sourceUrl: item.sourceUrl,
      sourceLabel: item.sourceLabel,
      framework: item.framework,
      system: item.system,
    })),
    authenticated: true,
  });
}
