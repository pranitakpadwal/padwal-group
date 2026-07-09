import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { findBillionaireById, getLeaderboard } from "@/lib/net-worth";
import { getPriceHistory } from "@/lib/price-history";
import { siteUrl } from "@/lib/site";
import {
  formatPercentChange,
  formatUsdChange,
  formatUsdCompact,
} from "@/lib/format";
import PersonAvatar from "@/components/PersonAvatar";
import Sparkline from "@/components/Sparkline";
import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";

export const dynamic = "force-dynamic";

type RouteParams = { id: string };

export async function generateMetadata({
  params,
}: {
  params: Promise<RouteParams>;
}): Promise<Metadata> {
  const { id } = await params;
  const person = findBillionaireById(id);
  if (!person) {
    return { title: "Billionaire not found" };
  }

  const title = `${person.name} — Real-Time Billionaires`;
  const description = person.bio;
  return {
    title,
    description,
    alternates: { canonical: `${siteUrl()}/billionaire/${person.id}` },
    openGraph: { title, description, type: "profile" },
    twitter: { card: "summary", title, description },
  };
}

export default async function BillionaireProfile({
  params,
}: {
  params: Promise<RouteParams>;
}) {
  const { id } = await params;
  const person = findBillionaireById(id);

  if (!person) {
    notFound();
  }

  const [leaderboard, priceHistory] = await Promise.all([
    getLeaderboard(),
    person.ticker ? getPriceHistory(person.ticker) : Promise.resolve(null),
  ]);

  const ranked = leaderboard.people.find((candidate) => candidate.id === id);

  if (!ranked) {
    notFound();
  }

  const isUp = ranked.dayChangeUsd > 0;
  const isDown = ranked.dayChangeUsd < 0;
  const changeColor = isUp
    ? "text-emerald-500"
    : isDown
      ? "text-rose-500"
      : "text-neutral-400";

  const personJsonLd = {
    "@context": "https://schema.org",
    "@type": "Person",
    name: person.name,
    description: person.bio,
    birthDate: person.birthDate,
    nationality: person.country,
    image: ranked.photoUrl ?? undefined,
    url: `${siteUrl()}/billionaire/${person.id}`,
  };

  return (
    <div className="flex flex-1 flex-col bg-zinc-50 dark:bg-black">
      <SiteHeader activeCategory="world" />
      <main className="mx-auto flex w-full max-w-3xl flex-1 flex-col gap-6 px-4 py-8 sm:px-8">
        <Link
          href="/"
          className="text-sm text-neutral-500 hover:underline dark:text-neutral-400"
        >
          &larr; Back to leaderboard
        </Link>

        <div className="flex flex-col items-start gap-4 sm:flex-row sm:items-center">
          <PersonAvatar name={ranked.name} photoUrl={ranked.photoUrl} size={72} />
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-black dark:text-zinc-50 sm:text-3xl">
              {ranked.name}
            </h1>
            <p className="text-sm text-neutral-500 dark:text-neutral-400">
              Rank #{ranked.rank} &middot; Age {ranked.age} &middot; {ranked.country}
            </p>
          </div>
        </div>

        <p className="max-w-2xl text-sm text-neutral-600 dark:text-neutral-300">
          {person.bio}
        </p>

        <div className="grid grid-cols-1 gap-4 rounded-xl border border-neutral-200 p-5 dark:border-neutral-800 sm:grid-cols-3">
          <div>
            <div className="text-xs uppercase tracking-wide text-neutral-500 dark:text-neutral-400">
              Net Worth
            </div>
            <div className="text-2xl font-bold tabular-nums">
              {formatUsdCompact(ranked.netWorthUsd)}
            </div>
          </div>
          <div>
            <div className="text-xs uppercase tracking-wide text-neutral-500 dark:text-neutral-400">
              Today
            </div>
            <div className={`text-2xl font-bold tabular-nums ${changeColor}`}>
              {formatUsdChange(ranked.dayChangeUsd)}
            </div>
            <div className={`text-sm tabular-nums ${changeColor}`}>
              {formatPercentChange(ranked.dayChangePercent)}
            </div>
          </div>
          <div>
            <div className="text-xs uppercase tracking-wide text-neutral-500 dark:text-neutral-400">
              Industry
            </div>
            <div className="text-sm font-medium">{ranked.industry}</div>
            <div className="text-xs text-neutral-500 dark:text-neutral-400">
              {ranked.primarySource}
            </div>
          </div>
        </div>

        {ranked.ticker ? (
          <div className="rounded-xl border border-neutral-200 p-5 dark:border-neutral-800">
            <div className="mb-3 flex items-baseline justify-between">
              <h2 className="text-sm font-semibold">
                {ranked.ticker} &mdash; last ~3 months
              </h2>
              {ranked.sharePrice !== null && (
                <span className="text-sm tabular-nums text-neutral-500 dark:text-neutral-400">
                  {ranked.sharePrice.toFixed(2)} {ranked.currency ?? ""}
                </span>
              )}
            </div>
            {priceHistory ? (
              <Sparkline values={priceHistory} />
            ) : (
              <p className="text-sm text-neutral-500 dark:text-neutral-400">
                Price history unavailable right now.
              </p>
            )}
            <p className="mt-3 text-xs text-neutral-400">
              This chart tracks {ranked.ticker}&apos;s share price, the public
              portion of {ranked.name.split(" ")[0]}&apos;s wealth. It
              excludes the {formatUsdCompact(person.otherAssetsUsd)} static
              estimate for private assets, which this tracker doesn&apos;t
              have historical data for.
            </p>
          </div>
        ) : (
          <div className="rounded-xl border border-neutral-200 p-5 text-sm text-neutral-500 dark:border-neutral-800 dark:text-neutral-400">
            {ranked.name}&apos;s wealth is primarily tied to{" "}
            {person.primarySource}, a privately held company with no public
            ticker to chart. The {formatUsdCompact(person.otherAssetsUsd)} net
            worth estimate shown above is a static figure, not a live feed.
          </div>
        )}
      </main>
      <SiteFooter />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(personJsonLd) }}
      />
    </div>
  );
}
