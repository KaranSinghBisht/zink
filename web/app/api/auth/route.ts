import { NextRequest, NextResponse } from "next/server";
import { ADMIN_COOKIE, isLocalMode, secretMatches } from "@/lib/auth";
import { rateLimitExceeded } from "@/lib/ratelimit";

export const runtime = "nodejs";

export async function POST(request: NextRequest): Promise<NextResponse> {
  if (isLocalMode()) {
    return NextResponse.json({ ok: true, localMode: true });
  }
  const ip = request.headers.get("x-forwarded-for")?.split(",")[0] ?? "local";
  if (rateLimitExceeded(`auth:${ip}`, 10)) {
    return NextResponse.json({ error: "Too many attempts" }, { status: 429 });
  }
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }
  const { token } = (body ?? {}) as { token?: unknown };
  if (typeof token !== "string" || !secretMatches(token)) {
    return NextResponse.json({ error: "Invalid token" }, { status: 401 });
  }
  const response = NextResponse.json({ ok: true });
  response.cookies.set(ADMIN_COOKIE, token, {
    httpOnly: true,
    sameSite: "strict",
    secure: request.nextUrl.protocol === "https:",
    path: "/",
    maxAge: 60 * 60 * 12,
  });
  return response;
}

export async function DELETE(): Promise<NextResponse> {
  const response = NextResponse.json({ ok: true });
  response.cookies.set(ADMIN_COOKIE, "", { path: "/", maxAge: 0 });
  return response;
}
