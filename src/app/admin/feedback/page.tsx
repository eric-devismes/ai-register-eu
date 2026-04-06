/**
 * Admin Feedback Page — View and manage contact form submissions.
 */

export const dynamic = "force-dynamic";

import Link from "next/link";
import { prisma } from "@/lib/db";

export default async function AdminFeedback() {
  const feedback = await prisma.feedback.findMany({
    orderBy: { createdAt: "desc" },
  });

  const totalCount = feedback.length;
  const newCount = feedback.filter((f) => f.status === "new").length;
  const readCount = feedback.filter((f) => f.status === "read").length;
  const respondedCount = feedback.filter((f) => f.status === "responded").length;

  return (
    <>
      <div className="flex items-center justify-between">
        <h1 className="font-heading text-2xl font-bold text-text-primary">Feedback</h1>
        <Link href="/admin" className="text-sm font-medium text-eu-blue hover:text-eu-blue-light">
          Back to Dashboard
        </Link>
      </div>

      {/* Stats cards */}
      <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-4">
        <div className="rounded-xl border border-border-light bg-white p-6">
          <p className="text-sm text-text-secondary">Total</p>
          <p className="mt-1 text-3xl font-bold text-text-primary">{totalCount}</p>
        </div>
        <div className="rounded-xl border border-border-light bg-white p-6">
          <p className="text-sm text-text-secondary">New</p>
          <p className="mt-1 text-3xl font-bold text-eu-blue">{newCount}</p>
        </div>
        <div className="rounded-xl border border-border-light bg-white p-6">
          <p className="text-sm text-text-secondary">Read</p>
          <p className="mt-1 text-3xl font-bold text-text-primary">{readCount}</p>
        </div>
        <div className="rounded-xl border border-border-light bg-white p-6">
          <p className="text-sm text-text-secondary">Responded</p>
          <p className="mt-1 text-3xl font-bold text-text-primary">{respondedCount}</p>
        </div>
      </div>

      {/* Feedback table */}
      <div className="mt-8 overflow-hidden rounded-xl border border-border-light bg-white">
        {feedback.length === 0 ? (
          <div className="p-8 text-center text-sm text-text-secondary">
            No feedback submissions yet.
          </div>
        ) : (
          <table className="w-full text-left text-sm">
            <thead className="border-b border-border-lighter bg-surface-alt text-xs uppercase tracking-wider text-text-muted">
              <tr>
                <th className="px-6 py-3">Date</th>
                <th className="px-6 py-3">Name</th>
                <th className="px-6 py-3">Email</th>
                <th className="px-6 py-3">Category</th>
                <th className="px-6 py-3">Subject</th>
                <th className="px-6 py-3">Status</th>
                <th className="px-6 py-3">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border-lighter">
              {feedback.map((item) => (
                <tr key={item.id} className="hover:bg-surface-alt/50">
                  <td className="px-6 py-4 text-xs text-text-muted">
                    {item.createdAt.toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 font-medium text-text-primary">{item.name}</td>
                  <td className="px-6 py-4 text-text-secondary">{item.email}</td>
                  <td className="px-6 py-4">
                    <span className="inline-block rounded-full bg-surface-alt px-2 py-0.5 text-xs font-medium text-text-secondary">
                      {item.category}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-text-primary">{item.subject}</td>
                  <td className="px-6 py-4">
                    <StatusBadge status={item.status} />
                  </td>
                  <td className="px-6 py-4">
                    <StatusToggle id={item.id} currentStatus={item.status} />
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

function StatusBadge({ status }: { status: string }) {
  const styles =
    status === "new"
      ? "bg-blue-100 text-blue-700"
      : status === "responded"
        ? "bg-green-100 text-green-700"
        : "bg-gray-100 text-gray-600";

  return (
    <span className={`inline-block rounded-full px-2 py-0.5 text-xs font-semibold ${styles}`}>
      {status}
    </span>
  );
}

function StatusToggle({ id, currentStatus }: { id: string; currentStatus: string }) {
  const nextStatus =
    currentStatus === "new" ? "read" : currentStatus === "read" ? "responded" : "new";

  return (
    <form action={`/api/feedback/${id}/status`} method="POST">
      <input type="hidden" name="status" value={nextStatus} />
      <button
        type="submit"
        className="rounded-lg px-3 py-1 text-xs font-medium text-eu-blue ring-1 ring-inset ring-eu-blue/30 transition hover:bg-eu-blue/5"
      >
        Mark {nextStatus}
      </button>
    </form>
  );
}
