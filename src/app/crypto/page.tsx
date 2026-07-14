import type { Metadata } from "next";
import Link from "next/link";
import { getLeaderboard } from "@/lib/net-worth";
import { getMarketQuotes } from "@/lib/markets";
import { CRYPTO_ASSETS, CRYPTO_BILLIONAIRE_IDS } from "@/data/markets";
import { formatUsdCompact, formatPercentChange } from "@/lib/format";
import { siteUrl } from "@/lib/site";
import MarketQuotesTable from "@/components/MarketQuotesTable";
import PersonAvatar from "@/components/PersonAvatar";
import Breadcrumbs from "@/components/Breadcrumbs";
import LiveWebPageJsonLd from "@/components/LiveWebPageJsonLd";
import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Crypto Billionaires & Live Crypto Prices — Real-Time Tracker",
  description:
    "Live Bitcoin, Ethereum, and crypto prices alongside the billionaires whose fortunes ride on them — Changpeng Zhao, Brian Armstrong, Michael Saylor — with real-time net worth and world rank.",
  keywords: [
    "crypto billionaires",
    "bitcoin price live",
    "richest crypto founders",
    "Changpeng Zhao net worth",
    "Brian Armstrong net worth",
    "Michael Saylor net worth",
  ],
  alternates: { canonical: `${siteUrl()}/crypto` },
};

export default async function CryptoPage() {
  const [quotes, leaderboard] = await Promise.all([
    getMarketQuotes(CRYPTO_ASSETS.map((a) => a.symbol)),
    getLeaderboard(),
  ]);

  const cryptoPeople = leaderboard.people.filter((p) =>
    CRYPTO_BILLIONAIRE_IDS.includes(p.id),
  );

  return (
    <div className="flex flex-1 flex-col">
      <SiteHeader activeCategory="crypto" />
      <main className="mx-auto flex w-full max-w-5xl flex-1 flex-col gap-8 px-4 py-8 sm:px-8">
        <Breadcrumbs crumbs={[{ label: "Crypto Wealth" }]} />
        <header>
          <h1 className="font-display text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
            Crypto Wealth, Live
          </h1>
          <p className="mt-2 max-w-2xl text-foreground/70">
            Cryptocurrency prices update around the clock — and so do the
            fortunes built on them. Live coin prices below, followed by the
            billionaires whose net worth moves with the crypto market.
          </p>
        </header>

        <section aria-labelledby="prices-heading" className="flex flex-col gap-3">
          <h2 id="prices-heading" className="text-lg font-bold">
            Live Crypto Prices
          </h2>
          <MarketQuotesTable symbols={CRYPTO_ASSETS} quotes={quotes} />
          <p className="text-xs text-neutral-400">
            Prices from Yahoo Finance, quoted in USD. Crypto trades 24/7, so
            &ldquo;today&rdquo; reflects the last 24 hours.
          </p>
        </section>

        <section aria-labelledby="people-heading" className="flex flex-col gap-3">
          <h2 id="people-heading" className="text-lg font-bold">
            The Crypto Billionaires
          </h2>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {cryptoPeople.map((person) => (
              <Link
                key={person.id}
                href={`/billionaire/${person.id}`}
                className="flex flex-col gap-3 rounded-2xl border border-line bg-surface p-5 transition-colors hover:border-brand"
              >
                <div className="flex items-center gap-3">
                  <PersonAvatar name={person.name} photoUrl={person.photoUrl} size={48} />
                  <div className="min-w-0">
                    <div className="truncate font-semibold text-foreground">{person.name}</div>
                    <div className="text-xs text-foreground/60">{person.primarySource}</div>
                  </div>
                </div>
                <div className="flex items-baseline justify-between">
                  <span className="font-display text-xl font-semibold tabular-nums text-brand-dark">
                    {formatUsdCompact(person.netWorthUsd)}
                  </span>
                  <span className="text-xs text-foreground/60">
                    #{person.rank} in the world
                  </span>
                </div>
                {person.dayChangeUsd !== 0 && (
                  <div
                    className={`text-xs font-medium tabular-nums ${person.dayChangeUsd > 0 ? "text-emerald-500" : "text-rose-500"}`}
                  >
                    {person.dayChangeUsd > 0 ? "▲" : "▼"}{" "}
                    {formatPercentChange(person.dayChangePercent)} today
                  </div>
                )}
              </Link>
            ))}
          </div>
        </section>

        <section className="rounded-2xl border border-line bg-brand-soft/40 p-5 text-sm text-foreground/70">
          <h2 className="mb-2 font-semibold text-foreground">How crypto fortunes are tracked here</h2>
          <p>
            Where a crypto fortune runs through a listed company — Brian
            Armstrong&apos;s Coinbase (COIN) stake, Michael Saylor&apos;s
            Strategy (MSTR) shares — we track it live from the share price,
            exactly like any other billionaire on the site. Fortunes held in
            private companies or directly in coins (like Changpeng
            Zhao&apos;s Binance stake) use static estimates from public
            reporting, since there&apos;s no public filing to price them
            from. Either way, these are directional estimates, not audited
            figures.
          </p>
        </section>
      </main>
      <SiteFooter />
      <LiveWebPageJsonLd
        url={`${siteUrl()}/crypto`}
        name="Crypto Billionaires & Live Crypto Prices"
        asOf={leaderboard.asOf}
      />
    </div>
  );
}
