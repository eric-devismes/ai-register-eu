/**
 * Prisma Database Client (Singleton)
 *
 * Creates a single database connection that is reused across
 * the entire application. In development, it's stored on `globalThis`
 * to prevent hot-reload from creating multiple connections.
 *
 * Prisma 7 requires a "driver adapter" for database connections.
 * We use @prisma/adapter-pg for PostgreSQL.
 *
 * Usage: import { prisma } from "@/lib/db";
 */

import { PrismaClient } from "@/generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

// Store the client on globalThis to survive hot-reloads in development
const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

/**
 * Create a new Prisma client with the PostgreSQL adapter.
 * The connection string comes from the DATABASE_URL env var.
 */
function createPrismaClient() {
  const adapter = new PrismaPg({
    connectionString: process.env.DATABASE_URL!,
  });
  return new PrismaClient({ adapter });
}

// Reuse existing client or create a new one
export const prisma = globalForPrisma.prisma ?? createPrismaClient();

// In development, save the client to prevent duplicate connections
if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;
