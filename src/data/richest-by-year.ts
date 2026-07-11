/**
 * The #1 person on Forbes' annual World's Billionaires list, by year.
 * The list began in 1987, so earlier years have no global ranking.
 *
 * Net worth figures are the widely-published Forbes annual-list numbers;
 * they're omitted for a few early years where reliable figures are hard
 * to pin down. `personId` links to our roster where the person is on it.
 */

export interface RichestOfYear {
  year: number;
  name: string;
  personId?: string;
  source: string;
  country: string;
  netWorthUsd?: number;
}

export const FIRST_RANKED_YEAR = 1987;

const B = 1_000_000_000;

export const RICHEST_BY_YEAR: RichestOfYear[] = [
  { year: 1987, name: "Yoshiaki Tsutsumi", source: "Seibu (railways & real estate)", country: "Japan", netWorthUsd: 20 * B },
  { year: 1988, name: "Yoshiaki Tsutsumi", source: "Seibu (railways & real estate)", country: "Japan" },
  { year: 1989, name: "Yoshiaki Tsutsumi", source: "Seibu (railways & real estate)", country: "Japan" },
  { year: 1990, name: "Yoshiaki Tsutsumi", source: "Seibu (railways & real estate)", country: "Japan" },
  { year: 1991, name: "Taikichiro Mori", source: "Mori Building (real estate)", country: "Japan" },
  { year: 1992, name: "Taikichiro Mori", source: "Mori Building (real estate)", country: "Japan" },
  { year: 1993, name: "Yoshiaki Tsutsumi", source: "Seibu (railways & real estate)", country: "Japan" },
  { year: 1994, name: "Yoshiaki Tsutsumi", source: "Seibu (railways & real estate)", country: "Japan" },
  { year: 1995, name: "Bill Gates", source: "Microsoft", country: "United States", netWorthUsd: 12.9 * B },
  { year: 1996, name: "Bill Gates", source: "Microsoft", country: "United States", netWorthUsd: 18.5 * B },
  { year: 1997, name: "Bill Gates", source: "Microsoft", country: "United States", netWorthUsd: 36.4 * B },
  { year: 1998, name: "Bill Gates", source: "Microsoft", country: "United States", netWorthUsd: 51 * B },
  { year: 1999, name: "Bill Gates", source: "Microsoft", country: "United States", netWorthUsd: 90 * B },
  { year: 2000, name: "Bill Gates", source: "Microsoft", country: "United States", netWorthUsd: 60 * B },
  { year: 2001, name: "Bill Gates", source: "Microsoft", country: "United States", netWorthUsd: 58.7 * B },
  { year: 2002, name: "Bill Gates", source: "Microsoft", country: "United States", netWorthUsd: 52.8 * B },
  { year: 2003, name: "Bill Gates", source: "Microsoft", country: "United States", netWorthUsd: 40.7 * B },
  { year: 2004, name: "Bill Gates", source: "Microsoft", country: "United States", netWorthUsd: 46.6 * B },
  { year: 2005, name: "Bill Gates", source: "Microsoft", country: "United States", netWorthUsd: 46.5 * B },
  { year: 2006, name: "Bill Gates", source: "Microsoft", country: "United States", netWorthUsd: 50 * B },
  { year: 2007, name: "Bill Gates", source: "Microsoft", country: "United States", netWorthUsd: 56 * B },
  { year: 2008, name: "Warren Buffett", personId: "warren-buffett", source: "Berkshire Hathaway", country: "United States", netWorthUsd: 62 * B },
  { year: 2009, name: "Bill Gates", source: "Microsoft", country: "United States", netWorthUsd: 40 * B },
  { year: 2010, name: "Carlos Slim", personId: "carlos-slim", source: "Telecom (América Móvil)", country: "Mexico", netWorthUsd: 53.5 * B },
  { year: 2011, name: "Carlos Slim", personId: "carlos-slim", source: "Telecom (América Móvil)", country: "Mexico", netWorthUsd: 74 * B },
  { year: 2012, name: "Carlos Slim", personId: "carlos-slim", source: "Telecom (América Móvil)", country: "Mexico", netWorthUsd: 69 * B },
  { year: 2013, name: "Carlos Slim", personId: "carlos-slim", source: "Telecom (América Móvil)", country: "Mexico", netWorthUsd: 73 * B },
  { year: 2014, name: "Bill Gates", source: "Microsoft", country: "United States", netWorthUsd: 76 * B },
  { year: 2015, name: "Bill Gates", source: "Microsoft", country: "United States", netWorthUsd: 79.2 * B },
  { year: 2016, name: "Bill Gates", source: "Microsoft", country: "United States", netWorthUsd: 75 * B },
  { year: 2017, name: "Bill Gates", source: "Microsoft", country: "United States", netWorthUsd: 86 * B },
  { year: 2018, name: "Jeff Bezos", personId: "jeff-bezos", source: "Amazon", country: "United States", netWorthUsd: 112 * B },
  { year: 2019, name: "Jeff Bezos", personId: "jeff-bezos", source: "Amazon", country: "United States", netWorthUsd: 131 * B },
  { year: 2020, name: "Jeff Bezos", personId: "jeff-bezos", source: "Amazon", country: "United States", netWorthUsd: 113 * B },
  { year: 2021, name: "Jeff Bezos", personId: "jeff-bezos", source: "Amazon", country: "United States", netWorthUsd: 177 * B },
  { year: 2022, name: "Elon Musk", personId: "elon-musk", source: "Tesla, SpaceX", country: "United States", netWorthUsd: 219 * B },
  { year: 2023, name: "Bernard Arnault", personId: "bernard-arnault", source: "LVMH", country: "France", netWorthUsd: 211 * B },
  { year: 2024, name: "Bernard Arnault", personId: "bernard-arnault", source: "LVMH", country: "France", netWorthUsd: 233 * B },
  { year: 2025, name: "Elon Musk", personId: "elon-musk", source: "Tesla, SpaceX", country: "United States", netWorthUsd: 342 * B },
  { year: 2026, name: "Elon Musk", personId: "elon-musk", source: "Tesla, SpaceX, xAI", country: "United States", netWorthUsd: 839 * B },
];

export function richestInYear(year: number): RichestOfYear | undefined {
  return RICHEST_BY_YEAR.find((entry) => entry.year === year);
}
