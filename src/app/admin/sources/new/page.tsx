import Link from "next/link";
import { createSource } from "../actions";

export default function NewSourcePage() {
  return (
    <>
      <h1 className="font-heading text-2xl font-bold text-text-primary">Add Approved Source</h1>
      <form action={createSource} className="mt-8 space-y-6">
        <fieldset className="rounded-xl border border-border-light bg-white p-6">
          <legend className="px-2 text-sm font-semibold text-text-primary">Source Details</legend>
          <div className="space-y-4">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-text-primary">Name</label>
              <input id="name" name="name" type="text" required placeholder="e.g. EU AI Act Official"
                className="mt-1 block w-full rounded-lg border border-border px-4 py-2.5 text-sm focus:border-eu-blue focus:outline-none focus:ring-1 focus:ring-eu-blue" />
            </div>
            <div>
              <label htmlFor="url" className="block text-sm font-medium text-text-primary">URL</label>
              <input id="url" name="url" type="url" required placeholder="https://artificialintelligenceact.eu"
                className="mt-1 block w-full rounded-lg border border-border px-4 py-2.5 text-sm focus:border-eu-blue focus:outline-none focus:ring-1 focus:ring-eu-blue" />
            </div>
            <div>
              <label htmlFor="description" className="block text-sm font-medium text-text-primary">Description</label>
              <input id="description" name="description" type="text" placeholder="Official EU AI Act text and analysis"
                className="mt-1 block w-full rounded-lg border border-border px-4 py-2.5 text-sm focus:border-eu-blue focus:outline-none focus:ring-1 focus:ring-eu-blue" />
            </div>
          </div>
        </fieldset>
        <div className="flex items-center gap-4">
          <button type="submit" className="rounded-lg bg-eu-blue px-6 py-3 text-sm font-semibold text-white transition hover:bg-eu-blue-light">Add Source</button>
          <Link href="/admin/sources" className="text-sm text-text-secondary hover:text-text-primary">Cancel</Link>
        </div>
      </form>
    </>
  );
}
