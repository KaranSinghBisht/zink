"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export function SignOutButton() {
  const router = useRouter();
  const [pending, setPending] = useState(false);

  async function signOut() {
    setPending(true);
    try {
      await fetch("/api/auth", { method: "DELETE" });
      router.refresh();
    } finally {
      setPending(false);
    }
  }

  return (
    <button
      type="button"
      onClick={signOut}
      disabled={pending}
      className="inline-flex min-h-10 cursor-pointer items-center transition-colors hover:text-ink disabled:cursor-wait disabled:opacity-60"
    >
      {pending ? "Locking…" : "Sign out"}
    </button>
  );
}
