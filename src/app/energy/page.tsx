import type { Metadata } from "next";
import Link from "next/link";
import { getLeaderboard } from "@/lib/net-worth";
import { getMarketQuotes } from "@/lib/markets";
import { ENERGY_CONTRACTS, ENERGY_BILLIONAIRES } from "@/data/markets";
import { formatUsdCompact } from "@/lib/format";
import { siteUrl } from "@/lib/site";
import MarketQuotesTable from "@/components/MarketQuotesTable";
import PersonAvatar from "@/components/PersonAvatar";
import Breadcrumbs from "@/components/Breadcrumbs";
import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Oil, Gas & Fuel Prices Live + The Energy Billionaires",
  description:
    "Real-time crude oil (WTI & Brent), natural gas, petrol, and diesel prices — and the global billionaires whose fortunes are built on energy, from Mukesh Ambani's Jamnagar refinery to the Dangote Refinery.",
  keywords: [
    "crude oil price live",
    "brent crude price",
    "natural gas price today",
    "petrol price",
    "diesel price",
    "oil billionaires",
    "energy billionaires",
  ],
  alternates: { canonical: `${siteUrl()}/energy` },
};

export default async function EnergyPage() {
  const [quotes, leaderboard] = await Promise.all([
    getMarketQuotes(ENERGY_CONTRACTS.map((c) => c.symbol)),
    getLeaderboard(),
  ]);

  const energyPeople = ENERGY_BILLIONAIRES.map((entry) => {
    const person = leaderboard.people.find((p) => p.id === entry.id);
    return person ? { person, energyNote: entry.energyNote } : null;
  }).filter((item) => item !== null);

  return (
    <div className="flex flex-1 flex-col">
      <SiteHeader activeCategory="energy" />
      <main className="mx-auto flex w-full max-w-5xl flex-1 flex-col gap-8 px-4 py-8 sm:px-8">
        <Breadcrumbs crumbs={[{ label: "Energy & Oil" }]} />
        <header>
          <h1 className="font-display text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
            Energy Markets & The Billionaires Behind Them
          </h1>
          <p className="mt-2 max-w-2xl text-foreground/70">
            Live benchmark prices for crude oil, natural gas, petrol, and
            diesel — and the billionaires whose empires run on refineries,
            pipelines, and power plants.
          </p>
        </header>

        <section aria-labelledby="prices-heading" className="flex flex-col gap-3">
          <h2 id="prices-heading" className="text-lg font-bold">
            Live Energy Prices
          </h2>
          <MarketQuotesTable symbols={ENERGY_CONTRACTS} quotes={quotes} />
          <p className="text-xs text-neutral-400">
            Front-month futures prices from Yahoo Finance (NYMEX/ICE), quoted
            in USD. These are wholesale benchmarks — pump prices add refining
            margins, distribution, and local taxes on top.
          </p>
        </section>

        <section aria-labelledby="people-heading" className="flex flex-col gap-3">
          <h2 id="people-heading" className="text-lg font-bold">
            The Energy Billionaires
          </h2>
          <div className="flex flex-col gap-3">
            {energyPeople.map(({ person, energyNote }) => (
              <Link
                key={person.id}
                href={`/billionaire/${person.id}`}
                className="flex flex-col gap-2 rounded-2xl border border-line bg-surface p-5 transition-colors hover:border-brand sm:flex-row sm:items-center sm:gap-4"
              >
                <div className="flex items-center gap-3 sm:w-64 sm:shrink-0">
                  <PersonAvatar name={person.name} photoUrl={person.photoUrl} size={48} />
                  <div className="min-w-0">
                    <div className="truncate font-semibold text-foreground">{person.name}</div>
                    <div className="text-xs text-foreground/60">
                      #{person.rank} · {formatUsdCompact(person.netWorthUsd)}
                    </div>
                  </div>
                </div>
                <p className="text-sm text-foreground/70">{energyNote}</p>
              </Link>
            ))}
          </div>
        </section>

        <section className="rounded-2xl border border-line bg-brand-soft/40 p-5 text-sm text-foreground/70">
          <h2 className="mb-2 font-semibold text-foreground">Why oil prices move billionaire rankings</h2>
          <p>
            Refining margins, energy stock prices, and commodity cycles feed
            directly into these fortunes. When crude spikes, refiners and
            producers swing in opposite directions — which is why a move in
            Brent can reshuffle the wealth rankings from Mumbai to Lagos.
            Where a fortune runs through a listed company (like Reliance
            Industries), we price it live; private empires use static
            estimates from public reporting.
          </p>
        </section>
      </main>
      <SiteFooter />
    </div>
  );
}
