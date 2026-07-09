/**
 * Seed roster for the tracker.
 *
 * This is NOT Forbes' proprietary dataset. Forbes' real-time list blends
 * private-company valuations, real estate, art, and other assets that
 * aren't publicly disclosed anywhere. What we CAN reconstruct from public
 * sources is the publicly-traded-stock portion of a person's wealth, which
 * for most people on this list is the majority of their net worth and the
 * part that actually moves minute-to-minute.
 *
 * `sharesHeld` are rough, manually-curated figures assembled from public
 * filings (SEC 13D/13G/Form 4, proxy statements) and secondary sources.
 * `otherAssetsUsd` is a static placeholder for everything else (private
 * equity, cash, real estate, art, etc.) and does NOT update in real time.
 * Treat both as directional estimates, not authoritative figures — verify
 * and refresh them periodically against current filings.
 */

export interface Billionaire {
  id: string;
  name: string;
  country: string;
  primarySource: string;
  /** Yahoo Finance ticker symbol for their main publicly traded holding. */
  ticker: string;
  /** Approximate shares held in that ticker. */
  sharesHeld: number;
  /** Static estimate (USD) of wealth NOT captured by the ticker above. */
  otherAssetsUsd: number;
}

export const billionaires: Billionaire[] = [
  {
    id: "elon-musk",
    name: "Elon Musk",
    country: "United States",
    primarySource: "Tesla, SpaceX",
    ticker: "TSLA",
    sharesHeld: 411_000_000,
    otherAssetsUsd: 150_000_000_000,
  },
  {
    id: "jeff-bezos",
    name: "Jeff Bezos",
    country: "United States",
    primarySource: "Amazon",
    ticker: "AMZN",
    sharesHeld: 920_000_000,
    otherAssetsUsd: 40_000_000_000,
  },
  {
    id: "mark-zuckerberg",
    name: "Mark Zuckerberg",
    country: "United States",
    primarySource: "Meta Platforms",
    ticker: "META",
    sharesHeld: 350_000_000,
    otherAssetsUsd: 30_000_000_000,
  },
  {
    id: "larry-ellison",
    name: "Larry Ellison",
    country: "United States",
    primarySource: "Oracle",
    ticker: "ORCL",
    sharesHeld: 1_100_000_000,
    otherAssetsUsd: 15_000_000_000,
  },
  {
    id: "larry-page",
    name: "Larry Page",
    country: "United States",
    primarySource: "Alphabet (Google)",
    ticker: "GOOGL",
    sharesHeld: 340_000_000,
    otherAssetsUsd: 10_000_000_000,
  },
  {
    id: "sergey-brin",
    name: "Sergey Brin",
    country: "United States",
    primarySource: "Alphabet (Google)",
    ticker: "GOOGL",
    sharesHeld: 325_000_000,
    otherAssetsUsd: 10_000_000_000,
  },
  {
    id: "steve-ballmer",
    name: "Steve Ballmer",
    country: "United States",
    primarySource: "Microsoft",
    ticker: "MSFT",
    sharesHeld: 333_000_000,
    otherAssetsUsd: 5_000_000_000,
  },
  {
    id: "warren-buffett",
    name: "Warren Buffett",
    country: "United States",
    primarySource: "Berkshire Hathaway",
    ticker: "BRK-B",
    sharesHeld: 208_000_000,
    otherAssetsUsd: 2_000_000_000,
  },
  {
    id: "bernard-arnault",
    name: "Bernard Arnault",
    country: "France",
    primarySource: "LVMH",
    ticker: "MC.PA",
    sharesHeld: 210_000_000,
    otherAssetsUsd: 20_000_000_000,
  },
  {
    id: "mukesh-ambani",
    name: "Mukesh Ambani",
    country: "India",
    primarySource: "Reliance Industries",
    ticker: "RELIANCE.NS",
    sharesHeld: 670_000_000,
    otherAssetsUsd: 15_000_000_000,
  },
  {
    id: "jensen-huang",
    name: "Jensen Huang",
    country: "United States",
    primarySource: "Nvidia",
    ticker: "NVDA",
    sharesHeld: 800_000_000,
    otherAssetsUsd: 5_000_000_000,
  },
  {
    id: "michael-dell",
    name: "Michael Dell",
    country: "United States",
    primarySource: "Dell Technologies",
    ticker: "DELL",
    sharesHeld: 700_000_000,
    otherAssetsUsd: 20_000_000_000,
  },
  {
    id: "phil-knight",
    name: "Phil Knight",
    country: "United States",
    primarySource: "Nike",
    ticker: "NKE",
    sharesHeld: 240_000_000,
    otherAssetsUsd: 5_000_000_000,
  },
  {
    id: "jim-walton",
    name: "Jim Walton",
    country: "United States",
    primarySource: "Walmart",
    ticker: "WMT",
    sharesHeld: 490_000_000,
    otherAssetsUsd: 5_000_000_000,
  },
  {
    id: "rob-walton",
    name: "Rob Walton",
    country: "United States",
    primarySource: "Walmart",
    ticker: "WMT",
    sharesHeld: 480_000_000,
    otherAssetsUsd: 5_000_000_000,
  },
];
