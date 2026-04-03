/**
 * Edit Section Page
 */
export const dynamic = "force-dynamic";

import { notFound } from "next/navigation";
import Link from "next/link";
import { prisma } from "@/lib/db";
import { updateSection } from "../../actions";

interface PageProps { params: Promise<{ id: string; sectionId: string }> }

export default async function EditSectionPage({ params }: PageProps) {
  const { id, sectionId } = await params;

  const [framework, section] = await Promise.all([
    prisma.regulatoryFramework.findUnique({ where: { id } }),
    prisma.frameworkSection.findUnique({ where: { id: sectionId } }),
  ]);
  if (!framework || !section) notFound();

  const updateWithIds = updateSection.bind(null, sectionId, id);

  return (
    <>
      <nav className="mb-4 text-sm text-text-muted">
        <Link href="/admin/frameworks" className="hover:text-eu-blue">Frameworks</Link>
        <span className="mx-2">/</span>
        <Link href={`/admin/frameworks/${id}/sections`} className="hover:text-eu-blue">{framework.name}</Link>
        <span className="mx-2">/</span>
        <span>Edit Section</span>
      </nav>

      <h1 className="font-heading text-2xl font-bold text-text-primary">Edit: {section.title}</h1>

      <form action={updateWithIds} className="mt-8 space-y-6">
        <fieldset className="rounded-xl border border-border-light bg-white p-6">
          <legend className="px-2 text-sm font-semibold text-text-primary">Section Details</legend>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
            <div className="sm:col-span-2">
              <label htmlFor="title" className="block text-sm font-medium text-text-primary">Title</label>
              <input id="title" name="title" type="text" required defaultValue={section.title}
                className="mt-1 block w-full rounded-lg border border-border px-4 py-2.5 text-sm focus:border-eu-blue focus:outline-none focus:ring-1 focus:ring-eu-blue" />
            </div>
            <div className="sm:col-span-2">
              <label htmlFor="description" className="block text-sm font-medium text-text-primary">Description</label>
              <textarea id="description" name="description" rows={3} defaultValue={section.description}
                className="mt-1 block w-full rounded-lg border border-border px-4 py-2.5 text-sm focus:border-eu-blue focus:outline-none focus:ring-1 focus:ring-eu-blue" />
            </div>
            <div>
              <label htmlFor="sortOrder" className="block text-sm font-medium text-text-primary">Sort Order</label>
              <input id="sortOrder" name="sortOrder" type="number" defaultValue={section.sortOrder}
                className="mt-1 block w-full rounded-lg border border-border px-4 py-2.5 text-sm focus:border-eu-blue focus:outline-none focus:ring-1 focus:ring-eu-blue" />
            </div>
          </div>
        </fieldset>
        <div className="flex items-center gap-4">
          <button type="submit" className="rounded-lg bg-eu-blue px-6 py-3 text-sm font-semibold text-white transition hover:bg-eu-blue-light">Save Changes</button>
          <Link href={`/admin/frameworks/${id}/sections`} className="text-sm text-text-secondary hover:text-text-primary">Cancel</Link>
        </div>
      </form>
    </>
  );
}
