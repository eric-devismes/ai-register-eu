/**
 * Admin Evidence Review Queue — Index Page
 *
 * Shows every system that has draft claims awaiting analyst review,
 * plus open source-diff ReviewTasks and recent fetcher activity.
 *
 * The flow:
 *   1. Cron fetches sources → writes snapshots
 *   2. Extractor produces draft claims grounded in snapshot text
 *   3. Analyst lands here, sees what's pending, drills into a system
 *   4. /admin/evidence/[systemSlug] shows side-by-side draft vs published
 *      with approve / edit / reject for every draft
 *   5. Approved drafts flip to status="published" — appear on the public page
 */

export const dynamic = "force-dynamic";

import Link from "next/link";
import { prisma } from "@/lib/db";
import { runEvidenceFetcher } from "@/lib/evidence-fetcher";

export default async function EvidenceQueuePage() {
  // Group draft claims by system so the analyst sees one row per vendor.
  // Drafts with no system shouldn't exist (FK enforced), but be defensive.
  const drafts = await prisma.systemClaim.groupBy({
    by: ["systemId"],
    where: { status: "draft" },
    _count: { _all: true },
    _max: { updatedAt: true },
  });

  const systemIds = drafts.map((d) => d.systemId);
  const systems = await prisma.aISystem.findMany({
    where: { id: { in: systemIds } },
    select: { id: true, slug: true, vendor: true, name: true },
  });
  const systemMap = new Map(systems.map((s) => [s.id, s]));

  // High-confidence draft counts per system — lets the analyst spot the
  // "safe to bulk-promote" vendors at a glance without clicking in.
  const highGroups = await prisma.systemClaim.groupBy({
    by: ["systemId"],
    where: { status: "draft", confidence: "high" },
    _count: { _all: true },
  });
  const highBySystem = new Map(highGroups.map((g) => [g.systemId, g._count._all]));

  // Sort by most recent extraction activity — analyst sees fresh work first
  const sortedDrafts = drafts
    .map((d) => ({
      system: systemMap.get(d.systemId)!,
      draftCount: d._count._all,
      highCount: highBySystem.get(d.systemId) ?? 0,
      lastUpdated: d._max.updatedAt,
    }))
    .filter((d) => d.system)
    .sort((a, b) => (b.lastUpdated?.getTime() ?? 0) - (a.lastUpdated?.getTime() ?? 0));

  // Open source-diff tasks — what the fetcher flagged for human attention
  const openTasks = await prisma.reviewTask.findMany({
    where: { type: "source-diff", status: "open" },
    include: {
      system: { select: { slug: true, vendor: true, name: true } },
      source: { select: { url: true, label: true } },
    },
    orderBy: [{ priority: "desc" }, { createdAt: "desc" }],
    take: 25,
  });

  // Last-7d fetcher pulse
  const since = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
  const [recentSnapshots, recentErrors, totalSources, publishedClaims] = await Promise.all([
    prisma.sourceSnapshot.count({ where: { fetchedAt: { gte: since } } }),
    prisma.sourceSnapshot.count({ where: { fetchedAt: { gte: since }, status: "fetch-error" } }),
    prisma.source.count({ where: { active: true } }),
    prisma.systemClaim.count({ where: { status: "published" } }),
  ]);

  // Force a no-op import so production catches accidental dead-code removal
  // of the runner the cron depends on. Has zero runtime cost.
  void runEvidenceFetcher;

  return (
    <>
      <div className="flex items-start justify-between">
        <div>
          <h1 className="font-heading text-2xl font-bold text-text-primary">Evidence Review Queue</h1>
          <p className="mt-1 text-sm text-text-secondary">
            Draft claims extracted from fetched sources, awaiting analyst approval.
            Nothing here is public yet.
          </p>
        </div>
        <form action="/api/admin/evidence-fetch" method="POST">
          <button
            type="submit"
            className="inline-flex items-center gap-2 rounded-lg border border-border-light bg-white px-4 py-2.5 text-sm font-semibold text-text-primary transition hover:border-eu-blue hover:text-eu-blue"
          >
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth={1.8} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0 3.181 3.183a8.25 8.25 0 0 0 13.803-3.7M4.031 9.865a8.25 8.25 0 0 1 13.803-3.7l3.181 3.182m0-4.991v4.99" />
            </svg>
            Refresh now
          </button>
        </form>
      </div>

      {/* Pulse strip */}
      <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
        <PulseTile label="Active sources" value={totalSources} />
        <PulseTile label="Snapshots (7d)" value={recentSnapshots} />
        <PulseTile label="Fetch errors (7d)" value={recentErrors} tone={recentErrors > 0 ? "danger" : "neutral"} />
        <PulseTile label="Published claims" value={publishedClaims} />
      </div>

      {/* Pending drafts grouped by system */}
      <section className="mt-8">
        <h2 className="font-heading text-lg font-semibold text-text-primary">Pending drafts by vendor</h2>
        <p className="mt-1 text-sm text-text-secondary">
          {sortedDrafts.length === 0
            ? "No drafts in the queue. Run the fetcher or wait for the weekly cron."
            : `${sortedDrafts.reduce((sum, d) => sum + d.draftCount, 0)} draft claim(s) across ${sortedDrafts.length} vendor(s).`}
        </p>

        {sortedDrafts.length > 0 && (
          <div className="mt-4 overflow-hidden rounded-xl border border-border-light bg-white">
            <table className="w-full text-left text-sm">
              <thead className="border-b border-border-lighter bg-surface-alt text-xs uppercase tracking-wider text-text-muted">
                <tr>
                  <th className="px-6 py-3">Vendor / system</th>
                  <th className="px-6 py-3">Drafts</th>
                  <th className="px-6 py-3">High-confidence</th>
                  <th className="px-6 py-3">Last extraction</th>
                  <th className="px-6 py-3 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border-lighter">
                {sortedDrafts.map((d) => {
                  const highPct = d.draftCount > 0 ? Math.round((d.highCount / d.draftCount) * 100) : 0;
                  return (
                    <tr key={d.system.id}>
                      <td className="px-6 py-4">
                        <div className="font-medium text-text-primary">{d.system.vendor}</div>
                        <div className="text-xs text-text-muted">{d.system.name}</div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="inline-flex items-center rounded-full bg-amber-100 px-2.5 py-0.5 text-xs font-semibold text-amber-800">
                          {d.draftCount} pending
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ${
                            highPct >= 80
                              ? "bg-emerald-100 text-emerald-800"
                              : highPct >= 40
                              ? "bg-sky-100 text-sky-800"
                              : "bg-slate-100 text-slate-700"
                          }`}
                          title={`${d.highCount} of ${d.draftCount} drafts are high-confidence — bulk-promote will auto-publish those that don't conflict with existing published values.`}
                        >
                          {d.highCount}/{d.draftCount} · {highPct}%
                        </span>
                      </td>
                      <td className="px-6 py-4 text-xs text-text-muted">
                        {d.lastUpdated ? formatRelative(d.lastUpdated) : "—"}
                      </td>
                      <td className="px-6 py-4 text-right">
                        <Link
                          href={`/admin/evidence/${d.system.slug}`}
                          className="text-xs font-semibold text-eu-blue hover:underline"
                        >
                          Review →
                        </Link>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </section>

      {/* Source-diff tasks (fetcher-generated) */}
      <section className="mt-8">
        <h2 className="font-heading text-lg font-semibold text-text-primary">Open source-diff tasks</h2>
        <p className="mt-1 text-sm text-text-secondary">
          {openTasks.length === 0
            ? "No open tasks. The fetcher hasn't flagged anything for your attention."
            : `${openTasks.length} task(s) opened by the fetcher — content drift or unreachable sources.`}
        </p>

        {openTasks.length > 0 && (
          <ul className="mt-4 space-y-3">
            {openTasks.map((t) => (
              <li
                key={t.id}
                className="rounded-lg border border-border-light bg-white p-4 text-sm shadow-sm"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-semibold ${
                        t.priority === "high" ? "bg-red-100 text-red-700" : "bg-blue-100 text-blue-700"
                      }`}>
                        {t.priority}
                      </span>
                      <span className="font-medium text-text-primary">{t.title}</span>
                    </div>
                    {t.notes && <p className="mt-1 text-xs text-text-muted">{t.notes}</p>}
                    <div className="mt-2 flex items-center gap-3 text-xs text-text-muted">
                      {t.system && (
                        <Link href={`/admin/evidence/${t.system.slug}`} className="hover:text-eu-blue">
                          {t.system.vendor} — {t.system.name}
                        </Link>
                      )}
                      {t.source && (
                        <a href={t.source.url} target="_blank" rel="noopener noreferrer" className="hover:text-eu-blue">
                          ↗ source URL
                        </a>
                      )}
                      {t.dueBy && (
                        <span className={t.dueBy.getTime() < Date.now() ? "text-red-600 font-semibold" : ""}>
                          due {t.dueBy.toISOString().slice(0, 10)}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        )}
      </section>
    </>
  );
}

function PulseTile({ label, value, tone = "neutral" }: { label: string; value: number; tone?: "neutral" | "danger" }) {
  return (
    <div className="rounded-lg border border-border-light bg-white px-4 py-3">
      <div className="text-xs uppercase tracking-wider text-text-muted">{label}</div>
      <div className={`mt-1 font-heading text-2xl font-bold ${tone === "danger" && value > 0 ? "text-red-600" : "text-text-primary"}`}>
        {value}
      </div>
    </div>
  );
}

function formatRelative(d: Date): string {
  const diffMs = Date.now() - d.getTime();
  const mins = Math.floor(diffMs / 60_000);
  if (mins < 1) return "just now";
  if (mins < 60) return `${mins}m ago`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  return `${days}d ago`;
}
