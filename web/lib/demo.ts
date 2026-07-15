import type { PaymentLink } from "./links";
import { decimalZecToZats } from "./zec";

export const DEMO_PREVIEW_LINK: PaymentLink = {
  id: "demo-preview",
  amountZats: 500_000,
  description: "Sample invoice preview",
  address: "showcase-address-demo-preview-not-payable",
  uri: "showcase:demo-preview",
  status: "unpaid",
  txid: null,
  paidValueZats: null,
  paidMemo: null,
  minedHeight: null,
  blockTime: null,
  createdAt: 1_784_089_500_000,
};

export function createDemoPreviewLink(
  amountInput?: string,
  descriptionInput?: string,
): PaymentLink {
  let amountZats = BigInt(DEMO_PREVIEW_LINK.amountZats);
  try {
    const parsed = decimalZecToZats(amountInput ?? "");
    if (parsed > 0n) amountZats = parsed;
  } catch {
    // Direct or edited preview URLs fall back to the safe sample amount.
  }

  const description =
    descriptionInput?.trim().slice(0, 200) || DEMO_PREVIEW_LINK.description;

  return {
    ...DEMO_PREVIEW_LINK,
    amountZats: Number(amountZats),
    description,
  };
}

/**
 * Synthetic, non-payable sample ledger for the hosted showcase. Never put a
 * real receiving address in demo mode: the hosted site has no wallet watcher,
 * so a visitor could otherwise send funds to an invoice that can never update.
 */
export const DEMO_LINKS: PaymentLink[] = [
  {
    id: "demo-paid-1",
    amountZats: 450_000,
    description: "Sample — design retainer",
    address: "showcase-address-demo-paid-1-not-payable",
    uri: "showcase:demo-paid-1",
    status: "paid",
    txid: null,
    paidValueZats: 450_000,
    paidMemo: null,
    minedHeight: null,
    blockTime: null,
    createdAt: 1_784_020_000_000,
  },
  {
    id: "demo-open-1",
    amountZats: 1_200_000,
    description: "Sample — consulting invoice",
    address: "showcase-address-demo-open-1-not-payable",
    uri: "showcase:demo-open-1",
    status: "unpaid",
    txid: null,
    paidValueZats: null,
    paidMemo: null,
    minedHeight: null,
    blockTime: null,
    createdAt: 1_784_083_000_000,
  },
  {
    id: "demo-open-2",
    amountZats: 250_000,
    description: "Sample — workshop seat",
    address: "showcase-address-demo-open-2-not-payable",
    uri: "showcase:demo-open-2",
    status: "unpaid",
    txid: null,
    paidValueZats: null,
    paidMemo: null,
    minedHeight: null,
    blockTime: null,
    createdAt: 1_784_089_500_000,
  },
];

export class DemoModeError extends Error {
  constructor() {
    super(
      "This is the hosted showcase — link creation runs on the merchant's own instance with a view-only wallet. Clone the repo to create real links.",
    );
    this.name = "DemoModeError";
  }
}
