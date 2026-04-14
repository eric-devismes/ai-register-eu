/**
 * POST /api/admin/evidence-fetch
 *
 * Triggers the evidence fetcher pipeline (Phase 1a of the evidence backbone).
 *
 * For each active Source row:
 *  - HTTP GET the URL, strip HTML, SHA-256 hash the cleaned text
 *  - Compare to the latest SourceSnapshot — skip if unchanged
 *  - On change: write a new snapshot AND create a "source-diff" ReviewTask
 *    so an analyst re-verifies every published claim that uses this source
 *  - On error: write a fetch-error snapshot AND create a high-priority
 *    ReviewTask (3-day SLA)
 *
 * Authentication: admin session cookie OR CRON_SECRET bearer header.
 *
 * Called by:
 *  - Vercel cron (weekly Mondays 5:00 UTC — see vercel.json)
 *  - Admin "Refresh evidence" button (TBD)
 *  - CLI: `npm run evidence:fetch`
 *
 * Body (optional JSON): `{ "systemId": "<id>" }` — limit to a single system,
 * useful when re-triggering after editing a vendor's source list.
 */

import { NextResponse } from "next/server";
import { getAdminSession } from "@/lib/auth";
import { runEvidenceFetcher } from "@/lib/evidence-fetcher";

export const dynamic = "force-dynamic";
// Allow plenty of headroom — fetcher does sequential HTTP gets, each can take
// up to FETCH_TIMEOUT_MS (30s). Six OpenAI sources comfortably fit in 60s,
// but as the source list grows, raise this in line with the cron schedule.
export const maxDuration = 300;

export async function POST(req: Request) {
  const cronSecret = process.env.CRON_SECRET;
  const authHeader = req.headers.get("authorization");

  const isValidCron = cronSecret && authHeader === `Bearer ${cronSecret}`;
  const adminSession = await getAdminSession();
  const isAdmin = adminSession !== null;

  if (!isValidCron && !isAdmin) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // Optional scoping: { systemId } limits the run to one vendor
  let systemId: string | undefined;
  try {
    const body = await req.json().catch(() => null);
    if (body && typeof body.systemId === "string") {
      systemId = body.systemId;
    }
  } catch {
    // Empty body is fine — full sweep
  }

  try {
    const stats = await runEvidenceFetcher(systemId ? { systemId } : undefined);
    return NextResponse.json({ success: true, ...stats });
  } catch (err) {
    console.error("[evidence-fetch] Pipeline error:", err);
    return NextResponse.json(
      { error: "Evidence fetcher pipeline failed", detail: (err as Error).message },
      { status: 500 },
    );
  }
}

/**
 * GET /api/admin/evidence-fetch — Status / last-run summary (admin only).
 *
 * Returns counts of recent snapshots and open source-diff review tasks so
 * the admin dashboard can show a quick "is the pipeline healthy?" widget.
 */
export async function GET() {
  const adminSession = await getAdminSession();
  if (!adminSession) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { prisma } = await import("@/lib/db");
  const since = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);

  const [recentSnapshots, recentErrors, openTasks, totalSources] = await Promise.all([
    prisma.sourceSnapshot.count({ where: { fetchedAt: { gte: since } } }),
    prisma.sourceSnapshot.count({
      where: { fetchedAt: { gte: since }, status: "fetch-error" },
    }),
    prisma.reviewTask.count({
      where: { type: "source-diff", status: "open" },
    }),
    prisma.source.count({ where: { active: true } }),
  ]);

  return NextResponse.json({
    activeSources: totalSources,
    snapshotsLast7d: recentSnapshots,
    fetchErrorsLast7d: recentErrors,
    openSourceDiffTasks: openTasks,
  });
}
