/**
 * COO-Led Work Cycle Engine
 *
 * Runs 3x/day via Vercel Cron. The COO assigns 3-5 agents to review
 * their domains, agents do their work via Claude API, results are
 * logged silently to DB. No Telegram messages — everything accumulates
 * for the daily digest.
 *
 * Flow:
 *  1. COO reviews context (TODO, QA, previous cycles, CEO precedents)
 *  2. COO assigns agents + focus areas
 *  3. Agents work in parallel (Claude Haiku calls)
 *  4. COO reviews outputs, classifies decisions by risk level
 *  5. Everything saved to DB silently
 */

import { prisma } from "@/lib/db";
import { LLM_MODEL, LLM_TIMEOUT_MS } from "@/lib/constants";

// ─── Expert Profiles (subset needed for work cycles) ─────

interface WorkAgent {
  id: string;
  shortName: string;
  emoji: string;
  domain: string;
  systemPrompt: string;
}

const AGENTS: WorkAgent[] = [
  { id: "cto", shortName: "CTO", emoji: "🔧", domain: "Technology & Architecture", systemPrompt: "You are the CTO. You think in systems, architectures, and technical tradeoffs. You prefer proven tech, care about DX and maintainability." },
  { id: "ciso", shortName: "CISO", emoji: "🛡️", domain: "Security", systemPrompt: "You are the CISO. You think in threats and attack surfaces. Non-negotiable on secrets, auth, encryption, and third-party security reviews." },
  { id: "dpo", shortName: "DPO", emoji: "🔒", domain: "Data & Privacy", systemPrompt: "You are the DPO. You know GDPR, DORA, ePrivacy, and the EU AI Act. You push for privacy by design." },
  { id: "cro", shortName: "Risk", emoji: "⚖️", domain: "Risk & Compliance", systemPrompt: "You are the CRO. You map risks to controls. Assess likelihood and impact. Keep a risk register." },
  { id: "vp-ops", shortName: "Ops", emoji: "⚙️", domain: "Operations & SRE", systemPrompt: "You are VP Operations. You keep the platform running. SLOs, error budgets, MTTR." },
  { id: "cpo", shortName: "Procurement", emoji: "📋", domain: "Procurement & Vendor", systemPrompt: "You are the CPO. You think in TCO, not sticker price. Vendor tricks, auto-renewal clauses, data hostage." },
  { id: "chro", shortName: "HR", emoji: "👥", domain: "HR & Org Change", systemPrompt: "You are the CHRO. You measure success by adoption rates, not rollout dates." },
  { id: "cfo", shortName: "CFO", emoji: "💰", domain: "Finance", systemPrompt: "You are the CFO. Every decision has a financial impact. Unit economics, burn rate, runway. Numbers, not opinions." },
  { id: "legal", shortName: "Legal", emoji: "⚖️", domain: "Legal", systemPrompt: "You are General Counsel. You protect from legal risk while enabling the business. Plain language, not legalese." },
  { id: "pmo", shortName: "PMO", emoji: "📊", domain: "Project Delivery", systemPrompt: "You are the PMO Lead. Milestones, dependencies, critical paths. Flag scope creep and unrealistic timelines." },
  { id: "cmo", shortName: "CMO", emoji: "📈", domain: "Marketing", systemPrompt: "You are the CMO. Positioning, messaging, distribution. Trust is currency in B2B. Content educates, not sells." },
  { id: "vp-sales", shortName: "VP Sales", emoji: "💼", domain: "Sales & Pipeline", systemPrompt: "You are VP Sales. Pipeline, conversion rates, deal velocity. Enterprise buyers are skeptical and risk-averse." },
  { id: "social-lead", shortName: "Social", emoji: "📱", domain: "Social & Community", systemPrompt: "You are Social & Community Lead. LinkedIn is king for EU regulatory tech. Founder brand > company page." },
];

