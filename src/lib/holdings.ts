import { billionaires } from "@/data/billionaires";
import type { Leaderboard, RankedBillionaire } from "@/lib/net-worth";

export interface Holding {
  ticker: string;
  shares: number;
  /** Live per-share price, already converted to USD. */
  priceUsd: number | null;
  /** shares × priceUsd, in USD. */
  valueUsd: number | null;
  /** What share of the person's net worth this public stake represents. */
  pctOfNetWorth: number | null;
}

const sharesById = new Map(billionaires.map((b) => [b.id, b.sharesHeld ?? 0]));

/**
 * The person's primary publicly-traded stake: shares held, live USD value,
 * and how much of their net worth it accounts for. Null if they have no
 * ticker (privately-held fortune).
 */
export function getHolding(ranked: RankedBillionaire): Holding | null {
  if (!ranked.ticker) {
    return null;
  }
  const shares = sharesById.get(ranked.id) ?? 0;
  const priceUsd = ranked.sharePrice;
  const valueUsd = priceUsd !== null ? shares * priceUsd : null;
  const pctOfNetWorth =
    valueUsd !== null && ranked.netWorthUsd > 0 ? (valueUsd / ranked.netWorthUsd) * 100 : null;

  return { ticker: ranked.ticker, shares, priceUsd, valueUsd, pctOfNetWorth };
}

export interface TickerHolder {
  person: RankedBillionaire;
  shares: number;
  valueUsd: number | null;
}

/** Every tracked billionaire who holds a given ticker, richest stake first. */
export function getTickerHolders(leaderboard: Leaderboard, ticker: string): TickerHolder[] {
  return leaderboard.people
    .filter((person) => person.ticker === ticker)
    .map((person) => {
      const shares = sharesById.get(person.id) ?? 0;
      const valueUsd = person.sharePrice !== null ? shares * person.sharePrice : null;
      return { person, shares, valueUsd };
    })
    .sort((a, b) => (b.valueUsd ?? 0) - (a.valueUsd ?? 0));
}

/** All distinct tickers held across the roster (for sitemap / stock pages). */
export function getAllTickers(): string[] {
  return Array.from(
    new Set(billionaires.map((b) => b.ticker).filter((t): t is string => Boolean(t))),
  );
}
