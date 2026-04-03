/**
 * Admin Dashboard — Overview of all content in the system.
 */

export const dynamic = "force-dynamic";

import Link from "next/link";
import { prisma } from "@/lib/db";

export default async function AdminDashboard() {
  // Fetch all counts in parallel
  const [systemCount, frameworkCount, industryCount, recentSystems] = await Promise.all([
    prisma.aISystem.count(),
    prisma.regulatoryFramework.count(),
    prisma.industry.count(),
    prisma.aISystem.findMany({
      orderBy: { updatedAt: "desc" },
      take: 5,
      include: { scores: { include: { framework: true } } },
    }),
  ]);

  return (
    <>
      <h1 className="font-heading text-2xl font-bold text-text-primary">Dashboard</h1>

      {/* Stats cards */}
      <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-4">
        <div className="rounded-xl border border-border-light bg-white p-6">
          <p className="text-sm text-text-secondary">AI Systems</p>
          <p className="mt-1 text-3xl font-bold text-text-primary">{systemCount}</p>
        </div>
        <div className="rounded-xl border border-border-light bg-white p-6">
          <p className="text-sm text-text-secondary">Frameworks</p>
          <p className="mt-1 text-3xl font-bold text-eu-blue">{frameworkCount}</p>
        </div>
        <div className="rounded-xl border border-border-light bg-white p-6">
          <p className="text-sm text-text-secondary">Industries</p>
          <p className="mt-1 text-3xl font-bold text-text-primary">{industryCount}</p>
        </div>
        <div className="rounded-xl border border-border-light bg-white p-6">
          <Link href="/admin/systems/new"
            className="flex h-full items-center justify-center gap-2 text-sm font-semibold text-eu-blue transition hover:text-eu-blue-light">
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
            </svg>
            Add New AI System
          </Link>
        </div>
      </div>

      {/* Recent systems */}
      <div className="mt-8">
        <div className="flex items-center justify-between">
          <h2 className="font-heading text-lg font-bold text-text-primary">Recently Updated</h2>
          <Link href="/admin/systems" className="text-sm font-medium text-eu-blue hover:text-eu-blue-light">View all</Link>
        </div>

        <div className="mt-4 overflow-hidden rounded-xl border border-border-light bg-white">
          {recentSystems.length === 0 ? (
            <div className="p-8 text-center text-sm text-text-secondary">
              No AI systems yet. <Link href="/admin/systems/new" className="font-medium text-eu-blue">Add your first one</Link>
            </div>
          ) : (
            <table className="w-full text-left text-sm">
              <thead className="border-b border-border-lighter bg-surface-alt text-xs uppercase tracking-wider text-text-muted">
                <tr>
                  <th className="px-6 py-3">System</th>
                  <th className="px-6 py-3">Risk</th>
                  <th className="px-6 py-3">Scores</th>
                  <th className="px-6 py-3">Updated</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border-lighter">
                {recentSystems.map((system) => (
                  <tr key={system.id} className="hover:bg-surface-alt/50">
                    <td className="px-6 py-4">
                      <Link href={`/admin/systems/${system.id}/edit`} className="font-medium text-text-primary hover:text-eu-blue">
                        {system.name}
                      </Link>
                      <p className="text-xs text-text-muted">{system.vendor}</p>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-block rounded-full px-2 py-0.5 text-xs font-semibold ${
                        system.risk === "High" ? "bg-risk-high-bg text-risk-high" :
                        system.risk === "Limited" ? "bg-risk-limited-bg text-risk-limited" :
                        "bg-risk-minimal-bg text-risk-minimal"
                      }`}>{system.risk}</span>
                    </td>
                    <td className="px-6 py-4 text-xs text-text-secondary">
                      {system.scores.map((s) => `${s.framework.name}: ${s.score}`).join(" · ")}
                    </td>
                    <td className="px-6 py-4 text-xs text-text-muted">
                      {system.updatedAt.toLocaleDateString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </>
  );
}
