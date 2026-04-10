/**
 * Markdown rendering utilities for chat messages.
 *
 * Parses simple markdown (links + bold) into React elements.
 * Used by both the Hero chat and the ChatWidget.
 */

import type { ReactNode } from "react";
import { createElement } from "react";

/**
 * Parse markdown links [text](url) and **bold** in a string.
 * Returns an array of React elements (strings, <a>, <strong>).
 */
export function renderMarkdownInline(content: string): ReactNode[] {
  const parts = content.split(/(\[.*?\]\(.*?\)|\*\*.*?\*\*)/g);
  return parts.map((part, i) => {
    // Markdown link: [text](url)
    const linkMatch = part.match(/^\[(.*?)\]\((.*?)\)$/);
    if (linkMatch) {
      return createElement("a", {
        key: i,
        href: linkMatch[2],
        className: "font-semibold text-[#003399] underline hover:text-[#002277]",
      }, linkMatch[1]);
    }
    // Bold: **text**
    const boldMatch = part.match(/^\*\*(.*?)\*\*$/);
    if (boldMatch) {
      return createElement("strong", { key: i }, boldMatch[1]);
    }
    return part;
  });
}
