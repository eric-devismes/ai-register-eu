/**
 * API Authentication — Bearer token auth for Enterprise REST API.
 *
 * Enterprise subscribers authenticate with:
 *   Authorization: Bearer <subscriber-jwt>
 *
 * This reuses the same JWT tokens used for browser sessions.
 * Future: add dedicated API keys for programmatic access.
 */

import { jwtVerify } from "jose";
import { prisma } from "@/lib/db";
import type { SubscriptionTier } from "@/lib/tier-access";

const JWT_SECRET = new TextEncoder().encode(process.env.JWT_SECRET || "");

interface ApiAuthResult {
  authenticated: boolean;
  tier: SubscriptionTier;
  subscriberId: string | null;
  error?: string;
}

/**
 * Authenticate an API request from the Authorization header.
 * Returns the subscriber's tier and ID if valid.
 */
export async function authenticateApiRequest(request: Request): Promise<ApiAuthResult> {
  const authHeader = request.headers.get("authorization");

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return {
      authenticated: false,
      tier: "free",
      subscriberId: null,
      error: "Missing or invalid Authorization header. Use: Bearer <token>",
    };
  }

  const token = authHeader.slice(7);

  try {
    const { payload } = await jwtVerify(token, JWT_SECRET);
    if (payload.type !== "subscriber" || !payload.sub) {
      return {
        authenticated: false,
        tier: "free",
        subscriberId: null,
        error: "Invalid token type",
      };
    }

    const subscriber = await prisma.subscriber.findUnique({
      where: { id: payload.sub },
      select: { id: true, tier: true, verified: true },
    });

    if (!subscriber || !subscriber.verified) {
      return {
        authenticated: false,
        tier: "free",
        subscriberId: null,
        error: "Subscriber not found or not verified",
      };
    }

    return {
      authenticated: true,
      tier: subscriber.tier as SubscriptionTier,
      subscriberId: subscriber.id,
    };
  } catch {
    return {
      authenticated: false,
      tier: "free",
      subscriberId: null,
      error: "Invalid or expired token",
    };
  }
}

/**
 * Require Enterprise tier for API access.
 * Returns a JSON error response if not authorized.
 */
export function requireEnterprise(auth: ApiAuthResult): Response | null {
  if (!auth.authenticated) {
    return Response.json(
      { error: "Unauthorized", message: auth.error },
      { status: 401 }
    );
  }

  if (auth.tier !== "enterprise") {
    return Response.json(
      {
        error: "Forbidden",
        message: "REST API access requires an Enterprise subscription. Contact sales@vendorscope.eu for access.",
      },
      { status: 403 }
    );
  }

  return null; // Authorized
}
