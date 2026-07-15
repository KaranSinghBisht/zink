import { zatsToDecimalZec } from "./zec";

function base64Url(bytes: Uint8Array): string {
  return Buffer.from(bytes)
    .toString("base64")
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/, "");
}

const MEMO_MAX_BYTES = 512;

/**
 * Build a ZIP-321 payment request URI: zcash:<addr>?amount=<zec>&memo=<b64url>
 */
export function buildPaymentUri(
  address: string,
  amountZats: bigint,
  memoText?: string,
): string {
  if (!address) {
    throw new Error("Address is required for a payment URI");
  }
  const params = new URLSearchParams();
  params.set("amount", zatsToDecimalZec(amountZats));
  if (memoText) {
    const memoBytes = new TextEncoder().encode(memoText);
    if (memoBytes.length > MEMO_MAX_BYTES) {
      throw new Error(`Memo exceeds ${MEMO_MAX_BYTES} bytes`);
    }
    params.set("memo", base64Url(memoBytes));
  }
  return `zcash:${address}?${params.toString()}`;
}
