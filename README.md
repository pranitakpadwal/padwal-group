# Real-Time Billionaires Tracker

A live-updating leaderboard inspired by Forbes' Real-Time Billionaires,
estimating net worth from public stock prices. Built with Next.js (App
Router) and [`yahoo-finance2`](https://github.com/gadicc/yahoo-finance2)
for market data.

## How it works

- `src/data/billionaires.ts` — a curated roster of people, each with their
  main publicly-traded ticker, an approximate share count, and a static
  estimate for everything else (private companies, cash, real estate, art,
  etc.).
- `src/lib/net-worth.ts` — fetches live quotes for every ticker, computes
  `net worth = shares held × current price + other assets`, ranks
  everyone, and caches the result for ~20s so concurrent visitors don't
  each trigger a fresh upstream call. If the quote provider is unreachable,
  it degrades to the static "other assets" estimate and flags the response
  as stale rather than failing the page.
- `src/app/api/billionaires/route.ts` — serves that leaderboard as JSON.
- `src/app/page.tsx` + `src/components/Leaderboard.tsx` — renders the
  table server-side for a fast first paint, then polls the API client-side
  every 20s to keep numbers moving.

### Important data caveats

This is **not** a Forbes data feed and isn't affiliated with Forbes. A few
things to know before you rely on it:

1. **Only the public-equity portion is truly "live."** Forbes' real
   figures also fold in private company valuations, real estate, art, etc.
   — none of which is available from any public API. The `otherAssetsUsd`
   field is a static placeholder you should periodically update by hand.
2. **Share counts are manually curated estimates**, not pulled from a live
   filings feed. Revisit them against SEC 13D/13G/Form 4 filings or other
   public sources periodically — insiders' holdings change with sales,
   grants, and pledges.
3. **`yahoo-finance2` is an unofficial client** for an undocumented Yahoo
   endpoint. It works well in practice but can break without notice. If
   you need contractual reliability, swap `src/lib/net-worth.ts` to a paid
   provider (Finnhub, Alpha Vantage, IEX Cloud, Polygon.io, etc.) — the
   rest of the app only depends on the `RankedBillionaire`/`Leaderboard`
   shapes, not on where the quotes come from.
4. **Outbound network access must be allowed** to Yahoo's quote endpoints
   (`query1.finance.yahoo.com`, `fc.yahoo.com`) from wherever this is
   hosted. If quotes never populate, that's almost always a network/egress
   policy issue on the host, not a bug in the app — the leaderboard falls
   back to the static estimate and shows a "Live prices unavailable"
   banner when it can't reach the provider.

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
5. No environment variables are required for the default Yahoo Finance
   data source. If you switch to a paid market-data provider, add its API
   key under **Variables** and read it via `process.env` in
   `src/lib/net-worth.ts`.

## Extending the roster

Add or edit entries in `src/data/billionaires.ts`. Each person needs:

- `ticker` — must be a symbol `yahoo-finance2` recognizes (append exchange
  suffixes for non-US listings, e.g. `MC.PA` for LVMH on Euronext Paris,
  `RELIANCE.NS` for Reliance Industries on the NSE).
- `sharesHeld` — approximate shares in that ticker.
- `otherAssetsUsd` — a static estimate (USD) for wealth outside that
  ticker.

The leaderboard re-sorts and re-ranks automatically on every refresh.
