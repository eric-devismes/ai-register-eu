/**
 * Scoring Utility — Grade conversion and overall score calculation.
 *
 * Each regulatory framework score is a letter grade (A+ through D).
 * This module converts between letter grades and numeric values,
 * and computes an overall score by averaging all framework scores.
 *
 * Scale:
 *   A+ = 10, A = 9, A- = 8
 *   B+ = 7,  B = 6, B- = 5
 *   C+ = 4,  C = 3, C- = 2
 *   D  = 1
 */

// ─── Grade ↔ Number Mapping ──────────────────────────────

/** All valid letter grades, from best to worst */
export const ALL_GRADES = [
  "A+", "A", "A-",
  "B+", "B", "B-",
  "C+", "C", "C-",
  "D",
] as const;

/** Convert a letter grade to a number (A+ = 10, D = 1) */
const GRADE_TO_NUMBER: Record<string, number> = {
  "A+": 10, "A": 9, "A-": 8,
  "B+": 7,  "B": 6, "B-": 5,
  "C+": 4,  "C": 3, "C-": 2,
  "D": 1,
};

/** Convert a number back to a letter grade */
const NUMBER_TO_GRADE: [number, string][] = [
  [9.5, "A+"],
  [8.5, "A"],
  [7.5, "A-"],
  [6.5, "B+"],
  [5.5, "B"],
  [4.5, "B-"],
  [3.5, "C+"],
  [2.5, "C"],
  [1.5, "C-"],
  [0,   "D"],
];

// ─── Public Functions ────────────────────────────────────

/**
 * Convert a letter grade string to its numeric value.
 * Returns 0 if the grade is not recognized.
 */
export function gradeToNumber(grade: string): number {
  return GRADE_TO_NUMBER[grade] ?? 0;
}

/**
 * Convert a numeric score to a letter grade.
 * Uses threshold-based rounding (e.g., 9.5+ = A+, 8.5+ = A).
 */
export function numberToGrade(value: number): string {
  for (const [threshold, grade] of NUMBER_TO_GRADE) {
    if (value >= threshold) return grade;
  }
  return "D";
}

/**
 * Compute the overall score for an AI system.
 *
 * Takes an array of letter grades (one per framework),
 * averages their numeric values, and converts back to a letter grade.
 *
 * Returns "N/A" if there are no scores.
 *
 * Example:
 *   computeOverallScore(["B+", "A-", "B", "B+"]) → "B+"
 *   (7 + 8 + 6 + 7) / 4 = 7.0 → B+
 */
export function computeOverallScore(grades: string[]): string {
  if (grades.length === 0) return "N/A";

  const total = grades.reduce((sum, grade) => sum + gradeToNumber(grade), 0);
  const average = total / grades.length;

  return numberToGrade(average);
}

/**
 * Get the Tailwind background color class for a letter grade.
 * Used by both the admin UI and public pages.
 *
 * A grades = green, B = blue, C = amber, D = red
 */
export function gradeColor(grade: string): string {
  if (grade.startsWith("A")) return "bg-emerald-500";
  if (grade.startsWith("B")) return "bg-blue-500";
  if (grade.startsWith("C")) return "bg-amber-500";
  if (grade === "N/A") return "bg-gray-400";
  return "bg-red-500";
}

/**
 * Get the light background + border + text color for a letter grade.
 * Used for score badges that need a softer appearance (e.g., cards, tables).
 */
export function gradeBgLight(grade: string): string {
  const letter = grade.charAt(0).toUpperCase();
  if (letter === "A") return "bg-emerald-50 border-emerald-200 text-emerald-700";
  if (letter === "B") return "bg-blue-50 border-blue-200 text-blue-700";
  if (letter === "C") return "bg-amber-50 border-amber-200 text-amber-700";
  return "bg-red-50 border-red-200 text-red-700";
}

// ─── Dimension Scores for Comparison Spider Chart ───────
//
// These functions compute high-level dimension scores (0-10) from
// individual AI system fields. Used by the comparison tool to render
// the radar chart without requiring an LLM call for most axes.
//
// The 6 dimensions are:
//   1. Feature Alignment   — LLM-generated, not computed here
//   2. Regulatory Compliance — average of framework letter grades
//   3. Security Posture     — heuristic from certs, encryption, access controls
//   4. Vendor Maturity      — from company age, size, market presence, customers
//   5. Data Sovereignty     — from EU residency, storage, processing fields
//   6. AI Transparency      — from model docs, explainability, bias testing

