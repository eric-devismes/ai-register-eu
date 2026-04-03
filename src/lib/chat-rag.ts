/**
 * RAG Retrieval — Searches the database for content relevant to the user's question.
 *
 * Simple keyword-based search (no vector DB needed at this scale).
 * Returns a context string to inject into the LLM prompt.
 */

import { prisma } from "@/lib/db";

const MAX_CONTEXT_LENGTH = 4000; // chars — keep prompt under token limits

/**
 * Extract key terms from a question (simple: split + filter short words).
 */
function extractTerms(question: string): string[] {
  const stopWords = new Set([
    "the", "a", "an", "is", "are", "was", "were", "be", "been", "being",
    "have", "has", "had", "do", "does", "did", "will", "would", "could",
    "should", "may", "might", "can", "shall", "to", "of", "in", "for",
    "on", "with", "at", "by", "from", "as", "into", "about", "between",
    "through", "during", "before", "after", "above", "below", "and", "or",
    "but", "not", "no", "nor", "so", "yet", "both", "each", "every",
    "this", "that", "these", "those", "what", "which", "who", "whom",
    "how", "when", "where", "why", "it", "its", "my", "your", "our",
    "le", "la", "les", "de", "du", "des", "un", "une", "et", "ou",
    "que", "qui", "est", "sont", "dans", "pour", "sur", "avec", "par",
    "der", "die", "das", "ein", "eine", "und", "oder", "ist", "sind",
  ]);

  return question
    .toLowerCase()
    .replace(/[^a-z0-9\s\u00C0-\u024F]/g, " ")
    .split(/\s+/)
    .filter((w) => w.length > 2 && !stopWords.has(w));
}

/**
 * Search the database for content relevant to the question.
 * Returns a formatted context string for the LLM.
 */
export async function retrieveContext(question: string): Promise<string> {
  const terms = extractTerms(question);
  if (terms.length === 0) return "No relevant context found.";

  // Build a search pattern: any term matches
  const searchPattern = terms.join(" | "); // PostgreSQL OR pattern

  const results: string[] = [];

  // 1. Search frameworks
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

  for (const fw of frameworks) {
    results.push(`FRAMEWORK: ${fw.name}\n${fw.description}\nPurpose: ${fw.purpose}\nEnforcement: ${fw.enforcementType}\nPenalty: ${fw.maxPenalty}`);
    for (const sec of fw.sections) {
      for (const stmt of sec.statements) {
        results.push(`${fw.name} > ${sec.title} > ${stmt.reference}: ${stmt.statement}\nImplication: ${stmt.commentary}`);
      }
    }
  }

  // 2. Search policy statements directly
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

  for (const stmt of statements) {
    if (!results.some((r) => r.includes(stmt.reference))) {
      results.push(`${stmt.section.framework.name} > ${stmt.section.title} > ${stmt.reference}: ${stmt.statement}\nImplication: ${stmt.commentary}`);
    }
  }

  // 3. Search AI systems
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

  for (const sys of systems) {
    const scoreStr = sys.scores.map((s) => `${s.framework.name}: ${s.score}`).join(", ");
    results.push(`AI SYSTEM: ${sys.vendor} ${sys.name} (${sys.type})\nRisk: ${sys.risk}\n${sys.description}\nScores: ${scoreStr}\nData: ${sys.dataStorage}\nEU Residency: ${sys.euResidency}\nCertifications: ${sys.certifications}`);
  }

  // 4. Search recent changelog
  const changelog = await prisma.changeLog.findMany({
    where: {
      OR: [
        { title: { contains: terms[0], mode: "insensitive" } },
        { description: { contains: terms[0], mode: "insensitive" } },
      ],
    },
    take: 3,
    orderBy: { date: "desc" },
    include: { framework: { select: { name: true } }, system: { select: { vendor: true, name: true } } },
  });

  for (const cl of changelog) {
    const related = cl.framework?.name || (cl.system ? `${cl.system.vendor} ${cl.system.name}` : "");
    results.push(`RECENT UPDATE (${cl.date.toISOString().split("T")[0]}): ${cl.title}\n${cl.description}\nRelated: ${related}\nSource: ${cl.sourceUrl}`);
  }

  // Combine and truncate to max length
  let context = results.join("\n\n---\n\n");
  if (context.length > MAX_CONTEXT_LENGTH) {
    context = context.slice(0, MAX_CONTEXT_LENGTH) + "\n\n[Context truncated]";
  }

  return context || "No relevant context found in the AI Compass EU database.";
}
