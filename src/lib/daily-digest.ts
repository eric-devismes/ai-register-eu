/**
 * Daily Digest Compiler
 *
 * Runs once per day at 20:00 Paris time. Collects all findings from
 * today's work cycles, has the COO synthesize them, and sends a single
 * Telegram message to the CEO.
 *
 * This is a SYNTHESIS of the day's work, not the primary work driver.
 * The work happens in work-cycle.ts (3x/day).
 */

import { prisma } from "@/lib/db";
import { sendTelegram } from "@/lib/telegram";
import { LLM_MODEL, LLM_TIMEOUT_MS } from "@/lib/constants";

// ─── Claude API Call ──────────────────────────────────────

async function callClaude(
  system: string,
  userMsg: string,
  maxTokens = 600
): Promise<string> {
  const apiKey = process.env.ANTHROPIC_API_KEY?.trim();
  if (!apiKey) return "[No ANTHROPIC_API_KEY]";

  const res = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-api-key": apiKey,
      "anthropic-version": "2023-06-01",
    },
    body: JSON.stringify({
      model: LLM_MODEL,
      max_tokens: maxTokens,
      system,
      messages: [{ role: "user", content: userMsg }],
    }),
    signal: AbortSignal.timeout(LLM_TIMEOUT_MS),
  });

  if (!res.ok) throw new Error(`Claude API ${res.status}`);
  const data = await res.json();
  return data?.content?.[0]?.text || "";
}

// ─── Main: Compile Daily Digest ──────────────────────────

export interface DigestResult {
  digestId: string;
  date: string;
  cyclesCompleted: number;
  agentsReported: number;
  findingsTotal: number;
  autonomousDecisions: number;
  escalations: number;
  durationMs: number;
  status: string;
  error?: string;
}

