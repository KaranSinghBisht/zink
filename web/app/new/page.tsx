import type { Metadata } from "next";
import Link from "next/link";
import { isDemoMode } from "@/lib/config";
import { SiteNav } from "@/components/site-nav";
import { CreateLinkForm } from "@/components/create-link-form";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "New payment link — Zink",
};

export default function NewLinkPage() {
  const demo = isDemoMode();
  return (
    <div className="flex flex-1 flex-col">
      <SiteNav tone="light" />
      <main className="mx-auto grid w-full max-w-5xl flex-1 gap-10 px-6 pb-20 pt-8 sm:px-10 md:grid-cols-[1fr_1.1fr]">
        <div className="md:pt-10">
          <p className="font-mono text-[10px] uppercase tracking-[0.28em] text-gold-deep">
            New link{" "}
            <span className="text-faint">[ one second · mainnet ]</span>
          </p>
          <h1 className="mt-3 font-display text-4xl font-semibold leading-[1.05] tracking-tight sm:text-5xl">
            get paid.
            <br />
            <span className="text-mute">reveal nothing.</span>
          </h1>
          <p className="mt-5 max-w-sm text-[14px] leading-relaxed text-ink-soft">
            Zink derives a fresh Orchard-only shielded address from your viewing
            key, wraps it in a ZIP-321 QR with an encrypted invoice reference,
            and watches mainnet until the payment is mined.
          </p>
          <p className="mt-4 font-mono text-[10px] uppercase tracking-[0.22em] text-faint">
            Orchard-only · unique address · viewing-key monitored · encrypted
            memo
          </p>
        </div>

        <div className="rounded-3xl border border-line bg-card p-6 shadow-[0_1px_2px_rgba(27,23,18,0.05),0_18px_44px_-20px_rgba(27,23,18,0.22)] sm:p-8 md:self-start">
          {demo ? (
            <div className="mb-6 rounded-xl border border-gold-deep/30 bg-gold-pale/40 px-4 py-3">
              <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-gold-deep">
                Hosted showcase
              </p>
              <p className="mt-1 text-[13px] leading-relaxed text-ink-soft">
                Link creation runs on the merchant&apos;s own instance next to a
                view-only wallet. Browse the{" "}
                <Link
                  href="/dash"
                  className="font-semibold text-gold-deep underline"
                >
                  sample ledger
                </Link>{" "}
                and{" "}
                <Link
                  href="/l/demo-open-1"
                  className="font-semibold text-gold-deep underline"
                >
                  a live invoice page
                </Link>
                , or clone the repo to run the full mainnet flow.
              </p>
            </div>
          ) : null}
          <CreateLinkForm />
        </div>
      </main>
    </div>
  );
}
