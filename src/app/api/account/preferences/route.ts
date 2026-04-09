/**
 * PUT /api/account/preferences — Update subscriber preferences and profile.
 *
 * Body (all fields optional):
 *   { frameworkIds, systemIds, digestFrequency, role, industry, orgSize, platforms }
 */

import { NextResponse } from "next/server";
import { getSubscriber } from "@/lib/subscriber-auth";
import { prisma } from "@/lib/db";

const VALID_ROLES = ["dpo", "procurement", "cto", "ciso", "legal", "executive", "other"];
const VALID_INDUSTRIES = ["financial", "healthcare", "insurance", "public-sector", "hr", "other"];
const VALID_ORG_SIZES = ["startup", "sme", "enterprise", "public-sector"];

export async function PUT(request: Request) {
  const subscriber = await getSubscriber();
  if (!subscriber) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  const body = await request.json();
  const { frameworkIds, systemIds, digestFrequency, role, industry, orgSize, platforms } = body;

  // Build update data — only include fields that were provided
  const data: Record<string, unknown> = {};

  if (frameworkIds !== undefined) {
    data.frameworks = { set: (frameworkIds || []).map((id: string) => ({ id })) };
  }
  if (systemIds !== undefined) {
    data.systems = { set: (systemIds || []).map((id: string) => ({ id })) };
  }
  if (digestFrequency !== undefined) {
    data.digestFrequency = digestFrequency || "daily";
    data.digestEnabled = digestFrequency !== "none";
  }

  // Profile fields — validate before saving
  if (role !== undefined && (role === "" || VALID_ROLES.includes(role))) {
    data.role = role;
  }
  if (industry !== undefined && (industry === "" || VALID_INDUSTRIES.includes(industry))) {
    data.industry = industry;
  }
  if (orgSize !== undefined && (orgSize === "" || VALID_ORG_SIZES.includes(orgSize))) {
    data.orgSize = orgSize;
  }
  if (platforms !== undefined && typeof platforms === "string" && platforms.length <= 500) {
    data.platforms = platforms;
  }

  await prisma.subscriber.update({
    where: { id: subscriber.id },
    data,
  });

  return NextResponse.json({ success: true });
}
