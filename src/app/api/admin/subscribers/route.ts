/**
 * Admin Subscribers API
 *
 * POST  /api/admin/subscribers — Create subscriber account
 * PATCH /api/admin/subscribers — Update subscriber (name, tier, company, role)
 */

import { NextResponse } from "next/server";
import { getAdminSession } from "@/lib/auth";
import { prisma } from "@/lib/db";

export async function POST(request: Request) {
  const session = await getAdminSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 403 });

  const { email, name, tier, role, industry, orgSize, companyId } = await request.json();
  if (!email) return NextResponse.json({ error: "Email required" }, { status: 400 });

  const existing = await prisma.subscriber.findUnique({ where: { email } });
  if (existing) return NextResponse.json({ error: "Email already exists" }, { status: 409 });

  const subscriber = await prisma.subscriber.create({
    data: {
      email,
      name: name || "",
      tier: tier || "free",
      role: role || "",
      industry: industry || "",
      orgSize: orgSize || "",
      companyId: companyId || null,
      verified: true, // Admin-created accounts are pre-verified
      consentDate: new Date(),
      consentText: "Account created by admin",
    },
  });

  return NextResponse.json({ subscriber });
}

export async function PATCH(request: Request) {
  const session = await getAdminSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 403 });

  const { id, ...updates } = await request.json();
  if (!id) return NextResponse.json({ error: "ID required" }, { status: 400 });

  const data: Record<string, unknown> = {};
  for (const key of ["name", "email", "tier", "role", "industry", "orgSize"]) {
    if (typeof updates[key] === "string") data[key] = updates[key];
  }
  if (typeof updates.companyId === "string") data.companyId = updates.companyId || null;

  await prisma.subscriber.update({ where: { id }, data });
  return NextResponse.json({ success: true });
}
