import { listUnpaidLinks, markPaid, memoRefFor } from "./links";
import {
  getSyncedHeight,
  listReceivedOutputs,
  type ReceivedOutput,
} from "./walletdb";
import { getConfig } from "./config";
import { log } from "./log";

/**
 * The diversified address is the authoritative signal: it is derived per link
 * and cannot be chosen by the payer. The memo is payer-controlled, so it is
 * only consulted when the wallet backend does not report an address for the
 * output — never as an override for an address that failed to match.
 */
function outputMatchesLink(
  output: ReceivedOutput,
  link: { id: string; address: string },
): boolean {
  if (output.toAddress) return output.toAddress === link.address;
  return output.memoText?.startsWith(memoRefFor(link.id)) ?? false;
}

export function isSettled(
  output: Pick<ReceivedOutput, "minedHeight">,
  syncedHeight: number | null,
  minConfirmations: number,
): boolean {
  if (output.minedHeight == null) return false;
  if (syncedHeight == null) return false;
  return syncedHeight - output.minedHeight + 1 >= minConfirmations;
}

/**
 * Reconcile received wallet outputs against unpaid links. A link is paid when
 * a MINED output with the configured confirmation depth arrives at its
 * diversified address (or carries its memo ref) with at least the requested
 * amount. Unmined/mempool outputs never mark a link paid.
 */
export function runDetection(): number {
  const unpaid = listUnpaidLinks();
  if (unpaid.length === 0) return 0;

  const outputs = listReceivedOutputs();
  if (outputs.length === 0) return 0;

  const syncedHeight = getSyncedHeight();
  const { minConfirmations } = getConfig();

  let paidCount = 0;
  for (const link of unpaid) {
    const match = outputs.find(
      (output) =>
        outputMatchesLink(output, link) &&
        output.valueZats >= link.amountZats &&
        isSettled(output, syncedHeight, minConfirmations),
    );
    if (!match) continue;
    const updated = markPaid(link.id, {
      txid: match.txid,
      valueZats: match.valueZats,
      memo: match.memoText,
      minedHeight: match.minedHeight,
      blockTime: match.blockTime,
    });
    if (updated) {
      paidCount += 1;
      log.info(`link ${link.id} paid by ${match.txid}`);
    }
  }
  return paidCount;
}
