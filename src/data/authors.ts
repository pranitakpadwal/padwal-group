/**
 * Staff bylines for individually-researched content (net-worth deep dives,
 * evergreen stories). Kept honest on purpose: no fabricated credentials,
 * awards, or work history — just what desk each writer covers. "News Desk"
 * is the attribution for content that's compiled automatically from live
 * market data rather than individually researched, so we never claim a
 * templated daily recap was written by a named person.
 */

export interface Author {
  id: string;
  name: string;
  title: string;
  bio: string;
}

export const AUTHORS: Record<string, Author> = {
  "pooja-k": {
    id: "pooja-k",
    name: "Pooja K",
    title: "Staff Writer, Wealth Desk",
    bio: "Writes about global wealth, markets, and the people behind the numbers for RealTimeBillionaire.",
  },
  "jahnavai-v": {
    id: "jahnavai-v",
    name: "Jahnavai V",
    title: "Staff Writer, Wealth Desk",
    bio: "Covers billionaire net worth, business empires, and wealth trends for RealTimeBillionaire.",
  },
  "uma-k": {
    id: "uma-k",
    name: "Uma K",
    title: "Staff Writer, Wealth Desk",
    bio: "Reports on tech fortunes, IPOs, and the companies driving today's biggest wealth swings for RealTimeBillionaire.",
  },
  "jai-simha": {
    id: "jai-simha",
    name: "Jai Simha",
    title: "Staff Writer, Wealth Desk",
    bio: "Focuses on Indian and Asian billionaires, family businesses, and succession stories for RealTimeBillionaire.",
  },
  "news-desk": {
    id: "news-desk",
    name: "News Desk",
    title: "Automated Market Coverage",
    bio: "Daily recaps and net-worth-movement articles compiled automatically from live market data, not individually written — labeled here for transparency rather than attributed to a person.",
  },
};

export function getAuthor(id: string): Author | undefined {
  return AUTHORS[id];
}

export function listAuthors(): Author[] {
  return Object.values(AUTHORS);
}
