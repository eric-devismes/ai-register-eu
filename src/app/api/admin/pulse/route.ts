/**
 * POST /api/admin/pulse
 *
 * Lightweight heartbeat sent to Telegram every 2 hours so the CEO
 * knows the autonomous team is running. No LLM calls — just DB queries.
 *
 * Authentication: admin session cookie OR CRON_SECRET header.
 */

import { NextResponse } from "next/server";
import { getAdminSession } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { sendTelegram } from "@/lib/telegram";

export const dynamic = "force-dynamic";
export const maxDuration = 15;

export async function POST(req: Request) {
  const cronSecret = process.env.CRON_SECRET;
  const authHeader = req.headers.get("authorization");

  const isValidCron = cronSecret && authHeader === `Bearer ${cronSecret}`;
  const adminSession = await getAdminSession();
  const isAdmin = adminSession !== null;

  if (!isValidCron && !isAdmin) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const today = new Date().toISOString().slice(0, 10);
    const now = new Date();
    const timeStr = now.toLocaleTimeString("en-GB", {
      hour: "2-digit", minute: "2-digit", timeZone: "Europe/Paris",
    });

    // Query today's work cycles
    const cycles = await prisma.workCycle.findMany({
      where: { date: today },
      orderBy: { cycleNumber: "asc" },
    });

    const completedCycles = cycles.filter((c) => c.status === "completed");
    const failedCycles = cycles.filter((c) => c.status === "failed");

    // Count today's findings and decisions
    const totalFindings = completedCycles.reduce((sum, c) => sum + c.findingsCount, 0);
    const totalDecisions = completedCycles.reduce((sum, c) => sum + c.decisionsCount, 0);

    // Count agents active today (unique across cycles)
    const agentReports = await prisma.agentReport.findMany({
      where: { workCycle: { date: today } },
      select: { agentId: true },
      distinct: ["agentId"],
    });

    // Check for pending escalations
    const escalations = await prisma.digestDecision.count({
      where: { workCycle: { date: today }, autonomous: false },
    });

    // Determine next events
    const parisHour = parseInt(
      now.toLocaleString("en-GB", { hour: "2-digit", hour12: false, timeZone: "Europe/Paris" })
    );

    const nextEvents: string[] = [];
    if (completedCycles.length < 1 && parisHour < 8) nextEvents.push("First cycle: 08:00");
    else if (completedCycles.length < 2 && parisHour < 13) nextEvents.push("Next cycle: 13:00");
    else if (completedCycles.length < 3 && parisHour < 18) nextEvents.push("Next cycle: 18:00");
    nextEvents.push("Digest: 20:00");

    // Build pulse message
    let msg: string;

    if (failedCycles.length > 0) {
      const lastFailed = failedCycles[failedCycles.length - 1];
      msg = `⚡ Pulse — ${timeStr}\n🔴 Cycle ${lastFailed.cycleNumber} FAILED: ${lastFailed.error || "unknown error"}\n${completedCycles.length} cycles OK | ${nextEvents.join(" | ")}`;
    } else if (completedCycles.length === 0) {
      msg = `⚡ Pulse — ${timeStr}\n🟢 Systems online | ${nextEvents.join(" | ")}`;
    } else {
      msg = `⚡ Pulse — ${timeStr}\n🟢 ${agentReports.length} agents | ${totalFindings} findings | ${totalDecisions} decisions${escalations > 0 ? ` | ⚠️ ${escalations} pending` : ""}\n${completedCycles.length}/3 cycles done | ${nextEvents.join(" | ")}`;
    }

    await sendTelegram(msg);

    return NextResponse.json({ status: "sent", message: msg });
  } catch (err) {
    console.error("[pulse] Error:", err);
    return NextResponse.json(
      { error: (err as Error).message },
      { status: 500 },
    );
  }
}
