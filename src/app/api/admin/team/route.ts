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

/** PATCH — Toggle active status */
export async function PATCH(request: Request) {
  const session = await getAdminSession();
  if (!session || session.role !== "owner") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
  }

  const { id, active } = await request.json();

  if (!id || typeof active !== "boolean") {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }

  // Prevent deactivating yourself
  if (id === session.adminId) {
    return NextResponse.json({ error: "Cannot deactivate yourself" }, { status: 400 });
  }

  // Prevent deactivating owner
  const target = await prisma.adminUser.findUnique({ where: { id } });
  if (!target) return NextResponse.json({ error: "Not found" }, { status: 404 });
  if (target.role === "owner") {
    return NextResponse.json({ error: "Cannot deactivate the owner" }, { status: 400 });
  }

  await prisma.adminUser.update({
    where: { id },
    data: { active },
  });

  return NextResponse.json({ success: true });
}
