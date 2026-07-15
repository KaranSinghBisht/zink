const ZATS_PER_ZEC = 100_000_000n;

/** Zcash MAX_MONEY: 21,000,000 ZEC in zatoshis. Fits in a JS safe integer. */
export const MAX_MONEY_ZATS = 21_000_000n * ZATS_PER_ZEC;

export function zatsToDecimalZec(zats: bigint): string {
  if (zats < 0n) {
    throw new Error("Amount must be non-negative");
  }
  const whole = zats / ZATS_PER_ZEC;
  const frac = zats % ZATS_PER_ZEC;
  if (frac === 0n) return whole.toString();
  const fracStr = frac.toString().padStart(8, "0").replace(/0+$/, "");
  return `${whole}.${fracStr}`;
}

export function decimalZecToZats(input: string): bigint {
  const trimmed = input.trim();
  if (trimmed.length > 20 || !/^\d+(\.\d{1,8})?$/.test(trimmed)) {
    throw new Error("Invalid ZEC amount format");
  }
  const [whole, frac = ""] = trimmed.split(".");
  const zats =
    BigInt(whole) * ZATS_PER_ZEC + BigInt(frac.padEnd(8, "0") || "0");
  if (zats > MAX_MONEY_ZATS) {
    throw new Error("Amount exceeds the Zcash monetary range");
  }
  return zats;
}

export function formatZec(zats: bigint): string {
  return `${zatsToDecimalZec(zats)} ZEC`;
}
