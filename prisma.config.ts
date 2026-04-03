/**
 * Prisma Configuration
 *
 * In Prisma 7, the database connection URL moved from schema.prisma
 * to this config file. This keeps secrets out of the schema file.
 *
 * We load .env.local (Next.js convention) for the DATABASE_URL.
 */

import dotenv from "dotenv";
import { defineConfig, env } from "prisma/config";

// Load .env.local first, then .env as fallback
dotenv.config({ path: ".env.local" });
dotenv.config({ path: ".env" });

export default defineConfig({
  schema: "prisma/schema.prisma",
  datasource: {
    url: env("DATABASE_URL"),
  },
});
