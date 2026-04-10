/**
 * RAG Retrieval — Keyword-based context retrieval for the chatbot.
 *
 * Searches the database for content relevant to the user's question,
 * then assembles it into a context string for the LLM prompt.
 *
 * How it works:
 *   1. Extract meaningful terms from the question (strip stop words)
 *   2. Search 4 data sources in parallel:
 *      - Regulatory frameworks (name, description, purpose)
 *      - Policy statements (requirement text, commentary)
 *      - AI systems (vendor, name, description)
 *      - Changelog entries (title, description)
 *   3. Deduplicate overlapping results (statements found via both paths)
 *   4. Truncate to MAX_CONTEXT_LENGTH to stay within token limits
 *
 * This is a simple keyword-based approach — no vector DB needed at
 * the current scale (~50 systems, ~10 frameworks, ~500 statements).
 * If the dataset grows past ~5000 statements, consider migrating
 * to vector search (Pinecone, pgvector, etc.)
 */

import { prisma } from "@/lib/db";

// Max characters in the assembled context string.
// Claude Haiku has 200K tokens, but we want the context to be focused,
// not exhaustive. 4000 chars ≈ ~1000 tokens — leaves plenty of room
// for the system prompt and response.
const MAX_CONTEXT_LENGTH = 4000;

// ─── Term Extraction ───────────────────────────────────

/**
 * Extract meaningful search terms from a question.
 *
 * Strips stop words in English, French, and German (the 3 most
 * common user languages). Keeps words with 3+ characters.
 * Returns lowercase terms for case-insensitive matching.
 */
function extractTerms(question: string): string[] {
  const stopWords = new Set([
    // English
    "the", "a", "an", "is", "are", "was", "were", "be", "been", "being",
    "have", "has", "had", "do", "does", "did", "will", "would", "could",
    "should", "may", "might", "can", "shall", "to", "of", "in", "for",
    "on", "with", "at", "by", "from", "as", "into", "about", "between",
    "through", "during", "before", "after", "above", "below", "and", "or",
    "but", "not", "no", "nor", "so", "yet", "both", "each", "every",
    "this", "that", "these", "those", "what", "which", "who", "whom",
    "how", "when", "where", "why", "it", "its", "my", "your", "our",
    // French
    "le", "la", "les", "de", "du", "des", "un", "une", "et", "ou",
    "que", "qui", "est", "sont", "dans", "pour", "sur", "avec", "par",
    // German
    "der", "die", "das", "ein", "eine", "und", "oder", "ist", "sind",
  ]);

  return question
    .toLowerCase()
    .replace(/[^a-z0-9\s\u00C0-\u024F]/g, " ") // Keep letters, numbers, accented chars
    .split(/\s+/)
    .filter((w) => w.length > 2 && !stopWords.has(w));
}

// ─── Search Helpers ────────────────────────────────────
// Each function searches one data source and returns formatted strings.
// They all accept the extracted terms and return string[] results.

/** Search regulatory frameworks by name, description, and purpose. */
async function searchFrameworks(terms: string[]): Promise<string[]> {
  const frameworks = await prisma.regulatoryFramework.findMany({
    where: {
      OR: [
        { name: { contains: terms[0], mode: "insensitive" } },
        { description: { contains: terms[0], mode: "insensitive" } },
        { purpose: { contains: terms[0], mode: "insensitive" } },
        ...(terms[1] ? [
          { name: { contains: terms[1], mode: "insensitive" as const } },
          { description: { contains: terms[1], mode: "insensitive" as const } },
        ] : []),
      ],
    },
    take: 3,
    include: { sections: { include: { statements: { take: 3 } }, take: 3 } },
  });

  const results: string[] = [];
  for (const fw of frameworks) {
    results.push(`FRAMEWORK: ${fw.name}\n${fw.description}\nPurpose: ${fw.purpose}\nEnforcement: ${fw.enforcementType}\nPenalty: ${fw.maxPenalty}`);
    for (const sec of fw.sections) {
      for (const stmt of sec.statements) {
        results.push(`${fw.name} > ${sec.title} > ${stmt.reference}: ${stmt.statement}\nImplication: ${stmt.commentary}`);
      }
    }
  }
  return results;
}

