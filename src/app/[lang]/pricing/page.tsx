import type { Metadata } from "next";
import Link from "next/link";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { PricingCards } from "./PricingCards";
import { getPageMetadata, type Locale } from "@/lib/i18n";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string }>;
}): Promise<Metadata> {
  const { lang } = await params;
  return getPageMetadata(lang as Locale, "pricing");
}

const services = [
  {
    title: "RFI / RFP Assistance",
    description:
      "Procurement documents with EU compliance requirements built in from the start.",
    icon: "M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z",
  },
  {
    title: "Compliance Assessment",
    description:
      "Audit your AI systems against AI Act, GDPR, and sector-specific regulations.",
    icon: "M9 12.75 11.25 15 15 9.75m-3-7.036A11.959 11.959 0 0 1 3.598 6 11.99 11.99 0 0 0 3 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285Z",
  },
  {
    title: "Vendor Selection Advisory",
    description:
      "Expert guidance choosing AI vendors that meet your regulatory and data sovereignty requirements.",
    icon: "M3.75 3v11.25A2.25 2.25 0 0 0 6 16.5h2.25M3.75 3h-1.5m1.5 0h16.5m0 0h1.5m-1.5 0v11.25A2.25 2.25 0 0 1 18 16.5h-2.25m-7.5 0h7.5m-7.5 0-1 3m8.5-3 1 3m0 0 .5 1.5m-.5-1.5h-9.5m0 0-.5 1.5M9 11.25v1.5M12 9v3.75m3-6v6",
  },
];

export default function PricingPage({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  return <PricingContent params={params} />;
}

async function PricingContent({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;

  return (
    <>
      <Header />
      <main className="flex-1">
        {/* Hero */}
        <section className="bg-gradient-to-br from-[#0d1b3e] to-[#003399] text-white">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16 lg:py-24">
            <div className="mx-auto max-w-3xl text-center">
              <p className="text-sm font-semibold text-[#ffc107] tracking-wide uppercase">
                Plans &amp; Services
              </p>
              <h1 className="mt-3 text-4xl font-bold tracking-tight sm:text-5xl">
                AI Compliance Intelligence &amp; Advisory
              </h1>
              <p className="mt-4 text-lg text-blue-100 leading-relaxed">
                Start free with our AI chatbot and compliance data.
                Upgrade to Pro for full access, or get enterprise-grade
                procurement intelligence and compliance tools.
              </p>
            </div>
          </div>
        </section>

        {/* Pricing tiers */}
        <PricingCards />

        {/* Advisory Services */}
        <section className="bg-gray-50 py-16 lg:py-20">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="mx-auto max-w-2xl text-center mb-12">
              <p className="text-sm font-semibold text-[#003399] tracking-wide uppercase">
                Advisory Services
              </p>
              <h2 className="mt-2 text-2xl font-bold text-[#0d1b3e] sm:text-3xl">
                Expert Support for Your AI Decisions
              </h2>
              <p className="mt-3 text-gray-600">
                Available as standalone engagements or included in Enterprise plans.
              </p>
            </div>

            <div className="grid gap-6 lg:grid-cols-3">
              {services.map((service) => (
                <div
                  key={service.title}
                  className="rounded-xl border border-gray-200 bg-white p-6 hover:shadow-sm transition-shadow"
                >
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#003399]/10 text-[#003399]">
                    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" d={service.icon} />
                    </svg>
                  </div>
                  <h3 className="mt-4 text-base font-bold text-[#0d1b3e]">{service.title}</h3>
                  <p className="mt-2 text-sm text-gray-600">{service.description}</p>
                </div>
              ))}
            </div>

            <div className="mt-10 text-center">
              <Link
                href={`/${lang}/contact?category=services`}
                className="inline-flex items-center rounded-lg bg-[#003399] px-6 py-3 text-sm font-semibold text-white hover:bg-[#002277] transition-colors"
              >
                Get in Touch
                <svg className="ml-2 h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
                </svg>
              </Link>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
