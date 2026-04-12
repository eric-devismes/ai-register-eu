import type { Metadata } from "next";
import Link from "next/link";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";

export const metadata: Metadata = {
  title: "Welcome to Pro!",
  description: "Your Pro subscription is now active.",
};

export default function PricingSuccessPage() {
  return (
    <>
      <Header />
      <main className="flex-1">
        <section className="py-24 lg:py-32">
          <div className="mx-auto max-w-2xl px-4 text-center sm:px-6 lg:px-8">
            {/* Green check icon */}
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
              <svg
                className="h-8 w-8 text-green-600"
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
            </div>

            <h1 className="mt-6 text-3xl font-bold tracking-tight text-[#0d1b3e] sm:text-4xl">
              Welcome to Pro!
            </h1>
            <p className="mt-4 text-lg leading-relaxed text-gray-600">
              Your subscription is active. You now have unlimited access to all
              AI compliance assessments.
            </p>

            <div className="mt-10">
              <Link
                href="/en/database"
                className="inline-flex items-center rounded-lg bg-[#003399] px-6 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-[#002277]"
              >
                Explore the Database
              </Link>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
