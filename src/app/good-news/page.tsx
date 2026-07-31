import type { Metadata } from "next";
import Link from "next/link";
import { billionaires } from "@/data/billionaires";
import { getPersonProfile } from "@/data/profiles";
import { getLeaderboard } from "@/lib/net-worth";
import { isSpotlightEligible } from "@/lib/spotlight";
import { formatUsdCompact } from "@/lib/format";
import { siteUrl, NOINDEX } from "@/lib/site";
import PersonAvatar from "@/components/PersonAvatar";
import Breadcrumbs from "@/components/Breadcrumbs";
import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Good News — Billionaire Wins, Milestones & Giving Back",
  description:
    "The positive side of the wealth list: business milestones, philanthropy, and career wins for the world's richest people, with the live net worth behind each story.",
  keywords: [
    "billionaire good news",
    "billionaire philanthropy",
    "billionaire achievements",
    "billionaire success stories",
  ],
  alternates: { canonical: `${siteUrl()}/good-news` },
  robots: NOINDEX,
};

export default async function GoodNewsHub() {
  const leaderboard = await getLeaderboard();

  const eligible = billionaires
    .map((person) => {
      const profile = getPersonProfile(person.id);
      if (!isSpotlightEligible(profile)) return null;
      const ranked = leaderboard.people.find((p) => p.id === person.id);
      return { person, ranked };
    })
    .filter((entry) => entry !== null)
    .sort((a, b) => (b.ranked?.netWorthUsd ?? 0) - (a.ranked?.netWorthUsd ?? 0));

  return (
    <div className="flex flex-1 flex-col">
      <SiteHeader activeCategory="world" />
      <main className="mx-auto flex w-full max-w-4xl flex-1 flex-col gap-6 px-4 py-8 sm:px-8">
        <Breadcrumbs crumbs={[{ label: "News", href: "/news" }, { label: "Good News" }]} />
        <header>
          <h1 className="font-display text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
            Good News
          </h1>
          <p className="mt-2 max-w-2xl text-foreground/70">
            The wealth list isn&apos;t only about who gained or lost billions
            today. These are the business wins, milestones, and giving-back
            stories behind the fortunes — each built from facts we&apos;ve
            already verified, with the live net worth to go with it.
          </p>
        </header>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          {eligible.map(({ person, ranked }) => (
            <Link
              key={person.id}
              href={`/good-news/${person.id}`}
              className="flex flex-col gap-3 rounded-2xl border border-line bg-surface p-5 transition-colors hover:border-brand"
            >
              <div className="flex items-center gap-3">
                <PersonAvatar name={person.name} photoUrl={ranked?.photoUrl ?? null} size={44} />
                <div className="min-w-0">
                  <div className="truncate font-display text-lg font-semibold text-foreground">
                    {person.name}
                  </div>
                  <div className="text-xs text-foreground/60">
                    {ranked ? `${formatUsdCompact(ranked.netWorthUsd)} · #${ranked.rank}` : person.industry}
                  </div>
                </div>
              </div>
              <span className="text-sm font-medium text-brand">Read the story &rarr;</span>
            </Link>
          ))}
        </div>

        <p className="text-xs text-neutral-400">
          Built from the same fact-checked profile data used across the
          site — nothing here is invented or unsourced.
        </p>
      </main>
      <SiteFooter />
    </div>
  );
}
