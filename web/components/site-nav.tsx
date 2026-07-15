import Link from "next/link";

/** Shared header for dark (hero/protocol) and light (new/dash) surfaces. */
export function SiteNav({ tone }: { tone: "dark" | "light" }) {
  const base =
    tone === "dark"
      ? { text: "text-cream/60", hover: "hover:text-cream", logo: "" }
      : { text: "text-mute", hover: "hover:text-ink", logo: "" };
  return (
    <header className="flex items-center justify-between px-6 py-6 sm:px-10">
      <Link href="/" className="font-display text-xl font-bold tracking-tight">
        zink<span className="text-gold">.</span>
      </Link>
      <nav
        className={`flex items-center gap-6 font-mono text-[11px] uppercase tracking-[0.24em] ${base.text}`}
      >
        <Link
          href="/protocol"
          className={`hidden transition-colors sm:inline ${base.hover}`}
        >
          Protocol
        </Link>
        <Link href="/dash" className={`transition-colors ${base.hover}`}>
          Ledger
        </Link>
        <Link
          href="/new"
          className={`rounded-lg border px-3 py-1.5 transition-colors ${
            tone === "dark"
              ? "border-cream/25 text-cream/80 hover:border-gold hover:text-cream"
              : "border-line bg-card text-ink-soft hover:border-gold-deep hover:text-ink"
          }`}
        >
          New link <span aria-hidden>→</span>
        </Link>
      </nav>
    </header>
  );
}
