import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getLeaderboard } from "@/lib/net-worth";
import { countryFromSlug, getCountryView, demonym, countrySlug } from "@/lib/countries";
import { siteUrl } from "@/lib/site";
import { formatUsdCompact } from "@/lib/format";
import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";
import PageHero from "@/components/PageHero";
import LeaderboardTable from "@/components/LeaderboardTable";
import FaqBlock from "@/components/FaqBlock";
import LiveWebPageJsonLd from "@/components/LiveWebPageJsonLd";

export const dynamic = "force-dynamic";

type RouteParams = { slug: string };

export async function generateMetadata({
  params,
}: {
  params: Promise<RouteParams>;
}): Promise<Metadata> {
  const { slug } = await params;
  const country = countryFromSlug(slug);
  if (!country) {
    return { title: "Country not found" };
  }
  const title = `Richest People in ${country} — Real-Time Net Worth & Rankings`;
  const description = `The real-time list of the richest people in ${country}: live net worth and rankings of ${demonym(country)} billionaires, updated continuously from public stock holdings.`;
  return {
    title,
    description,
    keywords: [
      `richest person in ${country}`,
      `richest man in ${country}`,
      `${demonym(country)} billionaires`,
      `${country} billionaires list`,
      `richest people in ${country}`,
    ],
    alternates: { canonical: `${siteUrl()}/country/${countrySlug(country)}` },
    openGraph: { title, description, type: "website" },
  };
}

export default async function CountryPage({ params }: { params: Promise<RouteParams> }) {
  const { slug } = await params;
  const country = countryFromSlug(slug);
  if (!country) {
    notFound();
  }

  const leaderboard = await getLeaderboard();
  const view = getCountryView(leaderboard, country);
  if (view.people.length === 0) {
    notFound();
  }

  const leader = view.people[0];
  const total = view.people.reduce((sum, p) => sum + p.netWorthUsd, 0);

  const faqs = [
    {
      question: `Who is the richest person in ${country}?`,
      answer: `As of the latest update, ${leader.name} is the richest person in ${country} on our real-time list, with an estimated net worth of ${formatUsdCompact(leader.netWorthUsd)}. Rankings can change intraday as markets move.`,
    },
    {
      question: `How many billionaires are there in ${country}?`,
      answer: `We currently track ${view.people.length} ${
        view.people.length === 1 ? "billionaire" : "billionaires"
      } based in ${country}, with a combined estimated net worth of ${formatUsdCompact(total)}. We add more over time.`,
    },
    {
      question: `How is ${demonym(country)} billionaire net worth calculated?`,
      answer:
        "We multiply each person's estimated public shareholdings by the live share price, convert to US dollars, and add a static estimate for private assets. It's an independent estimate, not affiliated with Forbes.",
    },
  ];

  return (
    <div className="flex flex-1 flex-col">
      <SiteHeader activeCategory="world" />
      <main className="mx-auto flex w-full max-w-6xl flex-1 flex-col gap-8 px-4 py-8 sm:px-8">
        <nav className="text-sm text-[--muted]" aria-label="Breadcrumb">
          <Link href="/" className="hover:text-brand">
            Home
          </Link>{" "}
          &rsaquo;{" "}
          <Link href="/countries" className="hover:text-brand">
            Countries
          </Link>{" "}
          &rsaquo; {country}
        </nav>

        <PageHero
          h1={`Richest People in ${country}`}
          lede={`The real-time list of ${demonym(country)} billionaires, ranked live by net worth. Every fortune updates continuously from public stock holdings.`}
          people={view.people}
          topGainer={view.topGainers[0]}
        />

        <LeaderboardTable people={view.people} />

        <section className="rounded-2xl border border-line bg-surface p-6 text-sm leading-relaxed text-foreground/70 sm:p-8">
          <h2 className="font-display text-2xl font-semibold text-foreground">
            {demonym(country)} billionaires, tracked in real time
          </h2>
          <p className="mt-4">
            We currently track {view.people.length}{" "}
            {view.people.length === 1 ? "billionaire" : "billionaires"} based in{" "}
            {country}, worth a combined {formatUsdCompact(total)} by our latest
            estimate. {leader.name} leads the list — their fortune comes from{" "}
            {leader.primarySource}
            {view.people[1] ? `, followed by ${view.people[1].name} (${view.people[1].primarySource})` : ""}
            {view.people[2] ? ` and ${view.people[2].name}` : ""}.
          </p>
          <p className="mt-3">
            Where a {demonym(country)} fortune sits in a publicly-listed company,
            we value it live from the current share price and convert to US
            dollars, so the ranking above moves throughout the trading day.
            Privately-held wealth is added as a manually-updated estimate. All
            figures are independent, directional estimates — not audited
            valuations, and not affiliated with Forbes or Bloomberg.
          </p>
        </section>

        <FaqBlock faqs={faqs} />

        <p className="text-xs text-[--muted]">
          Estimates only, updated from public market data; not affiliated with
          Forbes or Bloomberg.{" "}
          <Link href="/countries" className="text-brand hover:underline">
            Browse billionaires by country &rarr;
          </Link>
        </p>
      </main>
      <SiteFooter />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "ItemList",
            name: `Richest People in ${country}`,
            numberOfItems: view.people.length,
            itemListElement: view.people.slice(0, 50).map((p) => ({
              "@type": "ListItem",
              position: p.rank,
              name: p.name,
              url: `${siteUrl()}/billionaire/${p.id}`,
            })),
          }),
        }}
      />
      <LiveWebPageJsonLd
        url={`${siteUrl()}/country/${countrySlug(country)}`}
        name={`Richest People in ${country}`}
        asOf={leaderboard.asOf}
      />
    </div>
  );
}
