/**
 * Statements List — Shows all policy statements for a section.
 */

export const dynamic = "force-dynamic";

import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/db";
import { DeleteStatementButton } from "../../DeleteButton";

interface PageProps {
  params: Promise<{ id: string; sectionId: string }>;
}

export default async function StatementsPage({ params }: PageProps) {
  const { id, sectionId } = await params;

  const [framework, section] = await Promise.all([
    prisma.regulatoryFramework.findUnique({ where: { id } }),
    prisma.frameworkSection.findUnique({
      where: { id: sectionId },
      include: { statements: { orderBy: { sortOrder: "asc" } } },
    }),
  ]);

  if (!framework || !section) notFound();

  return (
    <>
      <nav className="mb-4 text-sm text-text-muted">
        <Link href="/admin/frameworks" className="hover:text-eu-blue">Frameworks</Link>
        <span className="mx-2">/</span>
        <Link href={`/admin/frameworks/${id}/sections`} className="hover:text-eu-blue">{framework.name}</Link>
        <span className="mx-2">/</span>
        <span>{section.title}</span>
      </nav>

      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-heading text-2xl font-bold text-text-primary">Policy Statements</h1>
          <p className="mt-1 text-sm text-text-secondary">
            Section: <strong>{section.title}</strong>
          </p>
        </div>
        <Link href={`/admin/frameworks/${id}/sections/${sectionId}/statements/new`}
          className="inline-flex items-center gap-2 rounded-lg bg-eu-blue px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-eu-blue-light">
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
          </svg>
          Add Statement
        </Link>
      </div>

      <div className="mt-6 space-y-4">
        {section.statements.length === 0 ? (
          <div className="rounded-xl border-2 border-dashed border-border-light p-12 text-center text-sm text-text-secondary">
            No policy statements yet. Add your first one.
          </div>
        ) : (
          section.statements.map((stmt, idx) => (
            <div key={stmt.id} className="rounded-xl border border-border-light bg-white p-5">
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3">
                    <span className="text-xs font-semibold text-text-muted">#{idx + 1}</span>
                    {stmt.reference && (
                      <span className="rounded bg-eu-blue/10 px-2 py-0.5 text-xs font-semibold text-eu-blue">
                        {stmt.reference}
                      </span>
                    )}
                  </div>
                  <p className="mt-2 text-sm font-medium text-text-primary">{stmt.statement}</p>
                  {stmt.commentary && (
                    <div className="mt-2 rounded-lg bg-amber-50 border border-amber-100 px-3 py-2">
                      <p className="text-xs text-amber-800"><strong>Commentary:</strong> {stmt.commentary}</p>
                    </div>
                  )}
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <Link href={`/admin/frameworks/${id}/sections/${sectionId}/statements/${stmt.id}/edit`}
                    className="rounded-lg px-3 py-1.5 text-xs font-medium text-eu-blue hover:bg-navy-50">Edit</Link>
                  <DeleteStatementButton statementId={stmt.id} sectionId={sectionId} frameworkId={id} />
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      <div className="mt-6">
        <Link href={`/admin/frameworks/${id}/sections`}
          className="text-sm text-text-secondary hover:text-text-primary">&larr; Back to sections</Link>
      </div>
    </>
  );
}
