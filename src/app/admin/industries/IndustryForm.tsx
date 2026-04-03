"use client";

/**
 * IndustryForm — Form for creating and editing industries.
 *
 * Fields:
 *   - Name: industry name (e.g., "Financial Services")
 *   - Color Class: Tailwind CSS classes for the badge (e.g., "bg-blue-100 text-blue-700")
 *   - Icon Name: identifier for the frontend icon
 */

// Predefined color options to choose from
const COLOR_OPTIONS = [
  { label: "Blue",    value: "bg-blue-100 text-blue-700" },
  { label: "Green",   value: "bg-emerald-100 text-emerald-700" },
  { label: "Purple",  value: "bg-violet-100 text-violet-700" },
  { label: "Amber",   value: "bg-amber-100 text-amber-700" },
  { label: "Orange",  value: "bg-orange-100 text-orange-700" },
  { label: "Cyan",    value: "bg-cyan-100 text-cyan-700" },
  { label: "Yellow",  value: "bg-yellow-100 text-yellow-700" },
  { label: "Rose",    value: "bg-rose-100 text-rose-700" },
];

interface IndustryFormProps {
  industry?: {
    id: string;
    name: string;
    colorClass: string;
    iconName: string;
  };
  action: (formData: FormData) => Promise<void>;
}

export default function IndustryForm({ industry, action }: IndustryFormProps) {
  return (
    <form action={action} className="space-y-8">
      <fieldset className="rounded-xl border border-border-light bg-white p-6">
        <legend className="px-2 text-sm font-semibold text-text-primary">
          Industry Details
        </legend>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
          {/* Industry name */}
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-text-primary">Name</label>
            <input
              id="name" name="name" type="text" required
              defaultValue={industry?.name}
              placeholder="e.g. Financial Services"
              className="mt-1 block w-full rounded-lg border border-border px-4 py-2.5 text-sm focus:border-eu-blue focus:outline-none focus:ring-1 focus:ring-eu-blue"
            />
          </div>

          {/* Icon name */}
          <div>
            <label htmlFor="iconName" className="block text-sm font-medium text-text-primary">Icon Name</label>
            <input
              id="iconName" name="iconName" type="text"
              defaultValue={industry?.iconName || "building"}
              placeholder="e.g. banknotes, heart, shield"
              className="mt-1 block w-full rounded-lg border border-border px-4 py-2.5 text-sm focus:border-eu-blue focus:outline-none focus:ring-1 focus:ring-eu-blue"
            />
            <p className="mt-1 text-xs text-text-muted">
              Options: banknotes, heart, shield, building-library, cog, signal, bolt, users
            </p>
          </div>

          {/* Color class */}
          <div className="sm:col-span-2">
            <label htmlFor="colorClass" className="block text-sm font-medium text-text-primary">Badge Color</label>
            <select
              id="colorClass" name="colorClass"
              defaultValue={industry?.colorClass || COLOR_OPTIONS[0].value}
              className="mt-1 block w-full rounded-lg border border-border px-4 py-2.5 text-sm focus:border-eu-blue focus:outline-none focus:ring-1 focus:ring-eu-blue"
            >
              {COLOR_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>{opt.label}</option>
              ))}
            </select>
          </div>
        </div>
      </fieldset>

      <div className="flex items-center gap-4">
        <button type="submit" className="rounded-lg bg-eu-blue px-6 py-3 text-sm font-semibold text-white transition hover:bg-eu-blue-light">
          {industry ? "Save Changes" : "Create Industry"}
        </button>
        <a href="/admin/industries" className="text-sm text-text-secondary hover:text-text-primary">Cancel</a>
      </div>
    </form>
  );
}
