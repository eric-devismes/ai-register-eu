import type { Metadata } from "next";
import Link from "next/link";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";

export const metadata: Metadata = {
  title: "Advisory Services",
  description:
    "Expert consulting for AI procurement, RFI/RFP writing, compliance assessments, and vendor selection. Tailored to European regulatory requirements.",
};

const services = [
  {
    title: "RFI / RFP Assistance",
    description:
      "We help you write procurement documents that embed the right EU compliance requirements from the start — so you evaluate vendors on what actually matters.",
    deliverables: [
      "Tailored RFI/RFP document with EU-specific compliance criteria",
      "Vendor shortlist based on our independent assessment data",
      "Evaluation scorecard aligned to your risk profile and industry",
      "Guidance on mandatory vs. desirable requirements",
    ],
    icon: (
      <svg className="h-7 w-7" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z" />
      </svg>
    ),
  },
  {
    title: "Compliance Assessment",
    description:
      "A focused audit of the AI systems your organisation already uses or plans to adopt — mapped against the regulations that apply to your sector.",
    deliverables: [
      "Per-system compliance scorecard (AI Act, GDPR, sector-specific)",
      "Gap analysis with prioritised remediation steps",
      "Risk classification review under the EU AI Act",
      "Executive summary for board-level reporting",
    ],
    icon: (
      <svg className="h-7 w-7" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75m-3-7.036A11.959 11.959 0 0 1 3.598 6 11.99 11.99 0 0 0 3 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285Z" />
      </svg>
    ),
  },
  {
    title: "Vendor Selection Advisory",
    description:
      "Expert guidance on choosing AI vendors that meet your regulatory, operational, and data sovereignty requirements — backed by our independent research.",
    deliverables: [
      "Curated vendor longlist matched to your use cases",
      "Comparative analysis across compliance dimensions",
      "Data residency and sovereignty assessment",
      "Negotiation guidance on DPA and contractual terms",
    ],
    icon: (
      <svg className="h-7 w-7" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 3v11.25A2.25 2.25 0 0 0 6 16.5h2.25M3.75 3h-1.5m1.5 0h16.5m0 0h1.5m-1.5 0v11.25A2.25 2.25 0 0 1 18 16.5h-2.25m-7.5 0h7.5m-7.5 0-1 3m8.5-3 1 3m0 0 .5 1.5m-.5-1.5h-9.5m0 0-.5 1.5M9 11.25v1.5M12 9v3.75m3-6v6" />
      </svg>
    ),
  },
];

const steps = [
  {
    step: "1",
    title: "Initial Consultation",
    description: "We discuss your organisation, sector, and what you need. Free 30-minute call to assess fit.",
  },
  {
    step: "2",
    title: "Scope & Proposal",
    description: "We define the engagement scope, timeline, and deliverables. You receive a fixed-price proposal.",
  },
  {
    step: "3",
    title: "Delivery",
    description: "We deliver the agreed outputs — RFI/RFP documents, assessment reports, or vendor shortlists.",
  },
  {
    step: "4",
    title: "Follow-Up",
    description: "We support you through vendor responses, evaluation, and any follow-up questions.",
  },
];

export default function ServicesPage({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  // We need params for the locale link but this is a static page
  // Use a wrapper to handle the async params
  return <ServicesContent params={params} />;
}

async function ServicesContent({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;

  return (
    <>
      <Header />
      <main className="flex-1">
        {/* Hero */}
        <section className="bg-gradient-to-br from-[#0d1b3e] to-[#003399] text-white">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16 lg:py-24">
            <div className="max-w-3xl">
              <p className="text-sm font-semibold text-[#ffc107] tracking-wide uppercase">
                Advisory Services
              </p>
              <h1 className="mt-3 text-4xl font-bold tracking-tight sm:text-5xl">
                Expert Support for AI Procurement &amp; Compliance
              </h1>
              <p className="mt-4 text-lg text-blue-100 leading-relaxed">
                Our independent research powers your decisions. We help European
                organisations write better RFIs, evaluate vendors objectively, and
                navigate the compliance landscape with confidence.
              </p>
            </div>
          </div>
        </section>

        {/* Service cards */}
        <section className="py-16 lg:py-24">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="grid gap-8 lg:grid-cols-3">
              {services.map((service) => (
                <div
                  key={service.title}
                  className="flex flex-col rounded-2xl border border-gray-200 bg-white p-8 shadow-sm transition hover:shadow-md"
                >
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#003399]/10 text-[#003399]">
                    {service.icon}
                  </div>
                  <h3 className="mt-5 text-xl font-bold text-[#0d1b3e]">
                    {service.title}
                  </h3>
                  <p className="mt-3 flex-1 text-sm text-gray-600 leading-relaxed">
                    {service.description}
                  </p>
                  <ul className="mt-6 space-y-2.5">
                    {service.deliverables.map((d) => (
                      <li key={d} className="flex items-start gap-2.5">
                        <svg
                          className="h-5 w-5 shrink-0 text-[#003399]/60"
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
                        <span className="text-sm text-gray-700">{d}</span>
                      </li>
                    ))}
                  </ul>
                  <Link
                    href={`/${lang}/contact?category=services`}
                    className="mt-8 inline-flex items-center justify-center rounded-lg bg-[#003399] px-6 py-3 text-sm font-semibold text-white transition hover:bg-[#002277]"
                  >
                    Discuss your needs
                    <svg
                      className="ml-2 h-4 w-4"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={2}
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3"
                      />
                    </svg>
                  </Link>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* How it works */}
        <section className="bg-gray-50 py-16 lg:py-24">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="mx-auto max-w-2xl text-center">
              <h2 className="text-2xl font-bold text-[#0d1b3e] sm:text-3xl">
                How It Works
              </h2>
              <p className="mt-4 text-gray-600 leading-relaxed">
                A straightforward process from first conversation to delivered results.
              </p>
            </div>

            <div className="mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
              {steps.map((item) => (
                <div key={item.step} className="text-center">
                  <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-[#003399] text-lg font-bold text-white shadow-sm">
                    {item.step}
                  </div>
                  <h3 className="mt-4 text-sm font-semibold text-[#0d1b3e]">
                    {item.title}
                  </h3>
                  <p className="mt-2 text-xs text-gray-600 leading-relaxed">
                    {item.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="bg-[#003399] py-16">
          <div className="mx-auto max-w-3xl px-4 text-center sm:px-6 lg:px-8">
            <h2 className="text-2xl font-bold text-white sm:text-3xl">
              Ready to Discuss Your AI Procurement Needs?
            </h2>
            <p className="mt-4 text-blue-100/80">
              The initial consultation is free. Tell us about your organisation
              and we&apos;ll propose a tailored engagement.
            </p>
            <Link
              href={`/${lang}/contact?category=services`}
              className="mt-8 inline-flex items-center rounded-lg bg-[#ffc107] px-8 py-3.5 text-sm font-semibold text-[#0d1b3e] transition hover:bg-[#ffcd38]"
            >
              Book a Free Consultation
              <svg
                className="ml-2 h-4 w-4"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={2}
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3"
                />
              </svg>
            </Link>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
