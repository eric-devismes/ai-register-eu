/**
 * POST /api/admin/news-ingest
 *
 * Triggers the news monitoring pipeline.
 * Authentication: admin session cookie OR CRON_SECRET header.
 *
 * Called by:
 *  - Cron job (scripts/news-monitor-cron.sh)
 *  - Admin panel "Refresh News" button
 *
 * Returns pipeline stats: sources fetched, items classified, items ingested.
 */

import { NextResponse } from "next/server";
import { getAdminSession } from "@/lib/auth";
import { runNewsMonitor } from "@/lib/news-monitor";

export const dynamic = "force-dynamic";
export const maxDuration = 60; // Allow up to 60s for fetching + LLM calls

export async function POST(req: Request) {
  // Auth: admin session OR cron secret
  const cronSecret = process.env.CRON_SECRET;
  const authHeader = req.headers.get("authorization");

  const isValidCron = cronSecret && authHeader === `Bearer ${cronSecret}`;
  const adminSession = await getAdminSession();
  const isAdmin = adminSession !== null;

  if (!isValidCron && !isAdmin) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const result = await runNewsMonitor();

    return NextResponse.json({
      success: true,
      ...result,
    });
  } catch (err) {
    console.error("[news-ingest] Pipeline error:", err);
    return NextResponse.json(
      { error: "News monitor pipeline failed", detail: (err as Error).message },
      { status: 500 }
    );
  }
}

/**
 * GET /api/admin/news-ingest — Returns status info (admin only).
 */
export async function GET() {
  const adminSession = await getAdminSession();
  if (!adminSession) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // Return recent ingest stats
  const recentCount = await (await import("@/lib/db")).prisma.changeLog.count({
    where: {
      author: "VendorScope News Monitor",
      date: { gte: new Date(Date.now() - 24 * 60 * 60 * 1000) },
    },
  });

  const totalMonitored = await (await import("@/lib/db")).prisma.changeLog.count({
    where: { author: "VendorScope News Monitor" },
  });

  return NextResponse.json({
    last24h: recentCount,
    totalMonitored,
    sourcesConfigured: (await import("@/lib/news-sources")).getEnabledSources().length,
  });
}
