"use client";

import { useState } from "react";

export function CopyButton({
  text,
  className = "",
}: {
  text: string;
  className?: string;
}) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 1300);
    } catch {
      // Clipboard access denied or unavailable; the command is still selectable as text.
    }
  };

  return (
    <button
      type="button"
      onClick={handleCopy}
      aria-label={`Copy "${text}" to clipboard`}
      className={`shrink-0 cursor-pointer bg-transparent font-mono text-[11px] tracking-wide text-[#6b6b70] transition-colors hover:text-[var(--accent)] focus-visible:text-[var(--accent)] focus-visible:outline-none ${className}`}
    >
      {copied ? "copied ✓" : "copy"}
    </button>
  );
}
