import type { Metadata } from "next";
import Link from "next/link";
import { getLeaderboard } from "@/lib/net-worth";
import { netWorthUrl } from "@/lib/net-worth-explainer";
import { formatUsdCompact } from "@/lib/format";
import { siteUrl } from "@/lib/site";
import Breadcrumbs from "@/components/Breadcrumbs";
import PersonAvatar from "@/components/PersonAvatar";
import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";
import LiveWebPageJsonLd from "@/components/LiveWebPageJsonLd";

export const dynamic = "force-dynamic";

export async function generateMetadata(): Promise<Metadata> {
  const year = new Date().getFullYear();
  return {
    title: `Billionaire Net Worth Explainers ${year} — Real-Time Breakdowns`,
    description: `How much is each tracked billionaire actually worth in ${year}? A real-time net worth breakdown for every person we track, updated continuously from public stock holdings.`,
    keywords: ["billionaire net worth", `net worth ${year}`, "how rich is", "net worth breakdown"],
    alternates: { canonical: `${siteUrl()}/net-worth` },
  };
}

export default async function NetWorthIndex() {
  const leaderboard = await getLeaderboard();
  const year = new Date().getFullYear();
  const sorted = leaderboard.people.slice().sort((a, b) => a.name.localeCompare(b.name));

  return (
    <div className="flex flex-1 flex-col">
      <SiteHeader activeCategory="world" />
      <main className="mx-auto flex w-full max-w-4xl flex-1 flex-col gap-8 px-4 py-8 sm:px-8">
        <Breadcrumbs crumbs={[{ label: "Net Worth Explainers" }]} />
        <header>
          <h1 className="font-display text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
            Billionaire Net Worth Explainers, {year}
          </h1>
          <p className="mt-2 max-w-2xl text-foreground/70">
            A real-time net worth breakdown for every person we track — current
            figure, how it splits between public stock and other assets, and
            how we calculate it. Updated continuously as markets move.
          </p>
        </header>

        <div className="flex flex-col gap-2">
          {sorted.map((person) => (
            <Link
              key={person.id}
              href={netWorthUrl(person.id, person.name, year)}
              className="flex items-center justify-between gap-3 rounded-xl border border-line bg-surface px-4 py-3 transition-colors hover:border-brand"
            >
              <div className="flex items-center gap-3">
                <PersonAvatar name={person.name} photoUrl={person.photoUrl} size={32} />
                <span className="font-medium text-foreground">{person.name}</span>
              </div>
              <span className="text-sm tabular-nums text-[--muted]">
                {formatUsdCompact(person.netWorthUsd)}
              </span>
            </Link>
          ))}
        </div>
      </main>
      <SiteFooter />
      <LiveWebPageJsonLd
        url={`${siteUrl()}/net-worth`}
        name={`Billionaire Net Worth Explainers, ${year}`}
        asOf={leaderboard.asOf}
      />
    </div>
  );
}
