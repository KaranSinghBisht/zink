import { beforeEach, describe, expect, it, vi } from "vitest";
import type { ReceivedOutput } from "../lib/walletdb";

const listUnpaidLinks = vi.fn();
const listReceivedOutputs = vi.fn();
const getSyncedHeight = vi.fn();
const markPaid = vi.fn();

vi.mock("../lib/links", () => ({
  listUnpaidLinks: () => listUnpaidLinks(),
  markPaid: (id: string, paid: unknown) => markPaid(id, paid),
  memoRefFor: (id: string) => `zink:${id}`,
}));

vi.mock("../lib/walletdb", () => ({
  listReceivedOutputs: () => listReceivedOutputs(),
  getSyncedHeight: () => getSyncedHeight(),
}));

vi.mock("../lib/config", () => ({
  getConfig: () => ({ minConfirmations: 1 }),
}));

vi.mock("../lib/log", () => ({
  log: { info: () => {}, error: () => {}, debug: () => {} },
}));

const { runDetection } = await import("../lib/detect");

const LINK_A = { id: "aaaa", address: "u1aaa", amountZats: 100 };
const LINK_B = { id: "bbbb", address: "u1bbb", amountZats: 100 };

function output(over: Partial<ReceivedOutput> = {}): ReceivedOutput {
  return {
    toAddress: "u1aaa",
    valueZats: 100,
    memoText: null,
    minedHeight: 3_000_000,
    blockTime: 1_700_000_000,
    txid: "deadbeef",
    ...over,
  };
}

describe("runDetection", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    getSyncedHeight.mockReturnValue(3_000_000);
    markPaid.mockReturnValue(true);
  });

  it("settles a link when a mined output arrives at its diversified address", () => {
    listUnpaidLinks.mockReturnValue([LINK_A]);
    listReceivedOutputs.mockReturnValue([output()]);

    expect(runDetection()).toBe(1);
    expect(markPaid).toHaveBeenCalledWith(
      "aaaa",
      expect.objectContaining({ txid: "deadbeef", valueZats: 100 }),
    );
  });

  it("does not let a payer-supplied memo settle a link whose address did not match", () => {
    // A payment lands on link A's address but carries link B's memo ref.
    // Only A may settle: the memo must never override a mismatched address,
    // or one payment would clear two invoices.
    listUnpaidLinks.mockReturnValue([LINK_A, LINK_B]);
    listReceivedOutputs.mockReturnValue([
      output({ toAddress: "u1aaa", memoText: "zink:bbbb" }),
    ]);

    expect(runDetection()).toBe(1);
    expect(markPaid).toHaveBeenCalledTimes(1);
    expect(markPaid).toHaveBeenCalledWith("aaaa", expect.anything());
    expect(markPaid).not.toHaveBeenCalledWith("bbbb", expect.anything());
  });

  it("falls back to the memo ref only when the backend reports no address", () => {
    listUnpaidLinks.mockReturnValue([LINK_B]);
    listReceivedOutputs.mockReturnValue([
      output({ toAddress: null, memoText: "zink:bbbb — thanks!" }),
    ]);

    expect(runDetection()).toBe(1);
    expect(markPaid).toHaveBeenCalledWith("bbbb", expect.anything());
  });

  it("ignores an underpaying output", () => {
    listUnpaidLinks.mockReturnValue([LINK_A]);
    listReceivedOutputs.mockReturnValue([output({ valueZats: 99 })]);

    expect(runDetection()).toBe(0);
    expect(markPaid).not.toHaveBeenCalled();
  });

  it("never settles an unmined (mempool) output", () => {
    listUnpaidLinks.mockReturnValue([LINK_A]);
    listReceivedOutputs.mockReturnValue([output({ minedHeight: null })]);

    expect(runDetection()).toBe(0);
    expect(markPaid).not.toHaveBeenCalled();
  });
});
