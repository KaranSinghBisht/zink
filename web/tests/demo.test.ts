import { describe, expect, it } from "vitest";
import {
  createDemoPreviewLink,
  DEMO_LINKS,
  DEMO_PREVIEW_LINK,
} from "../lib/demo";
import { toPublicStatus } from "../lib/links";

describe("hosted showcase safety", () => {
  it("never contains a usable Zcash receiving target", () => {
    for (const link of DEMO_LINKS) {
      expect(link.address).not.toMatch(/^(u1|utest1)[0-9a-z]+$/);
      expect(link.uri).not.toMatch(/^zcash:/);
    }
  });

  it("redacts private link fields from the public poll response", () => {
    const link = DEMO_LINKS[0];
    const publicStatus = toPublicStatus(link);
    expect(publicStatus).not.toHaveProperty("paidMemo");
    expect(publicStatus).not.toHaveProperty("address");
    expect(publicStatus).not.toHaveProperty("description");
  });

  it("builds a customized non-payable preview without adding it to the ledger", () => {
    const preview = createDemoPreviewLink("1.25", " Demo invoice ");

    expect(preview.amountZats).toBe(125_000_000);
    expect(preview.description).toBe("Demo invoice");
    expect(preview.address).not.toMatch(/^(u1|utest1)[0-9a-z]+$/);
    expect(preview.uri).not.toMatch(/^zcash:/);
    expect(DEMO_LINKS).not.toContainEqual(DEMO_PREVIEW_LINK);
  });

  it("uses safe defaults for an edited or invalid preview URL", () => {
    const preview = createDemoPreviewLink("not-an-amount", "   ");

    expect(preview.amountZats).toBe(DEMO_PREVIEW_LINK.amountZats);
    expect(preview.description).toBe(DEMO_PREVIEW_LINK.description);
  });
});
