/**
 * Seed: Create the owner admin account.
 *
 * Creates a single "owner" admin user with the same password as the
 * current ADMIN_PASSWORD_HASH env var, migrating from env-var auth
 * to DB-backed auth.
 *
 * Run: npx tsx src/data/seed-admin-owner.ts
 *
 * After running, the owner can log in with their email + existing password.
 * The owner can then add more admin users from the admin panel.
 */

import dotenv from "dotenv";
dotenv.config({ path: ".env.local" });

import { PrismaClient } from "../generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL! });
const prisma = new PrismaClient({ adapter });

async function main() {
  const email = "eric@vendorscope.eu";
  const name = "Eric de Vismes";
  const passwordHash = process.env.ADMIN_PASSWORD_HASH || "";
  const totpSecret = process.env.TOTP_SECRET || "";

  if (!passwordHash) {
    console.error("ADMIN_PASSWORD_HASH not set in .env.local");
    process.exit(1);
  }

  console.log("Creating owner admin account...\n");

  const admin = await prisma.adminUser.upsert({
    where: { email },
    update: {
      name,
      passwordHash,
      totpSecret,
      totpEnabled: !!totpSecret,
      role: "owner",
      active: true,
    },
    create: {
      email,
      name,
      passwordHash,
      totpSecret,
      totpEnabled: !!totpSecret,
      role: "owner",
      active: true,
    },
  });

  console.log(`  ✓ Owner: ${admin.email} (${admin.name})`);
  console.log(`    Role: ${admin.role}`);
  console.log(`    TOTP: ${admin.totpEnabled ? "enabled" : "not set up"}`);
  console.log(`\n✅ Done. Log in at /admin/login with your email + existing password.`);
}

main()
  .catch((e) => { console.error("Seed failed:", e); process.exit(1); })
  .finally(() => prisma.$disconnect());
