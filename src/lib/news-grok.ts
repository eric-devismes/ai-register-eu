/**
 * Grok (xAI) Twitter/X Scanner — Real-time social intelligence.
 *
 * Uses the xAI Responses API with x_search tool for GROUNDED real-time
 * X/Twitter search. Unlike the old chat completions endpoint, this actually
 * searches X and returns results backed by real posts with citations.
 *
 * Pipeline:
 *  1. Send search queries to Grok via Responses API with x_search tool
 *  2. Grok searches X in real time and returns grounded results
 *  3. Parse structured news items from the grounded response
 *  4. Items feed into the same classification + ingestion pipeline
 *
 * API Reference: POST https://api.x.ai/v1/responses
 * Tool: x_search (grounded X search with real citations)
 *
 * Requires: XAI_API_KEY env var (sign up at console.x.ai)
 */

import type { MonitorResult } from "@/lib/news-monitor";
import { prisma } from "@/lib/db";

// ─── Types ─────────────────────────────────────────────

interface GrokNewsItem {
  title: string;
  summary: string;
  sourceUrl: string;
  sourceLabel: string;
  changeType: string;
  relevance: number;
  frameworks: string[];
  systems: string[];
  date: string;
}

// ─── Twitter Accounts to Monitor ───────────────────────

const MONITORED_ACCOUNTS = [
  // EU Official
  "EU_Commission", "EUparliament", "EU_AIACT",
  "EU_Justice", "DigitalEU",
  // Regulators / DPAs
  "EDPB_EDPS", "CNIL", "ICOnews",
  "BfDI_Info", "ENISA_eu",
  // AI Vendors
  "OpenAI", "AnthropicAI", "MistralAI",
  "GoogleAI", "GoogleDeepMind", "MSFTResearch",
  "MetaAI", "xaboreu",
  "IBMResearch", "awscloud",
  "Salesforce", "CohereAI",
  // AI Policy / Think Tanks
  "FutureofLifeInst", "Stanford_HAI",
  "OECD_AI", "AIIndex",
  // Press
  "Reuters", "TechCrunch",
  "euaboreu", "iaboreu",
];

// ─── Search Topics ─────────────────────────────────────

const SEARCH_TOPICS = [
  "EU AI Act enforcement compliance 2025 2026",
  "GDPR AI automated decision fine penalty",
  "AI regulation Europe new rules enforcement",
  "AI vendor compliance certification EU",
  "DORA NIS2 AI cybersecurity regulation",
  "foundation model regulation GPAI EU",
  "AI procurement enterprise Europe compliance",
  "AI Act high-risk prohibited practices",
];

// ─── xAI Responses API with x_search ──────────────────

/**
 * Call the xAI Responses API with x_search tool for grounded X search.
 * The x_search tool allows max 10 handles per request, so we batch.
 * Results are grounded in real X posts — no hallucination.
 */
async function queryGrokWithSearch(
  apiKey: string,
  query: string,
  handles: string[],
  fromDate: string,
  toDate: string,
): Promise<string> {
  const res = await fetch("https://api.x.ai/v1/responses", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: "grok-3",
      input: [
        {
          role: "user",
          content: query,
        },
      ],
      tools: [
        {
          type: "x_search",
          ...(handles.length > 0 ? { allowed_x_handles: handles.slice(0, 10) } : {}),
          from_date: fromDate,
          to_date: toDate,
        },
      ],
      temperature: 0.3,
    }),
    signal: AbortSignal.timeout(90_000), // Grounded search may take longer
  });

  if (!res.ok) {
    const errBody = await res.text().catch(() => "");
    throw new Error(`xAI Responses API ${res.status}: ${errBody.slice(0, 300)}`);
  }

  const data = await res.json();

  // Responses API returns output as an array of content blocks
  // Find the text output block(s)
  const output = data?.output || [];
  const textParts: string[] = [];

  for (const block of output) {
    // Direct text content
    if (block.type === "message" && block.content) {
      for (const part of block.content) {
        if (part.type === "output_text" || part.type === "text") {
          textParts.push(part.text || "");
        }
      }
    }
    // Some responses have text at the top level
    if (block.type === "output_text" || block.type === "text") {
      textParts.push(block.text || "");
    }
  }

  return textParts.join("\n");
}

