import Link from "next/link";

export default function NotFound() {
  return (
    <html lang="en" className="h-full antialiased">
      <body className="min-h-full flex flex-col">
        <main className="flex flex-1 flex-col items-center justify-center px-4 py-24 text-center">
          <p className="text-sm font-semibold text-[#003399]">404</p>
          <h1 className="mt-2 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
            Page not found
          </h1>
          <p className="mt-4 text-gray-600">
            The page you&apos;re looking for doesn&apos;t exist or has been moved.
          </p>
          <Link
            href="/en"
            className="mt-8 inline-flex items-center rounded-lg bg-[#003399] px-6 py-3 text-sm font-semibold text-white transition hover:bg-[#003399]/90"
          >
            Back to homepage
          </Link>
        </main>
      </body>
    </html>
  );
}
