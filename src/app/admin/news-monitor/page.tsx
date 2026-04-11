/**
 * Admin — News Monitor Dashboard
 *
 * Shows news monitoring stats, configured sources, and a manual trigger button.
 */

import { getAdminSession } from "@/lib/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/db";
import { getEnabledSources } from "@/lib/news-sources";
import { NewsMonitorClient } from "./NewsMonitorClient";

export const dynamic = "force-dynamic";

export default async function NewsMonitorPage() {
  const session = await getAdminSession();
  if (!session) redirect("/admin/login");

  // Stats
  const now = new Date();
  const oneDayAgo = new Date(now.getTime() - 24 * 60 * 60 * 1000);
  const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);

  // Match both RSS monitor and Grok scanner authors
  const autoAuthors = { in: ["AI Compass EU News Monitor", "AI Compass EU Grok Scanner"] };

  const [last24h, last7d, totalMonitored, totalManual, recentItems] = await Promise.all([
    prisma.changeLog.count({
      where: { author: autoAuthors, createdAt: { gte: oneDayAgo } },
    }),
    prisma.changeLog.count({
      where: { author: autoAuthors, createdAt: { gte: sevenDaysAgo } },
    }),
    prisma.changeLog.count({
      where: { author: autoAuthors },
    }),
    prisma.changeLog.count({
      where: { NOT: { author: autoAuthors } },
    }),
    prisma.changeLog.findMany({
      where: { author: autoAuthors },
      orderBy: { createdAt: "desc" },
      take: 30,
      select: {
        id: true,
        date: true,
        title: true,
        description: true,
        changeType: true,
        sourceLabel: true,
        sourceUrl: true,
        author: true,
        framework: { select: { name: true } },
        system: { select: { name: true } },
      },
    }),
  ]);

  const sources = getEnabledSources();

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">News Monitor</h1>
        <p className="mt-1 text-sm text-gray-500">
          Automated EU AI regulatory news monitoring and ingestion pipeline.
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4 mb-8">
        <StatCard label="Last 24h" value={last24h} />
        <StatCard label="Last 7 days" value={last7d} />
        <StatCard label="Total auto-ingested" value={totalMonitored} />
        <StatCard label="Manual entries" value={totalManual} />
      </div>

      <NewsMonitorClient
        sources={sources.map((s) => ({
          id: s.id,
          name: s.name,
          type: s.type,
          category: s.category,
          trustLevel: s.trustLevel,
          region: s.region,
        }))}
        recentItems={recentItems.map((item) => ({
          id: item.id,
          date: item.date.toISOString(),
          title: item.title,
          description: item.description,
          changeType: item.changeType,
          sourceLabel: item.sourceLabel,
          sourceUrl: item.sourceUrl,
          author: item.author,
          framework: item.framework?.name || null,
          system: item.system?.name || null,
        }))}
      />
    </div>
  );
}

function StatCard({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-xl border border-gray-200 bg-white p-4">
      <p className="text-2xl font-bold text-gray-900">{value}</p>
      <p className="text-xs text-gray-500">{label}</p>
    </div>
  );
}
