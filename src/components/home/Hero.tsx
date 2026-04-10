"use client";

/**
 * Hero — Chat-first homepage hero.
 *
 * Primary interaction: ask the AI assistant a question.
 * Secondary: browse database or view methodology.
 * Preserves the brand look (dark gradient, gold accents)
 * while making the chatbot the centre of the experience.
 */

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useT, useLocale } from "@/lib/locale-context";
import { renderMarkdownInline } from "@/lib/utils/markdown";

// ─── Suggestion prompts per locale ──────────────────────

const suggestions: Record<string, string[]> = {
  en: [
    "What is the EU AI Act?",
    "Which AI tools are high-risk under the AI Act?",
    "What are the GDPR rules for AI systems?",
    "What does DORA require for AI in banking?",
  ],
  fr: [
    "Qu'est-ce que l'AI Act europ\u00e9en ?",
    "Quels outils IA sont \u00e0 haut risque selon l'AI Act ?",
    "Quelles sont les r\u00e8gles RGPD pour les syst\u00e8mes IA ?",
    "Que demande DORA pour l'IA en banque ?",
  ],
  de: [
    "Was ist der EU AI Act?",
    "Welche KI-Tools sind laut AI Act hochriskant?",
    "Welche DSGVO-Regeln gelten f\u00fcr KI-Systeme?",
    "Was verlangt DORA f\u00fcr KI im Bankwesen?",
  ],
};

interface ChatMessage {
  role: "user" | "assistant";
  content: string;
}

