/**
 * Admin Customers Page — Light CRM for subscriber management.
 *
 * Features:
 *   - Stats cards by tier (Free, Pro, Enterprise)
 *   - Filterable table with search, tier grouping
 *   - Key attributes: email, role, industry, org size, tier, dates, systems followed
 *   - GDPR: read-only view, users manage their own data
 */

export const dynamic = "force-dynamic";

import { prisma } from "@/lib/db";
import { CustomersClient } from "./CustomersClient";

export default async function AdminCustomersPage() {
  const subscribers = await prisma.subscriber.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      systems: { select: { slug: true, name: true, vendor: true } },
      frameworks: { select: { slug: true, name: true } },
    },
  });

  // Serialize for client
  const data = subscribers.map((s) => ({
    id: s.id,
    email: s.email,
    verified: s.verified,
    tier: s.tier,
    role: s.role,
    industry: s.industry,
    orgSize: s.orgSize,
    platforms: s.platforms,
    digestEnabled: s.digestEnabled,
    digestFrequency: s.digestFrequency,
    stripeCustomerId: s.stripeCustomerId || null,
    systems: s.systems.map((sys) => `${sys.vendor} ${sys.name}`),
    frameworks: s.frameworks.map((fw) => fw.name),
    consentDate: s.consentDate?.toISOString() || null,
    createdAt: s.createdAt.toISOString(),
    tierExpiresAt: s.tierExpiresAt?.toISOString() || null,
  }));

  return <CustomersClient subscribers={data} />;
}
