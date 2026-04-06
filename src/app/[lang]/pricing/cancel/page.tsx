import type { Metadata } from "next";
import Link from "next/link";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";

export const metadata: Metadata = {
  title: "Checkout Cancelled | AI Compass EU",
  description: "Your checkout was cancelled. No charges were made.",
};

export default function PricingCancelPage() {
  return (
    <>
      <Header />
      <main className="flex-1">
        <section className="py-24 lg:py-32">
          <div className="mx-auto max-w-2xl px-4 text-center sm:px-6 lg:px-8">
            <h1 className="text-3xl font-bold tracking-tight text-[#0d1b3e] sm:text-4xl">
              No Problem
            </h1>
            <p className="mt-4 text-lg leading-relaxed text-gray-600">
              Your checkout was cancelled and no charges were made. You can
              upgrade to Pro anytime when you are ready.
            </p>

            <div className="mt-10 flex items-center justify-center gap-4">
              <Link
                href="/en/pricing"
                className="inline-flex items-center rounded-lg bg-[#003399] px-6 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-[#002277]"
              >
                Back to Pricing
              </Link>
              <Link
                href="/en/database"
                className="inline-flex items-center rounded-lg px-6 py-3 text-sm font-semibold text-[#003399] ring-1 ring-inset ring-[#003399] transition hover:bg-[#003399]/5"
              >
                Browse Database
              </Link>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
