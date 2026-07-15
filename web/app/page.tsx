import Link from "next/link";
import { AddressTicker } from "@/components/address-ticker";
import { CreateLinkForm } from "@/components/create-link-form";

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
    bracket: "[ ZIP-316 · ORCHARD-ONLY ]",
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
];

function CornerLabel({
  className,
  line1,
  line2,
}: {
  className: string;
  line1: string;
  line2: string;
}) {
  return (
    <div
      aria-hidden
      className={`pointer-events-none absolute hidden font-mono text-[10px] uppercase tracking-[0.28em] text-cream/45 md:block ${className}`}
    >
      <div>{line1}</div>
      <div className="mt-1 text-cream/30">{line2}</div>
    </div>
  );
}

export default function Home() {
  return (
    <div className="flex flex-1 flex-col">
      {/* ------------------------------------------------ hero */}
      <section className="veil relative flex min-h-svh flex-col text-cream">
        <div className="veil-lines" />
        <div
          className="veil-ring left-1/2 top-1/2 h-[46rem] w-[46rem] -translate-x-1/2 -translate-y-1/2"
          aria-hidden
        />
        <div
          className="veil-ring left-1/2 top-1/2 h-[30rem] w-[30rem] -translate-x-1/2 -translate-y-1/2"
          aria-hidden
        />

        <header className="flex items-center justify-between px-6 py-6 sm:px-10">
          <span className="rise rise-1 font-display text-xl font-bold tracking-tight">
            zink<span className="text-gold">.</span>
          </span>
          <nav className="rise rise-1 flex items-center gap-7 font-mono text-[11px] uppercase tracking-[0.26em] text-cream/60">
            <Link href="/dash" className="transition-colors hover:text-cream">
              Ledger
            </Link>
            <a href="#create" className="transition-colors hover:text-cream">
              Enter <span aria-hidden>→</span>
            </a>
          </nav>
        </header>

        <div className="relative flex flex-1 items-center justify-center px-6">
          <CornerLabel
            className="left-8 top-[38%] lg:left-14"
            line1="MAINNET"
            line2="[ ZCASH · ORCHARD ]"
          />
          <CornerLabel
            className="right-8 top-[30%] text-right lg:right-14"
            line1="ADDRESS"
            line2="[ ZIP-316 · DIVERSIFIED ]"
          />
          <CornerLabel
            className="bottom-[16%] left-[18%]"
            line1="CUSTODY"
            line2="[ VIEWING KEY · NONE ]"
          />

          <h1 className="rise rise-2 max-w-5xl text-center font-display text-[13.5vw] font-bold uppercase leading-[0.98] tracking-tight sm:text-[9vw] lg:text-[6.4rem]">
            Payment links
            <br />
            that never
            <br />
            link back
          </h1>
        </div>

        <div className="rise rise-4 flex flex-col items-center gap-2 pb-8">
          <span className="font-mono text-[10px] uppercase tracking-[0.32em] text-cream/40">
            Scroll
          </span>
          <span aria-hidden className="scroll-cue block h-8 w-px bg-cream/35" />
        </div>
      </section>

      {/* ---------------------------------------- statement */}
      <section className="mx-auto w-full max-w-5xl px-6 pb-6 pt-20 sm:px-10 sm:pt-28">
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

      {/* ---------------------------------------- create + ticker */}
      <section
        id="create"
        className="mx-auto grid w-full max-w-5xl scroll-mt-10 gap-5 px-6 py-14 sm:px-10 md:grid-cols-[1fr_1.1fr]"
      >
        <div className="rounded-3xl border border-line bg-card p-6 shadow-[0_1px_2px_rgba(27,23,18,0.05),0_18px_44px_-20px_rgba(27,23,18,0.22)] sm:p-8">
          <p className="font-mono text-[10px] uppercase tracking-[0.28em] text-gold-deep">
            New link{" "}
            <span className="text-faint">[ one second · mainnet ]</span>
          </p>
          <h3 className="mt-2 font-display text-2xl font-semibold tracking-tight">
            get paid, reveal nothing.
          </h3>
          <div className="mt-6">
            <CreateLinkForm />
          </div>
        </div>

        <div className="veil flex flex-col justify-between overflow-hidden rounded-3xl p-6 text-cream sm:p-8">
          <div className="veil-lines" />
          <p className="font-mono text-[10px] uppercase tracking-[0.28em] text-cream/50">
            One wallet <span className="text-cream/30">[ many faces ]</span>
          </p>
          <div className="mt-6">
            <AddressTicker />
          </div>
        </div>
      </section>

      {/* ---------------------------------------- protocol facts */}
      <section className="mx-auto w-full max-w-5xl px-6 pb-20 sm:px-10">
        <div className="rounded-3xl border border-line bg-card p-6 sm:p-10">
          <p className="font-mono text-[10px] uppercase tracking-[0.28em] text-mute">
            The cryptography{" "}
            <span className="text-faint">
              [ <span className="text-gold-deep">ZIP-316</span> · ZIP-302 ·
              ZIP-321 ]
            </span>
          </p>
          <div className="mt-10 flex flex-col gap-10">
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
                  <h3 className="font-display text-xl font-semibold tracking-tight">
                    {fact.title}
                  </h3>
                  <p className="mt-2 max-w-xl text-[14px] leading-relaxed text-ink-soft">
                    {fact.body}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ---------------------------------------- footer */}
      <footer className="veil px-6 py-10 text-cream sm:px-10">
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
