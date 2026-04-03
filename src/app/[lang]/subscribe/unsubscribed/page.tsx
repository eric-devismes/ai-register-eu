import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import Link from "next/link";

export default function UnsubscribedPage() {
  return (
    <>
      <Header />
      <main className="flex-1 bg-white">
        <div className="mx-auto max-w-md px-4 py-24 text-center">
          <h1 className="text-2xl font-bold text-gray-900">Unsubscribed</h1>
          <p className="mt-3 text-gray-600">
            You will no longer receive digest emails from AI Compass EU.
            Your account and preferences are still saved.
          </p>
          <p className="mt-6 text-sm text-gray-400">
            Want to re-enable digests? <Link href="/account" className="text-[#003399] hover:underline">Manage your account</Link>.
          </p>
        </div>
      </main>
      <Footer />
    </>
  );
}
