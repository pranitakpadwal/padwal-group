import type { Metadata } from "next";
import Link from "next/link";
import { getLeaderboard } from "@/lib/net-worth";
import { getPersonHistory, type HistoryPoint } from "@/lib/snapshots";
import { siteUrl } from "@/lib/site";
import WealthRaceCalculator, { type RacePerson } from "@/components/WealthRaceCalculator";
import Breadcrumbs from "@/components/Breadcrumbs";
import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Wealth Race — Elon vs Zuckerberg (or Anyone) Over Time",
  description:
    "Pick any two billionaires and race their net worth over time, live. See who's ahead right now and how the gap has moved day by day.",
  keywords: [
    "wealth race calculator",
    "Elon Musk vs Zuckerberg net worth",
    "billionaire net worth comparison",
    "compare billionaire net worth",
  ],
  alternates: { canonical: `${siteUrl()}/calculators/wealth-race` },
};

export default async function WealthRacePage() {
  const leaderboard = await getLeaderboard();

  const roster: RacePerson[] = leaderboard.people
    .slice(0, 30)
    .map((p) => ({ id: p.id, name: p.name, netWorthUsd: p.netWorthUsd, rank: p.rank, primarySource: p.primarySource }));

  const history: Record<string, HistoryPoint[]> = {};
  for (const person of roster) {
    history[person.id] = getPersonHistory(person.id);
  }

  return (
    <div className="flex flex-1 flex-col">
      <SiteHeader activeCategory="world" />
      <main className="mx-auto flex w-full max-w-4xl flex-1 flex-col gap-6 px-4 py-8 sm:px-8">
        <Breadcrumbs crumbs={[{ label: "Calculators", href: "/calculators" }, { label: "Wealth Race" }]} />
        <header>
          <h1 className="font-display text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
            Wealth Race
          </h1>
          <p className="mt-2 max-w-2xl text-foreground/70">
            Pick any two billionaires and watch their fortunes race over
            time — live current numbers, plus how the gap has moved day by
            day.
          </p>
          <Link
            href="/calculators/articles/how-often-is-the-worlds-richest-person-actually-in-first"
            className="mt-2 inline-block text-sm font-medium text-brand hover:underline"
          >
            Read: How often is the world&apos;s richest person actually in first place? &rarr;
          </Link>
        </header>
        <WealthRaceCalculator roster={roster} history={history} />
      </main>
      <SiteFooter />
    </div>
  );
}
