"use client";

/**
 * ChatWidget — Floating chat bubble with RAG-powered Q&A.
 *
 * - Bottom-right floating bubble
 * - Expandable chat panel with message history
 * - Shows remaining questions for anonymous users
 * - When exhausted: shows consulting CTA + case submission form
 * - Responds in the user's language
 */

import { useState, useRef, useEffect } from "react";
import { useLocale, useT } from "@/lib/locale-context";
import { renderMarkdownInline } from "@/lib/utils/markdown";
import { CONSULTING_EMAIL } from "@/lib/constants";

interface Message {
  role: "user" | "assistant" | "system";
  content: string;
}

export default function ChatWidget() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [remaining, setRemaining] = useState<number | null>(null);
  const [exhausted, setExhausted] = useState(false);
  const [isSubscriber, setIsSubscriber] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const locale = useLocale();
  const t = useT();

  // Welcome message
  useEffect(() => {
    if (open && messages.length === 0) {
      setMessages([{
        role: "assistant",
        content: locale === "fr"
          ? "Bonjour ! Je suis un assistant IA (propuls\u00e9 par Claude d'Anthropic). Posez-moi vos questions sur les r\u00e9glementations IA europ\u00e9ennes ou les syst\u00e8mes IA \u00e9valu\u00e9s sur notre plateforme. Mes r\u00e9ponses sont g\u00e9n\u00e9r\u00e9es par IA et fond\u00e9es sur notre base de donn\u00e9es r\u00e9glementaire."
          : locale === "de"
          ? "Hallo! Ich bin ein KI-Assistent (betrieben von Anthropic Claude). Stellen Sie mir Fragen zu EU-KI-Vorschriften oder den auf unserer Plattform bewerteten KI-Systemen. Meine Antworten sind KI-generiert und basieren auf unserer regulatorischen Datenbank."
          : "Hello! I'm an AI assistant (powered by Anthropic Claude). Ask me about EU AI regulations or the AI systems assessed on our platform. My responses are AI-generated and grounded in our regulatory database.",
      }]);
    }
  }, [open, messages.length, locale]);

  // Scroll chat panel to bottom on new messages (NOT the page)
  useEffect(() => {
    const el = messagesEndRef.current;
    if (el) {
      const container = el.parentElement;
      if (container) {
        container.scrollTop = container.scrollHeight;
      }
    }
  }, [messages, loading]);

  async function handleSend() {
    if (!input.trim() || loading || exhausted) return;

    const question = input.trim();
    setInput("");
    setMessages((prev) => [...prev, { role: "user", content: question }]);
    setLoading(true);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question, locale }),
      });

      const data = await res.json();
      setRemaining(data.remaining);
      setIsSubscriber(data.isSubscriber);

      if (data.exhausted) {
        setExhausted(true);
        setMessages((prev) => [...prev, {
          role: "system",
          content: "EXHAUSTED",
        }]);
      } else {
        setMessages((prev) => [...prev, { role: "assistant", content: data.answer }]);
      }
    } catch {
      setMessages((prev) => [...prev, { role: "assistant", content: "Something went wrong. Please try again." }]);
    }

    setLoading(false);
  }

  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  }

  // Consulting CTA messages
  const exhaustedMessages: Record<string, { titleAnon: string; titleSub: string; body: string; cta: string; email: string }> = {
    en: {
      titleAnon: "You've used your 3 free questions for today — create an account for 10/day",
      titleSub: "That's it for today — unlimited access with Pro",
      body: "Need a deeper dive? Our team can analyse your specific use case, map it against the regulations, and give you a clear action plan.",
      cta: "Raise a case with our team",
      email: CONSULTING_EMAIL,
    },
    fr: {
      titleAnon: "Vous avez utilis\u00e9 vos 3 questions \u2014 cr\u00e9ez un compte pour 10/jour",
      titleSub: "C'est tout pour aujourd'hui \u2014 acc\u00e8s illimit\u00e9 avec Pro",
      body: "Besoin d'aller plus loin ? Notre \u00e9quipe peut analyser votre cas sp\u00e9cifique, le confronter aux r\u00e9glementations et vous donner un plan d'action clair.",
      cta: "Soumettre un cas \u00e0 notre \u00e9quipe",
      email: CONSULTING_EMAIL,
    },
    de: {
      titleAnon: "Sie haben Ihre 3 Fragen verbraucht \u2014 Konto erstellen f\u00fcr 10/Tag",
      titleSub: "Das war's f\u00fcr heute \u2014 unbegrenzter Zugang mit Pro",
      body: "Brauchen Sie eine tiefere Analyse? Unser Team kann Ihren konkreten Anwendungsfall pr\u00fcfen und Ihnen einen klaren Handlungsplan geben.",
      cta: "Einen Fall bei unserem Team einreichen",
      email: CONSULTING_EMAIL,
    },
  };

  const exMsg = exhaustedMessages[locale] || exhaustedMessages.en;

  return (
    <>
      {/* Floating bubble */}
      {!open && (
        <button
          onClick={() => setOpen(true)}
          className="fixed bottom-6 right-6 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-[#003399] text-white shadow-lg transition hover:bg-[#003399]/90 hover:shadow-xl"
          aria-label="Open chat"
        >
          <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="M8.625 12a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0H8.25m4.125 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0H12m4.125 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0h-.375M21 12c0 4.556-4.03 8.25-9 8.25a9.764 9.764 0 0 1-2.555-.337A5.972 5.972 0 0 1 5.41 20.97a5.969 5.969 0 0 1-.474-.065 4.48 4.48 0 0 0 .978-2.025c.09-.457-.133-.901-.467-1.226C3.93 16.178 3 14.189 3 12c0-4.556 4.03-8.25 9-8.25s9 3.694 9 8.25Z" />
          </svg>
          {remaining !== null && remaining > 0 && remaining <= 3 && !isSubscriber && (
            <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-[#ffc107] text-[10px] font-bold text-[#0d1b3e]">
              {remaining}
            </span>
          )}
        </button>
      )}

      {/* Chat panel */}
      {open && (
        <div className="fixed bottom-6 right-6 z-50 flex h-[420px] w-[340px] flex-col overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-2xl sm:h-[460px] sm:w-[360px]">
          {/* Header */}
          <div className="flex items-center justify-between bg-[#003399] px-4 py-3">
            <div className="flex items-center gap-2">
              <div className="h-8 w-8 rounded-full bg-white/20 flex items-center justify-center">
                <span className="text-xs font-bold text-white">AI</span>
              </div>
              <div>
                <p className="text-sm font-semibold text-white">AI Compass EU</p>
                <p className="text-[10px] text-blue-200">
                  {remaining !== null && remaining >= 0
                    ? `${remaining} remaining today`
                    : "AI Compliance Assistant"}
                </p>
              </div>
            </div>
            <button onClick={() => setOpen(false)} className="text-white/70 hover:text-white">
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto px-4 py-3 space-y-3">
            {messages.map((msg, i) => {
              if (msg.role === "system" && msg.content === "EXHAUSTED") {
                return (
                  <div key={i} className="rounded-xl bg-amber-50 border border-amber-200 p-4">
                    <p className="text-sm font-semibold text-amber-800">{isSubscriber ? exMsg.titleSub : exMsg.titleAnon}</p>
                    <p className="mt-2 text-xs text-amber-700">{exMsg.body}</p>
                    <div className="mt-3 space-y-2">
                      <a href={`mailto:${exMsg.email}?subject=AI%20Compliance%20Consulting%20Request`}
                        className="block w-full rounded-lg bg-[#003399] px-4 py-2 text-center text-sm font-semibold text-white hover:bg-[#003399]/90">
                        {exMsg.cta}
                      </a>
                      {!isSubscriber && (
                        <a href={`/${locale}/subscribe`}
                          className="block w-full rounded-lg border border-[#003399] px-4 py-2 text-center text-sm font-semibold text-[#003399] hover:bg-[#003399]/5">
                          {t("common.signUp")} — 10 {locale === "fr" ? "questions/jour" : locale === "de" ? "Fragen/Tag" : "questions/day"}
                        </a>
                      )}
                    </div>
                  </div>
                );
              }

              return (
                <div key={i} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
                  <div className={`max-w-[85%] rounded-xl px-3 py-2 text-sm ${
                    msg.role === "user"
                      ? "bg-[#003399] text-white"
                      : "bg-gray-100 text-gray-800"
                  }`}>
                    <p className="whitespace-pre-wrap leading-relaxed">
                      {msg.role === "assistant" ? renderMarkdownInline(msg.content) : msg.content}
                    </p>
                  </div>
                </div>
              );
            })}
            {loading && (
              <div className="flex justify-start">
                <div className="rounded-xl bg-gray-100 px-4 py-2">
                  <div className="flex gap-1">
                    <span className="h-2 w-2 rounded-full bg-gray-400 animate-bounce" style={{ animationDelay: "0ms" }} />
                    <span className="h-2 w-2 rounded-full bg-gray-400 animate-bounce" style={{ animationDelay: "150ms" }} />
                    <span className="h-2 w-2 rounded-full bg-gray-400 animate-bounce" style={{ animationDelay: "300ms" }} />
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          {!exhausted && (
            <div className="border-t border-gray-200 px-3 py-3">
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder={locale === "fr" ? "Posez votre question..." : locale === "de" ? "Stellen Sie Ihre Frage..." : "Ask about EU AI regulations..."}
                  maxLength={500}
                  disabled={loading}
                  className="flex-1 rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-[#003399] focus:outline-none focus:ring-1 focus:ring-[#003399] disabled:opacity-50"
                />
                <button
                  onClick={handleSend}
                  disabled={loading || !input.trim()}
                  className="rounded-lg bg-[#003399] p-2 text-white transition hover:bg-[#003399]/90 disabled:opacity-50"
                >
                  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 12 3.269 3.125A59.769 59.769 0 0 1 21.485 12 59.768 59.768 0 0 1 3.27 20.875L5.999 12Zm0 0h7.5" />
                  </svg>
                </button>
              </div>
              <p className={`mt-1 text-[10px] text-center ${input.length > 400 ? "text-red-500 font-semibold" : input.length > 300 ? "text-amber-500" : "text-gray-400"}`}>
                {input.length}/500
              </p>
            </div>
          )}
        </div>
      )}
    </>
  );
}