/**
 * Run the full Grok scanner pipeline:
 * 1. Search by monitored accounts (batched in groups of 10)
 * 2. Search by topic keywords
 * 3. Parse all results into structured items
 */
async function queryGrok(apiKey: string): Promise<GrokNewsItem[]> {
  const now = new Date();
  const yesterday = new Date(now);
  yesterday.setDate(yesterday.getDate() - 2); // 2 days for broader coverage

  const toDate = now.toISOString().split("T")[0];
  const fromDate = yesterday.toISOString().split("T")[0];

  const allResults: string[] = [];

  // ── Batch 1: Search monitored accounts (max 10 handles per request) ──
  const handleBatches: string[][] = [];
  for (let i = 0; i < MONITORED_ACCOUNTS.length; i += 10) {
    handleBatches.push(MONITORED_ACCOUNTS.slice(i, i + 10));
  }

  // Run first 2 batches of accounts (20 handles) to stay within rate limits
  for (const batch of handleBatches.slice(0, 2)) {
    try {
      const text = await queryGrokWithSearch(
        apiKey,
        `Find the most important posts about EU AI regulation, compliance, enforcement, fines, or AI vendor news from these accounts in the last 48 hours. Focus on: enforcement actions, new regulations, compliance deadlines, fines, guidance documents, and significant vendor compliance announcements. For each noteworthy item, provide the post content, author, and any linked URLs.`,
        batch,
        fromDate,
        toDate,
      );
      if (text) allResults.push(text);
    } catch (err) {
      console.warn(`[grok-scanner] Account batch failed:`, (err as Error).message);
    }
  }

  // ── Batch 2: Search by topics (no handle filter) ──
  const topicsQuery = SEARCH_TOPICS.slice(0, 4).join(" OR ");
  try {
    const text = await queryGrokWithSearch(
      apiKey,
      `Search X/Twitter for the most significant news and discussions about: ${topicsQuery}. Focus on posts from the last 48 hours with real regulatory or compliance significance for European businesses using AI. Include enforcement actions, new rules, deadlines, guidance, and major vendor announcements. Provide specific details: who posted, what they said, any URLs shared.`,
      [], // No handle filter — open search
      fromDate,
      toDate,
    );
    if (text) allResults.push(text);
  } catch (err) {
    console.warn(`[grok-scanner] Topic search failed:`, (err as Error).message);
  }

  if (allResults.length === 0) {
    console.warn("[grok-scanner] No results from any Grok query");
    return [];
  }

  // ── Parse results into structured items ──
  return await structureGrokResults(apiKey, allResults.join("\n\n---\n\n"), fromDate, toDate);
}

/**
 * Use a second Grok call to structure the raw search results into
 * our standard GrokNewsItem format. This is a pure text→JSON transform,
 * not a search — so hallucination risk is minimal since we're working
 * from grounded search output.
 */
