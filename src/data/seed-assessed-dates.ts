/**
 * Seed assessment dates on all systems.
 * Run: npx tsx src/data/seed-assessed-dates.ts
 */

import dotenv from "dotenv";
dotenv.config({ path: ".env.local" });

import { PrismaClient } from "../generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL! });
const prisma = new PrismaClient({ adapter });

const assessmentDates: Record<string, string> = {
  "microsoft-azure-openai-service": "2026-03-15",
  "google-vertex-ai": "2026-03-10",
  "anthropic-claude": "2026-03-12",
  "mistral-ai-mistral-large": "2026-03-18",
  "openai-gpt-4": "2026-03-08",
  "salesforce-einstein-gpt": "2026-02-20",
  "sap-business-ai": "2026-03-01",
  "servicenow-servicenow-now-assist": "2026-02-25",
  "workday-workday-ai": "2026-02-18",
  "palantir-palantir-aip": "2026-02-22",
  "fico-fico-platform": "2026-03-05",
  "ibm-watsonx": "2026-03-14",
  "uipath-ai-center": "2026-02-15",
  "verint-da-vinci-ai": "2026-02-10",
  "siemens-industrial-copilot": "2026-02-28",
  "philips-healthsuite-ai": "2026-03-02",
  "hirevue-ai-hiring": "2026-02-12",
  "personio-ai": "2026-02-08",
};

async function main() {
  console.log("Setting assessment dates...\n");

  for (const [slug, date] of Object.entries(assessmentDates)) {
    try {
      await prisma.aISystem.update({
        where: { slug },
        data: {
          assessedAt: new Date(date),
          assessmentNote: "Initial assessment based on publicly available documentation, vendor disclosures, and independent analysis.",
        },
      });
      console.log(`  ✓ ${slug}: ${date}`);
    } catch {
      console.log(`  ⚠ ${slug}: not found, skipping`);
    }
  }

  console.log("\nDone!");
}

main()
  .catch((e) => { console.error("Failed:", e); process.exit(1); })
  .finally(() => prisma.$disconnect());
