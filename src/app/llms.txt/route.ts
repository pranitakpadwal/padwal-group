import { siteUrl } from "@/lib/site";

export const dynamic = "force-dynamic";

export async function GET() {
  const base = siteUrl();
  const body = `# Real-Time Billionaires Tracker

> A live-updating leaderboard estimating billionaire net worth from public
> stock holdings, plus a static estimate for private assets. Not affiliated
> with Forbes. Figures are directional estimates, not audited valuations.

## Lists
- [World's Billionaires](${base}/): the full tracked roster, ranked by net worth
- [India's Billionaires](${base}/india)
- [The World's Richest Women](${base}/women)
- [The Youngest Billionaires](${base}/young)

## Daily Recaps
- [Daily Recaps index](${base}/articles): one factual recap per list per day —
  today's leader, biggest gainers/losers, and rank moves, each with sourced
  numbers and an FAQ section.

## Profiles
- Individual profile pages at ${base}/billionaire/{id} include bio, current
  net worth, and a recent stock price chart where the person has a
  publicly-traded primary holding.

## Data sources
- Share prices: Yahoo Finance (unofficial API), refreshed continuously.
- Portraits: Wikipedia REST API, where available.
- Share counts, birth dates, and private-asset estimates are manually
  curated and approximate — see ${base}/ for the full methodology note in
  the site footer.
`;

  return new Response(body, {
    headers: { "content-type": "text/plain; charset=utf-8" },
  });
}
