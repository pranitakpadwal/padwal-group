import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getLeaderboard } from "@/lib/net-worth";
import { regionFromSlug, getRegionView, regionSlug } from "@/lib/countries";
import { siteUrl } from "@/lib/site";
import { formatUsdCompact } from "@/lib/format";
import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";
import PageHero from "@/components/PageHero";
import LeaderboardTable from "@/components/LeaderboardTable";
import FaqBlock from "@/components/FaqBlock";

export const dynamic = "force-dynamic";

type RouteParams = { slug: string };

// "the Middle East" reads better than "Middle East" in a sentence.
function withArticle(region: string): string {
  return region === "Middle East" ? "the Middle East" : region;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<RouteParams>;
}): Promise<Metadata> {
  const { slug } = await params;
  const region = regionFromSlug(slug);
  if (!region) {
    return { title: "Region not found" };
  }
  const title = `Richest People in ${region} — Real-Time Net Worth & Rankings`;
  const description = `The real-time list of the richest people in ${withArticle(region)}: live net worth and rankings of the region's billionaires, updated continuously from public stock holdings.`;
  return {
    title,
    description,
    keywords: [
      `richest person in ${region}`,
      `richest man in ${region}`,
      `${region} billionaires`,
      `richest people in ${region}`,
    ],
    alternates: { canonical: `${siteUrl()}/region/${regionSlug(region)}` },
    openGraph: { title, description, type: "website" },
  };
}

export default async function RegionPage({ params }: { params: Promise<RouteParams> }) {
  const { slug } = await params;
  const region = regionFromSlug(slug);
  if (!region) {
    notFound();
  }

  const leaderboard = await getLeaderboard();
  const view = getRegionView(leaderboard, region);
  if (view.people.length === 0) {
    notFound();
  }

  const leader = view.people[0];
  const total = view.people.reduce((sum, p) => sum + p.netWorthUsd, 0);
  const countries = Array.from(new Set(view.people.map((p) => p.country)));

  const faqs = [
    {
      question: `Who is the richest person in ${withArticle(region)}?`,
      answer: `As of the latest update, ${leader.name} (${leader.country}) is the richest person in ${withArticle(region)} on our real-time list, with an estimated net worth of ${formatUsdCompact(leader.netWorthUsd)}.`,
    },
    {
      question: `How many billionaires does ${withArticle(region)} have?`,
      answer: `We track ${view.people.length} across ${countries.length} ${
        countries.length === 1 ? "country" : "countries"
      } in ${withArticle(region)}, worth a combined ${formatUsdCompact(total)}. Coverage grows over time.`,
    },
    {
      question: `How is net worth for ${region} calculated?`,
      answer:
        "We value each person's publicly-listed holdings live from the current share price, convert to US dollars, and add a static estimate for private assets. Independent estimates, not affiliated with Forbes.",
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
            Places
          </Link>{" "}
          &rsaquo; {region}
        </nav>

        <PageHero
          h1={`Richest People in ${region}`}
          lede={`The real-time list of the wealthiest people across ${withArticle(region)}, ranked live by net worth and spanning ${countries.length} ${countries.length === 1 ? "country" : "countries"}.`}
          people={view.people}
          topGainer={view.topGainers[0]}
        />

        <LeaderboardTable people={view.people} />

        <section className="rounded-2xl border border-line bg-surface p-6 text-sm leading-relaxed text-foreground/70 sm:p-8">
          <h2 className="font-display text-2xl font-semibold text-foreground">
            Wealth across {withArticle(region)}
          </h2>
          <p className="mt-4">
            This page brings together the billionaires we track in{" "}
            {countries.join(", ")}. {leader.name} of {leader.country} currently
            leads {withArticle(region)} with an estimated{" "}
            {formatUsdCompact(leader.netWorthUsd)}, built on {leader.primarySource}.
            The combined tracked wealth of the region stands at{" "}
            {formatUsdCompact(total)} and shifts throughout the day as markets
            move.
          </p>
        </section>

        <FaqBlock faqs={faqs} />

        <p className="text-xs text-[--muted]">
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
            name: `Richest People in ${region}`,
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
    </div>
  );
}
