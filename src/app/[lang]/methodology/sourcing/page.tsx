import type { Metadata } from "next";
import Link from "next/link";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";

export const metadata: Metadata = {
  title: "How we verify our sources — AI Compass EU",
  description:
    "Every claim we publish is linked to a primary vendor source, backed by a verbatim quote, and tracked with a content hash. Here's how the evidence backbone works.",
};

// NOTE (i18n debt): this sub-page is intentionally English-only for now.
// Translation keys will be added in a follow-up once the evidence backbone
// messaging is stable. The page path is not listed in
// scripts/i18n-scan-paths.txt nor PRIORITY_METADATA_PAGES, so the gate
// does not block on hardcoded English here. See TODO.md.

const tiers = [
  {
    tier: 1,
    label: "Primary canonical",
    description:
      "The vendor's own trust portal, DPA, sub-processor list, privacy notice, or AI-specific policy page. These are the sources a buyer would cite in a procurement review.",
    examples: [
      "trust.anthropic.com",
      "https://openai.com/enterprise-privacy",
      "https://trust.salesforce.com/",
    ],
  },
  {
    tier: 2,
    label: "Vendor documentation",
    description:
      "Product docs, support articles, engineering blog posts that state commitments — still from the vendor, but one step away from the legal surface.",
    examples: [
      "docs.github.com/copilot/...",
      "learn.microsoft.com/...",
      "cloud.google.com/gemini/docs/...",
    ],
  },
  {
    tier: 3,
    label: "Third-party certification registries",
    description:
      "ISO, CSA STAR, SOC report registries. Used to confirm certifications we cannot verify directly from the vendor's own page.",
    examples: ["iso.org/certification", "cloudsecurityalliance.org/star"],
  },
  {
    tier: 4,
    label: "Regulatory filings & incident reports",
    description:
      "EDPB decisions, DPA enforcement notices, CNIL/ICO opinions. Authoritative but narrow — used to capture verified incidents and regulatory findings.",
    examples: ["edpb.europa.eu", "cnil.fr/en/enforcement"],
  },
];

const pipeline = [
  {
    step: 1,
    title: "Source curation",
    body: "Each AI system gets a set of primary-source URLs. Tier-1 is mandatory. For every vendor we cover, we start with the trust portal, the DPA, the sub-processor list, the privacy policy, and the AI-specific policy page.",
  },
  {
    step: 2,
    title: "Snapshot & hash",
    body: "Every source URL is fetched (directly, or through a clean-Markdown proxy for JS-rendered pages), stripped to text, and SHA-256 hashed. The snapshot text and hash are stored in the database as an auditable record of what that page said at a given moment.",
  },
  {
    step: 3,
    title: "Verbatim claim extraction",
    body: "An LLM reads each snapshot and returns structured claims — but every claim must include a quote taken verbatim from the snippet. The server then re-checks that the quote actually appears in the raw text. Any claim whose quote cannot be grounded is dropped as a hallucination. Nothing gets through without evidence.",
  },
  {
    step: 4,
    title: "Human review before publish",
    body: "Extracted claims sit in a draft queue. An analyst reviews each one, can compare it against any prior published value, and either approves, edits, or rejects. Only approved claims appear on the public page — with a source chip linking back to the original URL and, where available, the specific verbatim quote that supports the claim.",
  },
  {
    step: 5,
    title: "Continuous diff detection",
    body: "The fetcher runs on a schedule. When a source page's hash changes, a review task is opened automatically, tagged with every published claim that referenced that page. Reviewers must re-verify the affected claims before they stay live. If a page becomes unreachable, a high-priority task is opened as well.",
  },
];

const guarantees = [
  {
    title: "No claim without a source",
    body: "Every visible value on a system page links to at least one source URL. If there's no source, there's no claim — we leave the field blank rather than guess.",
  },
  {
    title: "No quote we didn't find",
    body: "Evidence quotes are verified character-by-character against the stored snapshot text. The LLM cannot smuggle in a paraphrase or a vendor page it wasn't shown.",
  },
  {
    title: "No silent changes",
    body: "When a vendor updates their DPA or sub-processor list, the hash changes, a review task opens, and affected claims get re-verified. We do not backfill silently.",
  },
  {
    title: "No opaque AI writing",
    body: "The LLM is a retrieval-and-structuring tool. Every draft it produces is gated by a human reviewer and a verbatim-quote check. It is not used to generate opinions, scores, or marketing copy about vendors.",
  },
];

