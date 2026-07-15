import { createHash, timingSafeEqual } from "node:crypto";
import type { NextRequest } from "next/server";

export const ADMIN_COOKIE = "zink_admin";

// Read directly from the environment (not getConfig) so auth also works in
// demo mode, where the wallet-related variables are absent.
function adminToken(): string | null {
  return process.env.ZINK_ADMIN_TOKEN?.trim() || null;
}

function digest(value: string): Buffer {
  return createHash("sha256").update(value, "utf8").digest();
}

export function secretMatches(candidate: string | undefined | null): boolean {
  const token = adminToken();
  if (!token) return false;
  if (!candidate) return false;
  return timingSafeEqual(digest(candidate), digest(token));
}

/** True when no admin token is configured (local/dev mode: routes stay open). */
export function isLocalMode(): boolean {
  return adminToken() === null;
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
