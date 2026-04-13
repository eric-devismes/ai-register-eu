/**
 * POST /api/admin/daily-digest
 *
 * Compiles the daily digest from all work cycle findings and sends
 * a single Telegram message to the CEO. Called by Vercel Cron at 20:00 Paris.
 *
 * Authentication: admin session cookie OR CRON_SECRET header.
 */

import { NextResponse } from "next/server";
import { getAdminSession } from "@/lib/auth";
import { compileDailyDigest } from "@/lib/daily-digest";

export const dynamic = "force-dynamic";
export const maxDuration = 300; // 5 min for synthesis + Telegram

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
    const result = await compileDailyDigest();
    return NextResponse.json(result);
  } catch (err) {
    console.error("[daily-digest] API error:", err);
    return NextResponse.json(
      { error: (err as Error).message },
      { status: 500 },
    );
  }
}

export async function GET() {
  const { prisma } = await import("@/lib/db");
  const today = new Date().toISOString().slice(0, 10);

  const digest = await prisma.dailyDigest.findUnique({ where: { date: today } });
  const recentDigests = await prisma.dailyDigest.findMany({
    orderBy: { date: "desc" },
    take: 7,
    select: {
      date: true, status: true, executiveSummary: true,
      autonomousDecisions: true, escalations: true, durationMs: true,
    },
  });

  return NextResponse.json({
    today: digest || null,
    recent: recentDigests,
  });
}
