/**
 * New Regulatory Framework Page
 */

import { getAllIndustries } from "@/lib/queries";
import FrameworkForm from "../FrameworkForm";
import { createFramework } from "../actions";

export default async function NewFrameworkPage() {
  const industries = await getAllIndustries();

  return (
    <>
      <h1 className="font-heading text-2xl font-bold text-text-primary">
        Add Regulatory Framework
      </h1>
      <p className="mt-1 text-sm text-text-secondary">
        Create a new framework. After saving, you can add sections and policy statements.
      </p>
      <div className="mt-8">
        <FrameworkForm
          industries={industries.map((i) => ({ id: i.id, name: i.name }))}
          action={createFramework}
        />
      </div>
    </>
  );
}