/** System fields needed for dimension scoring */
export interface SystemForScoring {
  scores?: { score: string }[];
  certifications?: string;
  encryptionInfo?: string;
  accessControls?: string;
  foundedYear?: number | null;
  employeeCount?: string;
  marketPresence?: string;
  customerCount?: string;
  fundingStatus?: string;
  euResidency?: string;
  dataStorage?: string;
  dataProcessing?: string;
  modelDocs?: string;
  explainability?: string;
  biasTesting?: string;
}

/**
 * Regulatory Compliance (0-10)
 *
 * Simply averages all framework letter grades.
 * A system with ["B+", "A-", "B", "B+"] gets (7+8+6+7)/4 = 7.0
 */
export function computeRegulatoryScore(grades: string[]): number {
  if (grades.length === 0) return 0;
  const total = grades.reduce((sum, g) => sum + gradeToNumber(g), 0);
  return Math.round((total / grades.length) * 10) / 10;
}

/**
 * Security Posture (0-10)
 *
 * Heuristic scoring based on recognized certifications, encryption standards,
 * and access control mechanisms mentioned in the system's fields.
 */
export function computeSecurityScore(system: SystemForScoring): number {
  let score = 0;

  // Certifications (up to 5 points)
  const certs = (system.certifications || "").toLowerCase();
  const certKeywords = ["iso 27001", "soc 2", "soc2", "c5", "iso 27017", "iso 27018", "hipaa", "fedramp", "ens high", "hds"];
  const certMatches = certKeywords.filter((k) => certs.includes(k)).length;
  score += Math.min(certMatches * 1.0, 5);

  // Encryption (up to 2.5 points)
  const enc = (system.encryptionInfo || "").toLowerCase();
  if (enc.includes("aes-256") || enc.includes("aes 256")) score += 1.25;
  if (enc.includes("tls 1.3") || enc.includes("tls 1.2")) score += 1.25;

  // Access controls (up to 2.5 points)
  const ac = (system.accessControls || "").toLowerCase();
  const acKeywords = ["sso", "mfa", "rbac", "iam", "saml", "zero trust"];
  const acMatches = acKeywords.filter((k) => ac.includes(k)).length;
  score += Math.min(acMatches * 0.8, 2.5);

  return Math.min(Math.round(score * 10) / 10, 10);
}

/**
 * Vendor Maturity (0-10)
 *
 * Heuristic based on company age, employee count, market position,
 * customer base, and funding status.
 */
export function computeVendorMaturityScore(system: SystemForScoring): number {
  let score = 0;

  // Company age (up to 2.5 points) — older = more established
  if (system.foundedYear) {
    const age = new Date().getFullYear() - system.foundedYear;
    if (age >= 20) score += 2.5;
    else if (age >= 10) score += 2.0;
    else if (age >= 5) score += 1.5;
    else if (age >= 2) score += 1.0;
    else score += 0.5;
  }

  // Market presence (up to 2.5 points)
  const mp = (system.marketPresence || "").toLowerCase();
  if (mp === "leader") score += 2.5;
  else if (mp === "challenger") score += 1.8;
  else if (mp === "niche") score += 1.2;
  else if (mp === "emerging") score += 0.7;

  // Customer count (up to 2.5 points)
  const cc = system.customerCount || "";
  const ccNum = parseApproxCount(cc);
  if (ccNum >= 50000) score += 2.5;
  else if (ccNum >= 10000) score += 2.0;
  else if (ccNum >= 1000) score += 1.5;
  else if (ccNum >= 100) score += 1.0;
  else if (ccNum > 0) score += 0.5;

  // Funding status (up to 2.5 points) — public companies score highest
  const fs = (system.fundingStatus || "").toLowerCase();
  if (fs.includes("public")) score += 2.5;
  else if (fs.includes("vc") || fs.includes("private")) score += 1.5;
  else score += 0.5;

  return Math.min(Math.round(score * 10) / 10, 10);
}

