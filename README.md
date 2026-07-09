# Real-Time Billionaires Tracker

A live-updating leaderboard inspired by Forbes' Real-Time Billionaires,
estimating net worth from public stock prices. Built with Next.js (App
Router) and [`yahoo-finance2`](https://github.com/gadicc/yahoo-finance2)
for market data.

## Pages

- `/` — World (everyone in the tracker)
- `/india` — India's Billionaires
- `/women` — The Richest Women
- `/young` — Billionaires under 45
- `/billionaire/[id]` — per-person profile page (bio, stats, ~3-month stock
  price sparkline)

All four list pages share one layout: category tabs, a "Today's Biggest
Movers" gainers/losers section, the main ranked table, and a right-hand
sidebar (quick stats, today's top mover, links to the other lists).

## How it works

- `src/data/billionaires.ts` — a curated roster of ~35 people. Each has a
  gender, country, industry, bio, birth date (age is computed live, not
  hardcoded), and either a publicly-traded `ticker` + `sharesHeld`, or — for
  people whose wealth is almost entirely in a private company (e.g. Koch
  Industries, Mars, Fidelity) — no ticker at all, just a static
  `otherAssetsUsd` estimate.
- `src/lib/net-worth.ts` — fetches live quotes for every ticker, converts
  non-USD prices (EUR, INR, etc.) to USD using live FX quotes, computes
  `net worth = shares held × current USD price + other assets`, ranks
  everyone, and caches the result for ~20s so concurrent visitors don't
  each trigger a fresh upstream call. If a quote or FX rate is unavailable,
  that person's live price is treated as unavailable (falls back to the
  static estimate) rather than risking a wrong-currency number.
- `src/lib/categories.ts` — filters the full roster into World/India/
  Women/Young views, re-ranking and recomputing gainers/losers within each
  scoped list.
- `src/app/api/billionaires/route.ts` — serves a (optionally
  `?category=`-scoped) leaderboard as JSON; the client polls this every 20s.
- `src/components/CategoryLeaderboardPage.tsx` — the shared server
  component every list route renders, wiring together the header/tabs,
  movers section, table, and sidebar.
- `src/components/MoversStrip.tsx` — "Today's Biggest Movers": top 6
  gainers and losers by dollar change, above the main table.
- `src/components/Sidebar.tsx` — quick stats (people tracked, combined net
  worth, average age), today's single biggest mover, and links to the
  other category lists.
- `src/lib/photos.ts` — best-effort portrait lookup via Wikipedia's public
  REST summary API (cached ~24h), falling back to initials avatars
  (`src/components/PersonAvatar.tsx`) when unavailable.
- `src/lib/price-history.ts` + `src/components/Sparkline.tsx` — a
  ~3-month daily price chart on profile pages, for people who have a
  ticker. It reflects the ticker's price only — the static
  `otherAssetsUsd` portion has no historical data to chart.
- SEO: `src/app/sitemap.ts`, `src/app/robots.ts`, per-page `metadata`
  (title/description/OpenGraph/Twitter), and JSON-LD (`ItemList` on list
  pages, `Person` on profile pages).

### Important data caveats

This is **not** a Forbes data feed and isn't affiliated with Forbes. A few
things to know before you rely on it:

1. **Only the public-equity portion is truly "live."** Forbes' real
   figures also fold in private company valuations, real estate, art, etc.
   — none of which is available from any public API. The `otherAssetsUsd`
   field is a static placeholder you should periodically update by hand.
2. **Share counts, birth dates, and gender are manually curated**, not
   pulled from a live filings feed. Revisit share counts against SEC
   13D/13G/Form 4 filings or other public sources periodically — insiders'
   holdings change with sales, grants, and pledges. The "Young" cutoff
   (`YOUNG_AGE_THRESHOLD` in `src/lib/categories.ts`) is arbitrary — change
   it if you want a different bar.
3. **`yahoo-finance2` is an unofficial client** for an undocumented Yahoo
   endpoint. It works well in practice but can break without notice. If
   you need contractual reliability, swap `src/lib/net-worth.ts` to a paid
   provider (Finnhub, Alpha Vantage, IEX Cloud, Polygon.io, etc.) — the
   rest of the app only depends on the `RankedBillionaire`/`Leaderboard`
   shapes, not on where the quotes come from.
4. **Outbound network access must be allowed** to Yahoo's quote endpoints
   (`query1.finance.yahoo.com`, `fc.yahoo.com`) and Wikipedia's REST API
   (`en.wikipedia.org`) from wherever this is hosted. If quotes or photos
   never populate, that's almost always a network/egress policy issue on
   the host, not a bug in the app — the leaderboard falls back to the
   static estimate / initials avatars and shows a "Live prices
   unavailable" banner when it can't reach a provider.
5. **Portraits are pulled from Wikipedia's REST API**, not a licensed
   photo feed — see the note in `src/lib/photos.ts`. Fine for a personal
   project; swap in a licensed image source before using this
   commercially.

## Getting started locally

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Deploying to Railway

1. Push this repo to GitHub (already done if you're reading this from the
   repo).
2. In Railway, **New Project → Deploy from GitHub repo** and pick this
   repository.
3. Railway auto-detects Next.js via Nixpacks — no extra config needed. It
   will run `npm install`, `npm run build`, then `npm run start` (which
   Next.js binds to Railway's `$PORT` automatically).
4. Once deployed, go to the service's **Settings → Networking** and either
   use the generated `*.up.railway.app` domain or add your own custom
   domain there (Railway will show you the CNAME/A record to add at your
   registrar).
5. **Set `NEXT_PUBLIC_SITE_URL`** under **Variables** to your real deployed
   URL (e.g. `https://yourdomain.com`), without a trailing slash. It's used
   for canonical URLs, Open Graph tags, and the sitemap — without it,
   those all fall back to `http://localhost:3000`, which is fine for local
   dev but wrong once deployed.
6. No other environment variables are required for the default Yahoo
   Finance data source. If you switch to a paid market-data provider, add
   its API key under **Variables** and read it via `process.env` in
   `src/lib/net-worth.ts`.

## Extending the roster

Add or edit entries in `src/data/billionaires.ts`. Each person needs:

- `gender` — `"female"` or `"male"` (drives the `/women` list).
- `birthDate` — ISO date; age is computed live, not stored.
- `ticker` (optional) — must be a symbol `yahoo-finance2` recognizes;
  append exchange suffixes for non-US listings (e.g. `MC.PA` for LVMH on
  Euronext Paris, `RELIANCE.NS` for Reliance Industries on the NSE, `BMW.DE`
  for BMW on Xetra). Omit entirely for people whose wealth is essentially
  all in a private company.
- `sharesHeld` (optional, only meaningful with `ticker`) — approximate
  shares held.
- `otherAssetsUsd` — a static estimate (USD) for wealth outside the
  ticker, or the person's ENTIRE net worth estimate if there's no ticker.

The India/Women/Young lists are just filters (`src/lib/categories.ts`)
over this same roster — adding an Indian or woman billionaire to the array
automatically makes them show up on the relevant list, re-ranked among
their peers.
