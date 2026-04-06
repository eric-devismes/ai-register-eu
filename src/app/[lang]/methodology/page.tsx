import type { Metadata } from "next";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";

export const metadata: Metadata = {
  title: "Methodology",
  description:
    "AI Compass EU's transparent scoring methodology. Learn how we assess AI systems across 8 compliance dimensions with evidence-based, reproducible criteria.",
};

const dimensions = [
  {
    number: 1,
    name: "EU AI Act Readiness",
    color: "#003399",
    criteria: [
      "Risk classification accuracy and documentation",
      "Conformity assessment completion status",
      "Technical documentation and record-keeping",
      "Post-market monitoring procedures",
    ],
  },
  {
    number: 2,
    name: "GDPR Compliance",
    color: "#0055cc",
    criteria: [
      "Lawful basis for data processing",
      "Data subject rights implementation",
      "Data Protection Impact Assessment (DPIA)",
      "International transfer mechanisms",
    ],
  },
  {
    number: 3,
    name: "Data Sovereignty",
    color: "#003399",
    criteria: [
      "EU/EEA data residency options",
      "Jurisdictional data control guarantees",
      "Sub-processor location transparency",
      "Data portability and deletion capabilities",
    ],
  },
  {
    number: 4,
    name: "Transparency & Explainability",
    color: "#0055cc",
    criteria: [
      "Model documentation and data sheets",
      "Decision explainability mechanisms",
      "Audit trail completeness",
      "User-facing transparency measures",
    ],
  },
  {
    number: 5,
    name: "Security & Robustness",
    color: "#003399",
    criteria: [
      "Cybersecurity certifications and practices",
      "Adversarial robustness testing",
      "Incident response procedures",
      "NIS2 Directive alignment",
    ],
  },
  {
    number: 6,
    name: "Bias & Fairness",
    color: "#0055cc",
    criteria: [
      "Bias testing across protected characteristics",
      "Fairness metrics and thresholds",
      "Ongoing monitoring and remediation",
      "Training data diversity documentation",
    ],
  },
  {
    number: 7,
    name: "Human Oversight",
    color: "#003399",
    criteria: [
      "Human-in-the-loop capability design",
      "Override and intervention mechanisms",
      "Meaningful human control provisions",
      "Operator training and documentation",
    ],
  },
  {
    number: 8,
    name: "Multilingual Quality",
    color: "#0055cc",
    criteria: [
      "Coverage of EU official languages",
      "Performance parity across languages",
      "Cultural appropriateness testing",
      "Localization quality assurance",
    ],
  },
];

const processSteps = [
  {
    step: "Evidence Collection",
    description:
      "We gather public documentation, vendor disclosures, certifications, and independent audit reports for each AI system.",
  },
  {
    step: "Expert Assessment",
    description:
      "Domain experts evaluate each dimension using standardized rubrics with defined scoring criteria and evidence requirements.",
  },
  {
    step: "Peer Review",
    description:
      "A second assessor independently reviews the scoring, and any disagreements are resolved through structured deliberation.",
  },
  {
    step: "Score Calculation",
    description:
      "Weighted dimension scores are aggregated into an overall compliance score on a 0-100 scale, with confidence indicators.",
  },
  {
    step: "Continuous Updates",
    description:
      "Scores are re-evaluated when regulations change, vendors update their practices, or new evidence becomes available.",
  },
];

export default function MethodologyPage() {
  return (
    <>
      <Header />
      <main className="flex-1">
        {/* Hero */}
        <section className="bg-gradient-to-br from-[#0d1b3e] to-[#003399] text-white">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16 lg:py-24">
            <div className="max-w-3xl">
              <p className="text-sm font-semibold text-[#ffc107] tracking-wide uppercase">
                Methodology
              </p>
              <h1 className="mt-3 text-4xl font-bold tracking-tight sm:text-5xl">
                Transparent Scoring Methodology
              </h1>
              <p className="mt-4 text-lg text-blue-100 leading-relaxed">
                Every rating on AI Compass EU is built on a transparent,
                evidence-based methodology. Our 8 assessment dimensions cover the
                full spectrum of European AI compliance requirements.
              </p>
            </div>
          </div>
        </section>

        {/* Assessment Process */}
        <section className="py-16 lg:py-24 bg-gray-50">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="mx-auto max-w-2xl text-center">
              <h2 className="text-2xl font-bold text-[#0d1b3e] sm:text-3xl">
                Our Assessment Process
              </h2>
              <p className="mt-4 text-gray-600 leading-relaxed">
                A rigorous, multi-step process ensures consistency, accuracy, and
                fairness across all assessments.
              </p>
            </div>

            <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-5">
              {processSteps.map((item, index) => (
                <div key={item.step} className="relative text-center">
                  <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-[#003399] text-lg font-bold text-white shadow-sm">
                    {index + 1}
                  </div>
                  <h3 className="mt-4 text-sm font-semibold text-[#0d1b3e]">
                    {item.step}
                  </h3>
                  <p className="mt-2 text-xs text-gray-600 leading-relaxed">
                    {item.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* 8 Dimensions */}
        <section className="py-16 lg:py-24">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="mx-auto max-w-2xl text-center">
              <h2 className="text-2xl font-bold text-[#0d1b3e] sm:text-3xl">
                8 Assessment Dimensions
              </h2>
              <p className="mt-4 text-gray-600 leading-relaxed">
                Each AI system is evaluated across 8 weighted dimensions, with
                specific criteria and evidence requirements for every score.
              </p>
            </div>

            <div className="mt-12 grid gap-6 sm:grid-cols-2">
              {dimensions.map((dim) => (
                <div
                  key={dim.name}
                  className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm"
                >
                  <div className="flex items-center gap-3">
                    <span
                      className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-sm font-bold text-white"
                      style={{ backgroundColor: dim.color }}
                    >
                      {dim.number}
                    </span>
                    <h3 className="text-lg font-semibold text-[#0d1b3e]">
                      {dim.name}
                    </h3>
                  </div>
                  <ul className="mt-4 space-y-2">
                    {dim.criteria.map((criterion) => (
                      <li
                        key={criterion}
                        className="flex items-start gap-2 text-sm text-gray-600"
                      >
                        <svg
                          className="h-4 w-4 shrink-0 mt-0.5 text-[#003399]/40"
                          fill="none"
                          viewBox="0 0 24 24"
                          strokeWidth={2}
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="m4.5 12.75 6 6 9-13.5"
                          />
                        </svg>
                        {criterion}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>

            {/* Grading scale */}
            <div className="mt-16 mx-auto max-w-2xl text-center">
              <h2 className="text-2xl font-bold text-[#0d1b3e] sm:text-3xl">
                Grading Scale
              </h2>
              <p className="mt-4 text-gray-600 leading-relaxed">
                Each dimension receives a letter grade from A+ (exemplary) to F
                (non-compliant). Grades are weighted by dimension importance and
                aggregated into an overall compliance score. All ratings include
                source references so you can verify the evidence yourself.
              </p>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
