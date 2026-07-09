import YahooFinance from "yahoo-finance2";
import { billionaires, type Billionaire } from "@/data/billionaires";
import { calculateAge } from "@/lib/age";
import { getPhotoUrls } from "@/lib/photos";

const yahooFinance = new YahooFinance({ suppressNotices: ["yahooSurvey"] });

export interface RankedBillionaire {
  rank: number;
  id: string;
  name: string;
  gender: "female" | "male";
  age: number;
  country: string;
  primarySource: string;
  industry: string;
  bio: string;
  photoUrl: string | null;
  ticker: string | null;
  netWorthUsd: number;
  dayChangeUsd: number;
  dayChangePercent: number;
  sharePrice: number | null;
  currency: string | null;
  marketState: string | null;
}

export interface Leaderboard {
  people: RankedBillionaire[];
  topGainers: RankedBillionaire[];
  topLosers: RankedBillionaire[];
  asOf: string;
  stale: boolean;
  warning: string | null;
}

const CACHE_TTL_MS = 20_000;
const MOVERS_COUNT = 6;

let cache: { leaderboard: Leaderboard; expiresAt: number } | null = null;
let inFlight: Promise<Leaderboard> | null = null;

type QuoteInfo = { priceUsd: number; changeUsd: number; currency?: string; marketState?: string };

export function selectMovers(
  people: RankedBillionaire[],
  count: number = MOVERS_COUNT,
): { topGainers: RankedBillionaire[]; topLosers: RankedBillionaire[] } {
  const movers = people.filter((person) => person.dayChangeUsd !== 0);
  const topGainers = [...movers].sort((a, b) => b.dayChangeUsd - a.dayChangeUsd).slice(0, count);
  const topLosers = [...movers].sort((a, b) => a.dayChangeUsd - b.dayChangeUsd).slice(0, count);
  return { topGainers, topLosers };
}

function computeLeaderboard(
  people: Billionaire[],
  quotesBySymbol: Map<string, QuoteInfo>,
  photosByTitle: Map<string, string | null>,
): Leaderboard {
  const ranked = people.map((person) => {
    const quote = person.ticker ? quotesBySymbol.get(person.ticker) : undefined;
    const price = quote?.priceUsd ?? null;
    const changePerShare = quote?.changeUsd ?? 0;
    const sharesHeld = person.sharesHeld ?? 0;

    const netWorthUsd = price !== null ? sharesHeld * price + person.otherAssetsUsd : person.otherAssetsUsd;
    const dayChangeUsd = sharesHeld * changePerShare;
    const previousNetWorth = netWorthUsd - dayChangeUsd;
    const dayChangePercent = previousNetWorth > 0 ? (dayChangeUsd / previousNetWorth) * 100 : 0;

    return {
      id: person.id,
      name: person.name,
      gender: person.gender,
      age: calculateAge(person.birthDate),
      country: person.country,
      primarySource: person.primarySource,
      industry: person.industry,
      bio: person.bio,
      photoUrl: photosByTitle.get(person.wikipediaTitle) ?? null,
      ticker: person.ticker ?? null,
      netWorthUsd,
      dayChangeUsd,
      dayChangePercent,
      sharePrice: price,
      currency: quote?.currency ?? null,
      marketState: quote?.marketState ?? null,
    };
  });

  ranked.sort((a, b) => b.netWorthUsd - a.netWorthUsd);
  const rankedWithPositions = ranked.map((person, index) => ({ ...person, rank: index + 1 }));
  const { topGainers, topLosers } = selectMovers(rankedWithPositions);

  return {
    people: rankedWithPositions,
    topGainers,
    topLosers,
    asOf: new Date().toISOString(),
    stale: false,
    warning: null,
  };
}

/**
 * Yahoo Finance returns prices in the security's native currency (e.g. EUR
 * for a Euronext Paris listing, INR for an NSE listing). We convert
 * everything to USD using live FX quotes so net worth stays comparable
 * across people. If a currency's FX rate can't be fetched, that person's
 * live price is treated as unavailable (falls back to otherAssetsUsd)
 * rather than silently mixing currencies.
 */
