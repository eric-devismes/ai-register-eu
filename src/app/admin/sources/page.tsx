/**
 * Admin Approved Sources — Manage external URLs the chatbot can reference.
 */

export const dynamic = "force-dynamic";

import Link from "next/link";
import { prisma } from "@/lib/db";
import { deleteSource } from "./actions";

export default async function SourcesPage() {
  const sources = await prisma.approvedSource.findMany({ orderBy: { name: "asc" } });

  return (
    <>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-heading text-2xl font-bold text-text-primary">Approved Sources</h1>
          <p className="mt-1 text-sm text-text-secondary">External URLs the chatbot can reference when answering questions.</p>
        </div>
        <Link href="/admin/sources/new"
          className="inline-flex items-center gap-2 rounded-lg bg-eu-blue px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-eu-blue-light">
          Add Source
        </Link>
      </div>

      <div className="mt-6 overflow-hidden rounded-xl border border-border-light bg-white">
        {sources.length === 0 ? (
          <div className="p-12 text-center text-sm text-text-secondary">No approved sources yet.</div>
        ) : (
          <table className="w-full text-left text-sm">
            <thead className="border-b border-border-lighter bg-surface-alt text-xs uppercase tracking-wider text-text-muted">
              <tr>
                <th className="px-6 py-3">Name</th>
                <th className="px-6 py-3">URL</th>
                <th className="px-6 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border-lighter">
              {sources.map((src) => (
                <tr key={src.id}>
                  <td className="px-6 py-4 font-medium text-text-primary">{src.name}</td>
                  <td className="px-6 py-4 text-xs text-text-muted">{src.url}</td>
                  <td className="px-6 py-4 text-right">
                    <form action={deleteSource.bind(null, src.id)}>
                      <button type="submit" className="text-xs text-red-600 hover:underline">Remove</button>
                    </form>
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
