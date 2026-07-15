import type { Metadata } from "next";
import Link from "next/link";
import { SiteNav } from "@/components/site-nav";
import { VeilBends } from "@/components/veil-bends";
import { AddressTicker } from "@/components/address-ticker";
import { getNetwork } from "@/lib/config";

export const metadata: Metadata = {
  title: "Protocol — Zink",
  description:
    "How Zink keeps merchant payments private: viewing keys, ZIP-316 diversified addresses, encrypted memos, ZIP-321 URIs.",
};

export const dynamic = "force-dynamic";

const PROTOCOL_FACTS = [
  {
    index: "01",
    tag: "VIEWING KEY",
    bracket: "[ WATCH · NEVER SPEND ]",
    title: "the server can look, not touch.",
    body: "Zink runs on a Unified Full Viewing Key. It sees payments arrive and reconciles your books — but no key on the server can ever move money. Non-custodial by construction, not by promise.",
  },
  {
    index: "02",
    tag: "DIVERSIFIED",
    bracket: "[ ZIP-316 · SHIELDED-ONLY ]",
    title: "every invoice gets its own address.",
    body: "One wallet key yields billions of shielded addresses that are cryptographically unlinkable. Each link derives a fresh one, so no customer can connect an invoice to your balance, your history, or each other.",
  },
  {
    index: "03",
    tag: "ENCRYPTED MEMO",
    bracket: "[ ZIP-302 · ZIP-321 ]",
    title: "reconciled with zero public metadata.",
    body: "The QR encodes address, amount and an encrypted invoice reference. Only payer and merchant can read it — yet the dashboard clears the right invoice the moment the payment is mined.",
  },
  {
    index: "04",
    tag: "SETTLEMENT",
    bracket: "[ MINED · CONFIRMED ]",
    title: "paid means mined, not promised.",
    body: "An invoice only stamps PAID once the transaction is mined with the configured confirmation depth. Mempool activity never settles a link, and the dashboard shows sync health at all times.",
  },
];

export default function ProtocolPage() {
  const network = getNetwork();
  return (
    <div className="flex flex-1 flex-col">
      <section className="veil relative text-cream">
        <VeilBends intensity={0.9} />
        <SiteNav tone="dark" />
        <div className="mx-auto w-full max-w-5xl px-6 pb-16 pt-10 sm:px-10 sm:pb-24">
          <p className="font-mono text-[11px] uppercase tracking-[0.3em] text-gold">
            The cryptography{" "}
            <span className="text-cream/40">
              [ ZIP-316 · ZIP-302 · ZIP-321 ]
            </span>
          </p>
          <h1 className="mt-5 max-w-3xl font-display text-4xl font-semibold leading-[1.05] tracking-tight sm:text-6xl">
            public chains remember everything.{" "}
            <span className="text-cream/50">
              the shielded pool doesn&apos;t.
            </span>
          </h1>
        </div>
      </section>

      <main className="mx-auto w-full max-w-5xl flex-1 px-6 py-14 sm:px-10">
        <div className="flex flex-col gap-10">
          {PROTOCOL_FACTS.map((fact) => (
            <div
              key={fact.index}
              className="grid gap-4 border-t border-dashed border-line pt-8 first:border-0 first:pt-0 md:grid-cols-[220px_1fr]"
            >
              <p className="font-mono text-[10px] uppercase tracking-[0.24em] text-mute">
                {fact.index} · {fact.tag}
                <span className="mt-1 block text-faint">{fact.bracket}</span>
              </p>
              <div>
                <h2 className="font-display text-xl font-semibold tracking-tight">
                  {fact.title}
                </h2>
                <p className="mt-2 max-w-xl text-[14px] leading-relaxed text-ink-soft">
                  {fact.body}
                </p>
              </div>
            </div>
          ))}
        </div>

        <div className="veil relative mt-14 overflow-hidden rounded-3xl p-6 text-cream sm:p-8">
          <VeilBends intensity={0.8} speed={0.1} />
          <p className="relative font-mono text-[10px] uppercase tracking-[0.28em] text-cream/50">
            One wallet <span className="text-cream/30">[ many faces ]</span>
          </p>
          <div className="relative mt-5">
            <AddressTicker network={network} />
          </div>
        </div>

        <div className="mt-10">
          <Link
            href="/new"
            className="rounded-xl bg-ink px-5 py-3 font-display text-[15px] font-bold text-paper transition-opacity hover:opacity-90"
          >
            Create a payment link
          </Link>
        </div>
      </main>
    </div>
  );
}