async function getUsdFxRates(currencies: string[]): Promise<Map<string, number>> {
  const uniqueNonUsd = Array.from(new Set(currencies)).filter(
    (currency) => currency && currency !== "USD",
  );

  const rates = new Map<string, number>();
  if (uniqueNonUsd.length === 0) {
    return rates;
  }

  try {
    const fxSymbols = uniqueNonUsd.map((currency) => `${currency}USD=X`);
    const fxQuotes = await yahooFinance.quote(fxSymbols, { return: "map" });
    for (const currency of uniqueNonUsd) {
      const rate = fxQuotes.get(`${currency}USD=X`)?.regularMarketPrice;
      if (typeof rate === "number") {
        rates.set(currency, rate);
      }
    }
  } catch {
    // Leave rates empty; affected currencies simply won't resolve below.
  }

  return rates;
}

async function fetchLeaderboard(): Promise<Leaderboard> {
  const symbols = Array.from(
    new Set(billionaires.map((b) => b.ticker).filter((ticker): ticker is string => Boolean(ticker))),
  );
  const wikipediaTitles = billionaires.map((b) => b.wikipediaTitle);

  const [quotes, photosByTitle] = await Promise.all([
    yahooFinance.quote(symbols, { return: "map" }),
    getPhotoUrls(wikipediaTitles),
  ]);

  const currencies = Array.from(quotes.values())
    .map((quote) => quote.currency)
    .filter((currency): currency is string => Boolean(currency));
  const fxRates = await getUsdFxRates(currencies);

  const quotesBySymbol = new Map<string, QuoteInfo>();
  for (const [symbol, quote] of quotes.entries()) {
    const price = quote.regularMarketPrice;
    if (typeof price !== "number") {
      continue;
    }

    const currency = quote.currency;
    const fxRate = !currency || currency === "USD" ? 1 : fxRates.get(currency);
    if (fxRate === undefined) {
      // Non-USD currency with no live FX rate — skip rather than mixing units.
      continue;
    }

    quotesBySymbol.set(symbol, {
      priceUsd: price * fxRate,
      changeUsd: (quote.regularMarketChange ?? 0) * fxRate,
      currency: quote.currency,
      marketState: quote.marketState,
    });
  }

  return computeLeaderboard(billionaires, quotesBySymbol, photosByTitle);
}

/**
 * Returns a leaderboard, serving a short-lived cache to keep us well under
 * Yahoo Finance's unofficial rate limits even if many browser tabs are
 * polling this endpoint at once. Falls back to the last good snapshot
 * (marked stale) if a refresh fails.
 */
export async function getLeaderboard(): Promise<Leaderboard> {
  const now = Date.now();

  if (cache && cache.expiresAt > now) {
    return cache.leaderboard;
  }

  if (inFlight) {
    return inFlight;
  }

  inFlight = fetchLeaderboard()
    .then((leaderboard) => {
      cache = { leaderboard, expiresAt: Date.now() + CACHE_TTL_MS };
      return leaderboard;
    })
    .catch((error) => {
      const message = error instanceof Error ? error.message : String(error);

      if (cache) {
        return {
          ...cache.leaderboard,
          stale: true,
          warning: `Live prices unavailable, showing last known snapshot: ${message}`,
        };
      }

      // No cache yet (e.g. first request, or the quote provider is
      // unreachable) — degrade to the "other assets" estimate only rather
      // than failing the whole page. Cache the degraded result briefly too,
      // so a sustained outage doesn't retry the upstream on every request.
      const degraded: Leaderboard = {
        ...computeLeaderboard(billionaires, new Map(), new Map()),
        stale: true,
        warning: `Live prices unavailable: ${message}`,
      };
      cache = { leaderboard: degraded, expiresAt: Date.now() + CACHE_TTL_MS };
      return degraded;
    })
    .finally(() => {
      inFlight = null;
    });

  return inFlight;
}

export function findBillionaireById(id: string): Billionaire | undefined {
  return billionaires.find((person) => person.id === id);
}
