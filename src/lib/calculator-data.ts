import { getStockSummary } from "@/lib/stock";
import { getLeaderboard } from "@/lib/net-worth";
import { getUsdRates } from "@/lib/fx";

/**
 * Well-known companies for the "own a piece" calculator — global, not just
 * US. Non-USD listings are converted to USD via live FX so everything is
 * comparable. Exchange suffixes: .NS = India (NSE), .PA = Euronext Paris,
 * .DE = Xetra, .SW = SIX Swiss, .T = Tokyo, .HK = Hong Kong, .KS = Korea,
 * .SR = Saudi (Tadawul), .L = London.
 */
export const CALCULATOR_COMPANIES: { ticker: string; name: string; country: string }[] = [
  { ticker: "AAPL", name: "Apple", country: "United States" },
  { ticker: "MSFT", name: "Microsoft", country: "United States" },
  { ticker: "NVDA", name: "Nvidia", country: "United States" },
  { ticker: "AMZN", name: "Amazon", country: "United States" },
  { ticker: "GOOGL", name: "Alphabet (Google)", country: "United States" },
  { ticker: "META", name: "Meta Platforms", country: "United States" },
  { ticker: "TSLA", name: "Tesla", country: "United States" },
  { ticker: "BRK-B", name: "Berkshire Hathaway", country: "United States" },
  { ticker: "WMT", name: "Walmart", country: "United States" },
  { ticker: "RELIANCE.NS", name: "Reliance Industries", country: "India" },
  { ticker: "TCS.NS", name: "Tata Consultancy Services", country: "India" },
  { ticker: "HDFCBANK.NS", name: "HDFC Bank", country: "India" },
  { ticker: "MC.PA", name: "LVMH", country: "France" },
  { ticker: "ASML", name: "ASML", country: "Netherlands" },
  { ticker: "NESN.SW", name: "Nestlé", country: "Switzerland" },
  { ticker: "TM", name: "Toyota", country: "Japan" },
  { ticker: "BABA", name: "Alibaba", country: "China" },
  { ticker: "0700.HK", name: "Tencent", country: "China" },
  { ticker: "2222.SR", name: "Saudi Aramco", country: "Saudi Arabia" },
  { ticker: "SHEL.L", name: "Shell", country: "United Kingdom" },
];

export interface CompanyCap {
  ticker: string;
  name: string;
  country: string;
  /** Market capitalization converted to USD. */
  marketCapUsd: number;
  /** Per-share price converted to USD. */
  priceUsd: number;
}

export async function getCompanyCaps(): Promise<CompanyCap[]> {
  const summaries = await Promise.all(
    CALCULATOR_COMPANIES.map(async (company) => ({
      company,
      summary: await getStockSummary(company.ticker),
    })),
  );

  const currencies = summaries
    .map((s) => s.summary?.currency)
    .filter((c): c is string => Boolean(c));
  const usdRates = await getUsdRates(currencies);

  const caps: CompanyCap[] = [];
  for (const { company, summary } of summaries) {
    if (!summary || summary.marketCap === null || summary.price === null) continue;
    const rate = summary.currency ? usdRates.get(summary.currency) : 1;
    if (rate === undefined) continue; // no FX rate -> skip rather than mislabel
    caps.push({
      ticker: company.ticker,
      name: company.name,
      country: company.country,
      marketCapUsd: summary.marketCap * rate,
      priceUsd: summary.price * rate,
    });
  }

  return caps.sort((a, b) => b.marketCapUsd - a.marketCapUsd);
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
