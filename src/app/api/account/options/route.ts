/**
 * GET /api/account/options — Returns subscriber data + all available frameworks and systems.
 * Used by the account preferences page.
 */

import { NextResponse } from "next/server";
import { getSubscriber } from "@/lib/subscriber-auth";
import { prisma } from "@/lib/db";

export async function GET() {
  const subscriber = await getSubscriber();
  if (!subscriber) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  const [frameworks, systems] = await Promise.all([
    prisma.regulatoryFramework.findMany({
      where: { published: true },
      orderBy: { name: "asc" },
      select: { id: true, slug: true, name: true },
    }),
    prisma.aISystem.findMany({
      orderBy: [{ vendor: "asc" }, { name: "asc" }],
      select: { id: true, slug: true, vendor: true, name: true },
    }),
  ]);

  return NextResponse.json({
    subscriber: {
      email: subscriber.email,
      tier: subscriber.tier,
      subscriptionId: subscriber.stripeSubscriptionId,
      tierExpiresAt: subscriber.tierExpiresAt,
      digestFrequency: subscriber.digestFrequency,
      frameworks: subscriber.frameworks,
      systems: subscriber.systems,
    },
    frameworks,
    systems,
  });
}
