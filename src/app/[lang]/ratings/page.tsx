import type { Metadata } from "next";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";

export const metadata: Metadata = {
  title: "Ratings & Methodology",
  description:
    "How AI Compass EU scores AI systems across compliance dimensions. Transparent, reproducible methodology for EU AI Act readiness, GDPR, data sovereignty, and more.",
};

const dimensions = [
  {
    name: "EU AI Act Readiness",
    weight: "20%",
    description:
      "Risk classification accuracy, conformity assessment status, and documentation completeness.",
  },
  {
    name: "GDPR Compliance",
    weight: "15%",
    description:
      "Data processing lawfulness, data subject rights, DPIAs, and cross-border transfer mechanisms.",
  },
  {
    name: "Data Sovereignty",
    weight: "15%",
    description:
      "Data residency options, EU hosting availability, and jurisdictional data control guarantees.",
  },
  {
    name: "Transparency & Explainability",
    weight: "12.5%",
    description:
      "Model documentation, decision explainability, audit trails, and algorithmic transparency.",
  },
  {
    name: "Security & Robustness",
    weight: "12.5%",
    description:
      "Cybersecurity measures, adversarial robustness, incident response, and NIS2 alignment.",
  },
  {
    name: "Bias & Fairness",
    weight: "10%",
    description:
      "Bias testing, fairness metrics, non-discrimination measures, and ongoing monitoring practices.",
  },
  {
    name: "Human Oversight",
    weight: "7.5%",
    description:
      "Human-in-the-loop capabilities, override mechanisms, and meaningful human control provisions.",
  },
  {
    name: "Multilingual Quality",
    weight: "7.5%",
    description:
      "Performance across EU official languages, localization quality, and cultural appropriateness.",
  },
];

export default function RatingsPage() {
  return (
    <>
      <Header />
      <main className="flex-1">
        {/* Hero */}
        <section className="bg-gradient-to-br from-[#0d1b3e] to-[#003399] text-white">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16 lg:py-24">
            <div className="max-w-3xl">
              <p className="text-sm font-semibold text-[#ffc107] tracking-wide uppercase">
                Ratings &amp; Methodology
              </p>
              <h1 className="mt-3 text-4xl font-bold tracking-tight sm:text-5xl">
                How We Score AI Systems
              </h1>
              <p className="mt-4 text-lg text-blue-100 leading-relaxed">
                Our compliance scores are built on a transparent, reproducible
                methodology across 8 weighted dimensions. Every rating can be
                traced back to verifiable evidence.
              </p>
            </div>
          </div>
        </section>

        {/* Coming Soon */}
        <section className="py-16 lg:py-24">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="mx-auto max-w-2xl text-center">
              <div className="inline-flex items-center gap-2 rounded-full bg-[#ffc107]/10 px-4 py-1.5 text-sm font-medium text-[#b38600]">
                <span className="relative flex h-2 w-2">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#ffc107] opacity-75" />
                  <span className="relative inline-flex h-2 w-2 rounded-full bg-[#ffc107]" />
                </span>
                Coming Soon
              </div>
              <h2 className="mt-6 text-2xl font-bold text-[#0d1b3e] sm:text-3xl">
                Full Scoring Details In Development
              </h2>
              <p className="mt-4 text-gray-600 leading-relaxed">
                Detailed rubrics, scoring criteria, evidence requirements, and
                worked examples for each dimension are being finalized for
                publication.
              </p>
            </div>

            {/* Scoring dimensions */}
            <div className="mt-12 space-y-4">
              {dimensions.map((dim, index) => (
                <div
                  key={dim.name}
                  className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm"
                >
                  <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                    <div className="flex items-start gap-4">
                      <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#003399] text-sm font-bold text-white">
                        {index + 1}
                      </span>
                      <div>
                        <h3 className="text-lg font-semibold text-[#0d1b3e]">
                          {dim.name}
                        </h3>
                        <p className="mt-1 text-sm text-gray-600 leading-relaxed">
                          {dim.description}
                        </p>
                      </div>
                    </div>
                    <span className="inline-flex shrink-0 items-center rounded-full bg-[#003399]/10 px-3 py-1 text-sm font-semibold text-[#003399]">
                      {dim.weight}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
