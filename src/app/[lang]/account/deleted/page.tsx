import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import Link from "next/link";

export default function AccountDeletedPage() {
  return (
    <>
      <Header />
      <main className="flex-1 bg-white">
        <div className="mx-auto max-w-md px-4 py-24 text-center">
          <h1 className="text-2xl font-bold text-gray-900">Account Deleted</h1>
          <p className="mt-3 text-gray-600">
            Your account and all associated data have been permanently deleted from our systems.
            This action cannot be undone.
          </p>
          <Link href="/" className="mt-8 inline-block rounded-lg bg-[#003399] px-6 py-3 text-sm font-semibold text-white hover:bg-[#003399]/90">
            Return to homepage
          </Link>
        </div>
      </main>
      <Footer />
    </>
  );
}
