import { getStockSummary } from "@/lib/stock";
import { getLeaderboard } from "@/lib/net-worth";

/** Well-known US-listed companies (USD market caps) for the "own a piece" calculator. */
export const CALCULATOR_COMPANIES: { ticker: string; name: string }[] = [
  { ticker: "TSLA", name: "Tesla" },
  { ticker: "NVDA", name: "Nvidia" },
  { ticker: "AMZN", name: "Amazon" },
  { ticker: "META", name: "Meta Platforms" },
  { ticker: "GOOGL", name: "Alphabet (Google)" },
  { ticker: "MSFT", name: "Microsoft" },
  { ticker: "ORCL", name: "Oracle" },
  { ticker: "DELL", name: "Dell Technologies" },
  { ticker: "NKE", name: "Nike" },
  { ticker: "WMT", name: "Walmart" },
  { ticker: "BRK-B", name: "Berkshire Hathaway" },
  { ticker: "SPOT", name: "Spotify" },
  { ticker: "ABNB", name: "Airbnb" },
  { ticker: "SNAP", name: "Snap" },
];

export interface CompanyCap {
  ticker: string;
  name: string;
  marketCapUsd: number;
}

export async function getCompanyCaps(): Promise<CompanyCap[]> {
  const results = await Promise.all(
    CALCULATOR_COMPANIES.map(async (company) => {
      const summary = await getStockSummary(company.ticker);
      const cap =
        summary && summary.marketCap !== null && (summary.currency === "USD" || summary.currency === null)
          ? summary.marketCap
          : null;
      return cap !== null ? { ...company, marketCapUsd: cap } : null;
    }),
  );
  return results.filter((c): c is CompanyCap => c !== null).sort((a, b) => b.marketCapUsd - a.marketCapUsd);
}

export interface RosterEntry {
  id: string;
  name: string;
  netWorthUsd: number;
}

export async function getRosterNetWorths(): Promise<RosterEntry[]> {
  const leaderboard = await getLeaderboard();
  return leaderboard.people.map((p) => ({ id: p.id, name: p.name, netWorthUsd: p.netWorthUsd }));
}
