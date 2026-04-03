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
