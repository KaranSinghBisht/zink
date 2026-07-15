"use client";

import { useState } from "react";

export function CopyButton({
  text,
  label,
  className = "",
}: {
  text: string;
  label: string;
  className?: string;
}) {
  const [copied, setCopied] = useState(false);

  async function copy() {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 1600);
    } catch {
      setCopied(false);
    }
  }

  return (
    <button
      type="button"
      onClick={copy}
      className={`font-mono text-xs tracking-wide transition-colors cursor-pointer ${className}`}
    >
      {copied ? "Copied ✓" : label}
    </button>
  );
}
