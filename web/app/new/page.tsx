import type { Metadata } from "next";
import Link from "next/link";
import { getNetwork, isDemoMode } from "@/lib/config";
import { networkLabel, networkTicker } from "@/lib/network";
import { SiteNav } from "@/components/site-nav";
import { CreateLinkForm } from "@/components/create-link-form";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "New payment link — Zink",
};

export default function NewLinkPage() {
  const demo = isDemoMode();
  const network = getNetwork();
  const networkName = networkLabel(network);
  const ticker = networkTicker(network);
  return (
    <div className="flex flex-1 flex-col">
      <SiteNav tone="light" />
      <main className="mx-auto grid w-full max-w-5xl flex-1 gap-10 px-6 pb-20 pt-8 sm:px-10 md:grid-cols-[1fr_1.1fr]">
        <div className="md:pt-10">
          <p className="font-mono text-[10px] uppercase tracking-[0.28em] text-gold-deep">
            New link{" "}
            <span className="text-faint">
              [ {demo ? "showcase · no chain" : `one second · ${networkName}`} ]
            </span>
          </p>
          <h1 className="mt-3 font-display text-4xl font-semibold leading-[1.05] tracking-tight sm:text-5xl">
            get paid.
            <br />
            <span className="text-mute">reveal nothing.</span>
          </h1>
          <p className="mt-5 max-w-sm text-[14px] leading-relaxed text-ink-soft">
            {demo
              ? "Use this form to preview the customer invoice experience. The hosted site will not derive an address or contact Zcash."
              : `Zink derives a fresh shielded-only diversified address from your viewing key, wraps it in a ZIP-321 QR with an encrypted invoice reference, and watches ${networkName} until the payment is mined.`}
          </p>
          <p className="mt-4 font-mono text-[10px] uppercase tracking-[0.22em] text-faint">
            Shielded-only · unique address · viewing-key monitored · encrypted
            memo
          </p>
        </div>

        <div className="rounded-3xl border border-line bg-card p-6 shadow-[0_1px_2px_rgba(27,23,18,0.05),0_18px_44px_-20px_rgba(27,23,18,0.22)] sm:p-8 md:self-start">
          {demo ? (
            <div className="mb-6 rounded-xl border border-gold-deep/30 bg-gold-pale/40 px-4 py-3">
              <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-gold-deep">
                Hosted demo
              </p>
              <p className="mt-1 text-[13px] leading-relaxed text-ink-soft">
                Create a synthetic invoice and walk through the customer
                experience. No Zcash address is generated and no real payment
                can be sent. The{" "}
                <Link
                  href="/dash"
                  className="font-semibold text-gold-deep underline"
                >
                  sample ledger
                </Link>{" "}
                shows the merchant side; you can also open{" "}
                <Link
                  href="/l/demo-open-1"
                  className="font-semibold text-gold-deep underline"
                >
                  a pre-filled sample
                </Link>
                . Clone the repo to run the full {networkName} flow.
              </p>
            </div>
          ) : (
            <div className="mb-6 rounded-xl border border-cleared/30 bg-cleared/5 px-4 py-3">
              <div className="flex flex-wrap items-center gap-2">
                <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-cleared">
                  Merchant workspace
                </p>
                <span className="rounded border border-cleared/25 px-1.5 py-0.5 font-mono text-[9px] uppercase tracking-[0.14em] text-cleared">
                  {networkName}
                </span>
                <span className="rounded border border-line bg-card px-1.5 py-0.5 font-mono text-[9px] uppercase tracking-[0.14em] text-mute">
                  view only
                </span>
              </div>
              <p className="mt-1.5 text-[13px] leading-relaxed text-ink-soft">
                A merchant viewing wallet is configured. Zink can derive and
                reconcile incoming {ticker}, but it has no authority to spend.
              </p>
            </div>
          )}
          <CreateLinkForm ticker={ticker} showcase={demo} />
        </div>
      </main>
    </div>
  );
}
