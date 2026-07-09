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
 * `birthDate`, `industry`, `bio`, and `wikipediaTitle` are static
 * biographical fields. Treat all of it as directional estimates, not
 * authoritative figures — verify and refresh periodically against current
 * filings and sources.
 */

export interface Billionaire {
  id: string;
  name: string;
  country: string;
  primarySource: string;
  industry: string;
  /** ISO date string, used to compute a live age. */
  birthDate: string;
  bio: string;
  /** Wikipedia article title (underscored), used to look up a portrait. */
  wikipediaTitle: string;
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
    industry: "Automotive & Aerospace",
    birthDate: "1971-06-28",
    bio: "Co-founder and CEO of Tesla and SpaceX; also owns X (formerly Twitter) and founded The Boring Company and Neuralink.",
    wikipediaTitle: "Elon_Musk",
    ticker: "TSLA",
    sharesHeld: 411_000_000,
    otherAssetsUsd: 150_000_000_000,
  },
  {
    id: "jeff-bezos",
    name: "Jeff Bezos",
    country: "United States",
    primarySource: "Amazon",
    industry: "Technology & E-commerce",
    birthDate: "1964-01-12",
    bio: "Founder of Amazon and Blue Origin; owns The Washington Post.",
    wikipediaTitle: "Jeff_Bezos",
    ticker: "AMZN",
    sharesHeld: 920_000_000,
    otherAssetsUsd: 40_000_000_000,
  },
  {
    id: "mark-zuckerberg",
    name: "Mark Zuckerberg",
    country: "United States",
    primarySource: "Meta Platforms",
    industry: "Technology & Social Media",
    birthDate: "1984-05-14",
    bio: "Co-founder, chairman, and CEO of Meta Platforms (Facebook, Instagram, WhatsApp).",
    wikipediaTitle: "Mark_Zuckerberg",
    ticker: "META",
    sharesHeld: 350_000_000,
    otherAssetsUsd: 30_000_000_000,
  },
  {
    id: "larry-ellison",
    name: "Larry Ellison",
    country: "United States",
    primarySource: "Oracle",
    industry: "Technology & Software",
    birthDate: "1944-08-17",
    bio: "Co-founder and chairman of Oracle Corporation.",
    wikipediaTitle: "Larry_Ellison",
    ticker: "ORCL",
    sharesHeld: 1_100_000_000,
    otherAssetsUsd: 15_000_000_000,
  },
  {
    id: "larry-page",
    name: "Larry Page",
    country: "United States",
    primarySource: "Alphabet (Google)",
    industry: "Technology & Internet",
    birthDate: "1973-03-26",
    bio: "Co-founder of Google, former CEO of Alphabet Inc.",
    wikipediaTitle: "Larry_Page",
    ticker: "GOOGL",
    sharesHeld: 340_000_000,
    otherAssetsUsd: 10_000_000_000,
  },
  {
    id: "sergey-brin",
    name: "Sergey Brin",
    country: "United States",
    primarySource: "Alphabet (Google)",
    industry: "Technology & Internet",
    birthDate: "1973-08-21",
    bio: "Co-founder of Google, former president of Alphabet Inc.",
    wikipediaTitle: "Sergey_Brin",
    ticker: "GOOGL",
    sharesHeld: 325_000_000,
    otherAssetsUsd: 10_000_000_000,
  },
  {
    id: "steve-ballmer",
    name: "Steve Ballmer",
    country: "United States",
    primarySource: "Microsoft",
    industry: "Technology",
    birthDate: "1956-03-24",
    bio: "Former CEO of Microsoft and owner of the Los Angeles Clippers.",
    wikipediaTitle: "Steve_Ballmer",
    ticker: "MSFT",
    sharesHeld: 333_000_000,
    otherAssetsUsd: 5_000_000_000,
  },
  {
    id: "warren-buffett",
    name: "Warren Buffett",
    country: "United States",
    primarySource: "Berkshire Hathaway",
    industry: "Finance & Investments",
    birthDate: "1930-08-30",
    bio: "Chairman and CEO of Berkshire Hathaway, known as one of the most successful investors in history.",
    wikipediaTitle: "Warren_Buffett",
    ticker: "BRK-B",
    sharesHeld: 208_000_000,
    otherAssetsUsd: 2_000_000_000,
  },
  {
    id: "bernard-arnault",
    name: "Bernard Arnault",
    country: "France",
    primarySource: "LVMH",
    industry: "Fashion & Luxury Goods",
    birthDate: "1949-03-05",
    bio: "Chairman and CEO of LVMH Moët Hennessy Louis Vuitton, the world's largest luxury goods company.",
    wikipediaTitle: "Bernard_Arnault",
    ticker: "MC.PA",
    sharesHeld: 210_000_000,
    otherAssetsUsd: 20_000_000_000,
  },
  {
    id: "mukesh-ambani",
    name: "Mukesh Ambani",
    country: "India",
    primarySource: "Reliance Industries",
    industry: "Diversified (Energy, Telecom, Retail)",
    birthDate: "1957-04-19",
    bio: "Chairman and managing director of Reliance Industries, India's most valuable company.",
    wikipediaTitle: "Mukesh_Ambani",
    ticker: "RELIANCE.NS",
    sharesHeld: 670_000_000,
    otherAssetsUsd: 15_000_000_000,
  },
  {
    id: "jensen-huang",
    name: "Jensen Huang",
    country: "United States",
    primarySource: "Nvidia",
    industry: "Technology & Semiconductors",
    birthDate: "1963-02-17",
    bio: "Co-founder and CEO of Nvidia, the dominant maker of AI accelerator chips.",
    wikipediaTitle: "Jensen_Huang",
    ticker: "NVDA",
    sharesHeld: 800_000_000,
    otherAssetsUsd: 5_000_000_000,
  },
  {
    id: "michael-dell",
    name: "Michael Dell",
    country: "United States",
    primarySource: "Dell Technologies",
    industry: "Technology & Computer Hardware",
    birthDate: "1965-02-23",
    bio: "Founder, chairman, and CEO of Dell Technologies.",
    wikipediaTitle: "Michael_Dell",
    ticker: "DELL",
    sharesHeld: 700_000_000,
    otherAssetsUsd: 20_000_000_000,
  },
  {
    id: "phil-knight",
    name: "Phil Knight",
    country: "United States",
    primarySource: "Nike",
    industry: "Fashion & Retail",
    birthDate: "1938-02-24",
    bio: "Co-founder and chairman emeritus of Nike, Inc.",
    wikipediaTitle: "Phil_Knight",
    ticker: "NKE",
    sharesHeld: 240_000_000,
    otherAssetsUsd: 5_000_000_000,
  },
  {
    id: "jim-walton",
    name: "Jim Walton",
    country: "United States",
    primarySource: "Walmart",
    industry: "Retail",
    birthDate: "1948-06-07",
    bio: "Youngest son of Walmart founder Sam Walton; chairman of Arvest Bank.",
    wikipediaTitle: "Jim_Walton",
    ticker: "WMT",
    sharesHeld: 490_000_000,
    otherAssetsUsd: 5_000_000_000,
  },
  {
    id: "rob-walton",
    name: "Rob Walton",
    country: "United States",
    primarySource: "Walmart",
    industry: "Retail",
    birthDate: "1944-10-28",
    bio: "Eldest son of Walmart founder Sam Walton; former chairman of Walmart's board.",
    wikipediaTitle: "Rob_Walton",
    ticker: "WMT",
    sharesHeld: 480_000_000,
    otherAssetsUsd: 5_000_000_000,
  },
];
