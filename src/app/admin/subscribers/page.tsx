/**
 * Admin Subscribers Page — Read-only view of subscriber accounts.
 * GDPR: Users manage their own data; admin can only view.
 */

export const dynamic = "force-dynamic";

import Link from "next/link";
import { prisma } from "@/lib/db";

export default async function AdminSubscribers() {
  const subscribers = await prisma.subscriber.findMany({
    orderBy: { createdAt: "desc" },
  });

  const totalCount = subscribers.length;
  const verifiedCount = subscribers.filter((s) => s.verified).length;
  const digestCount = subscribers.filter((s) => s.digestEnabled).length;
  const proCount = subscribers.filter((s) => s.tier === "pro").length;

  return (
    <>
      <div className="flex items-center justify-between">
        <h1 className="font-heading text-2xl font-bold text-text-primary">Subscribers</h1>
        <Link href="/admin" className="text-sm font-medium text-eu-blue hover:text-eu-blue-light">
          Back to Dashboard
        </Link>
      </div>

      {/* Stats cards */}
      <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-4">
        <div className="rounded-xl border border-border-light bg-white p-6">
          <p className="text-sm text-text-secondary">Total Subscribers</p>
          <p className="mt-1 text-3xl font-bold text-text-primary">{totalCount}</p>
        </div>
        <div className="rounded-xl border border-border-light bg-white p-6">
          <p className="text-sm text-text-secondary">Verified</p>
          <p className="mt-1 text-3xl font-bold text-eu-blue">{verifiedCount}</p>
        </div>
        <div className="rounded-xl border border-border-light bg-white p-6">
          <p className="text-sm text-text-secondary">Digest Enabled</p>
          <p className="mt-1 text-3xl font-bold text-text-primary">{digestCount}</p>
        </div>
        <div className="rounded-xl border border-border-light bg-white p-6">
          <p className="text-sm text-text-secondary">Pro Tier</p>
          <p className="mt-1 text-3xl font-bold text-text-primary">{proCount}</p>
        </div>
      </div>

      {/* Note about GDPR */}
      <div className="mt-6 rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-800">
        <strong>GDPR Notice:</strong> This view is read-only. Subscribers manage their own data
        through self-service account settings and unsubscribe links.
      </div>

      {/* Subscribers table */}
      <div className="mt-6 overflow-hidden rounded-xl border border-border-light bg-white">
        {subscribers.length === 0 ? (
          <div className="p-8 text-center text-sm text-text-secondary">
            No subscribers yet.
          </div>
        ) : (
          <table className="w-full text-left text-sm">
            <thead className="border-b border-border-lighter bg-surface-alt text-xs uppercase tracking-wider text-text-muted">
              <tr>
                <th className="px-6 py-3">Email</th>
                <th className="px-6 py-3">Verified</th>
                <th className="px-6 py-3">Tier</th>
                <th className="px-6 py-3">Digest</th>
                <th className="px-6 py-3">Consent Date</th>
                <th className="px-6 py-3">Created</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border-lighter">
              {subscribers.map((sub) => (
                <tr key={sub.id} className="hover:bg-surface-alt/50">
                  <td className="px-6 py-4 font-medium text-text-primary">{sub.email}</td>
                  <td className="px-6 py-4">
                    {sub.verified ? (
                      <span className="text-green-600" title="Verified">&#10003;</span>
                    ) : (
                      <span className="text-red-500" title="Not verified">&#10007;</span>
                    )}
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`inline-block rounded-full px-2 py-0.5 text-xs font-semibold ${
                        sub.tier === "pro"
                          ? "bg-blue-100 text-blue-700"
                          : sub.tier === "team"
                            ? "bg-purple-100 text-purple-700"
                            : "bg-gray-100 text-gray-600"
                      }`}
                    >
                      {sub.tier}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-text-secondary">
                    {sub.digestEnabled ? sub.digestFrequency : "off"}
                  </td>
                  <td className="px-6 py-4 text-xs text-text-muted">
                    {sub.consentDate ? sub.consentDate.toLocaleDateString() : "—"}
                  </td>
                  <td className="px-6 py-4 text-xs text-text-muted">
                    {sub.createdAt.toLocaleDateString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </>
  );
}
