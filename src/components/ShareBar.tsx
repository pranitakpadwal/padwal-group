"use client";

import { useState } from "react";

/**
 * Share row used on profiles and calculators. `text` should read like a
 * finished social post — the URL is appended automatically. If `url` is
 * omitted, the current page URL is used at click time.
 */
export default function ShareBar({
  text,
  url,
  label = "Share this",
}: {
  text: string;
  url?: string;
  label?: string;
}) {
  const [copied, setCopied] = useState(false);

  const resolveUrl = () => url ?? window.location.href;

  const open = (href: string) => {
    window.open(href, "_blank", "noopener,noreferrer,width=600,height=600");
  };

  const nativeShare = async () => {
    const shareUrl = resolveUrl();
    if (navigator.share) {
      try {
        await navigator.share({ text, url: shareUrl });
        return;
      } catch {
        // fall through to copy if the user cancels on an odd platform
      }
    }
    await copyLink();
  };

  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(`${text} ${resolveUrl()}`);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Clipboard unavailable (very old browser) — nothing to do.
    }
  };

  const buttonClass =
    "shrink-0 rounded-full border border-line bg-surface px-3.5 py-1.5 text-xs font-medium text-foreground/80 transition-colors hover:border-brand hover:text-brand";

  return (
    <div className="flex flex-wrap items-center gap-2" aria-label="Share">
      <span className="text-xs font-semibold uppercase tracking-wide text-[--muted]">
        {label}
      </span>
      <button type="button" onClick={nativeShare} className={`${buttonClass} border-brand bg-brand text-white hover:bg-brand-dark hover:text-white`}>
        Share
      </button>
      <button
        type="button"
        onClick={() =>
          open(
            `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(resolveUrl())}`,
          )
        }
        className={buttonClass}
      >
        X / Twitter
      </button>
      <button
        type="button"
        onClick={() => open(`https://wa.me/?text=${encodeURIComponent(`${text} ${resolveUrl()}`)}`)}
        className={buttonClass}
      >
        WhatsApp
      </button>
      <button
        type="button"
        onClick={() =>
          open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(resolveUrl())}`)
        }
        className={buttonClass}
      >
        Facebook
      </button>
      <button
        type="button"
        onClick={() =>
          open(
            `https://t.me/share/url?url=${encodeURIComponent(resolveUrl())}&text=${encodeURIComponent(text)}`,
          )
        }
        className={buttonClass}
      >
        Telegram
      </button>
      <button type="button" onClick={copyLink} className={buttonClass}>
        {copied ? "Copied!" : "Copy link"}
      </button>
    </div>
  );
}
