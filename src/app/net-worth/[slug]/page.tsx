import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { findBillionaireById, getLeaderboard } from "@/lib/net-worth";
import { getPersonProfile } from "@/data/profiles";
import { getAuthor } from "@/data/authors";
import { getHolding } from "@/lib/holdings";
import { countryPagePath } from "@/lib/countries";
import {
  netWorthHeadline,
  netWorthPageTitle,
  netWorthCanonical,
  netWorthUrl,
  personIdFromNetWorthSlug,
} from "@/lib/net-worth-explainer";
import { formatUsdCompact, formatUsdChange, formatPercentChange } from "@/lib/format";
import { siteUrl } from "@/lib/site";
import { publisherJsonLd, personImageUrl, SITE_NAME } from "@/lib/schema";
import Breadcrumbs from "@/components/Breadcrumbs";
import PersonAvatar from "@/components/PersonAvatar";
import ShareBar from "@/components/ShareBar";
import FaqBlock from "@/components/FaqBlock";
import LiveWebPageJsonLd from "@/components/LiveWebPageJsonLd";
import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";

export const dynamic = "force-dynamic";

type RouteParams = { slug: string };

export async function generateMetadata({
  params,
}: {
  params: Promise<RouteParams>;
}): Promise<Metadata> {
  const { slug } = await params;
  const year = new Date().getFullYear();
  const id = personIdFromNetWorthSlug(slug, year);
  const person = id ? findBillionaireById(id) : null;
  if (!person) {
    return { title: "Not found" };
  }
  const title = netWorthPageTitle(person.id, person.name, year);
  const description = `Where ${person.name}'s fortune actually comes from: how it splits between ${person.primarySource} stock and other assets, what's driven it in ${year}, and how the figure is calculated.`;
  return {
    title,
    description,
    // Explainer intent only. "{name} net worth" / "how rich is {name}" belong to
    // /billionaire/[id] now — keeping them here made our own pages compete.
    keywords: [
      `how did ${person.name} make their money`,
      `how ${person.name} got rich`,
      `${person.name} net worth breakdown`,
      `${person.name} wealth explained`,
      `${person.name} fortune source`,
    ],
    alternates: { canonical: netWorthCanonical(person.id, person.name, year) },
    openGraph: { title, description, type: "article" },
  };
}