const COO: WorkAgent = {
  id: "coo",
  shortName: "COO",
  emoji: "🎯",
  domain: "Operations & Leadership",
  systemPrompt: `You are the COO of AI Compass EU — the operational leader. You run the team day-to-day so the CEO can focus on strategy. Three times a day you assign agents to review their domains, collect findings, and make autonomous operational decisions.

You only escalate to the CEO when the risk is genuinely high (spending >50 EUR, security incidents, legal/compliance, irreversible changes). You learn from previous CEO decisions and apply the same patterns to similar situations.

You lead with the single most important thing. You're direct, concise, and action-oriented. When nothing notable happened, you say so — never fabricate urgency. You think like a startup COO: keep the team productive, unblock work, prioritize ruthlessly.`,
};

// ─── Claude API Call ──────────────────────────────────────

async function callClaude(
  system: string,
  userMsg: string,
  maxTokens = 400
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

// ─── Gather Context ──────────────────────────────────────

async function gatherContext(today: string): Promise<string> {
  const parts: string[] = [];

  // Previous cycles today
  try {
    const cycles = await prisma.workCycle.findMany({
      where: { date: today },
      include: { reports: { where: { hasFindings: true } }, decisions: true },
      orderBy: { cycleNumber: "asc" },
    });
    if (cycles.length > 0) {
      const summaries = cycles.map((c) => {
        const findings = c.reports.map((r) => `${r.emoji} ${r.agentName}: ${r.done}`).join("\n");
        const decisions = c.decisions.map((d) => `• ${d.description} (${d.riskLevel})`).join("\n");
        return `Cycle ${c.cycleNumber}: ${c.reports.length} agents reported\n${findings}${decisions ? `\nDecisions:\n${decisions}` : ""}`;
      });
      parts.push(`PREVIOUS CYCLES TODAY:\n${summaries.join("\n\n")}`);
    }
  } catch { /* */ }

  // Recent news items (last 24h)
  try {
    const yesterday = new Date(Date.now() - 86400000);
    const news = await prisma.changeLog.findMany({
      where: { date: { gte: yesterday } },
      orderBy: { date: "desc" },
      take: 10,
      select: { title: true, changeType: true },
    });
    if (news.length > 0) {
      parts.push(`RECENT NEWS (24h):\n${news.map((n) => `• [${n.changeType}] ${n.title}`).join("\n")}`);
    }
  } catch { /* */ }

  // Platform stats
  try {
    const systemCount = await prisma.aISystem.count();
    const frameworkCount = await prisma.regulatoryFramework.count();
    const subscriberCount = await prisma.subscriber.count();
    const newsCount = await prisma.changeLog.count();
    parts.push(`PLATFORM: ${systemCount} AI systems, ${frameworkCount} frameworks, ${subscriberCount} subscribers, ${newsCount} news items`);
  } catch { /* */ }

  // CEO decision precedents (last 20)
  try {
    const decisions = await prisma.expertDiscussion.findMany({
      where: { ceoDecision: { not: "" } },
      orderBy: { createdAt: "desc" },
      take: 20,
      select: { topic: true, ceoDecision: true },
    });
    if (decisions.length > 0) {
      parts.push(`CEO DECISION PRECEDENTS:\n${decisions.map((d) => `• Topic: ${d.topic} → Decision: ${d.ceoDecision}`).join("\n")}`);
    }
  } catch { /* */ }

  // Recent QA defects (check if there are unresolved)
  try {
    const recentReports = await prisma.agentReport.findMany({
      where: { agentId: "ciso", hasFindings: true },
      orderBy: { createdAt: "desc" },
      take: 3,
      select: { highestRisk: true, action: true },
    });
    if (recentReports.length > 0) {
      parts.push(`RECENT CISO FINDINGS:\n${recentReports.map((r) => `• Risk: ${r.highestRisk} | Action: ${r.action}`).join("\n")}`);
    }
  } catch { /* */ }

  return parts.join("\n\n");
}

// ─── COO: Assign Agents ──────────────────────────────────

interface AgentAssignment {
  agentId: string;
  focus: string;
}

async function cooAssignAgents(
  cycleNumber: number,
  context: string
): Promise<AgentAssignment[]> {
  const prompt = `You are running work cycle ${cycleNumber} of 3 today (1=morning patrol, 2=midday follow-up, 3=evening wrap-up).

Based on the current context, decide which 3-5 agents should work this cycle and what each should focus on. Don't assign agents if there's nothing in their domain to review.

Available agents: ${AGENTS.map((a) => `${a.id} (${a.domain})`).join(", ")}

CONTEXT:
${context || "No prior activity today — this is the first cycle."}

Respond ONLY with a JSON array, no other text:
[{"agentId": "ciso", "focus": "Review security certifications for recently updated systems"}, ...]`;

  try {
    const response = await callClaude(COO.systemPrompt, prompt, 500);
    // Extract JSON from response
    const jsonMatch = response.match(/\[[\s\S]*\]/);
    if (!jsonMatch) {
      // Fallback: assign core agents
      return [
        { agentId: "ciso", focus: "Security review" },
        { agentId: "cto", focus: "Technical review" },
        { agentId: "cmo", focus: "Content and SEO review" },
      ];
    }
    return JSON.parse(jsonMatch[0]);
  } catch (err) {
    console.warn("[work-cycle] COO assignment failed:", err);
    return [
      { agentId: "ciso", focus: "Security review" },
      { agentId: "cto", focus: "Technical review" },
      { agentId: "cfo", focus: "Financial review" },
    ];
  }
}

// ─── Agent Work Phase ────────────────────────────────────

interface AgentOutput {
  agentId: string;
  agentName: string;
  emoji: string;
  done: string;
  highestRisk: string;
  action: string;
  advice: string;
  nextStep: string;
  hasFindings: boolean;
  decisions: Array<{ description: string; riskLevel: string; rationale: string }>;
  raw: string;
}

async function runAgent(
  agent: WorkAgent,
  focus: string,
  context: string
): Promise<AgentOutput> {
  const system = `${agent.systemPrompt}

You are reviewing your domain for AI Compass EU, a regulatory intelligence platform. This is an autonomous work cycle — the CEO is NOT involved. Report your findings honestly and concisely.`;

  const prompt = `FOCUS: ${focus}

PLATFORM CONTEXT:
${context}

Review your domain and respond with ONLY a JSON object (no other text):
{
  "done": "What you reviewed or accomplished (1 sentence)",
  "highestRisk": "The biggest risk you see right now (1 sentence, or 'None' if nothing notable)",
  "action": "Most important action to take (1 sentence, or 'None')",
  "advice": "Your best advice to the team (1 sentence)",
  "nextStep": "What should happen next in your domain (1 sentence)",
  "hasFindings": true/false,
  "decisions": [{"description": "...", "riskLevel": "LOW|MEDIUM|HIGH", "rationale": "..."}]
}

If nothing notable in your domain, set hasFindings to false and keep fields brief.`;

  try {
    const raw = await callClaude(system, prompt, 500);
    const jsonMatch = raw.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      return {
        agentId: agent.id, agentName: agent.shortName, emoji: agent.emoji,
        done: "Review completed", highestRisk: "None", action: "None",
        advice: "No issues found", nextStep: "Continue monitoring",
        hasFindings: false, decisions: [], raw,
      };
    }
    const parsed = JSON.parse(jsonMatch[0]);
    return {
      agentId: agent.id,
      agentName: agent.shortName,
      emoji: agent.emoji,
      done: parsed.done || "",
      highestRisk: parsed.highestRisk || "None",
      action: parsed.action || "None",
      advice: parsed.advice || "",
      nextStep: parsed.nextStep || "",
      hasFindings: parsed.hasFindings ?? false,
      decisions: Array.isArray(parsed.decisions) ? parsed.decisions : [],
      raw,
    };
  } catch (err) {
    console.warn(`[work-cycle] Agent ${agent.shortName} failed:`, err);
    return {
      agentId: agent.id, agentName: agent.shortName, emoji: agent.emoji,
      done: `Error: ${(err as Error).message}`, highestRisk: "Agent failure",
      action: "Investigate agent error", advice: "", nextStep: "Retry next cycle",
      hasFindings: true, decisions: [], raw: (err as Error).message,
    };
  }
}

