import { createHash, timingSafeEqual } from "node:crypto";
import type { NextRequest } from "next/server";
import { getConfig } from "./config";

export const ADMIN_COOKIE = "zink_admin";

function digest(value: string): Buffer {
  return createHash("sha256").update(value, "utf8").digest();
}

export function secretMatches(candidate: string | undefined | null): boolean {
  const { adminToken } = getConfig();
  if (!adminToken) return false;
  if (!candidate) return false;
  return timingSafeEqual(digest(candidate), digest(adminToken));
}

/** True when no admin token is configured (local/dev mode: routes stay open). */
export function isLocalMode(): boolean {
  return getConfig().adminToken === null;
}

/**
 * Merchant authorization for API routes. Accepts the session cookie set by
 * /api/auth or an `Authorization: Bearer <token>` header (for curl/scripts).
 */
export function isAuthorizedRequest(request: NextRequest): boolean {
  if (isLocalMode()) return true;
  const header = request.headers.get("authorization");
  if (header?.startsWith("Bearer ") && secretMatches(header.slice(7))) {
    return true;
  }
  return secretMatches(request.cookies.get(ADMIN_COOKIE)?.value);
}

/** Merchant authorization for server components, via next/headers cookies. */
export function isAuthorizedCookie(cookieValue: string | undefined): boolean {
  if (isLocalMode()) return true;
  return secretMatches(cookieValue);
}
