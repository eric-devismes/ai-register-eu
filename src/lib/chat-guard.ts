/**
 * Chat Security Guard — Input sanitisation, injection detection, topic check.
 */

const MAX_QUESTION_LENGTH = 500;

// Patterns that suggest prompt injection attempts
const INJECTION_PATTERNS = [
  /ignore\s+(previous|all|your|above)\s+(instructions|rules|prompt)/i,
  /forget\s+(your|all|previous)\s+(instructions|rules)/i,
  /you\s+are\s+now\s+/i,
  /pretend\s+(to\s+be|you\s+are)/i,
  /act\s+as\s+(if|a|an)/i,
  /new\s+instructions?:/i,
  /system\s*prompt/i,
  /\bDAN\b/,
  /jailbreak/i,
  /bypass\s+(safety|filter|rules)/i,
  /override\s+(instructions|rules|safety)/i,
  /reveal\s+(your|the)\s+(prompt|instructions|system)/i,
  /what\s+(are|is)\s+your\s+(instructions|system\s*prompt|rules)/i,
];

// Off-topic patterns — questions clearly unrelated to AI compliance
const OFF_TOPIC_PATTERNS = [
  /(?:weather|forecast|temperature)\s+(?:in|for|today)/i,
  /(?:recipe|cook|bake)\s+/i,
  /(?:sports?|football|soccer|basketball)\s+(?:score|result|game)/i,
  /(?:write|compose|draft)\s+(?:a\s+)?(?:poem|story|song|essay|code|script)/i,
  /(?:translate|convert)\s+(?:this|the\s+following)/i,
  /(?:joke|funny|humor)/i,
  /(?:stock|crypto|bitcoin|invest)\s+(?:price|market)/i,
];

export interface GuardResult {
  allowed: boolean;
  reason?: string;       // "injection" | "off-topic" | "too-long" | "empty"
  sanitised?: string;    // Cleaned question
}

/**
 * Validate and sanitise a chat question.
 */
export function guardQuestion(rawQuestion: string): GuardResult {
  // Empty check
  if (!rawQuestion || rawQuestion.trim().length === 0) {
    return { allowed: false, reason: "empty" };
  }

  // Length check
  if (rawQuestion.length > MAX_QUESTION_LENGTH) {
    return { allowed: false, reason: "too-long" };
  }

  // Sanitise: strip control characters, normalise whitespace
  const sanitised = rawQuestion
    .replace(/[\x00-\x1F\x7F]/g, "")  // Control characters
    .replace(/\s+/g, " ")              // Normalise whitespace
    .trim();

  if (sanitised.length === 0) {
    return { allowed: false, reason: "empty" };
  }

  // Injection detection
  for (const pattern of INJECTION_PATTERNS) {
    if (pattern.test(sanitised)) {
      return { allowed: false, reason: "injection", sanitised };
    }
  }

  // Off-topic detection
  for (const pattern of OFF_TOPIC_PATTERNS) {
    if (pattern.test(sanitised)) {
      return { allowed: false, reason: "off-topic", sanitised };
    }
  }

  return { allowed: true, sanitised };
}

/**
 * Get a user-friendly refusal message based on the block reason.
 */
export function getRefusalMessage(reason: string, locale: string): string {
  const messages: Record<string, Record<string, string>> = {
    injection: {
      en: "I can only help with questions about EU AI regulations and AI systems. Please ask about a specific compliance topic.",
      fr: "Je ne peux r\u00e9pondre qu'aux questions sur les r\u00e9glementations IA europ\u00e9ennes. Veuillez poser une question sur un sujet de conformit\u00e9 sp\u00e9cifique.",
      de: "Ich kann nur bei Fragen zu EU-KI-Vorschriften helfen. Bitte stellen Sie eine Frage zu einem bestimmten Compliance-Thema.",
    },
    "off-topic": {
      en: "I can only help with questions about EU AI regulations and the AI systems assessed on our platform. Please ask about a specific regulation, AI system, or compliance topic.",
      fr: "Je ne peux r\u00e9pondre qu'aux questions sur les r\u00e9glementations IA europ\u00e9ennes et les syst\u00e8mes IA \u00e9valu\u00e9s sur notre plateforme.",
      de: "Ich kann nur bei Fragen zu EU-KI-Vorschriften und den auf unserer Plattform bewerteten KI-Systemen helfen.",
    },
    "too-long": {
      en: "Please keep your question under 500 characters. Try to be more specific.",
      fr: "Veuillez limiter votre question \u00e0 500 caract\u00e8res. Essayez d'\u00eatre plus pr\u00e9cis.",
      de: "Bitte beschr\u00e4nken Sie Ihre Frage auf 500 Zeichen.",
    },
    empty: {
      en: "Please enter a question.",
      fr: "Veuillez saisir une question.",
      de: "Bitte geben Sie eine Frage ein.",
    },
  };

  const lang = locale.slice(0, 2);
  return messages[reason]?.[lang] || messages[reason]?.en || messages.empty.en;
}
