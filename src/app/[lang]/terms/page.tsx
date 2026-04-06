import type { Metadata } from "next";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";

export const metadata: Metadata = {
  title: "Terms of Service",
  description:
    "Terms of Service for AI Compass EU. Conditions governing your use of the platform, its data, ratings, and services.",
};

export default function TermsPage() {
  return (
    <>
      <Header />
      <main className="flex-1">
        <section className="bg-gradient-to-br from-[#0d1b3e] to-[#003399] text-white">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16 lg:py-24">
            <div className="max-w-3xl">
              <p className="text-sm font-semibold text-[#ffc107] tracking-wide uppercase">
                Legal
              </p>
              <h1 className="mt-3 text-4xl font-bold tracking-tight sm:text-5xl">
                Terms of Service
              </h1>
              <p className="mt-4 text-lg text-blue-100 leading-relaxed">
                Last updated: 6 April 2026
              </p>
            </div>
          </div>
        </section>

        <section className="py-16 lg:py-24">
          <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 prose prose-gray">
            <h2 className="text-xl font-bold text-[#0d1b3e]">1. Acceptance of Terms</h2>
            <p className="mt-3 text-gray-600 leading-relaxed">
              By accessing or using AI Compass EU (&quot;the Platform&quot;), you agree to be
              bound by these Terms of Service. If you do not agree to these terms, please
              do not use the Platform.
            </p>

            <h2 className="mt-10 text-xl font-bold text-[#0d1b3e]">2. Description of Service</h2>
            <p className="mt-3 text-gray-600 leading-relaxed">
              AI Compass EU provides compliance intelligence for AI systems in the
              European market, including ratings, regulatory analysis, and educational
              resources. The Platform is intended for informational purposes only and does
              not constitute legal, regulatory, or professional advice.
            </p>

            <h2 className="mt-10 text-xl font-bold text-[#0d1b3e]">3. Ratings and Assessments</h2>
            <p className="mt-3 text-gray-600 leading-relaxed">
              Our ratings reflect our independent assessment based on publicly available
              information at the time of evaluation. Ratings are not guarantees of
              compliance and should not be used as the sole basis for procurement or
              regulatory decisions. We update assessments periodically but cannot guarantee
              real-time accuracy.
            </p>

            <h2 className="mt-10 text-xl font-bold text-[#0d1b3e]">4. User Accounts</h2>
            <p className="mt-3 text-gray-600 leading-relaxed">
              You may create a subscriber account using your email address. You are
              responsible for maintaining the confidentiality of your account access. You
              may delete your account and all associated data at any time through your
              account settings page.
            </p>

            <h2 className="mt-10 text-xl font-bold text-[#0d1b3e]">5. Acceptable Use</h2>
            <p className="mt-3 text-gray-600 leading-relaxed">
              You agree not to: (a) use the Platform for any unlawful purpose; (b) attempt
              to gain unauthorized access to the Platform&apos;s systems; (c) scrape, crawl, or
              use automated tools to bulk-extract data beyond what is available via our
              public pages; (d) misrepresent AI Compass EU ratings as your own analysis.
            </p>

            <h2 className="mt-10 text-xl font-bold text-[#0d1b3e]">6. Intellectual Property</h2>
            <p className="mt-3 text-gray-600 leading-relaxed">
              All content, ratings, methodology documentation, and original materials on
              the Platform are the intellectual property of AI Compass EU. You may cite our
              ratings with proper attribution. Republishing substantial portions of our
              content requires written permission.
            </p>

            <h2 className="mt-10 text-xl font-bold text-[#0d1b3e]">7. Limitation of Liability</h2>
            <p className="mt-3 text-gray-600 leading-relaxed">
              AI Compass EU is provided &quot;as is&quot; without warranties of any kind. We are not
              liable for any damages arising from your use of or reliance on the
              Platform&apos;s content, ratings, or services. Our total liability shall not
              exceed the amount you paid us in the 12 months preceding the claim.
            </p>

            <h2 className="mt-10 text-xl font-bold text-[#0d1b3e]">8. Changes to Terms</h2>
            <p className="mt-3 text-gray-600 leading-relaxed">
              We may update these Terms of Service from time to time. Continued use of the
              Platform after changes constitutes acceptance of the new terms. We will
              notify registered subscribers of material changes via email.
            </p>

            <h2 className="mt-10 text-xl font-bold text-[#0d1b3e]">9. Governing Law</h2>
            <p className="mt-3 text-gray-600 leading-relaxed">
              These terms are governed by the laws of the European Union and the Member
              State in which AI Compass EU is established. Disputes shall be resolved in
              the competent courts of that jurisdiction.
            </p>

            <h2 className="mt-10 text-xl font-bold text-[#0d1b3e]">10. Contact</h2>
            <p className="mt-3 text-gray-600 leading-relaxed">
              For questions about these terms, contact us at{" "}
              <a
                href="mailto:contact@aicompass.eu"
                className="font-semibold text-[#003399] hover:underline"
              >
                contact@aicompass.eu
              </a>
              .
            </p>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
