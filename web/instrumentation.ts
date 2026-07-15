export async function register(): Promise<void> {
  const isNodeRuntime = process.env.NEXT_RUNTIME === "nodejs";
  const isBuildPhase = process.env.NEXT_PHASE === "phase-production-build";
  if (!isNodeRuntime || isBuildPhase || !process.env.ZINK_WALLET_DIR) {
    return;
  }
  const { startPoller } = await import("./lib/poller");
  startPoller();
}
