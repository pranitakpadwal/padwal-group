import YahooFinance from "yahoo-finance2";
import { getLeaderboard } from "@/lib/net-worth";
import { getUsdRates } from "@/lib/fx";
import { withTimeout } from "@/lib/with-timeout";

const yahooFinance = new YahooFinance({ suppressNotices: ["yahooSurvey"] });

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

const CACHE_TTL_MS = 60_000;
const FETCH_TIMEOUT_MS = 10_000;
let capsCache: { caps: CompanyCap[]; expiresAt: number } | null = null;

/**
 * Used to fetch every company's quote in ONE outbound request instead of 20
 * separate ones. The previous version called getStockSummary() per company
 * via Promise.all — 20 concurrent, uncached, untimed-out Yahoo Finance
 * calls on every single load of this page. That's the kind of load pattern
 * that shows up in Search Console as "server connectivity: high fail rate":
 * a slow or overloaded upstream held the whole response open, and enough of
 * those piling up (crawler + regular traffic) can make the server look down
 * to anyone else hitting it at the same time, not just this page.
 */
export async function getCompanyCaps(): Promise<CompanyCap[]> {
  if (capsCache && capsCache.expiresAt > Date.now()) {
    return capsCache.caps;
  }

  const tickers = CALCULATOR_COMPANIES.map((c) => c.ticker);
  const quotes = await withTimeout(yahooFinance.quote(tickers, { return: "map" }), FETCH_TIMEOUT_MS, null).catch(
    () => null,
  );

  if (!quotes) {
    // Fetch failed/timed out — serve stale data rather than an empty page.
    return capsCache?.caps ?? [];
  }

  const currencies = Array.from(quotes.values())
    .map((q) => q.currency)
    .filter((c): c is string => Boolean(c));
  const usdRates = await getUsdRates(currencies);

  const caps: CompanyCap[] = [];
  for (const company of CALCULATOR_COMPANIES) {
    const quote = quotes.get(company.ticker);
    if (!quote || typeof quote.marketCap !== "number" || typeof quote.regularMarketPrice !== "number") continue;
    const rate = quote.currency ? usdRates.get(quote.currency) : 1;
    if (rate === undefined) continue; // no FX rate -> skip rather than mislabel
    caps.push({
      ticker: company.ticker,
      name: company.name,
      country: company.country,
      marketCapUsd: quote.marketCap * rate,
      priceUsd: quote.regularMarketPrice * rate,
    });
  }

  caps.sort((a, b) => b.marketCapUsd - a.marketCapUsd);
  capsCache = { caps, expiresAt: Date.now() + CACHE_TTL_MS };
  return caps;
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