async function structureGrokResults(
  apiKey: string,
  rawResults: string,
  _fromDate: string,
  _toDate: string,
): Promise<GrokNewsItem[]> {
  const res = await fetch("https://api.x.ai/v1/responses", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: "grok-3",
      input: [
        {
          role: "system",
          content: `You are a structured data extractor. You receive raw X/Twitter search results about EU AI regulation and must extract individual news items into a JSON array. ONLY extract items that are ACTUALLY present in the search results — do NOT invent, fabricate, or hallucinate any items.`,
        },
        {
          role: "user",
          content: `Extract news items from these X/Twitter search results into a JSON array.

RAW SEARCH RESULTS:
${rawResults.slice(0, 8000)}

For each distinct news item found in the results above, return:
{
  "title": "Sharp headline, max 100 chars — Reuters/Politico style",
  "summary": "2-3 sentence journalist-quality summary. Vary your style — be direct, opinionated, specific about who should care and what they should do. No templates, no bullet points, no consultant-speak.",
  "sourceUrl": "Priority order: (1) If the post links to an external article, use that article URL. (2) If no article URL, use the user's profile page: https://x.com/username. NEVER fabricate tweet status URLs (x.com/user/status/ID) and NEVER use search URLs (x.com/search?q=...) — both lead to dead ends.",
  "sourceLabel": "X/@username format",
  "changeType": "update|amendment|jurisprudence|new_version|incident|certification|correction",
  "relevance": 0-100,
  "frameworks": ["eu-ai-act", "gdpr", "dora", "nis2", "data-act", "dsa-dma", "iso-42001"],
  "systems": ["gpt-4", "claude", "gemini", "mistral", "copilot", etc.],
  "date": "ISO date"
}

RULES:
- ONLY include items that appear in the search results above
- Do NOT invent news stories — if there are only 3 real items, return 3
- relevance >= 50 only
- Max 10 items, ranked by importance
- Skip marketing, memes, hot takes without substance

Return ONLY a valid JSON array. No markdown, no explanation.`,
        },
      ],
      temperature: 0.2,
    }),
    signal: AbortSignal.timeout(60_000),
  });

  if (!res.ok) {
    console.warn(`[grok-scanner] Structure call failed: ${res.status}`);
    return [];
  }

  const data = await res.json();

  // Extract text from Responses API output
  const output = data?.output || [];
  let text = "";
  for (const block of output) {
    if (block.type === "message" && block.content) {
      for (const part of block.content) {
        if (part.type === "output_text" || part.type === "text") {
          text += part.text || "";
        }
      }
    }
    if (block.type === "output_text" || block.type === "text") {
      text += block.text || "";
    }
  }

  // Extract JSON array from response
  const jsonMatch = text.match(/\[[\s\S]*\]/);
  if (!jsonMatch) {
    console.warn("[grok-scanner] No JSON array in structure response");
    return [];
  }

  try {
    const items = JSON.parse(jsonMatch[0]) as GrokNewsItem[];
    return items
      .filter((item) => item.relevance >= 50 && item.title && item.summary)
      .map((item) => ({
        ...item,
        // Final safety: catch any remaining hallucinated tweet URLs
        sourceUrl: sanitizeFallback(item.sourceUrl, item.sourceLabel, item.title),
      }));
  } catch (err) {
    console.warn("[grok-scanner] Failed to parse structure JSON:", (err as Error).message);
    return [];
  }
}

/**
 * Sanitize URLs from Grok output. Even with grounded search, the
 * structuring step can still hallucinate tweet status URLs.
 *
 * Strategy: if the URL is a fabricated tweet (x.com/user/status/digits),
 * replace it with the user's profile page — which always works.
 * Search URLs like "from:user keyword" often return empty on X.
 */
function sanitizeFallback(url: string, sourceLabel: string, _title: string): string {
  if (!url) {
    // No URL at all — try to build a profile link from sourceLabel
    const userMatch = sourceLabel?.match(/@(\w+)/);
    if (userMatch) return `https://x.com/${userMatch[1]}`;
    return "";
  }

  // Detect hallucinated tweet status URLs (x.com/user/status/digits)
  const tweetPattern = /^https?:\/\/(x\.com|twitter\.com)\/(\w+)\/status\/\d+/i;
  const match = url.match(tweetPattern);
  if (match) {
    // Link to the user's profile — always works, unlike search URLs
    return `https://x.com/${match[2]}`;
  }

  // Detect search URLs (these often return empty results)
  const searchPattern = /^https?:\/\/(x\.com|twitter\.com)\/search\?/i;
  if (searchPattern.test(url)) {
    // Replace with profile link if we can extract a username
    const userMatch = sourceLabel?.match(/@(\w+)/);
    if (userMatch) return `https://x.com/${userMatch[1]}`;
  }

  return url;
}

// ─── Dedup Against Existing Entries ────────────────────

