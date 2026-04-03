/**
 * Sections List — Shows all sections for a framework, ordered by sortOrder.
 * Each section links to its statements list.
 */

export const dynamic = "force-dynamic";

import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/db";
import { DeleteSectionButton } from "./DeleteButton";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function SectionsPage({ params }: PageProps) {
  const { id } = await params;

  const framework = await prisma.regulatoryFramework.findUnique({
    where: { id },
    include: {
      sections: {
        orderBy: { sortOrder: "asc" },
        include: { _count: { select: { statements: true } } },
      },
    },
  });

  if (!framework) notFound();

  return (
    <>
      <nav className="mb-4 text-sm text-text-muted">
        <Link href="/admin/frameworks" className="hover:text-eu-blue">Frameworks</Link>
        <span className="mx-2">/</span>
        <Link href={`/admin/frameworks/${id}/edit`} className="hover:text-eu-blue">{framework.name}</Link>
        <span className="mx-2">/</span>
        <span>Sections</span>
      </nav>

      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-heading text-2xl font-bold text-text-primary">
            Sections &amp; Policies
          </h1>
          <p className="mt-1 text-sm text-text-secondary">
            Manage structured sections and policy statements for <strong>{framework.name}</strong>.
          </p>
        </div>
        <Link href={`/admin/frameworks/${id}/sections/new`}
          className="inline-flex items-center gap-2 rounded-lg bg-eu-blue px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-eu-blue-light">
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
          </svg>
          Add Section
        </Link>
      </div>

      <div className="mt-6 space-y-4">
        {framework.sections.length === 0 ? (
          <div className="rounded-xl border-2 border-dashed border-border-light p-12 text-center text-sm text-text-secondary">
            No sections yet. Add your first section to start documenting this regulation.
          </div>
        ) : (
          framework.sections.map((section, idx) => (
            <div key={section.id} className="rounded-xl border border-border-light bg-white p-6">
              <div className="flex items-start justify-between">
                <div>
                  <span className="text-xs font-semibold text-text-muted">Section {idx + 1} (order: {section.sortOrder})</span>
                  <h3 className="mt-1 text-lg font-bold text-text-primary">{section.title}</h3>
                  {section.description && (
                    <p className="mt-1 text-sm text-text-secondary">{section.description}</p>
                  )}
                  <p className="mt-2 text-xs text-text-muted">
                    {section._count.statements} policy {section._count.statements === 1 ? "statement" : "statements"}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <Link href={`/admin/frameworks/${id}/sections/${section.id}/statements`}
                    className="rounded-lg bg-eu-blue/10 px-3 py-1.5 text-xs font-medium text-eu-blue hover:bg-eu-blue/20">
                    Manage Statements
                  </Link>
                  <Link href={`/admin/frameworks/${id}/sections/${section.id}/edit`}
                    className="rounded-lg px-3 py-1.5 text-xs font-medium text-eu-blue hover:bg-navy-50">
                    Edit
                  </Link>
                  <DeleteSectionButton sectionId={section.id} frameworkId={id} title={section.title} />
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      <div className="mt-6">
        <Link href={`/admin/frameworks/${id}/edit`}
          className="text-sm text-text-secondary hover:text-text-primary">&larr; Back to framework</Link>
      </div>
    </>
  );
}
