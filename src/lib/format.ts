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