/** Search policy statements directly (catches statements not found via frameworks). */
async function searchStatements(terms: string[]): Promise<string[]> {
  const statements = await prisma.policyStatement.findMany({
    where: {
      OR: [
        { statement: { contains: terms[0], mode: "insensitive" } },
        { commentary: { contains: terms[0], mode: "insensitive" } },
        ...(terms[1] ? [
          { statement: { contains: terms[1], mode: "insensitive" as const } },
        ] : []),
      ],
    },
    take: 5,
    include: { section: { include: { framework: { select: { name: true } } } } },
  });

  return statements.map((stmt) =>
    `${stmt.section.framework.name} > ${stmt.section.title} > ${stmt.reference}: ${stmt.statement}\nImplication: ${stmt.commentary}`
  );
}

/** Search AI systems by vendor name, product name, and description. */
async function searchSystems(terms: string[]): Promise<string[]> {
  const systems = await prisma.aISystem.findMany({
    where: {
      OR: [
        { name: { contains: terms[0], mode: "insensitive" } },
        { vendor: { contains: terms[0], mode: "insensitive" } },
        { description: { contains: terms[0], mode: "insensitive" } },
        ...(terms[1] ? [
          { name: { contains: terms[1], mode: "insensitive" as const } },
          { vendor: { contains: terms[1], mode: "insensitive" as const } },
        ] : []),
      ],
    },
    take: 3,
    include: { scores: { include: { framework: { select: { name: true } } } } },
  });

  return systems.map((sys) => {
    const scoreStr = sys.scores.map((s) => `${s.framework.name}: ${s.score}`).join(", ");
    return `AI SYSTEM: ${sys.vendor} ${sys.name} (${sys.type})\nRisk: ${sys.risk}\n${sys.description}\nScores: ${scoreStr}\nData: ${sys.dataStorage}\nEU Residency: ${sys.euResidency}\nCertifications: ${sys.certifications}`;
  });
}

/** Search recent changelog entries (regulatory updates, incidents, etc.). */
async function searchChangelog(terms: string[]): Promise<string[]> {
  const changelog = await prisma.changeLog.findMany({
    where: {
      OR: [
        { title: { contains: terms[0], mode: "insensitive" } },
        { description: { contains: terms[0], mode: "insensitive" } },
      ],
    },
    take: 3,
    orderBy: { date: "desc" },
    include: {
      framework: { select: { name: true } },
      system: { select: { vendor: true, name: true } },
    },
  });

  return changelog.map((cl) => {
    const related = cl.framework?.name || (cl.system ? `${cl.system.vendor} ${cl.system.name}` : "");
    return `RECENT UPDATE (${cl.date.toISOString().split("T")[0]}): ${cl.title}\n${cl.description}\nRelated: ${related}\nSource: ${cl.sourceUrl}`;
  });
}

// ─── Main Retrieval Function ───────────────────────────

/**
 * Search the database for content relevant to the question.
 *
 * Runs all 4 searches in parallel for speed (~50ms total instead of
 * ~200ms sequential). Deduplicates statement results that may appear
 * in both the framework search and direct statement search.
 */
export async function retrieveContext(question: string): Promise<string> {
  const terms = extractTerms(question);
  if (terms.length === 0) return "No relevant context found.";

  // Run all searches in parallel — each query is independent
  const [frameworkResults, statementResults, systemResults, changelogResults] =
    await Promise.all([
      searchFrameworks(terms),
      searchStatements(terms),
      searchSystems(terms),
      searchChangelog(terms),
    ]);

  // Deduplicate: remove statements already found via framework search
  // by checking if the statement text is already present in results
  const deduplicatedStatements = statementResults.filter(
    (stmt) => !frameworkResults.some((r) => r.includes(stmt.slice(0, 80)))
  );

  // Assemble context: frameworks first (most authoritative), then
  // additional statements, systems, and recent updates
  const allResults = [
    ...frameworkResults,
    ...deduplicatedStatements,
    ...systemResults,
    ...changelogResults,
  ];

  let context = allResults.join("\n\n---\n\n");
  if (context.length > MAX_CONTEXT_LENGTH) {
    context = context.slice(0, MAX_CONTEXT_LENGTH) + "\n\n[Context truncated]";
  }

  return context || "No relevant context found in the AI Compass EU database.";
}
