/**
 * Chart helper utilities shared between SpiderChart and ComparisonSpiderChart.
 */

/** Split a long label into 2 lines at a word boundary (for SVG text) */
export function wrapLabel(text: string, maxLength = 18): string[] {
  if (text.length <= maxLength) return [text];
  const mid = text.lastIndexOf(" ", maxLength + 2);
  if (mid === -1) return [text];
  return [text.slice(0, mid), text.slice(mid + 1)];
}
