import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getLeaderboard } from "@/lib/net-worth";
import { cityFromSlug, getCityView } from "@/lib/cities";
import { countryPagePath } from "@/lib/countries";
import { isGroupIndexable } from "@/lib/seo-thresholds";
import { formatUsdCompact } from "@/lib/format";
import { siteUrl } from "@/lib/site";
import Breadcrumbs from "@/components/Breadcrumbs";
import PageHero from "@/components/PageHero";
import LeaderboardTable from "@/components/LeaderboardTable";
import FaqBlock from "@/components/FaqBlock";
import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";
import LiveWebPageJsonLd from "@/components/LiveWebPageJsonLd";

export const dynamic = "force-dynamic";

type RouteParams = { slug: string };

export async function generateMetadata({
  params,
}: {
  params: Promise<RouteParams>;
}): Promise<Metadata> {
  const { slug } = await params;
  const info = cityFromSlug(slug);
  if (!info) {
    return { title: "Not found" };
  }
  const title = `Billionaires in ${info.city} — Ranked Live by Net Worth`;
  const description = `The billionaires who call ${info.city} home, ranked live by real-time net worth.`;
  return {
    title,
    description,
    keywords: [
      `billionaires in ${info.city}`,
      `richest people in ${info.city}`,
      `${info.city} billionaires`,
    ],
    alternates: { canonical: `${siteUrl()}/city/${info.slug}` },
    openGraph: { title, description, type: "website" },
    robots: isGroupIndexable(info.personIds.length) ? undefined : { index: false, follow: true },
  };
}

export default async function CityPage({ params }: { params: Promise<RouteParams> }) {
  const { slug } = await params;
  const info = cityFromSlug(slug);
  if (!info) {
    notFound();
  }

  const leaderboard = await getLeaderboard();
  const view = getCityView(leaderboard, info);
  if (view.people.length === 0) {
    notFound();
  }

  const leader = view.people[0];
  const total = view.people.reduce((sum, p) => sum + p.netWorthUsd, 0);
  const country = leader.country;
  const industries = Array.from(new Set(view.people.map((p) => p.industry)));

  const faqs = [
    {
      question: `Who is the richest person in ${info.city}?`,
      answer: `${leader.name} is the richest tracked billionaire based in ${info.city}, with an estimated net worth of ${formatUsdCompact(leader.netWorthUsd)}. Rankings can shift intraday as markets move.`,
    },
    {
      question: `How many billionaires live in ${info.city}?`,
      answer: `We currently track ${view.people.length} ${
        view.people.length === 1 ? "billionaire" : "billionaires"
      } based in ${info.city}, with a combined estimated net worth of ${formatUsdCompact(total)}.`,
    },
    {
      question: `What industries do ${info.city}'s billionaires come from?`,
      answer:
        industries.length === 1
          ? `Every tracked billionaire in ${info.city} built their fortune in ${industries[0]}.`
          : `The tracked billionaires in ${info.city} span ${industries.slice(0, -1).join(", ")} and ${industries[industries.length - 1]}.`,
    },
  ];

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: `Billionaires in ${info.city}`,
    itemListOrder: "https://schema.org/ItemListOrderDescending",
    numberOfItems: view.people.length,
    itemListElement: view.people.map((p) => ({
      "@type": "ListItem",
      position: p.rank,
      url: `${siteUrl()}/billionaire/${p.id}`,
      name: p.name,
    })),
  };

  return (
    <div className="flex flex-1 flex-col">
      <SiteHeader activeCategory="world" />
      <main className="mx-auto flex w-full max-w-6xl flex-1 flex-col gap-8 px-4 py-8 sm:px-8">
        <Breadcrumbs crumbs={[{ label: "Cities", href: "/cities" }, { label: info.city }]} />

        <PageHero
          h1={`Billionaires in ${info.city}`}
          lede={`${view.people.length} tracked ${view.people.length === 1 ? "billionaire calls" : "billionaires call"} ${info.city} home, ranked live by real-time net worth.`}
          people={view.people}
          topGainer={view.topGainers[0]}
        />

        <LeaderboardTable people={view.people} />

        <section className="rounded-2xl border border-line bg-surface p-6 text-sm leading-relaxed text-foreground/70 sm:p-8">
          <h2 className="font-display text-2xl font-semibold text-foreground">
            The billionaires of {info.city}
          </h2>
          <p className="mt-4">
            We track {view.people.length} {view.people.length === 1 ? "billionaire" : "billionaires"}{" "}
            based in {info.city}, worth a combined {formatUsdCompact(total)} by our latest
            estimate. {leader.name} leads the list, with a fortune built on {leader.primarySource}.
          </p>
          <ul className="mt-4 flex flex-col gap-2">
            {view.people.map((person) => (
              <li key={person.id} className="flex flex-wrap items-baseline justify-between gap-x-3 border-t border-line pt-2 first:border-t-0 first:pt-0">
                <Link href={`/billionaire/${person.id}`} className="font-medium text-foreground hover:text-brand hover:underline">
                  #{person.rank} {person.name}
                </Link>
                <span className="text-xs text-[--muted]">
                  {formatUsdCompact(person.netWorthUsd)} &middot; {person.primarySource}
                </span>
              </li>
            ))}
          </ul>
          <p className="mt-4">
            Home cities are curated from public reporting at city/region
            level, not exact addresses. Figures are independent, directional
            estimates from public stock holdings, not audited valuations.{" "}
            <Link href={countryPagePath(country)} className="text-brand hover:underline">
              See all of {country}&apos;s tracked billionaires &rarr;
            </Link>
          </p>
        </section>

        <FaqBlock faqs={faqs} />

        <p className="text-xs text-[--muted]">
          <Link href="/cities" className="text-brand hover:underline">
            Browse billionaires by city &rarr;
          </Link>
        </p>
      </main>
      <SiteFooter />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <LiveWebPageJsonLd
        url={`${siteUrl()}/city/${info.slug}`}
        name={`Billionaires in ${info.city}`}
        asOf={leaderboard.asOf}
      />
    </div>
  );
}
