/**
 * Admin Customers Page — Unified CRM for subscribers + companies.
 *
 * Two tabs: "Customer Users" and "Companies"
 * - Users: full CRM with inline editing, tier/role/industry filters
 * - Companies: enterprise subscribers with drill-down to users, inline editing
 */

export const dynamic = "force-dynamic";

import { redirect } from "next/navigation";
import { getAdminSession } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { CustomersAdminClient } from "./CustomersAdminClient";

export default async function AdminCustomersPage() {
  const session = await getAdminSession();
  if (!session) redirect("/admin/login");

  // Fetch subscribers with company relation
  const subscribers = await prisma.subscriber.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      company: { select: { id: true, name: true } },
      systems: { select: { slug: true, name: true, vendor: true } },
      frameworks: { select: { slug: true, name: true } },
    },
  });

  // Fetch companies with counts and subscriber details
  const companies = await prisma.company.findMany({
    orderBy: { name: "asc" },
    include: {
      _count: { select: { subscribers: true, cases: true, aiSystems: true } },
      subscribers: {
        select: { id: true, email: true, name: true, tier: true, role: true },
      },
    },
  });

  // Serialize subscribers
  const subscriberData = subscribers.map((s) => ({
    id: s.id,
    email: s.email,
    name: s.name || "",
    verified: s.verified,
    tier: s.tier,
    role: s.role,
    industry: s.industry,
    orgSize: s.orgSize,
    platforms: s.platforms,
    digestEnabled: s.digestEnabled,
    digestFrequency: s.digestFrequency,
    stripeCustomerId: s.stripeCustomerId || null,
    companyId: s.companyId || null,
    companyName: s.company?.name || null,
    systems: s.systems.map((sys) => `${sys.vendor} ${sys.name}`),
    frameworks: s.frameworks.map((fw) => fw.name),
    consentDate: s.consentDate?.toISOString() || null,
    createdAt: s.createdAt.toISOString(),
    tierExpiresAt: s.tierExpiresAt?.toISOString() || null,
  }));

  // Serialize companies
  const companyData = companies.map((c) => ({
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
  }));

  return (
    <CustomersAdminClient
      subscribers={subscriberData}
      companies={companyData}
    />
  );
}
