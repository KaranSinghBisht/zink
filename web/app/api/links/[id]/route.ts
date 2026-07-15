import { NextRequest, NextResponse } from "next/server";
import { getLink, toPublicStatus } from "@/lib/links";
import { isDemoMode } from "@/lib/config";
import { isWatcherHealthy } from "@/lib/health";
import { log } from "@/lib/log";

export const runtime = "nodejs";

const ID_PATTERN = /^[A-Za-z0-9_-]{1,32}$/;

export async function GET(
  _request: NextRequest,
  context: { params: Promise<{ id: string }> },
): Promise<NextResponse> {
  const { id } = await context.params;
  if (!ID_PATTERN.test(id)) {
    return NextResponse.json({ error: "Invalid link id" }, { status: 400 });
  }
  try {
    const link = getLink(id);
    if (!link) {
      return NextResponse.json({ error: "Link not found" }, { status: 404 });
    }
    // Public endpoint: anyone with the invoice URL can poll status, so only
    // a redacted DTO is returned (no memo contents, no merchant fields).
    return NextResponse.json({
      link: toPublicStatus(link),
      watcherOk: isDemoMode() ? true : isWatcherHealthy(),
    });
  } catch (err) {
    log.error("link fetch failed", err);
    return NextResponse.json(
      { error: "Failed to fetch payment link" },
      { status: 500 },
    );
  }
}
