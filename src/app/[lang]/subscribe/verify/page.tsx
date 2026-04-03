/**
 * Magic link verification handler.
 * This page is hit when the user clicks the link in their email.
 * The actual verification is done by the API route — this page just shows status.
 */

import Link from "next/link";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";

export default function VerifyPage() {
  // The API route /api/subscribe/verify handles the actual verification
  // and redirects to /account on success or back here on failure.
  return (
    <>
      <Header />
      <main className="flex-1 bg-white">
        <div className="mx-auto max-w-md px-4 py-24 text-center">
          <h1 className="text-2xl font-bold text-gray-900">Verifying your email...</h1>
          <p className="mt-3 text-gray-600">
            If you are not redirected automatically,{" "}
            <Link href="/subscribe" className="text-[#003399] hover:underline">click here to try again</Link>.
          </p>
        </div>
      </main>
      <Footer />
    </>
  );
}