export default async function NetWorthPage({ params }: { params: Promise<RouteParams> }) {
  const { slug } = await params;
  const year = new Date().getFullYear();
  const id = personIdFromNetWorthSlug(slug, year);
  const person = id ? findBillionaireById(id) : null;
  if (!person) {
    notFound();
  }

  const leaderboard = await getLeaderboard();
  const ranked = leaderboard.people.find((p) => p.id === person.id);
  if (!ranked) {
    notFound();
  }

  const profile = getPersonProfile(person.id);
  const hook = profile?.netWorthHook;
  const author = profile?.deepDiveAuthor ? getAuthor(profile.deepDiveAuthor) : undefined;
  const holding = getHolding(ranked);
  const firstName = ranked.name.split(" ")[0];
  const pronounCap = ranked.gender === "female" ? "She" : "He";
  const possessive = ranked.gender === "female" ? "her" : "his";
  const url = `${siteUrl()}${netWorthUrl(person.id, person.name, year)}`;

  const isUp = ranked.dayChangeUsd > 0;
  const isDown = ranked.dayChangeUsd < 0;
  const changeColor = isUp ? "text-emerald-500" : isDown ? "text-rose-500" : "text-neutral-400";
  const arrow = isUp ? "▲" : isDown ? "▼" : "•";

  const faqs = [
    ...(hook
      ? [
          {
            question: `${hook.title}?`,
            answer: `${hook.fact} (Per ${hook.sourceName}.)`,
          },
        ]
      : []),
    {
      question: `What is ${person.name}'s net worth in ${year}?`,
      answer: `As of the latest update, ${person.name}'s real-time net worth is an estimated ${formatUsdCompact(ranked.netWorthUsd)}, ranking #${ranked.rank} on our live world list. This figure updates continuously as markets move.`,
    },
    {
      question: `How is ${person.name}'s net worth calculated?`,
      answer: holding
        ? `Most of it comes from ${possessive} publicly-traded stake in ${ranked.primarySource} (${holding.ticker}), which we price from the live share price. We add a static estimate of ${formatUsdCompact(person.otherAssetsUsd)} for private holdings, cash, and other assets.`
        : `${person.name}'s wealth is primarily tied to ${ranked.primarySource}, a privately held company with no public share price to track live, so the ${formatUsdCompact(person.otherAssetsUsd)} figure is a static, manually-updated estimate.`,
    },
    {
      question: `Is this a real-time, live net worth figure?`,
      answer: `The public-stock portion is live and updates continuously while markets are open. Any privately-held portion is a directional estimate we update by hand, not a live feed. This is an independent estimate, not affiliated with Forbes or Bloomberg.`,
    },
  ];

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Person",
    name: person.name,
    description: person.bio,
    url,
    nationality: person.country,
  };

  const articleJsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: netWorthHeadline(person.id, person.name, year),
    image: [personImageUrl(person.id)],
    author: author
      ? { "@type": "Person", name: author.name, url: `${siteUrl()}/author/${author.id}` }
      : { "@type": "Organization", name: SITE_NAME, url: siteUrl() },
    publisher: publisherJsonLd(),
    mainEntityOfPage: { "@type": "WebPage", "@id": url },
    url,
    dateModified: leaderboard.asOf,
    inLanguage: "en",
    isAccessibleForFree: true,
  };

  return (
    <div className="flex flex-1 flex-col">
      <SiteHeader activeCategory="world" />
      <main className="mx-auto flex w-full max-w-5xl flex-1 flex-col gap-6 px-4 py-8 sm:px-8">
        <Breadcrumbs crumbs={[{ label: person.name, href: `/billionaire/${person.id}` }, { label: `Net Worth ${year}` }]} />

        <div className="flex flex-col gap-6 rounded-2xl border border-line bg-gradient-to-br from-brand-soft to-surface p-6 sm:flex-row sm:items-center sm:p-8">
          <PersonAvatar name={ranked.name} photoUrl={ranked.photoUrl} size={96} />
          <div className="flex-1">
            {/* Matches the <title> exactly so the page reads as the explainer it is,
                rather than re-competing with the live profile's "net worth" framing. */}
            <h1 className="font-display text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
              {netWorthPageTitle(person.id, person.name, year)}
            </h1>
            <p className="mt-1 text-sm text-[--muted]">
              #{ranked.rank} in the World &middot; {ranked.primarySource}
            </p>
            {author && (
              <p className="mt-1 text-xs text-[--muted]">
                By{" "}
                <Link href={`/author/${author.id}`} className="font-medium hover:text-brand hover:underline">
                  {author.name}
                </Link>
              </p>
            )}
          </div>
          <div className="sm:text-right">
            <div className="text-xs uppercase tracking-wide text-[--muted]">
              Real-Time Net Worth
            </div>
            <div className="font-display text-3xl font-semibold tabular-nums text-brand-dark sm:text-4xl">
              {formatUsdCompact(ranked.netWorthUsd)}
            </div>
            <div className={`text-sm font-medium tabular-nums ${changeColor}`}>
              {arrow} {formatUsdChange(ranked.dayChangeUsd)} ({formatPercentChange(ranked.dayChangePercent)}) today
            </div>
          </div>
        </div>

        <ShareBar
          label={`Share ${firstName}'s net worth`}
          text={`${person.name}'s net worth in ${year}: ${formatUsdCompact(ranked.netWorthUsd)}, #${ranked.rank} in the world. Full breakdown:`}
        />

        <div className="flex flex-col gap-8 lg:flex-row">
          <div className="flex min-w-0 flex-1 flex-col gap-8">
            {hook && (
              <section aria-labelledby="hook-heading" className="rounded-2xl border border-brand/40 bg-brand-soft/40 p-5">
                <h2 id="hook-heading" className="mb-2 text-lg font-bold text-foreground">
                  {hook.title}
                </h2>
                <p className="text-sm leading-relaxed text-foreground/80">{hook.fact}</p>
                <a
                  href={hook.sourceUrl}
                  target="_blank"
                  rel="noopener noreferrer nofollow"
                  className="mt-2 inline-block text-xs text-[--muted] hover:text-brand hover:underline"
                >
                  Source: {hook.sourceName}
                </a>
              </section>
            )}

            {profile?.deepDive?.map((section, index) => (
              <section key={index} aria-labelledby={`deep-dive-${index}`}>
                <h2 id={`deep-dive-${index}`} className="mb-2 text-lg font-bold text-foreground">
                  {section.heading}
                </h2>
                <div className="flex flex-col gap-3 text-sm leading-relaxed text-foreground/80">
                  {section.paragraphs.map((paragraph, pIndex) => (
                    <p key={pIndex}>{paragraph}</p>
                  ))}
                </div>
                <a
                  href={section.sourceUrl}
                  target="_blank"
                  rel="noopener noreferrer nofollow"
                  className="mt-2 inline-block text-xs text-[--muted] hover:text-brand hover:underline"
                >
                  Source: {section.sourceName}
                </a>
              </section>
            ))}

            <section aria-labelledby="breakdown-heading">
              <h2 id="breakdown-heading" className="mb-2 text-lg font-bold text-foreground">
                How the {formatUsdCompact(ranked.netWorthUsd)} Breaks Down
              </h2>
              {holding ? (
                <div className="flex flex-col gap-3 text-sm leading-relaxed text-foreground/80">
                  <p>
                    {pronounCap} holds an estimated{" "}
                    {holding.shares.toLocaleString("en-US")} shares of {ranked.ticker}
                    {holding.valueUsd !== null && <> worth {formatUsdCompact(holding.valueUsd)} at the current price</>}
                    {holding.pctOfNetWorth !== null && (
                      <> — about {holding.pctOfNetWorth.toFixed(0)}% of {possessive} total net worth.</>
                    )}
                  </p>
                  <p>
                    The remaining {formatUsdCompact(person.otherAssetsUsd)}{" "}
                    is a static estimate for privately-held assets, cash, and other holdings
                    that don&apos;t have a live public price — this portion doesn&apos;t move
                    minute-to-minute like the {ranked.ticker} stake does.
                  </p>
                </div>
              ) : (
                <p className="text-sm leading-relaxed text-foreground/80">
                  {possessive.charAt(0).toUpperCase() + possessive.slice(1)} fortune is tied to{" "}
                  {ranked.primarySource}, a privately held company with no public ticker to price
                  live. The full {formatUsdCompact(ranked.netWorthUsd)}{" "}
                  is a static, manually-updated estimate rather than a live feed.
                </p>
              )}
            </section>

            <section aria-labelledby="how-heading">
              <h2 id="how-heading" className="mb-2 text-lg font-bold text-foreground">
                How {firstName} Got Here
              </h2>
              {profile?.longBio ? (
                <div className="flex flex-col gap-3 text-sm leading-relaxed text-foreground/80">
                  {profile.longBio.map((paragraph, index) => (
                    <p key={index}>{paragraph}</p>
                  ))}
                </div>
              ) : (
                <p className="text-sm leading-relaxed text-foreground/80">{person.bio}</p>
              )}
              {profile?.keyFacts && profile.keyFacts.length > 0 && (
                <ul className="mt-3 flex flex-col gap-2 text-sm text-foreground/80">
                  {profile.keyFacts.map((fact, index) => (
                    <li key={index} className="flex gap-2">
                      <span aria-hidden className="text-neutral-400">&bull;</span>
                      <span>{fact}</span>
                    </li>
                  ))}
                </ul>
              )}
            </section>

            <FaqBlock faqs={faqs} heading={`${firstName}'s Net Worth: FAQ`} />

            <p className="text-xs text-neutral-400">
              Net worth is an estimate derived from public stock holdings plus a static estimate
              for private assets — directional, not audited, and not affiliated with Forbes or
              Bloomberg.{" "}
              <Link href={`/billionaire/${person.id}`} className="text-brand hover:underline">
                See {firstName}&apos;s full profile &rarr;
              </Link>
            </p>
          </div>

          <aside className="flex w-full flex-col gap-4 lg:sticky lg:top-6 lg:w-[300px] lg:shrink-0 lg:self-start">
            <div className="rounded-xl border border-neutral-200 p-4 dark:border-neutral-800">
              <h2 className="mb-3 text-xs font-semibold uppercase tracking-wide text-neutral-500 dark:text-neutral-400">
                Explore More
              </h2>
              <ul className="flex flex-col gap-2 text-sm">
                <li>
                  <Link href={`/billionaire/${person.id}`} className="hover:underline">
                    {firstName}&apos;s Full Profile &rarr;
                  </Link>
                </li>
                <li>
                  <Link href={countryPagePath(ranked.country)} className="hover:underline">
                    {ranked.country} Billionaires &rarr;
                  </Link>
                </li>
                <li>
                  <Link href="/net-worth" className="hover:underline">
                    Net Worth Explainers, A-Z &rarr;
                  </Link>
                </li>
              </ul>
            </div>
          </aside>
        </div>
      </main>
      <SiteFooter />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(articleJsonLd) }} />
      <LiveWebPageJsonLd
        url={url}
        name={`${person.name} Net Worth in ${year}`}
        asOf={leaderboard.asOf}
      />
    </div>
  );
}