/**
 * Data Sovereignty (0-10)
 *
 * Scores how well the system supports EU data residency.
 * Self-hosted and EU-native systems score highest.
 */
export function computeDataSovereigntyScore(system: SystemForScoring): number {
  let score = 0;
  const fields = [
    system.euResidency || "",
    system.dataStorage || "",
    system.dataProcessing || "",
  ].join(" ").toLowerCase();

  // Full EU residency (up to 4 points)
  if (fields.includes("self-hosted") || fields.includes("on-premises") || fields.includes("on-prem")) {
    score += 4;
  } else if (fields.includes("full eu") || fields.includes("eu-only") || fields.includes("eu only")) {
    score += 3.5;
  } else if (fields.includes("eu region") || fields.includes("frankfurt") || fields.includes("eu data")) {
    score += 2.5;
  } else if (fields.includes("eu")) {
    score += 1.5;
  }

  // EU-native vendor bonus (up to 2 points)
  if (fields.includes("eu-native") || fields.includes("german") || fields.includes("french") || fields.includes("norwegian") || fields.includes("romanian")) {
    score += 2;
  }

  // DPA and contractual safeguards (up to 2 points)
  if (fields.includes("dpa") || fields.includes("scc") || fields.includes("adequacy")) {
    score += 2;
  }

  // Encryption and data isolation (up to 2 points)
  if (fields.includes("customer-managed") || fields.includes("cmek") || fields.includes("byok")) {
    score += 1;
  }
  if (fields.includes("zero data leaves") || fields.includes("no cross-customer") || fields.includes("data stays")) {
    score += 1;
  }

  return Math.min(Math.round(score * 10) / 10, 10);
}

/**
 * AI Transparency (0-10)
 *
 * Scores the quality and completeness of model documentation,
 * explainability features, and bias testing procedures.
 */
export function computeTransparencyScore(system: SystemForScoring): number {
  let score = 0;

  // Model documentation (up to 3.5 points)
  const docs = (system.modelDocs || "").toLowerCase();
  if (docs.length > 100) score += 2.5;
  else if (docs.length > 30) score += 1.5;
  else if (docs.length > 0) score += 0.5;
  if (docs.includes("model card") || docs.includes("architecture")) score += 1;

  // Explainability (up to 3.5 points)
  const expl = (system.explainability || "").toLowerCase();
  if (expl.length > 100) score += 2.5;
  else if (expl.length > 30) score += 1.5;
  else if (expl.length > 0) score += 0.5;
  if (expl.includes("shap") || expl.includes("lime") || expl.includes("attention") || expl.includes("feature importance")) score += 1;

  // Bias testing (up to 3 points)
  const bias = (system.biasTesting || "").toLowerCase();
  if (bias.length > 100) score += 2;
  else if (bias.length > 30) score += 1;
  else if (bias.length > 0) score += 0.5;
  if (bias.includes("demographic") || bias.includes("fairness") || bias.includes("benchmark")) score += 1;

  return Math.min(Math.round(score * 10) / 10, 10);
}

/**
 * Compute all 5 static dimension scores for a system.
 * (Feature Alignment is LLM-generated and not included here.)
 *
 * Returns a record mapping dimension key to score (0-10).
 */
export function computeAllDimensionScores(system: SystemForScoring): Record<string, number> {
  const grades = (system.scores || []).map((s) => s.score);

  return {
    compliance: computeRegulatoryScore(grades),
    security: computeSecurityScore(system),
    maturity: computeVendorMaturityScore(system),
    sovereignty: computeDataSovereigntyScore(system),
    transparency: computeTransparencyScore(system),
  };
}

// ─── Helpers ─────────────────────────────────────────────

/**
 * Parse approximate count strings like "10,000+", "500+", "200M+".
 * Returns a rough numeric value for comparison purposes.
 */
function parseApproxCount(text: string): number {
  const cleaned = text.replace(/[,+\s]/g, "").toLowerCase();
  const match = cleaned.match(/^(\d+)(m|k)?/);
  if (!match) return 0;
  const num = parseInt(match[1], 10);
  if (match[2] === "m") return num * 1_000_000;
  if (match[2] === "k") return num * 1_000;
  return num;
}
