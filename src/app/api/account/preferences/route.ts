/**
 * PUT /api/account/preferences — Update subscriber preferences.
 * Body: { frameworkIds: string[], systemIds: string[], digestFrequency: string }
 */

import { NextResponse } from "next/server";
import { getSubscriber } from "@/lib/subscriber-auth";
import { prisma } from "@/lib/db";

export async function PUT(request: Request) {
  const subscriber = await getSubscriber();
  if (!subscriber) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  const { frameworkIds, systemIds, digestFrequency } = await request.json();

  await prisma.subscriber.update({
    where: { id: subscriber.id },
    data: {
      frameworks: { set: (frameworkIds || []).map((id: string) => ({ id })) },
      systems: { set: (systemIds || []).map((id: string) => ({ id })) },
      digestFrequency: digestFrequency || "daily",
      digestEnabled: digestFrequency !== "none",
    },
  });

  return NextResponse.json({ success: true });
}
