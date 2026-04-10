/**
 * Chat Security Guard — Input validation before the LLM call.
 *
 * This is the first line of defense against misuse of the chatbot.
 * Runs BEFORE the LLM call, so malicious inputs never reach Claude.
 *
 * Three checks, in order:
 *   1. Length — reject questions over 500 characters
 *   2. Injection — detect prompt injection attempts
 *   3. Off-topic — detect clearly unrelated questions
 *
 * If a question passes all checks, it's sanitised (control chars
 * stripped, whitespace normalised) and passed to the RAG pipeline.
 *
 * Note: This is a heuristic filter, not a foolproof defense. The
 * LLM system prompt provides a second layer of protection. Advanced
 * attackers could bypass regex patterns (e.g., Unicode tricks), but
 * the dual-layer approach catches the vast majority of attempts.
 */

const MAX_QUESTION_LENGTH = 500;

// ─── Injection Detection ───────────────────────────────
// Each pattern targets a known class of prompt injection attack.
// If any matches, the question is blocked before reaching the LLM.

const INJECTION_PATTERNS = [
  /ignore\s+(previous|all|your|above)\s+(instructions|rules|prompt)/i,  // "Ignore previous instructions"
  /forget\s+(your|all|previous)\s+(instructions|rules)/i,               // "Forget your rules"
  /you\s+are\s+now\s+/i,                                                 // "You are now a helpful..."
  /pretend\s+(to\s+be|you\s+are)/i,                                      // "Pretend to be..."
  /act\s+as\s+(if|a|an)/i,                                               // "Act as a..."
  /new\s+instructions?:/i,                                               // "New instructions: ..."
  /system\s*prompt/i,                                                     // Probing for system prompt
  /\bDAN\b/,                                                              // "Do Anything Now" jailbreak
  /jailbreak/i,                                                           // Direct jailbreak mention
  /bypass\s+(safety|filter|rules)/i,                                     // "Bypass safety filters"
  /override\s+(instructions|rules|safety)/i,                             // "Override instructions"
  /reveal\s+(your|the)\s+(prompt|instructions|system)/i,                 // "Reveal your prompt"
  /what\s+(are|is)\s+your\s+(instructions|system\s*prompt|rules)/i,     // "What are your instructions?"
];

// ─── Off-Topic Detection ───────────────────────────────
// Questions clearly unrelated to AI compliance / EU regulations.
// These get a polite redirect instead of wasting an LLM call.

const OFF_TOPIC_PATTERNS = [
  /(?:weather|forecast|temperature)\s+(?:in|for|today)/i,               // Weather queries
  /(?:recipe|cook|bake)\s+/i,                                           // Cooking
  /(?:sports?|football|soccer|basketball)\s+(?:score|result|game)/i,    // Sports
  /(?:write|compose|draft)\s+(?:a\s+)?(?:poem|story|song|essay|code|script)/i, // Creative writing
  /(?:translate|convert)\s+(?:this|the\s+following)/i,                   // Translation requests
  /(?:joke|funny|humor)/i,                                               // Humor
  /(?:stock|crypto|bitcoin|invest)\s+(?:price|market)/i,                // Financial markets
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
