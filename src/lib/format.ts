const compactUsd = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  notation: "compact",
  maximumFractionDigits: 2,
});

const signedCompactUsd = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  notation: "compact",
  maximumFractionDigits: 2,
  signDisplay: "always",
});

const signedPercent = new Intl.NumberFormat("en-US", {
  style: "percent",
  maximumFractionDigits: 2,
  signDisplay: "always",
});

const plainPercent = new Intl.NumberFormat("en-US", {
  style: "percent",
  maximumFractionDigits: 2,
});

const compactNumber = new Intl.NumberFormat("en-US", {
  notation: "compact",
  maximumFractionDigits: 2,
});

/** Compact number without a currency symbol, e.g. "1.2B" — pair with a currency label. */
export function formatCompactNumber(value: number): string {
  return compactNumber.format(value);
}

/** Compact value in an arbitrary currency, e.g. "$1.2B" / "₹1.2K Cr". */
export function formatCurrencyCompact(value: number, currency: string): string {
  const locale = currency === "INR" ? "en-IN" : "en-US";
  try {
    return new Intl.NumberFormat(locale, {
      style: "currency",
      currency,
      notation: "compact",
      maximumFractionDigits: 2,
    }).format(value);
  } catch {
    return `${compactNumber.format(value)} ${currency}`;
  }
}

export function formatUsdCompact(value: number): string {
  return compactUsd.format(value);
}

export function formatUsdChange(value: number): string {
  return signedCompactUsd.format(value);
}

export function formatPercentChange(value: number): string {
  return signedPercent.format(value / 100);
}

/** Unsigned magnitude, for narrative sentences that already say "gained"/"fell". */
export function formatPercentMagnitude(value: number): string {
  return plainPercent.format(Math.abs(value) / 100);
}

export function formatClock(iso: string): string {
  return new Date(iso).toLocaleTimeString("en-US", { hour12: true });
}
