"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { decimalZecToZats, zatsToDecimalZec } from "@/lib/zec";

export function CreateLinkForm({
  ticker = "ZEC",
  showcase = false,
}: {
  ticker?: "ZEC" | "TAZ";
  showcase?: boolean;
}) {
  const router = useRouter();
  const [amount, setAmount] = useState("");
  const [description, setDescription] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

  async function submit(event: { preventDefault: () => void }) {
    event.preventDefault();
    setError(null);

    if (showcase) {
      try {
        const amountZats = decimalZecToZats(amount);
        if (amountZats <= 0n) throw new Error("Amount must be positive");

        const query = new URLSearchParams({
          amount: zatsToDecimalZec(amountZats),
        });
        const trimmedDescription = description.trim();
        if (trimmedDescription) {
          query.set("description", trimmedDescription);
        }

        setPending(true);
        router.push(`/l/demo-preview?${query.toString()}`);
      } catch {
        setError(
          `Enter a positive ${ticker} amount with no more than 8 decimal places.`,
        );
      }
      return;
    }

    setPending(true);
    try {
      const response = await fetch("/api/links", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ amount, description }),
      });
      const data = (await response.json()) as {
        link?: { id: string };
        error?: string;
      };
      if (!response.ok || !data.link) {
        setError(data.error ?? "Something went wrong creating the link.");
        setPending(false);
        return;
      }
      router.push(`/l/${data.link.id}`);
    } catch {
      setError("Network error — is the Zink server running?");
      setPending(false);
    }
  }

  return (
    <form onSubmit={submit} className="flex flex-col gap-4">
      <div className="flex flex-col gap-1.5">
        <label
          htmlFor="amount"
          className="font-mono text-[11px] uppercase tracking-[0.18em] text-mute"
        >
          Amount ({ticker})
        </label>
        <input
          id="amount"
          name="amount"
          inputMode="decimal"
          type="text"
          autoComplete="off"
          spellCheck={false}
          placeholder="0.005"
          required
          aria-invalid={error ? "true" : undefined}
          aria-describedby={error ? "create-link-error" : undefined}
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          className="rounded-xl border border-line bg-paper px-3.5 py-2.5 font-mono text-lg text-ink placeholder:text-faint focus:border-gold-deep"
        />
      </div>
      <div className="flex flex-col gap-1.5">
        <label
          htmlFor="description"
          className="font-mono text-[11px] uppercase tracking-[0.18em] text-mute"
        >
          What is it for?
        </label>
        <input
          id="description"
          name="description"
          placeholder="Design work — March invoice"
          maxLength={200}
          autoComplete="off"
          aria-invalid={error ? "true" : undefined}
          aria-describedby={error ? "create-link-error" : undefined}
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="rounded-xl border border-line bg-paper px-3.5 py-2.5 text-[15px] text-ink placeholder:text-faint focus:border-gold-deep"
        />
      </div>
      {error ? (
        <p
          id="create-link-error"
          role="alert"
          className="text-sm font-medium text-danger"
        >
          {error}
        </p>
      ) : null}
      <button
        type="submit"
        disabled={pending}
        aria-busy={pending}
        className="mt-1 min-h-11 cursor-pointer rounded-xl bg-ink px-4 py-3 font-display text-[15px] font-bold text-paper transition-opacity duration-100 ease-out hover:opacity-90 active:translate-y-px disabled:cursor-not-allowed disabled:opacity-60"
      >
        {pending
          ? showcase
            ? "Creating demo invoice…"
            : "Deriving a fresh address…"
          : showcase
            ? "Create demo invoice"
            : "Create payment link"}
      </button>
      <p className="text-[13px] leading-relaxed text-mute">
        {showcase
          ? "Creates a synthetic, non-payable invoice. You can simulate the paid state on the next screen; nothing is saved."
          : "Each link derives a new shielded address from your viewing key. Zink never holds keys that can spend."}
      </p>
    </form>
  );
}