export default function SourcingMethodologyPage() {
  return (
    <>
      <Header />
      <main className="flex-1">
        {/* Hero */}
        <section className="bg-gradient-to-br from-[#0d1b3e] to-[#003399] text-white">
          <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 py-16 lg:py-24">
            <p className="text-sm font-semibold text-[#ffc107] tracking-wide uppercase">
              Methodology / Sourcing
            </p>
            <h1 className="mt-3 text-4xl font-bold tracking-tight sm:text-5xl">
              How we verify every claim
            </h1>
            <p className="mt-4 text-lg text-blue-100 leading-relaxed max-w-3xl">
              AI Compass EU's credibility depends on one thing: that every
              statement on this platform can be traced back to a primary
              vendor source, a specific quote, and a timestamped snapshot.
              The pipeline below is how we enforce that — mechanically, not
              on trust.
            </p>
          </div>
        </section>

        {/* The pipeline */}
        <section className="py-16 lg:py-24">
          <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
            <h2 className="text-2xl font-bold text-[#0d1b3e] sm:text-3xl">
              The evidence pipeline
            </h2>
            <p className="mt-4 text-gray-600 leading-relaxed max-w-3xl">
              Five stages, all auditable. The database keeps every
              intermediate artefact — source URL, raw text snapshot, content
              hash, extracted claim, verbatim quote, review decision —
              available to our analysts and, on request, to enterprise
              subscribers performing their own due diligence.
            </p>

            <ol className="mt-10 space-y-6">
              {pipeline.map((p) => (
                <li
                  key={p.step}
                  className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm"
                >
                  <div className="flex items-start gap-5">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#003399] text-base font-bold text-white">
                      {p.step}
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-[#0d1b3e]">
                        {p.title}
                      </h3>
                      <p className="mt-2 text-gray-700 leading-relaxed">
                        {p.body}
                      </p>
                    </div>
                  </div>
                </li>
              ))}
            </ol>
          </div>
        </section>

        {/* Source tiers */}
        <section className="bg-gray-50 py-16 lg:py-24">
          <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
            <h2 className="text-2xl font-bold text-[#0d1b3e] sm:text-3xl">
              Source tiers
            </h2>
            <p className="mt-4 text-gray-600 leading-relaxed max-w-3xl">
              Not all sources carry equal weight. We classify every source
              into one of four tiers and show the tier on every citation so
              you can judge the strength of the evidence yourself.
            </p>

            <div className="mt-10 grid gap-5 sm:grid-cols-2">
              {tiers.map((t) => (
                <div
                  key={t.tier}
                  className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm"
                >
                  <div className="flex items-baseline gap-3">
                    <span className="inline-flex h-8 min-w-8 items-center justify-center rounded-full bg-[#003399] px-3 text-sm font-bold text-white">
                      Tier {t.tier}
                    </span>
                    <h3 className="text-lg font-semibold text-[#0d1b3e]">
                      {t.label}
                    </h3>
                  </div>
                  <p className="mt-3 text-gray-700 leading-relaxed">
                    {t.description}
                  </p>
                  <ul className="mt-4 space-y-1 text-sm text-gray-500">
                    {t.examples.map((ex) => (
                      <li key={ex} className="font-mono">
                        {ex}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* What we guarantee */}
        <section className="py-16 lg:py-24">
          <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
            <h2 className="text-2xl font-bold text-[#0d1b3e] sm:text-3xl">
              What we guarantee
            </h2>
            <div className="mt-10 grid gap-5 sm:grid-cols-2">
              {guarantees.map((g) => (
                <div
                  key={g.title}
                  className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm"
                >
                  <h3 className="text-lg font-semibold text-[#0d1b3e]">
                    {g.title}
                  </h3>
                  <p className="mt-2 text-gray-700 leading-relaxed">
                    {g.body}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Corrections */}
        <section className="bg-[#0d1b3e] text-white py-16 lg:py-20">
          <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
            <h2 className="text-2xl font-bold sm:text-3xl">
              Found something wrong? Tell us.
            </h2>
            <p className="mt-4 text-blue-100 leading-relaxed max-w-3xl">
              If a claim on AI Compass EU is outdated, misquoted, or no
              longer matches the vendor's current policy, we want to know.
              Email{" "}
              <a
                href="mailto:corrections@ai-compass.eu"
                className="underline text-[#ffc107] hover:text-yellow-300"
              >
                corrections@ai-compass.eu
              </a>{" "}
              with the system, the claim, and a link to the current source.
              Vendors can also request review of claims about their own
              products via the same address.
            </p>
            <p className="mt-4 text-blue-100 leading-relaxed max-w-3xl">
              We publish corrections with the date they were made. Our
              credibility is in the audit trail, not in never being wrong.
            </p>

            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                href="../"
                className="inline-flex items-center rounded-lg bg-white text-[#003399] px-5 py-2.5 text-sm font-semibold hover:bg-gray-100"
              >
                ← Back to methodology
              </Link>
              <Link
                href="../../database"
                className="inline-flex items-center rounded-lg border border-white/30 px-5 py-2.5 text-sm font-semibold hover:bg-white/10"
              >
                Browse AI systems
              </Link>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
