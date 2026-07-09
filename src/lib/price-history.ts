import YahooFinance from "yahoo-finance2";

const yahooFinance = new YahooFinance({ suppressNotices: ["yahooSurvey"] });

const CACHE_TTL_MS = 5 * 60 * 1000;
const cache = new Map<string, { closes: number[]; expiresAt: number }>();

/**
 * ~3 months of daily closes for a ticker. This charts the underlying
 * stock's trend, which is a proxy for the "public equity" slice of net
 * worth — it does NOT reflect the static otherAssetsUsd portion, which
 * this app doesn't track historically.
 */
export async function getPriceHistory(ticker: string): Promise<number[] | null> {
  const cached = cache.get(ticker);
  if (cached && cached.expiresAt > Date.now()) {
    return cached.closes;
  }

  try {
    const period1 = new Date();
    period1.setDate(period1.getDate() - 90);

    const result = await yahooFinance.chart(ticker, {
      period1,
      interval: "1d",
      return: "array",
    });

    const closes = result.quotes
      .map((quote) => quote.close)
      .filter((close): close is number => typeof close === "number");

    if (closes.length === 0) {
      return null;
    }

    cache.set(ticker, { closes, expiresAt: Date.now() + CACHE_TTL_MS });
    return closes;
  } catch {
    return null;
  }
}
