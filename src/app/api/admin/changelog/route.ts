/**
 * PATCH /api/admin/changelog
 *
 * Update a changelog entry (title, description, changeType).
 * Admin-only.
 */

import { NextResponse } from "next/server";
import { getAdminSession } from "@/lib/auth";
import { prisma } from "@/lib/db";

export async function PATCH(req: Request) {
  const session = await getAdminSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json();
  const { id, title, description, changeType } = body;

  if (!id) {
    return NextResponse.json({ error: "Missing id" }, { status: 400 });
  }

  const data: Record<string, string> = {};
  if (title !== undefined) data.title = title;
  if (description !== undefined) data.description = description;
  if (changeType !== undefined) data.changeType = changeType;

  if (Object.keys(data).length === 0) {
    return NextResponse.json({ error: "Nothing to update" }, { status: 400 });
  }

  const updated = await prisma.changeLog.update({
    where: { id },
    data,
  });

  return NextResponse.json({ success: true, id: updated.id });
}

/**
 * DELETE /api/admin/changelog
 *
 * Delete a changelog entry. Admin-only.
 */
export async function DELETE(req: Request) {
  const session = await getAdminSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id");

  if (!id) {
    return NextResponse.json({ error: "Missing id" }, { status: 400 });
  }

  await prisma.changeLog.delete({ where: { id } });

  return NextResponse.json({ success: true });
}
