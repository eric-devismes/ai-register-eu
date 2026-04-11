import Link from "next/link";

export default function NotFound() {
  return (
    <html lang="en" className="h-full antialiased">
      <body className="min-h-full flex flex-col bg-gray-50">
        <main className="flex flex-1 flex-col items-center justify-center px-4 py-24 text-center">
          <div className="inline-flex h-20 w-20 items-center justify-center rounded-full bg-[#003399]/10 mb-6">
            <svg className="h-10 w-10 text-[#003399]" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15.182 16.318A4.486 4.486 0 0 0 12.016 15a4.486 4.486 0 0 0-3.198 1.318M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0ZM9.75 9.75c0 .414-.168.75-.375.75S9 10.164 9 9.75 9.168 9 9.375 9s.375.336.375.75Zm-.375 0h.008v.015h-.008V9.75Zm5.625 0c0 .414-.168.75-.375.75s-.375-.336-.375-.75.168-.75.375-.75.375.336.375.75Zm-.375 0h.008v.015h-.008V9.75Z" />
            </svg>
          </div>
          <p className="text-sm font-semibold text-[#003399] uppercase tracking-wider">404 — Page not found</p>
          <h1 className="mt-3 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
            This page doesn&apos;t exist
          </h1>
          <p className="mt-4 max-w-md text-gray-600">
            The page you&apos;re looking for may have been moved or doesn&apos;t exist.
            Try one of these instead:
          </p>

          <div className="mt-8 grid grid-cols-1 sm:grid-cols-3 gap-3 max-w-xl w-full">
            <Link href="/en/database"
              className="rounded-lg border border-gray-200 bg-white px-4 py-3 text-sm hover:border-[#003399] hover:shadow-sm transition">
              <p className="font-semibold text-gray-900">AI Database</p>
              <p className="text-xs text-gray-500">Browse 100+ AI systems</p>
            </Link>
            <Link href="/en/regulations"
              className="rounded-lg border border-gray-200 bg-white px-4 py-3 text-sm hover:border-[#003399] hover:shadow-sm transition">
              <p className="font-semibold text-gray-900">Regulations</p>
              <p className="text-xs text-gray-500">EU AI Act, GDPR, DORA</p>
            </Link>
            <Link href="/en/compare"
              className="rounded-lg border border-gray-200 bg-white px-4 py-3 text-sm hover:border-[#003399] hover:shadow-sm transition">
              <p className="font-semibold text-gray-900">Compare</p>
              <p className="text-xs text-gray-500">Side-by-side analysis</p>
            </Link>
          </div>

          <Link
            href="/en"
            className="mt-8 inline-flex items-center gap-2 rounded-lg bg-[#003399] px-6 py-3 text-sm font-semibold text-white transition hover:bg-[#003399]/90"
          >
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5 3 12m0 0 7.5-7.5M3 12h18" />
            </svg>
            Back to homepage
          </Link>
        </main>
      </body>
    </html>
  );
}
