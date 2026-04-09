/**
 * Admin Companies API
 *
 * POST  /api/admin/companies — Create company
 * PATCH /api/admin/companies — Update company
 */

import { NextResponse } from "next/server";
import { getAdminSession } from "@/lib/auth";
import { prisma } from "@/lib/db";

export async function POST(request: Request) {
  const session = await getAdminSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 403 });

  const { name, domain, industry, country, size, notes } = await request.json();
  if (!name) return NextResponse.json({ error: "Name required" }, { status: 400 });

  const company = await prisma.company.create({
    data: { name, domain: domain || "", industry: industry || "", country: country || "", size: size || "", notes: notes || "" },
    include: { _count: { select: { subscribers: true, cases: true, aiSystems: true } } },
  });

  return NextResponse.json({
    company: {
      ...company,
      subscriberCount: company._count.subscribers,
      caseCount: company._count.cases,
      aiSystemCount: company._count.aiSystems,
      subscribers: [],
      createdAt: company.createdAt.toISOString(),
    },
  });
}

export async function PATCH(request: Request) {
  const session = await getAdminSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 403 });

  const { id, ...updates } = await request.json();
  if (!id) return NextResponse.json({ error: "ID required" }, { status: 400 });

  const data: Record<string, unknown> = {};
  for (const key of ["name", "domain", "industry", "country", "size", "tier", "notes"]) {
    if (typeof updates[key] === "string") data[key] = updates[key];
  }

  await prisma.company.update({ where: { id }, data });
  return NextResponse.json({ success: true });
}
