/**
 * Expert Panel API — Trigger discussions, list history, submit CEO decisions.
 *
 * POST: Start a new expert discussion
 * GET:  List recent discussions
 * PATCH: Submit CEO decision on a discussion
 */

import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { prisma } from "@/lib/db";
import { runExpertDiscussion, submitCeoDecision, listDiscussions } from "@/lib/expert-panel";

export const maxDuration = 120; // Expert discussions involve multiple LLM calls

async function isAdmin(): Promise<boolean> {
  const jar = await cookies();
  const sessionId = jar.get("admin_session")?.value;
  if (!sessionId) return false;
  const session = await prisma.adminUser.findFirst({
    where: { id: sessionId, active: true },
  });
  return !!session;
}

// ─── POST: Start a new discussion ──────────────────────

export async function POST(req: NextRequest) {
  if (!(await isAdmin())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json();
  const { topic, context } = body;

  if (!topic || typeof topic !== "string" || topic.trim().length < 5) {
    return NextResponse.json({ error: "Topic must be at least 5 characters" }, { status: 400 });
  }

  try {
    const result = await runExpertDiscussion(topic.trim(), context?.trim());
    return NextResponse.json(result);
  } catch (err) {
    console.error("[expert-panel] Discussion failed:", err);
    return NextResponse.json(
      { error: (err as Error).message },
      { status: 500 }
    );
  }
}

// ─── GET: List discussions ─────────────────────────────

export async function GET() {
  if (!(await isAdmin())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const discussions = await listDiscussions();
    return NextResponse.json({ discussions });
  } catch (err) {
    return NextResponse.json(
      { error: (err as Error).message },
      { status: 500 }
    );
  }
}

// ─── PATCH: Submit CEO decision ────────────────────────

export async function PATCH(req: NextRequest) {
  if (!(await isAdmin())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json();
  const { discussionId, decision } = body;

  if (!discussionId || !decision) {
    return NextResponse.json({ error: "discussionId and decision required" }, { status: 400 });
  }

  try {
    await submitCeoDecision(discussionId, decision);
    return NextResponse.json({ success: true });
  } catch (err) {
    return NextResponse.json(
      { error: (err as Error).message },
      { status: 500 }
    );
  }
}
