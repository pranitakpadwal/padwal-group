import YahooFinance from "yahoo-finance2";
import { withTimeout } from "@/lib/with-timeout";

const yahooFinance = new YahooFinance({ suppressNotices: ["yahooSurvey"] });

const CACHE_TTL_MS = 60_000;
const FETCH_TIMEOUT_MS = 8_000;
const cache = new Map<string, { summary: StockSummary | null; expiresAt: number }>();

export interface StockSummary {
  symbol: string;
  name: string | null;
  price: number | null;
  currency: string | null;
  changePercent: number | null;
  /** Market cap in the stock's native currency. */
  marketCap: number | null;
}

/**
 * Live summary for a single ticker, used by /stock/[ticker] and (indirectly,
 * via calculator-data.ts) the company-stake calculator. Cached for a minute
 * per ticker and hard-timed-out at 8s so a slow Yahoo response can never
 * block the page it's rendering on — an unbounded call here previously
 * risked the whole request hanging, which is indistinguishable from a dead
 * server to a crawler timing out the connection.
 */
export async function getStockSummary(ticker: string): Promise<StockSummary | null> {
  const cached = cache.get(ticker);
  if (cached && cached.expiresAt > Date.now()) {
    return cached.summary;
  }

  const quote = await withTimeout(yahooFinance.quote(ticker), FETCH_TIMEOUT_MS, null).catch(() => null);

  const summary: StockSummary | null =
    quote && quote.symbol
      ? {
          symbol: quote.symbol,
          name: quote.longName ?? quote.shortName ?? null,
          price: typeof quote.regularMarketPrice === "number" ? quote.regularMarketPrice : null,
          currency: quote.currency ?? null,
          changePercent:
            typeof quote.regularMarketChangePercent === "number" ? quote.regularMarketChangePercent : null,
          marketCap: typeof quote.marketCap === "number" ? quote.marketCap : null,
        }
      : (cached?.summary ?? null); // fetch failed/timed out — stale beats nothing

  cache.set(ticker, { summary, expiresAt: Date.now() + CACHE_TTL_MS });
  return summary;
}
