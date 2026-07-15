import Link from "next/link";
import { SiteNav } from "@/components/site-nav";
import { VeilBends } from "@/components/veil-bends";

const STRIP_FACTS = [
  {
    tag: "01 · VIEWING KEY",
    text: "the server watches payments arrive. it can never spend.",
  },
  {
    tag: "02 · DIVERSIFIED",
    text: "every invoice is a fresh shielded address — unlinkable by math.",
  },
  {
    tag: "03 · ENCRYPTED MEMO",
    text: "reconciled automatically, with zero public metadata.",
  },
];

export default function Home() {
  return (
    <div className="flex flex-1 flex-col">
      {/* ------------------------------------------------ hero */}
      <section className="veil relative flex min-h-svh flex-col text-cream">
        <VeilBends />
        <SiteNav tone="dark" />

        <div className="relative flex flex-1 flex-col justify-end px-6 pb-16 sm:px-10 sm:pb-20">
          <p className="rise rise-1 font-mono text-[11px] uppercase tracking-[0.3em] text-gold">
            Non-custodial <span className="text-cream/40">·</span> Zcash mainnet{" "}
            <span className="text-cream/40">·</span> Orchard
          </p>
          <h1 className="rise rise-2 mt-5 max-w-4xl font-display text-[15vw] font-bold leading-[0.95] tracking-tight sm:text-[9.5vw] lg:text-[7rem]">
            payment links
            <br />
            that never
            <br />
            <span className="text-gold">link back.</span>
          </h1>
          <div className="rise rise-3 mt-8 flex flex-wrap items-center gap-4">
            <Link
              href="/new"
              className="rounded-xl bg-cream px-5 py-3 font-display text-[15px] font-bold text-night transition-opacity hover:opacity-90"
            >
              Create a link
            </Link>
            <Link
              href="/protocol"
              className="rounded-xl border border-cream/25 px-5 py-3 font-display text-[15px] font-semibold text-cream/85 transition-colors hover:border-gold hover:text-cream"
            >
              How it stays private
            </Link>
          </div>

          <div
            aria-hidden
            className="pointer-events-none absolute bottom-20 right-10 hidden text-right font-mono text-[10px] uppercase tracking-[0.28em] text-cream/40 lg:block"
          >
            <div>ADDRESS [ ZIP-316 · DIVERSIFIED ]</div>
            <div className="mt-2 text-cream/25">
              CUSTODY [ VIEWING KEY · NONE ]
            </div>
            <div className="mt-2 text-cream/25">PROOF [ SHIELDED · MEMO ]</div>
          </div>
        </div>
      </section>

      {/* ---------------------------------------- statement */}
      <section className="mx-auto w-full max-w-5xl px-6 pb-4 pt-20 sm:px-10 sm:pt-24">
        <p className="font-mono text-[11px] uppercase tracking-[0.28em] text-mute">
          Public link <span className="text-faint">·</span> Shielded link
        </p>
        <h2 className="mt-6 max-w-3xl font-display text-4xl font-semibold leading-[1.08] tracking-tight sm:text-5xl">
          a normal payment link <em className="not-italic text-mute">is</em>{" "}
          your address.
          <span className="text-mute">
            {" "}
            every customer can read your balance, your revenue, everyone who
            ever paid you.
          </span>
        </h2>
        <p className="mt-6 max-w-xl text-[15px] leading-relaxed text-ink-soft">
          Stripe hides that with custody — they hold your money and see
          everything. Zcash hides it in the protocol. Zink turns one viewing key
          into Stripe-style links where every invoice is a fresh shielded
          address, and the ledger reconciles itself.
        </p>
      </section>

      {/* ---------------------------------------- facts strip */}
      <section className="mx-auto grid w-full max-w-5xl gap-4 px-6 py-14 sm:px-10 md:grid-cols-3">
        {STRIP_FACTS.map((fact) => (
          <div
            key={fact.tag}
            className="rounded-2xl border border-line bg-card p-5"
          >
            <p className="font-mono text-[10px] uppercase tracking-[0.24em] text-gold-deep">
              {fact.tag}
            </p>
            <p className="mt-2 text-[14px] leading-relaxed text-ink-soft">
              {fact.text}
            </p>
          </div>
        ))}
        <div className="md:col-span-3">
          <Link
            href="/protocol"
            className="font-mono text-[11px] uppercase tracking-[0.24em] text-gold-deep hover:underline"
          >
            Read the cryptography →
          </Link>
        </div>
      </section>

      {/* ---------------------------------------- footer */}
      <footer className="veil relative px-6 py-10 text-cream sm:px-10">
        <div className="mx-auto flex w-full max-w-5xl flex-wrap items-center justify-between gap-3 font-mono text-[10px] uppercase tracking-[0.24em] text-cream/45">
          <span>
            zink<span className="text-gold">.</span> — built for ZecHub
            Hackathon 3.0
          </span>
          <span>Zcash mainnet · view-only · MIT</span>
        </div>
      </footer>
    </div>
  );
}