// ─── Main: Run Work Cycle ────────────────────────────────

export interface WorkCycleResult {
  cycleId: string;
  date: string;
  cycleNumber: number;
  agentsAssigned: number;
  findingsCount: number;
  decisionsCount: number;
  durationMs: number;
  status: string;
  error?: string;
}

export async function runWorkCycle(cycleNumber?: number): Promise<WorkCycleResult> {
  const start = Date.now();
  const today = new Date().toISOString().slice(0, 10);

  // Determine cycle number based on existing cycles today
  if (!cycleNumber) {
    const existing = await prisma.workCycle.count({ where: { date: today } });
    cycleNumber = existing + 1;
  }

  if (cycleNumber > 3) {
    return {
      cycleId: "", date: today, cycleNumber, agentsAssigned: 0,
      findingsCount: 0, decisionsCount: 0, durationMs: 0,
      status: "skipped", error: "Max 3 cycles per day",
    };
  }

  // Check for duplicate
  const existing = await prisma.workCycle.findUnique({
    where: { date_cycleNumber: { date: today, cycleNumber } },
  });
  if (existing) {
    return {
      cycleId: existing.id, date: today, cycleNumber,
      agentsAssigned: existing.agentsAssigned, findingsCount: existing.findingsCount,
      decisionsCount: existing.decisionsCount, durationMs: existing.durationMs,
      status: "already_ran",
    };
  }

  // Create cycle record
  const cycle = await prisma.workCycle.create({
    data: { date: today, cycleNumber, status: "running" },
  });

  try {
    // 1. Gather context
    const context = await gatherContext(today);

    // 2. COO assigns agents
    const assignments = await cooAssignAgents(cycleNumber, context);
    console.log(`[work-cycle] Cycle ${cycleNumber}: COO assigned ${assignments.map((a) => a.agentId).join(", ")}`);

    // 3. Agents work in parallel
    const agentPromises = assignments.map((assignment) => {
      const agent = AGENTS.find((a) => a.id === assignment.agentId);
      if (!agent) return null;
      return runAgent(agent, assignment.focus, context);
    }).filter(Boolean) as Promise<AgentOutput>[];

    const outputs = await Promise.all(agentPromises);

    // 4. Save agent reports
    let findingsCount = 0;
    let decisionsCount = 0;

    for (const output of outputs) {
      await prisma.agentReport.create({
        data: {
          workCycleId: cycle.id,
          agentId: output.agentId,
          agentName: output.agentName,
          emoji: output.emoji,
          done: output.done,
          highestRisk: output.highestRisk,
          action: output.action,
          advice: output.advice,
          nextStep: output.nextStep,
          hasFindings: output.hasFindings,
          rawResponse: output.raw,
        },
      });

      if (output.hasFindings) findingsCount++;

      // Save decisions
      for (const decision of output.decisions) {
        await prisma.digestDecision.create({
          data: {
            workCycleId: cycle.id,
            description: decision.description,
            riskLevel: decision.riskLevel || "LOW",
            rationale: decision.rationale || "",
            autonomous: decision.riskLevel !== "HIGH",
          },
        });
        decisionsCount++;
      }
    }

    // 5. Update cycle record
    const durationMs = Date.now() - start;
    await prisma.workCycle.update({
      where: { id: cycle.id },
      data: {
        status: "completed",
        agentsAssigned: outputs.length,
        findingsCount,
        decisionsCount,
        durationMs,
      },
    });

    return {
      cycleId: cycle.id, date: today, cycleNumber,
      agentsAssigned: outputs.length, findingsCount, decisionsCount,
      durationMs, status: "completed",
    };
  } catch (err) {
    const durationMs = Date.now() - start;
    await prisma.workCycle.update({
      where: { id: cycle.id },
      data: { status: "failed", error: (err as Error).message, durationMs },
    });

    return {
      cycleId: cycle.id, date: today, cycleNumber: cycleNumber!,
      agentsAssigned: 0, findingsCount: 0, decisionsCount: 0,
      durationMs, status: "failed", error: (err as Error).message,
    };
  }
}
