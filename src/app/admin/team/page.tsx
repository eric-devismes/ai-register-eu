/**
 * Admin Team Management — Owner only.
 *
 * URL: /admin/team
 *
 * Lists all admin users. Owner can add, edit roles, and deactivate admins.
 * Non-owner admins are redirected.
 */

export const dynamic = "force-dynamic";

import { redirect } from "next/navigation";
import { getAdminSession } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { AdminTeamClient } from "./TeamClient";

export default async function AdminTeamPage() {
  const session = await getAdminSession();
  if (!session) redirect("/admin/login");
  if (session.role !== "owner") redirect("/admin");

  const admins = await prisma.adminUser.findMany({
    orderBy: { createdAt: "asc" },
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

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Team</h1>
          <p className="text-sm text-gray-500">
            Manage admin users and their roles. Only the owner can add or remove team members.
          </p>
        </div>
      </div>

      <AdminTeamClient
        admins={admins.map((a: typeof admins[number]) => ({
          ...a,
          lastLoginAt: a.lastLoginAt?.toISOString() || null,
          createdAt: a.createdAt.toISOString(),
        }))}
        currentAdminId={session.adminId}
      />
    </div>
  );
}
