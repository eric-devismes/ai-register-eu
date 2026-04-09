/**
 * Admin Companies — CRM company management.
 *
 * CRUD for companies. Shows subscribers, AI systems, and cases per company.
 * Sortable, searchable, with inline company creation.
 */

export const dynamic = "force-dynamic";

import { redirect } from "next/navigation";
import { getAdminSession } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { CompaniesClient } from "./CompaniesClient";

export default async function AdminCompaniesPage() {
  const session = await getAdminSession();
  if (!session) redirect("/admin/login");

  const companies = await prisma.company.findMany({
    orderBy: { name: "asc" },
    include: {
      _count: { select: { subscribers: true, cases: true, aiSystems: true } },
      subscribers: { select: { id: true, email: true, name: true, tier: true, role: true } },
    },
  });

  const allSystems = await prisma.aISystem.findMany({
    select: { id: true, slug: true, name: true, vendor: true },
    orderBy: { name: "asc" },
  });

  return (
    <CompaniesClient
      companies={companies.map((c: typeof companies[number]) => ({
        id: c.id,
        name: c.name,
        domain: c.domain,
        industry: c.industry,
        country: c.country,
        size: c.size,
        tier: c.tier,
        notes: c.notes,
        subscriberCount: c._count.subscribers,
        caseCount: c._count.cases,
        aiSystemCount: c._count.aiSystems,
        subscribers: c.subscribers,
        createdAt: c.createdAt.toISOString(),
      }))}
      allSystems={allSystems}
    />
  );
}
