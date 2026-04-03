/**
 * New AI System Page
 *
 * Fetches all published frameworks and industries from the database,
 * then renders the form with dynamic score dropdowns and industry checkboxes.
 */

import { getAllFrameworks, getAllIndustries } from "@/lib/queries";
import SystemForm from "../SystemForm";
import { createSystem } from "../actions";

export default async function NewSystemPage() {
  // Fetch frameworks and industries for the form
  const [frameworks, industries] = await Promise.all([
    getAllFrameworks(),
    getAllIndustries(),
  ]);

  return (
    <>
      <h1 className="font-heading text-2xl font-bold text-text-primary">
        Add New AI System
      </h1>
      <p className="mt-1 text-sm text-text-secondary">
        Fill in the details below. Compliance scores will appear as colored badges on the website.
      </p>
      <div className="mt-8">
        <SystemForm
          frameworks={frameworks.map((f) => ({ id: f.id, name: f.name }))}
          industries={industries.map((i) => ({ id: i.id, name: i.name }))}
          action={createSystem}
        />
      </div>
    </>
  );
}
