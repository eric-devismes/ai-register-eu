import type { Metadata } from "next";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";

export const metadata: Metadata = {
  title: "Contact",
  description:
    "Get in touch with AI Compass EU for questions, partnership enquiries, corrections, or press requests.",
};

export default function ContactPage() {
  return (
    <>
      <Header />
      <main className="flex-1">
        <section className="bg-gradient-to-br from-[#0d1b3e] to-[#003399] text-white">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16 lg:py-24">
            <div className="max-w-3xl">
              <p className="text-sm font-semibold text-[#ffc107] tracking-wide uppercase">
                Contact
              </p>
              <h1 className="mt-3 text-4xl font-bold tracking-tight sm:text-5xl">
                Get in Touch
              </h1>
              <p className="mt-4 text-lg text-blue-100 leading-relaxed">
                We welcome questions, feedback, and partnership enquiries.
              </p>
            </div>
          </div>
        </section>

        <section className="py-16 lg:py-24">
          <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
            <div className="grid gap-8 sm:grid-cols-2">
              <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
                <h2 className="text-lg font-semibold text-[#0d1b3e]">
                  General Enquiries
                </h2>
                <p className="mt-2 text-sm text-gray-600 leading-relaxed">
                  Questions about the platform, methodology, or your account.
                </p>
                <a
                  href="mailto:contact@aicompass.eu"
                  className="mt-4 inline-flex items-center text-sm font-semibold text-[#003399] hover:underline"
                >
                  contact@aicompass.eu
                </a>
              </div>

              <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
                <h2 className="text-lg font-semibold text-[#0d1b3e]">
                  Rating Corrections
                </h2>
                <p className="mt-2 text-sm text-gray-600 leading-relaxed">
                  If you believe a rating contains an error or outdated
                  information, let us know with supporting evidence.
                </p>
                <a
                  href="mailto:corrections@aicompass.eu"
                  className="mt-4 inline-flex items-center text-sm font-semibold text-[#003399] hover:underline"
                >
                  corrections@aicompass.eu
                </a>
              </div>

              <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
                <h2 className="text-lg font-semibold text-[#0d1b3e]">
                  Partnerships
                </h2>
                <p className="mt-2 text-sm text-gray-600 leading-relaxed">
                  For collaboration, research partnerships, or institutional
                  licensing enquiries.
                </p>
                <a
                  href="mailto:partnerships@aicompass.eu"
                  className="mt-4 inline-flex items-center text-sm font-semibold text-[#003399] hover:underline"
                >
                  partnerships@aicompass.eu
                </a>
              </div>

              <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
                <h2 className="text-lg font-semibold text-[#0d1b3e]">Press</h2>
                <p className="mt-2 text-sm text-gray-600 leading-relaxed">
                  Media enquiries, interview requests, and press materials.
                </p>
                <a
                  href="mailto:press@aicompass.eu"
                  className="mt-4 inline-flex items-center text-sm font-semibold text-[#003399] hover:underline"
                >
                  press@aicompass.eu
                </a>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
