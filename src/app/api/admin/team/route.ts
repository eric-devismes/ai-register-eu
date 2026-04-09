/**
 * Admin Team API — Owner only.
 *
 * POST   /api/admin/team — Add a new admin user
 * PATCH  /api/admin/team — Toggle active/inactive
 *
 * Only accessible by admin users with "owner" role.
 */

import { NextResponse } from "next/server";
import { getAdminSession, hashPassword } from "@/lib/auth";
import { prisma } from "@/lib/db";

/** POST — Add a new admin user */
export async function POST(request: Request) {
  const session = await getAdminSession();
  if (!session || session.role !== "owner") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
  }

  const { email, name, password, role } = await request.json();

  if (!email || !password) {
    return NextResponse.json({ error: "Email and password required" }, { status: 400 });
  }

  // Only allow editor and admin roles (not owner)
  const validRole = role === "admin" ? "admin" : "editor";

  // Check for existing
  const existing = await prisma.adminUser.findUnique({ where: { email } });
  if (existing) {
    return NextResponse.json({ error: "An admin with this email already exists" }, { status: 409 });
  }

  const passwordHash = await hashPassword(password);

  const admin = await prisma.adminUser.create({
    data: {
      email,
      name: name || "",
      passwordHash,
      role: validRole,
      active: true,
    },
    select: {
      id: true,
      email: true,
      name: true,
      role: true,
      active: true,
      totpEnabled: true,
      lastLoginAt: true,
      createdAt: true,
    },
  });

  return NextResponse.json({
    admin: {
      ...admin,
      lastLoginAt: admin.lastLoginAt?.toISOString() || null,
      createdAt: admin.createdAt.toISOString(),
    },
  });
}

/** PATCH — Update admin user (name, email, role, active) */
export async function PATCH(request: Request) {
  const session = await getAdminSession();
  if (!session || session.role !== "owner") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
  }

  const body = await request.json();
  const { id } = body;

  if (!id) {
    return NextResponse.json({ error: "ID required" }, { status: 400 });
  }

  const target = await prisma.adminUser.findUnique({ where: { id } });
  if (!target) return NextResponse.json({ error: "Not found" }, { status: 404 });

  // Build update data from provided fields
  const data: Record<string, unknown> = {};

  if (typeof body.name === "string") data.name = body.name;
  if (typeof body.email === "string" && body.email !== target.email) {
    // Check uniqueness
    const existing = await prisma.adminUser.findUnique({ where: { email: body.email } });
    if (existing && existing.id !== id) {
      return NextResponse.json({ error: "Email already in use" }, { status: 409 });
    }
    data.email = body.email;
  }
  if (typeof body.role === "string" && target.role !== "owner") {
    // Can't change owner role, and can only assign editor or admin
    const validRole = body.role === "admin" ? "admin" : "editor";
    data.role = validRole;
  }
  if (typeof body.active === "boolean") {
    if (id === session.adminId) {
      return NextResponse.json({ error: "Cannot deactivate yourself" }, { status: 400 });
    }
    if (target.role === "owner") {
      return NextResponse.json({ error: "Cannot deactivate the owner" }, { status: 400 });
    }
    data.active = body.active;
  }

  if (Object.keys(data).length === 0) {
    return NextResponse.json({ error: "Nothing to update" }, { status: 400 });
  }

  await prisma.adminUser.update({ where: { id }, data });

  return NextResponse.json({ success: true });
}
