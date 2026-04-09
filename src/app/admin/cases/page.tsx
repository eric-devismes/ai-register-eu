/**
 * Admin Cases — Support case management.
 *
 * Track consulting requests, support inquiries, and customer interactions.
 * Filter by status, priority, category. Assign to admin team members.
 */

export const dynamic = "force-dynamic";

import { redirect } from "next/navigation";
import { getAdminSession } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { CasesClient } from "./CasesClient";

export default async function AdminCasesPage() {
  const session = await getAdminSession();
  if (!session) redirect("/admin/login");

  const [cases, companies, admins, subscribers] = await Promise.all([
    prisma.case.findMany({
      orderBy: { createdAt: "desc" },
      include: {
        subscriber: { select: { id: true, email: true, name: true } },
        company: { select: { id: true, name: true } },
        assignedTo: { select: { id: true, name: true, email: true } },
      },
    }),
    prisma.company.findMany({ select: { id: true, name: true }, orderBy: { name: "asc" } }),
    prisma.adminUser.findMany({ where: { active: true }, select: { id: true, name: true, email: true }, orderBy: { name: "asc" } }),
    prisma.subscriber.findMany({ select: { id: true, email: true, name: true }, orderBy: { email: "asc" } }),
  ]);

  return (
    <CasesClient
      cases={cases.map((c: typeof cases[number]) => ({
        id: c.id,
        title: c.title,
        description: c.description,
        status: c.status,
        priority: c.priority,
        category: c.category,
        subscriber: c.subscriber,
        company: c.company,
        assignedTo: c.assignedTo,
        resolvedAt: c.resolvedAt?.toISOString() || null,
        createdAt: c.createdAt.toISOString(),
        updatedAt: c.updatedAt.toISOString(),
      }))}
      companies={companies}
      admins={admins}
      subscribers={subscribers}
    />
  );
}