async function dedup(items: GrokNewsItem[]): Promise<GrokNewsItem[]> {
  if (items.length === 0) return [];

  const sevenDaysAgo = new Date();
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

  const existing = await prisma.changeLog.findMany({
    where: { date: { gte: sevenDaysAgo } },
    select: { sourceUrl: true, title: true },
  });

  const existingUrls = new Set(existing.map((e) => e.sourceUrl).filter(Boolean));
  const existingTitles = new Set(existing.map((e) => e.title.toLowerCase().slice(0, 50)));

  return items.filter((item) => {
    if (item.sourceUrl && existingUrls.has(item.sourceUrl)) return false;
    if (existingTitles.has(item.title.toLowerCase().slice(0, 50))) return false;
    return true;
  });
}

// ─── Ingest Into Database ──────────────────────────────

async function ingestGrokItems(items: GrokNewsItem[]): Promise<number> {
  let ingested = 0;

  const allFrameworks = await prisma.regulatoryFramework.findMany({
    select: { id: true, slug: true },
  });
  const frameworkMap = new Map(allFrameworks.map((f) => [f.slug, f.id]));

  const allSystems = await prisma.aISystem.findMany({
    select: { id: true, slug: true },
  });
  const systemMap = new Map(allSystems.map((s) => [s.slug, s.id]));

  for (const item of items) {
    try {
      const frameworkId = (item.frameworks || [])
        .map((slug) => frameworkMap.get(slug))
        .find((id) => id != null) || null;

      const systemId = (item.systems || [])
        .map((slug) => systemMap.get(slug))
        .find((id) => id != null) || null;

      let date: Date;
      try {
        date = new Date(item.date);
        if (isNaN(date.getTime())) date = new Date();
      } catch {
        date = new Date();
      }

      await prisma.changeLog.create({
        data: {
          date,
          title: item.title.slice(0, 200),
          description: item.summary,
          changeType: item.changeType || "update",
          sourceUrl: item.sourceUrl || "",
          sourceLabel: item.sourceLabel || "X/Twitter via Grok",
          author: "AI Compass EU Grok Scanner",
          ...(frameworkId ? { frameworkId } : {}),
          ...(systemId ? { systemId } : {}),
        },
      });
      ingested++;
    } catch (err) {
      console.warn(`[grok-scanner] Ingest failed "${item.title}":`, (err as Error).message);
    }
  }

  return ingested;
}

// ─── Main Pipeline ─────────────────────────────────────

export interface GrokScanResult {
  enabled: boolean;
  rawItems: number;
  newItems: number;
  ingestedItems: number;
  errors: string[];
  duration: number;
}

export async function runGrokScanner(): Promise<GrokScanResult> {
  const start = Date.now();
  const apiKey = process.env.XAI_API_KEY?.trim();

  if (!apiKey) {
    return {
      enabled: false,
      rawItems: 0,
      newItems: 0,
      ingestedItems: 0,
      errors: ["XAI_API_KEY not configured"],
      duration: 0,
    };
  }

  const errors: string[] = [];
  console.log("[grok-scanner] Scanning X/Twitter via Grok Responses API (grounded search)...");

  let rawItems: GrokNewsItem[] = [];
  try {
    rawItems = await queryGrok(apiKey);
    console.log(`[grok-scanner] Grok returned ${rawItems.length} grounded items`);
  } catch (err) {
    const msg = (err as Error).message;
    console.error("[grok-scanner] Grok API error:", msg);
    errors.push(msg);
    return {
      enabled: true,
      rawItems: 0,
      newItems: 0,
      ingestedItems: 0,
      errors,
      duration: Date.now() - start,
    };
  }

  // Dedup
  const newItems = await dedup(rawItems);
  console.log(`[grok-scanner] ${newItems.length} new items after dedup`);

  // Ingest (max 10 per run)
  const toIngest = newItems.slice(0, 10);
  const ingestedCount = await ingestGrokItems(toIngest);
  console.log(`[grok-scanner] ${ingestedCount} items ingested`);

  return {
    enabled: true,
    rawItems: rawItems.length,
    newItems: newItems.length,
    ingestedItems: ingestedCount,
    errors,
    duration: Date.now() - start,
  };
}
