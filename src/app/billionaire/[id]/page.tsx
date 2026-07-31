import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { findBillionaireById, getLeaderboard } from "@/lib/net-worth";
import { getPriceHistory } from "@/lib/price-history";
import { getPersonHistory } from "@/lib/snapshots";
import { getPersonProfile } from "@/data/profiles";
import { getPersonQuotes } from "@/data/quotes";
import { isSpotlightEligible } from "@/lib/spotlight";
import { getListAppearances, getRelatedPeople } from "@/lib/person-context";
import { countryPagePath } from "@/lib/countries";
import { listIndustries } from "@/lib/industries";
import { listCities } from "@/lib/cities";
import { netWorthUrl } from "@/lib/net-worth-explainer";
import { getHolding, getTickerHolders } from "@/lib/holdings";
import { explainMove } from "@/lib/explain-move";
import { siteUrl } from "@/lib/site";
import { todayDateString } from "@/lib/dates";
import {
  formatPercentChange,
  formatUsdChange,
  formatUsdCompact,
} from "@/lib/format";
import PersonAvatar from "@/components/PersonAvatar";
import Sparkline from "@/components/Sparkline";
import PersonalStats from "@/components/PersonalStats";
import NetWorthHistorySection from "@/components/NetWorthHistorySection";
import CareerTimelineTable from "@/components/CareerTimelineTable";
import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";
import ShareBar from "@/components/ShareBar";
import Breadcrumbs from "@/components/Breadcrumbs";

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

  const title = `${person.name} Net Worth Today — Live Tracker & World Rank`;
  const description = `${person.name}'s net worth right now, updated live from ${person.primarySource} share prices — plus today's gain or loss, world ranking, and how the figure is calculated.`;
  return {
    title,
    description,
    // This page owns the high-volume "{name} net worth" query: Search Console
    // shows it taking ~2.5x the impressions of the /net-worth explainer, which
    // has been re-aimed at "how did {name} make their money" so the two stop
    // splitting the same ranking signal. The live/today angle is the part
    // Google can't answer with a knowledge panel, so it leads here.
    keywords: [
      `${person.name} net worth`,
      `${person.name} net worth today`,
      `${person.name} live net worth`,
      `${person.name} net worth right now`,
      `${person.name} real time net worth`,
      `how rich is ${person.name}`,
      `${person.name} rank`,
      person.primarySource,
    ],
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

  const profile = getPersonProfile(id);
  const appearances = getListAppearances(leaderboard, id);
  const related = getRelatedPeople(leaderboard, ranked);
  const holding = getHolding(ranked);
  const coOwners = ranked.ticker
    ? getTickerHolders(leaderboard, ranked.ticker).filter((h) => h.person.id !== id)
    : [];
  const history = getPersonHistory(id);
  const moveExplanation = explainMove(ranked);
  const industryLinks = listIndustries().filter((i) => i.personIds.includes(id));
  const cityLink = listCities().find((c) => c.personIds.includes(id));
  const exploreLinks = [
    { href: countryPagePath(ranked.country), label: `${ranked.country} Billionaires` },
    ...(cityLink ? [{ href: `/city/${cityLink.slug}`, label: `${cityLink.city} Billionaires` }] : []),
    ...industryLinks.map((i) => ({ href: `/industry/${i.slug}`, label: `${i.industry} Billionaires` })),
    ...(ranked.ticker ? [{ href: `/stock/${ranked.ticker}`, label: `Who Else Owns ${ranked.ticker}?` }] : []),
    { href: "/billionaire", label: "The Full Billionaires List" },
  ];
  const today = todayDateString();
  const firstName = ranked.name.split(" ")[0];

  const isUp = ranked.dayChangeUsd > 0;
  const isDown = ranked.dayChangeUsd < 0;
  const changeColor = isUp
    ? "text-emerald-500"
    : isDown
      ? "text-rose-500"
      : "text-neutral-400";
  const arrow = isUp ? "▲" : isDown ? "▼" : "•";

  const journeyRows =
    profile?.careerTimeline && profile.careerTimeline.length > 0
      ? [
          ...profile.careerTimeline,
          {
            year: "Today",
            title: `Ranked #${ranked.rank} in the world`,
            description: `${firstName}'s net worth is an estimated ${formatUsdCompact(ranked.netWorthUsd)}, updated in real time from public holdings.`,
          },
        ]
      : null;

  const subpageLinks = [
    { href: netWorthUrl(id, ranked.name, new Date().getFullYear()), label: "Net Worth Explainer" },
    profile?.careerTimeline && profile.careerTimeline.length > 0
      ? { href: `/story/${id}`, label: "The Full Story" }
      : null,
    getPersonQuotes(id).length > 0
      ? { href: `/quotes/${id}`, label: "Quotes (Verified)" }
      : null,
    isSpotlightEligible(profile) ? { href: `/good-news/${id}`, label: "Good News" } : null,
    profile?.ventures && profile.ventures.length > 0
      ? { href: `/billionaire/${id}/ventures`, label: "Ventures & Investments" }
      : null,
    profile?.notableAssets && profile.notableAssets.length > 0
      ? { href: `/billionaire/${id}/lifestyle`, label: "Homes, Jets & Notable Assets" }
      : null,
    profile?.family ? { href: `/billionaire/${id}/family`, label: "Family" } : null,
  ].filter((link) => link !== null);

  const personJsonLd = {
    "@context": "https://schema.org",
    "@type": "Person",
    name: person.name,
    description: person.bio,
    birthDate: person.birthDate,
    nationality: person.country,
    image: ranked.photoUrl ?? undefined,
    url: `${siteUrl()}/billionaire/${person.id}`,
    ...(profile?.education ? { alumniOf: profile.education } : {}),
    ...(profile?.residenceCity ? { homeLocation: profile.residenceCity } : {}),
  };

  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: siteUrl() },
      {
        "@type": "ListItem",
        position: 2,
        name: person.name,
        item: `${siteUrl()}/billionaire/${person.id}`,
      },
    ],
  };

  return (
    <div className="flex flex-1 flex-col">
      <SiteHeader activeCategory="world" />
      <main className="mx-auto flex w-full max-w-5xl flex-1 flex-col gap-6 px-4 py-8 sm:px-8">
        <Breadcrumbs crumbs={[{ label: "Billionaires", href: "/" }, { label: ranked.name }]} />

        {/* Hero */}
        <div className="flex flex-col gap-6 rounded-2xl border border-line bg-gradient-to-br from-brand-soft to-surface p-6 sm:flex-row sm:items-center sm:p-8">
          <PersonAvatar name={ranked.name} photoUrl={ranked.photoUrl} size={96} />
          <div className="flex-1">
            <h1 className="font-display text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
              {ranked.name}
            </h1>
            <p className="mt-1 text-sm text-[--muted]">
              #{ranked.rank} in the World &middot; Age {ranked.age} &middot;{" "}
              <Link href={countryPagePath(ranked.country)} className="hover:text-brand hover:underline">
                {ranked.country}
              </Link>
            </p>
          </div>
          <div className="sm:text-right">
            <div className="text-xs uppercase tracking-wide text-[--muted]">
              Real-Time Net Worth
            </div>
            <div className="font-display text-3xl font-semibold tabular-nums text-brand-dark sm:text-4xl">
              {formatUsdCompact(ranked.netWorthUsd)}
            </div>
            <div className={`text-sm font-medium tabular-nums ${changeColor}`}>
              {arrow} {formatUsdChange(ranked.dayChangeUsd)} (
              {formatPercentChange(ranked.dayChangePercent)}) today
            </div>
            {moveExplanation && (
              <p className="mt-2 max-w-xs text-xs text-[--muted] sm:ml-auto">
                {moveExplanation}
              </p>
            )}
          </div>
        </div>

        <ShareBar
          label={`Share ${firstName}'s net worth`}
          text={`${ranked.name} is worth ${formatUsdCompact(ranked.netWorthUsd)} right now — #${ranked.rank} in the world. Track it live:`}
        />

        <div className="flex flex-col gap-8 lg:flex-row">
          {/* Main column */}
          <div className="flex min-w-0 flex-1 flex-col gap-8">
            <section aria-labelledby="about-heading">
              <h2 id="about-heading" className="mb-2 text-lg font-bold">
                About {firstName}
              </h2>
              {profile?.longBio ? (
                <div className="flex flex-col gap-3 text-sm leading-relaxed text-neutral-700 dark:text-neutral-200">
                  {profile.longBio.map((paragraph, index) => (
                    <p key={index}>{paragraph}</p>
                  ))}
                </div>
              ) : (
                <p className="text-sm leading-relaxed text-neutral-700 dark:text-neutral-200">
                  {person.bio}
                </p>
              )}
            </section>

            {profile?.keyFacts && profile.keyFacts.length > 0 && (
              <section aria-labelledby="facts-heading">
                <h2 id="facts-heading" className="mb-2 text-lg font-bold">
                  Key Facts
                </h2>
                <ul className="flex flex-col gap-2 text-sm text-neutral-700 dark:text-neutral-200">
                  {profile.keyFacts.map((fact, index) => (
                    <li key={index} className="flex gap-2">
                      <span aria-hidden className="text-neutral-400">
                        &bull;
                      </span>
                      <span>{fact}</span>
                    </li>
                  ))}
                </ul>
              </section>
            )}

            {ranked.ticker ? (
              <section aria-labelledby="chart-heading">
                <div className="mb-3 flex items-baseline justify-between">
                  <h2 id="chart-heading" className="text-lg font-bold">
                    {ranked.ticker} &mdash; last ~3 months
                  </h2>
                  {ranked.sharePrice !== null && (
                    <span className="text-sm tabular-nums text-neutral-500 dark:text-neutral-400">
                      {ranked.sharePrice.toFixed(2)} USD
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
                  This chart tracks {ranked.ticker}&apos;s share price, the
                  public portion of {firstName}&apos;s wealth. It excludes the{" "}
                  {formatUsdCompact(person.otherAssetsUsd)} static estimate for
                  private assets.
                </p>
              </section>
            ) : (
              <section className="rounded-xl border border-neutral-200 p-5 text-sm text-neutral-500 dark:border-neutral-800 dark:text-neutral-400">
                {firstName}&apos;s wealth is primarily tied to{" "}
                {person.primarySource}, a privately held company with no public
                ticker to chart. The {formatUsdCompact(person.otherAssetsUsd)}{" "}
                net worth estimate is a static figure, not a live feed.
              </section>
            )}

            {holding && (
              <section aria-labelledby="holdings-heading">
                <h2 id="holdings-heading" className="mb-3 text-lg font-bold">
                  Public Holding
                </h2>
                <div className="rounded-xl border border-neutral-200 p-4 dark:border-neutral-800">
                  <div className="flex flex-wrap items-baseline justify-between gap-x-3 gap-y-1">
                    <span className="font-semibold">
                      {ranked.primarySource} ({holding.ticker})
                    </span>
                    <Link
                      href={`/stock/${holding.ticker}`}
                      className="text-sm text-neutral-500 hover:underline dark:text-neutral-400"
                    >
                      Who else owns {holding.ticker}? &rarr;
                    </Link>
                  </div>
                  <dl className="mt-3 grid grid-cols-1 gap-3 text-sm sm:grid-cols-3">
                    <div>
                      <dt className="text-xs uppercase tracking-wide text-neutral-500 dark:text-neutral-400">
                        Shares Held (est.)
                      </dt>
                      <dd className="font-medium tabular-nums">
                        {holding.shares.toLocaleString("en-US")}
                      </dd>
                    </div>
                    <div>
                      <dt className="text-xs uppercase tracking-wide text-neutral-500 dark:text-neutral-400">
                        Stake Value
                      </dt>
                      <dd className="font-medium tabular-nums">
                        {holding.valueUsd !== null ? formatUsdCompact(holding.valueUsd) : "—"}
                      </dd>
                    </div>
                    <div>
                      <dt className="text-xs uppercase tracking-wide text-neutral-500 dark:text-neutral-400">
                        Share of Net Worth
                      </dt>
                      <dd className="font-medium tabular-nums">
                        {holding.pctOfNetWorth !== null
                          ? `${holding.pctOfNetWorth.toFixed(0)}%`
                          : "—"}
                      </dd>
                    </div>
                  </dl>
                  {coOwners.length > 0 && (
                    <p className="mt-3 border-t border-neutral-200 pt-3 text-xs text-neutral-500 dark:border-neutral-800 dark:text-neutral-400">
                      Also held by{" "}
                      {coOwners.map((holder, index) => (
                        <span key={holder.person.id}>
                          {index > 0 && ", "}
                          <Link href={`/billionaire/${holder.person.id}`} className="hover:underline">
                            {holder.person.name}
                          </Link>
                        </span>
                      ))}
                      .
                    </p>
                  )}
                </div>
              </section>
            )}

            <NetWorthHistorySection points={history} firstName={firstName} />

            {journeyRows && (
              <section aria-labelledby="journey-heading" className="flex flex-col gap-3">
                <h2 id="journey-heading" className="text-lg font-bold">
                  {firstName}&apos;s Journey
                </h2>
                <p className="text-sm text-neutral-500 dark:text-neutral-400">
                  The milestones that built the fortune — from the early days to today.
                </p>
                <CareerTimelineTable timeline={journeyRows} />
              </section>
            )}

            {subpageLinks.length > 0 && (
              <section aria-labelledby="more-heading">
                <h2 id="more-heading" className="mb-2 text-lg font-bold">
                  More on {firstName}
                </h2>
                <div className="flex flex-wrap gap-2">
                  {subpageLinks.map((link) => (
                    <Link
                      key={link.href}
                      href={link.href}
                      className="rounded-full border border-neutral-300 px-4 py-2 text-sm font-medium hover:bg-neutral-100 dark:border-neutral-700 dark:hover:bg-neutral-900"
                    >
                      {link.label} &rarr;
                    </Link>
                  ))}
                </div>
              </section>
            )}

            {related.length > 0 && (
              <section aria-labelledby="related-heading">
                <h2 id="related-heading" className="mb-3 text-lg font-bold">
                  Related Billionaires
                </h2>
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                  {related.map((other) => (
                    <Link
                      key={other.id}
                      href={`/billionaire/${other.id}`}
                      className="flex items-center gap-3 rounded-xl border border-neutral-200 p-3 transition-colors hover:border-neutral-300 dark:border-neutral-800 dark:hover:border-neutral-700"
                    >
                      <PersonAvatar name={other.name} photoUrl={other.photoUrl} size={40} />
                      <div className="min-w-0">
                        <div className="truncate text-sm font-medium">{other.name}</div>
                        <div className="text-xs tabular-nums text-neutral-500 dark:text-neutral-400">
                          {formatUsdCompact(other.netWorthUsd)} &middot; {other.primarySource}
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              </section>
            )}
          </div>

          {/* Sidebar */}
          <aside className="flex w-full flex-col gap-4 lg:sticky lg:top-6 lg:w-[300px] lg:shrink-0 lg:self-start">
            <PersonalStats person={ranked} profile={profile} />

            {appearances.length > 0 && (
              <div className="rounded-xl border border-neutral-200 p-4 dark:border-neutral-800">
                <h2 className="mb-3 text-xs font-semibold uppercase tracking-wide text-neutral-500 dark:text-neutral-400">
                  Appears On These Lists
                </h2>
                <ul className="flex flex-col gap-2 text-sm">
                  {appearances.map((appearance) => (
                    <li key={appearance.category} className="flex items-baseline justify-between gap-2">
                      <span>{appearance.label}</span>
                      <span className="tabular-nums font-semibold">
                        #{appearance.rank}
                        <span className="text-xs font-normal text-neutral-400"> / {appearance.total}</span>
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {appearances.length > 0 && (
              <div className="rounded-xl border border-neutral-200 p-4 dark:border-neutral-800">
                <h2 className="mb-3 text-xs font-semibold uppercase tracking-wide text-neutral-500 dark:text-neutral-400">
                  Today&apos;s Recaps
                </h2>
                <ul className="flex flex-col gap-2 text-sm">
                  {appearances.map((appearance) => (
                    <li key={appearance.category}>
                      <Link
                        href={`/articles/${today}/${appearance.category}`}
                        className="hover:underline"
                      >
                        {appearance.label} &rarr;
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            <div className="rounded-xl border border-neutral-200 p-4 dark:border-neutral-800">
              <h2 className="mb-3 text-xs font-semibold uppercase tracking-wide text-neutral-500 dark:text-neutral-400">
                Explore More
              </h2>
              <ul className="flex flex-col gap-2 text-sm">
                {exploreLinks.map((link) => (
                  <li key={link.href}>
                    <Link href={link.href} className="hover:underline">
                      {link.label} &rarr;
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </aside>
        </div>

        <p className="text-xs text-neutral-400">
          Net worth is an estimate derived from public stock holdings plus a
          static estimate for private assets — directional, not audited, and
          not affiliated with Forbes. Biographical details are curated from
          public reporting and may go out of date.
        </p>
      </main>
      <SiteFooter />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(personJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />
    </div>
  );
}