export default function Hero() {
  const [query, setQuery] = useState("");
  const [chatOpen, setChatOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const t = useT();
  const locale = useLocale();
  const router = useRouter();

  const localeSuggestions = suggestions[locale] || suggestions.en;

  // Keep the latest user message visible at the top of the chat panel
  const lastUserMsgRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (lastUserMsgRef.current) {
      const container = lastUserMsgRef.current.closest("[data-chat-scroll]") as HTMLElement | null;
      if (container) {
        // Scroll so the user's question sits near the top with a small margin
        container.scrollTop = lastUserMsgRef.current.offsetTop - 8;
      }
    }
  }, [messages, loading]);

  // Focus input when chat opens
  useEffect(() => {
    if (chatOpen) inputRef.current?.focus();
  }, [chatOpen]);

  async function handleAsk(questionOverride?: string) {
    const question = (questionOverride || query).trim();
    if (!question || loading) return;

    setQuery("");
    setChatOpen(true);
    setMessages((prev) => [...prev, { role: "user", content: question }]);
    setLoading(true);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question, locale }),
      });
      const data = await res.json();
      setMessages((prev) => [...prev, { role: "assistant", content: data.answer }]);
    } catch {
      setMessages((prev) => [...prev, {
        role: "assistant",
        content: locale === "fr"
          ? "Désolé, une erreur s'est produite. Réessayez."
          : "Sorry, something went wrong. Please try again.",
      }]);
    }
    setLoading(false);
  }

  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleAsk();
    }
  }

  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-[#0d1b3e] via-[#0d1b3e] to-[#003399]">
      {/* Grid overlay */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.07]"
        style={{
          backgroundImage:
            "linear-gradient(rgba(255,255,255,.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.5) 1px, transparent 1px)",
          backgroundSize: "60px 60px",
        }}
      />

      <div className="relative mx-auto max-w-7xl px-4 py-20 sm:px-6 sm:py-24 lg:px-8 lg:py-28">
        <div className="mx-auto max-w-3xl text-center">
          {/* Badge */}
          <span className="inline-block rounded-full border border-white/20 bg-white/10 px-4 py-1.5 text-sm font-medium tracking-wide text-white/90 backdrop-blur-sm">
            {t("hero.badge")}
          </span>

          {/* Title */}
          <h1 className="mt-6 text-4xl font-extrabold leading-tight tracking-tight text-white sm:text-5xl lg:text-6xl">
            {t("hero.title")}{" "}
            <span className="text-[#ffc107]">{t("hero.titleHighlight")}</span>
          </h1>

          {/* Subtitle */}
          <p className="mx-auto mt-4 max-w-2xl text-lg leading-relaxed text-blue-100/80 sm:text-xl">
            {t("hero.subtitle")}
          </p>

          {/* ─── Chat Input (primary CTA) ─────────────────── */}
          <div className="mx-auto mt-10 max-w-2xl">
            <div className="rounded-2xl border border-white/15 bg-white/[0.07] p-1.5 shadow-2xl backdrop-blur-sm">
              {/* Chat messages area — visible when chat is active */}
              {chatOpen && messages.length > 0 && (
                <div data-chat-scroll className="mb-2 max-h-72 overflow-y-auto rounded-xl bg-[#0a1428]/80 p-4 text-left">
                  {messages.map((msg, i) => {
                    // Track the last user message so we can scroll to it
                    const isLastUser = msg.role === "user" && !messages.slice(i + 1).some((m) => m.role === "user");
                    return (
                      <div
                        key={i}
                        ref={isLastUser ? lastUserMsgRef : undefined}
                        className={`mb-3 last:mb-0 ${msg.role === "user" ? "text-right" : "text-left"}`}
                      >
                        <div
                          className={`inline-block max-w-[85%] rounded-xl px-3 py-2 text-sm leading-relaxed ${
                            msg.role === "user"
                              ? "bg-[#003399] text-white"
                              : "bg-white/10 text-blue-50"
                          }`}
                        >
                          <p className="whitespace-pre-wrap">
                            {msg.role === "assistant" ? renderMarkdownInline(msg.content) : msg.content}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                  {loading && (
                    <div className="text-left">
                      <div className="inline-block rounded-xl bg-white/10 px-4 py-2">
                        <div className="flex gap-1">
                          <span className="h-2 w-2 rounded-full bg-blue-300 animate-bounce" style={{ animationDelay: "0ms" }} />
                          <span className="h-2 w-2 rounded-full bg-blue-300 animate-bounce" style={{ animationDelay: "150ms" }} />
                          <span className="h-2 w-2 rounded-full bg-blue-300 animate-bounce" style={{ animationDelay: "300ms" }} />
                        </div>
                      </div>
                    </div>
                  )}
                  <div ref={messagesEndRef} />
                </div>
              )}

              {/* Input row */}
              <div className="flex items-center gap-2">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-[#ffc107]/20">
                  <svg className="h-5 w-5 text-[#ffc107]" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M8.625 12a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0H8.25m4.125 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0H12m4.125 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0h-.375M21 12c0 4.556-4.03 8.25-9 8.25a9.764 9.764 0 0 1-2.555-.337A5.972 5.972 0 0 1 5.41 20.97a5.969 5.969 0 0 1-.474-.065 4.48 4.48 0 0 0 .978-2.025c.09-.457-.133-.901-.467-1.226C3.93 16.178 3 14.189 3 12c0-4.556 4.03-8.25 9-8.25s9 3.694 9 8.25Z" />
                  </svg>
                </div>
                <input
                  ref={inputRef}
                  type="text"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  onKeyDown={handleKeyDown}
                  onFocus={() => { /* keep chat open if already open */ }}
                  placeholder={
                    chatOpen
                      ? (locale === "fr" ? "Posez une autre question..." : locale === "de" ? "Stellen Sie eine weitere Frage..." : "Ask a follow-up question...")
                      : (locale === "fr" ? "Posez votre question sur la conformité IA en Europe..." : locale === "de" ? "Stellen Sie Ihre Frage zur KI-Compliance in der EU..." : "Ask about any AI system's EU compliance...")
                  }
                  maxLength={500}
                  disabled={loading}
                  className="flex-1 bg-transparent px-2 py-3 text-sm text-white placeholder-blue-200/40 focus:outline-none disabled:opacity-50"
                />
                <button
                  type="button"
                  onClick={() => handleAsk()}
                  disabled={loading || !query.trim()}
                  className="rounded-lg bg-[#ffc107] px-5 py-2.5 text-sm font-semibold text-[#0d1b3e] transition hover:bg-[#ffcd38] disabled:opacity-40"
                >
                  {locale === "fr" ? "Demander" : locale === "de" ? "Fragen" : "Ask"}
                </button>
              </div>
            </div>

            {/* Suggestion pills — hidden once chat is active */}
            {!chatOpen && (
              <div className="mt-4 flex flex-wrap items-center justify-center gap-2">
                <span className="text-xs text-blue-200/40">
                  {locale === "fr" ? "Essayez :" : locale === "de" ? "Versuchen Sie:" : "Try:"}
                </span>
                {localeSuggestions.map((s) => (
                  <button
                    key={s}
                    type="button"
                    onClick={() => handleAsk(s)}
                    className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-blue-100/70 transition hover:border-[#ffc107]/30 hover:bg-[#ffc107]/10 hover:text-white"
                  >
                    {s}
                  </button>
                ))}
              </div>
            )}

            {/* Secondary links */}
            <div className="mt-5 flex items-center justify-center gap-6">
              <a
                href={`/${locale}/database`}
                className="group inline-flex items-center gap-1.5 text-sm font-medium text-blue-200/70 transition hover:text-white"
              >
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 6.375c0 2.278-3.694 4.125-8.25 4.125S3.75 8.653 3.75 6.375m16.5 0c0-2.278-3.694-4.125-8.25-4.125S3.75 4.097 3.75 6.375m16.5 0v11.25c0 2.278-3.694 4.125-8.25 4.125s-8.25-1.847-8.25-4.125V6.375m16.5 0v3.75m-16.5-3.75v3.75m16.5 0v3.75C20.25 16.153 16.556 18 12 18s-8.25-1.847-8.25-4.125v-3.75" />
                </svg>
                {t("hero.ctaDatabase")}
                <svg className="h-3 w-3 transition group-hover:translate-x-0.5" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
                </svg>
              </a>
              <span className="text-blue-200/20">|</span>
              <a
                href={`/${locale}/methodology`}
                className="group inline-flex items-center gap-1.5 text-sm font-medium text-blue-200/70 transition hover:text-white"
              >
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9.75 3.104v5.714a2.25 2.25 0 0 1-.659 1.591L5 14.5M9.75 3.104c-.251.023-.501.05-.75.082m.75-.082a24.301 24.301 0 0 1 4.5 0m0 0v5.714c0 .597.237 1.17.659 1.591L19.8 15.3M14.25 3.104c.251.023.501.05.75.082M19.8 15.3l-1.57.393A9.065 9.065 0 0 1 12 15a9.065 9.065 0 0 0-6.23.693L5 14.5m14.8.8 1.402 1.402c1.232 1.232.65 3.318-1.067 3.611l-.772.13c-1.687.282-3.404.438-5.138.438-1.734 0-3.451-.156-5.138-.438l-.772-.131c-1.717-.293-2.3-2.379-1.067-3.61L5 14.5" />
                </svg>
                {t("hero.ctaMethodology")}
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
