const debugEnabled = process.env.ZINK_DEBUG === "1";

export const log = {
  info(message: string): void {
    if (debugEnabled) {
      process.stderr.write(`[zink] ${message}\n`);
    }
  },
  error(message: string, err?: unknown): void {
    const detail = err instanceof Error ? `: ${err.message}` : "";
    process.stderr.write(`[zink:error] ${message}${detail}\n`);
  },
};
