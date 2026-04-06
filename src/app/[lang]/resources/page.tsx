import type { Metadata } from "next";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";

export const metadata: Metadata = {
  title: "Resources",
  description:
    "Essential resources for AI compliance in Europe. Official regulatory texts, guidance documents, and practical tools for EU AI Act, GDPR, DORA, and more.",
};

const officialSources = [
  {
    title: "EU AI Act — Full Text",
    description:
      "Regulation (EU) 2024/1689 laying down harmonised rules on artificial intelligence.",
    url: "https://eur-lex.europa.eu/eli/reg/2024/1689/oj",
    badge: "EU AI Act",
  },
  {
    title: "EU AI Office",
    description:
      "The European Commission body overseeing AI Act implementation, codes of practice, and guidance.",
    url: "https://digital-strategy.ec.europa.eu/en/policies/european-approach-artificial-intelligence",
    badge: "EU Commission",
  },
  {
    title: "GDPR — Official Text",
    description:
      "General Data Protection Regulation — the primary data protection law governing AI systems processing personal data in the EU.",
    url: "https://eur-lex.europa.eu/eli/reg/2016/679/oj",
    badge: "GDPR",
  },
  {
    title: "ENISA — AI Cybersecurity",
    description:
      "The EU Agency for Cybersecurity's guidance on securing AI systems, threat landscapes, and risk frameworks.",
    url: "https://www.enisa.europa.eu/topics/artificial-intelligence",
    badge: "Security",
  },
  {
    title: "DORA — Digital Operational Resilience",
    description:
      "Regulation on digital operational resilience for the financial sector, covering AI-driven services.",
    url: "https://eur-lex.europa.eu/eli/reg/2022/2554/oj",
    badge: "Financial",
  },
  {
    title: "High-Level Expert Group on AI",
    description:
      "Ethics guidelines, assessment lists, and policy recommendations from the European Commission's AI expert group.",
    url: "https://digital-strategy.ec.europa.eu/en/policies/expert-group-ai",
    badge: "Ethics",
  },
  {
    title: "OECD AI Policy Observatory",
    description:
      "International AI policies, metrics, and country-level implementation tracking relevant to EU member states.",
    url: "https://oecd.ai/en/",
    badge: "International",
  },
  {
    title: "NIS2 Directive — Cybersecurity",
    description:
      "The EU's updated network and information security directive affecting AI-dependent critical infrastructure.",
    url: "https://eur-lex.europa.eu/eli/dir/2022/2555/oj",
    badge: "Security",
  },
];

const BADGE_COLORS: Record<string, string> = {
  "EU AI Act": "bg-blue-100 text-blue-700",
  "EU Commission": "bg-blue-100 text-blue-700",
  "GDPR": "bg-purple-100 text-purple-700",
  "Security": "bg-red-100 text-red-700",
  "Financial": "bg-amber-100 text-amber-700",
  "Ethics": "bg-green-100 text-green-700",
  "International": "bg-gray-100 text-gray-700",
};

export default function ResourcesPage() {
  return (
    <>
      <Header />
      <main className="flex-1">
        {/* Hero */}
        <section className="bg-gradient-to-br from-[#0d1b3e] to-[#003399] text-white">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16 lg:py-24">
            <div className="max-w-3xl">
              <p className="text-sm font-semibold text-[#ffc107] tracking-wide uppercase">
                Resources
              </p>
              <h1 className="mt-3 text-4xl font-bold tracking-tight sm:text-5xl">
                Essential Reading
              </h1>
              <p className="mt-4 text-lg text-blue-100 leading-relaxed">
                Primary sources and official guidance documents for AI compliance
                in Europe. We use these references in our own assessments and
                recommend them as starting points for any compliance effort.
              </p>
            </div>
          </div>
        </section>

        {/* Official sources */}
        <section className="py-16 lg:py-24">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="mx-auto max-w-2xl text-center">
              <h2 className="text-2xl font-bold text-[#0d1b3e] sm:text-3xl">
                Official Sources &amp; Guidance
              </h2>
              <p className="mt-4 text-gray-600 leading-relaxed">
                Direct links to the regulatory texts, EU agency publications, and
                expert group outputs that underpin European AI governance.
              </p>
            </div>

            <div className="mt-12 grid gap-6 sm:grid-cols-2">
              {officialSources.map((source) => (
                <a
                  key={source.title}
                  href={source.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group flex flex-col rounded-xl border border-gray-200 bg-white p-6 shadow-sm transition hover:border-[#003399]/30 hover:shadow-md"
                >
                  <div className="flex items-start justify-between">
                    <h3 className="text-lg font-semibold text-[#0d1b3e] group-hover:text-[#003399] transition-colors">
                      {source.title}
                    </h3>
                    <span
                      className={`shrink-0 rounded-full px-2.5 py-0.5 text-xs font-medium ${BADGE_COLORS[source.badge] || "bg-gray-100 text-gray-700"}`}
                    >
                      {source.badge}
                    </span>
                  </div>
                  <p className="mt-2 flex-1 text-sm text-gray-600 leading-relaxed">
                    {source.description}
                  </p>
                  <span className="mt-4 inline-flex items-center text-sm font-semibold text-[#003399]">
                    Visit source
                    <svg
                      className="ml-1 h-4 w-4"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={2}
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M13.5 6H5.25A2.25 2.25 0 0 0 3 8.25v10.5A2.25 2.25 0 0 0 5.25 21h10.5A2.25 2.25 0 0 0 18 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25"
                      />
                    </svg>
                  </span>
                </a>
              ))}
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
