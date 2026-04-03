import IndustryForm from "../IndustryForm";
import { createIndustry } from "../actions";

export default function NewIndustryPage() {
  return (
    <>
      <h1 className="font-heading text-2xl font-bold text-text-primary">Add Industry</h1>
      <p className="mt-1 text-sm text-text-secondary">Create a new industry sector. AI systems can then be linked to it.</p>
      <div className="mt-8">
        <IndustryForm action={createIndustry} />
      </div>
    </>
  );
}
