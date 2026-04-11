/**
 * POST /api/checklist
 *
 * Returns compliance checklist data for selected framework combination.
 * Pure data assembly — no LLM needed. Pulls framework sections and
 * policy statements from the database.
 *
 * Body: { frameworks: string[] }  — array of framework slugs
 * Returns: { frameworks: Array<{ slug, name, sections: Array<{ title, statements }> }> }
 */

import { NextResponse } from "next/server";
import { getFrameworksWithSections } from "@/lib/queries";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { frameworks: slugs } = body as { frameworks: string[] };

    if (!slugs || !Array.isArray(slugs) || slugs.length === 0) {
      return NextResponse.json(
        { error: "Please select at least one framework." },
        { status: 400 }
      );
    }

    if (slugs.length > 6) {
      return NextResponse.json(
        { error: "Maximum 6 frameworks per checklist." },
        { status: 400 }
      );
    }

    const frameworks = await getFrameworksWithSections(slugs);

    if (frameworks.length === 0) {
      return NextResponse.json(
        { error: "No matching frameworks found." },
        { status: 404 }
      );
    }

    // Shape the response
    const result = frameworks.map((fw) => ({
      slug: fw.slug,
      name: fw.name,
      badgeType: fw.badgeType,
      sections: fw.sections.map((sec) => ({
        id: sec.id,
        title: sec.title,
        description: sec.description,
        statements: sec.statements.map((stmt) => ({
          id: stmt.id,
          reference: stmt.reference,
          statement: stmt.statement,
          commentary: stmt.commentary,
        })),
      })),
    }));

    return NextResponse.json({ frameworks: result });
  } catch {
    return NextResponse.json(
      { error: "Failed to generate checklist." },
      { status: 500 }
    );
  }
}