export async function compileDailyDigest(): Promise<DigestResult> {
  const start = Date.now();
  const today = new Date().toISOString().slice(0, 10);

  // Check for duplicate
  const existing = await prisma.dailyDigest.findUnique({ where: { date: today } });
  if (existing) {
    return {
      digestId: existing.id, date: today, cyclesCompleted: 0,
      agentsReported: 0, findingsTotal: 0, autonomousDecisions: existing.autonomousDecisions,
      escalations: existing.escalations, durationMs: 0, status: "already_sent",
    };
  }

  // Create digest record
  const digest = await prisma.dailyDigest.create({
    data: { date: today, status: "running" },
  });

  try {
    // 1. Gather today's work cycle data
    const cycles = await prisma.workCycle.findMany({
      where: { date: today },
      include: {
        reports: true,
        decisions: true,
      },
      orderBy: { cycleNumber: "asc" },
    });

    const allReports = cycles.flatMap((c) => c.reports);
    const allDecisions = cycles.flatMap((c) => c.decisions);
    const reportsWithFindings = allReports.filter((r) => r.hasFindings);

    // 2. Aggregate by agent (merge findings across cycles)
    const agentMap = new Map<string, {
      agentId: string;
      agentName: string;
      emoji: string;
      done: string[];
      risks: string[];
      actions: string[];
      advice: string[];
      nextSteps: string[];
    }>();

    for (const r of reportsWithFindings) {
      const existing = agentMap.get(r.agentId);
      if (existing) {
        if (r.done) existing.done.push(r.done);
        if (r.highestRisk && r.highestRisk !== "None") existing.risks.push(r.highestRisk);
        if (r.action && r.action !== "None") existing.actions.push(r.action);
        if (r.advice) existing.advice.push(r.advice);
        if (r.nextStep) existing.nextSteps.push(r.nextStep);
      } else {
        agentMap.set(r.agentId, {
          agentId: r.agentId,
          agentName: r.agentName,
          emoji: r.emoji,
          done: r.done ? [r.done] : [],
          risks: r.highestRisk && r.highestRisk !== "None" ? [r.highestRisk] : [],
          actions: r.action && r.action !== "None" ? [r.action] : [],
          advice: r.advice ? [r.advice] : [],
          nextSteps: r.nextStep ? [r.nextStep] : [],
        });
      }
    }

    const autonomousDecisions = allDecisions.filter((d) => d.autonomous);
    const escalations = allDecisions.filter((d) => !d.autonomous);

    // 3. COO executive summary
    const agentSummaries = Array.from(agentMap.values())
      .map((a) => `${a.emoji} ${a.agentName}: Done: ${a.done.join("; ")} | Risks: ${a.risks.join("; ") || "None"} | Actions: ${a.actions.join("; ") || "None"}`)
      .join("\n");

    const decisionSummaries = allDecisions
      .map((d) => `• ${d.description} (${d.riskLevel}${d.autonomous ? " — auto" : " — NEEDS CEO"})`)
      .join("\n");

    let executiveSummary = "";
    try {
      const cooPrompt = `You are the COO compiling the daily briefing for the CEO.

TODAY'S AGENT FINDINGS:
${agentSummaries || "No notable findings today."}

TODAY'S DECISIONS:
${decisionSummaries || "No decisions needed today."}

STATS: ${cycles.length} work cycles, ${reportsWithFindings.length} agents with findings, ${autonomousDecisions.length} autonomous decisions, ${escalations.length} escalations.

Write a 1-2 sentence executive summary for the CEO. Be direct. Lead with the most important thing. If nothing notable happened, say so briefly.`;

      executiveSummary = await callClaude(
        "You are the COO of AI Compass EU. Be concise, direct, and honest. No fluff.",
        cooPrompt,
        150,
      );
    } catch {
      executiveSummary = `${cycles.length} cycles completed, ${reportsWithFindings.length} agents reported findings.`;
    }

    // 4. Format Telegram message
    const dateFormatted = new Date().toLocaleDateString("en-GB", {
      day: "numeric", month: "short", year: "numeric",
    });

    let msg = `🎯 *Daily Board Briefing — ${dateFormatted}*\n`;
    msg += `COO: ${executiveSummary}\n\n`;

    if (agentMap.size > 0) {
      msg += `━━━ Today's Work (${cycles.length} cycles) ━━━\n\n`;

      for (const agent of agentMap.values()) {
        msg += `${agent.emoji} *${agent.agentName}*\n`;
        msg += `• Done: ${agent.done.join("; ")}\n`;
        if (agent.risks.length > 0) msg += `• Risk: ${agent.risks[0]}\n`;
        if (agent.actions.length > 0) msg += `• Action: ${agent.actions[0]}\n`;
        if (agent.nextSteps.length > 0) msg += `• Next: ${agent.nextSteps[0]}\n`;
        msg += `\n`;
      }
    } else {
      msg += `_No notable findings today. All systems nominal._\n\n`;
    }

    if (autonomousDecisions.length > 0) {
      msg += `📋 *Decisions Made (autonomous):*\n`;
      for (const d of autonomousDecisions) {
        msg += `• ${d.description} — ${d.riskLevel} ✅\n`;
      }
      msg += `\n`;
    }

    if (escalations.length > 0) {
      msg += `⚠️ *Needs CEO:*\n`;
      for (const d of escalations) {
        msg += `• ${d.description}\n`;
      }
      msg += `\n`;
    }

    msg += `📊 ${reportsWithFindings.length} agents active | ${cycles.length} cycles | ${autonomousDecisions.length} decisions | ${escalations.length} escalations\n`;
    msg += `💬 Reply to discuss any item`;

    // 5. Send to Telegram
    await sendTelegram(msg);

    // 6. Update digest record
    const durationMs = Date.now() - start;
    await prisma.dailyDigest.update({
      where: { id: digest.id },
      data: {
        status: "completed",
        executiveSummary,
        autonomousDecisions: autonomousDecisions.length,
        escalations: escalations.length,
        durationMs,
      },
    });

    return {
      digestId: digest.id, date: today,
      cyclesCompleted: cycles.length,
      agentsReported: reportsWithFindings.length,
      findingsTotal: allReports.length,
      autonomousDecisions: autonomousDecisions.length,
      escalations: escalations.length,
      durationMs, status: "completed",
    };
  } catch (err) {
    const durationMs = Date.now() - start;
    await prisma.dailyDigest.update({
      where: { id: digest.id },
      data: { status: "failed", durationMs },
    });

    return {
      digestId: digest.id, date: today, cyclesCompleted: 0,
      agentsReported: 0, findingsTotal: 0, autonomousDecisions: 0,
      escalations: 0, durationMs, status: "failed",
      error: (err as Error).message,
    };
  }
}
