/**
 * Admin Cases API
 *
 * POST  /api/admin/cases — Create case
 * PATCH /api/admin/cases — Update case (status, assignment, etc.)
 */

import { NextResponse } from "next/server";
import { getAdminSession } from "@/lib/auth";
import { prisma } from "@/lib/db";

export async function POST(request: Request) {
  const session = await getAdminSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 403 });

  const { title, description, priority, category, subscriberId, companyId, assignedToId } = await request.json();
  if (!title) return NextResponse.json({ error: "Title required" }, { status: 400 });

  const caseItem = await prisma.case.create({
    data: {
      title,
      description: description || "",
      priority: priority || "normal",
      category: category || "general",
      subscriberId: subscriberId || null,
      companyId: companyId || null,
      assignedToId: assignedToId || null,
    },
    include: {
      subscriber: { select: { id: true, email: true, name: true } },
      company: { select: { id: true, name: true } },
      assignedTo: { select: { id: true, name: true, email: true } },
    },
  });

  return NextResponse.json({
    caseItem: {
      ...caseItem,
      resolvedAt: caseItem.resolvedAt?.toISOString() || null,
      createdAt: caseItem.createdAt.toISOString(),
      updatedAt: caseItem.updatedAt.toISOString(),
    },
  });
}

export async function PATCH(request: Request) {
  const session = await getAdminSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 403 });

  const { id, ...updates } = await request.json();
  if (!id) return NextResponse.json({ error: "ID required" }, { status: 400 });

  const data: Record<string, unknown> = {};
  for (const key of ["title", "description", "status", "priority", "category"]) {
    if (typeof updates[key] === "string") data[key] = updates[key];
  }
  if (typeof updates.assignedToId === "string") data.assignedToId = updates.assignedToId || null;
  if (typeof updates.companyId === "string") data.companyId = updates.companyId || null;
  if (typeof updates.subscriberId === "string") data.subscriberId = updates.subscriberId || null;

  // Auto-set resolvedAt when status changes to resolved
  if (updates.status === "resolved") data.resolvedAt = new Date();
  if (updates.status === "open" || updates.status === "in_progress") data.resolvedAt = null;

  await prisma.case.update({ where: { id }, data });
  return NextResponse.json({ success: true });
}
