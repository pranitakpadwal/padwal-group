"use client";

import { useState } from "react";

/** Tiny per-quote actions: copy the quote, or tweet it. */
export default function QuoteShare({ text, attribution }: { text: string; attribution: string }) {
  const [copied, setCopied] = useState(false);
  const full = `"${text}" — ${attribution}`;

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(`${full} ${window.location.href}`);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Clipboard unavailable — nothing to do.
    }
  };

  const tweet = () => {
    window.open(
      `https://twitter.com/intent/tweet?text=${encodeURIComponent(full)}&url=${encodeURIComponent(window.location.href)}`,
      "_blank",
      "noopener,noreferrer,width=600,height=600",
    );
  };

  const buttonClass =
    "rounded-full border border-line px-3 py-1 text-xs font-medium text-foreground/70 transition-colors hover:border-brand hover:text-brand";

  return (
    <div className="flex gap-2">
      <button type="button" onClick={copy} className={buttonClass}>
        {copied ? "Copied!" : "Copy"}
      </button>
      <button type="button" onClick={tweet} className={buttonClass}>
        Post on X
      </button>
    </div>
  );
}
