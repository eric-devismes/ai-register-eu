import type { Metadata } from "next";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";

export const metadata: Metadata = {
  title: "About AI Compass EU",
  description:
    "AI Compass EU is an independent, vendor-neutral platform providing AI compliance intelligence for European decision-makers. Learn about our mission and team.",
};

const values = [
  {
    title: "Independent & Vendor-Neutral",
    description:
      "We accept no sponsorship, advertising, or vendor payments that could influence our ratings. Our revenue comes solely from subscriptions.",
  },
  {
    title: "Transparency First",
    description:
      "Every score we publish can be traced to verifiable evidence. Our methodology is fully documented and open to scrutiny.",
  },
  {
    title: "European Perspective",
    description:
      "Built in Europe, for Europe. We understand the regulatory landscape, cultural nuances, and multilingual requirements of the EU market.",
  },
  {
    title: "Rigorous & Evidence-Based",
    description:
      "Assessments are conducted by domain experts using standardized rubrics, not automated scraping or self-reported vendor claims.",
  },
];

export default function AboutPage() {
  return (
    <>
      <Header />
      <main className="flex-1">
        {/* Hero */}
        <section className="bg-gradient-to-br from-[#0d1b3e] to-[#003399] text-white">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16 lg:py-24">
            <div className="max-w-3xl">
              <p className="text-sm font-semibold text-[#ffc107] tracking-wide uppercase">
                About Us
              </p>
              <h1 className="mt-3 text-4xl font-bold tracking-tight sm:text-5xl">
                AI Intelligence for European Decision-Makers
              </h1>
              <p className="mt-4 text-lg text-blue-100 leading-relaxed">
                AI Compass EU is the independent, vendor-neutral platform that
                helps European organizations understand, evaluate, and deploy AI
                systems in compliance with EU regulations.
              </p>
            </div>
          </div>
        </section>

        {/* Mission */}
        <section className="py-16 lg:py-24">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="mx-auto max-w-3xl">
              <h2 className="text-2xl font-bold text-[#0d1b3e] sm:text-3xl">
                Our Mission
              </h2>
              <p className="mt-4 text-gray-600 leading-relaxed">
                The European AI landscape is evolving rapidly. With the EU AI Act
                in force and a growing patchwork of sector-specific regulations,
                organizations face unprecedented complexity in choosing and
                deploying AI systems responsibly.
              </p>
              <p className="mt-4 text-gray-600 leading-relaxed">
                AI Compass EU was founded to bring clarity to this complexity. We
                provide independent compliance intelligence — transparent
                ratings, regulatory analysis, and practical guidance — so that
                decision-makers can act with confidence.
              </p>
            </div>

            {/* Values */}
            <div className="mt-16">
              <h2 className="text-center text-2xl font-bold text-[#0d1b3e] sm:text-3xl">
                Our Values
              </h2>
              <div className="mt-10 grid gap-8 sm:grid-cols-2">
                {values.map((value) => (
                  <div
                    key={value.title}
                    className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm"
                  >
                    <div className="h-1 w-10 rounded-full bg-[#ffc107]" />
                    <h3 className="mt-4 text-lg font-semibold text-[#0d1b3e]">
                      {value.title}
                    </h3>
                    <p className="mt-2 text-sm text-gray-600 leading-relaxed">
                      {value.description}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Coming Soon */}
            <div className="mt-16 mx-auto max-w-2xl text-center">
              <div className="inline-flex items-center gap-2 rounded-full bg-[#ffc107]/10 px-4 py-1.5 text-sm font-medium text-[#b38600]">
                <span className="relative flex h-2 w-2">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#ffc107] opacity-75" />
                  <span className="relative inline-flex h-2 w-2 rounded-full bg-[#ffc107]" />
                </span>
                Coming Soon
              </div>
              <h2 className="mt-6 text-2xl font-bold text-[#0d1b3e] sm:text-3xl">
                Full Team Profiles Launching Soon
              </h2>
              <p className="mt-4 text-gray-600 leading-relaxed">
                Detailed profiles of our advisory board, research team, and
                domain experts will be published here. Stay tuned.
              </p>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
