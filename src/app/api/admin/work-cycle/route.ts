/**
 * POST /api/admin/work-cycle
 *
 * Triggers a COO-led work cycle. Called by Vercel Cron 3x/day
 * or manually via admin panel.
 *
 * Authentication: admin session cookie OR CRON_SECRET header.
 */

import { NextResponse } from "next/server";
import { getAdminSession } from "@/lib/auth";
import { runWorkCycle } from "@/lib/work-cycle";

export const dynamic = "force-dynamic";
export const maxDuration = 300; // 5 min for parallel LLM calls

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
    const result = await runWorkCycle();
    return NextResponse.json(result);
  } catch (err) {
    console.error("[work-cycle] API error:", err);
    return NextResponse.json(
      { error: (err as Error).message },
      { status: 500 },
    );
  }
}

export async function GET() {
  // Return today's cycle status
  const { prisma } = await import("@/lib/db");
  const today = new Date().toISOString().slice(0, 10);

  const cycles = await prisma.workCycle.findMany({
    where: { date: today },
    include: {
      reports: { where: { hasFindings: true }, select: { agentName: true, emoji: true, done: true } },
      decisions: { select: { description: true, riskLevel: true, autonomous: true } },
    },
    orderBy: { cycleNumber: "asc" },
  });

  return NextResponse.json({
    date: today,
    cyclesCompleted: cycles.length,
    cycles: cycles.map((c) => ({
      cycleNumber: c.cycleNumber,
      status: c.status,
      agents: c.agentsAssigned,
      findings: c.findingsCount,
      decisions: c.decisionsCount,
      durationMs: c.durationMs,
      reports: c.reports,
      decisionsList: c.decisions,
    })),
  });
}
