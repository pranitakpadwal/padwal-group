import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getLeaderboard } from "@/lib/net-worth";
import { industryFromSlug, getIndustryView } from "@/lib/industries";
import { getRelatedCoverage } from "@/lib/related-coverage";
import { formatUsdCompact } from "@/lib/format";
import { siteUrl } from "@/lib/site";
import Breadcrumbs from "@/components/Breadcrumbs";
import PageHero from "@/components/PageHero";
import LeaderboardTable from "@/components/LeaderboardTable";
import FaqBlock from "@/components/FaqBlock";
import RelatedCoverage from "@/components/RelatedCoverage";
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
  const info = industryFromSlug(slug);
  if (!info) {
    return { title: "Not found" };
  }
  const title = `${info.industry} Billionaires — Ranked Live by Net Worth`;
  const description = `Billionaires who made their fortune in ${info.industry.toLowerCase()}, ranked live by real-time net worth.`;
  return {
    title,
    description,
    keywords: [
      `${info.industry} billionaires`,
      `richest people in ${info.industry.toLowerCase()}`,
      `${info.industry.toLowerCase()} billionaires list`,
    ],
    alternates: { canonical: `${siteUrl()}/industry/${info.slug}` },
    openGraph: { title, description, type: "website" },
  };
}

export default async function IndustryPage({ params }: { params: Promise<RouteParams> }) {
  const { slug } = await params;
  const info = industryFromSlug(slug);
  if (!info) {
    notFound();
  }

  const leaderboard = await getLeaderboard();
  const view = getIndustryView(leaderboard, info);
  if (view.people.length === 0) {
    notFound();
  }

  const leader = view.people[0];
  const total = view.people.reduce((sum, p) => sum + p.netWorthUsd, 0);
  const countries = Array.from(new Set(view.people.map((p) => p.country)));

  const faqs = [
    {
      question: `Who is the richest ${info.industry.toLowerCase()} billionaire?`,
      answer: `${leader.name} is the richest tracked billionaire in ${info.industry.toLowerCase()}, with an estimated net worth of ${formatUsdCompact(leader.netWorthUsd)}. Rankings can shift intraday as markets move.`,
    },
    {
      question: `How many ${info.industry.toLowerCase()} billionaires do you track?`,
      answer: `We currently track ${view.people.length} ${
        view.people.length === 1 ? "billionaire" : "billionaires"
      } in ${info.industry.toLowerCase()}, with a combined estimated net worth of ${formatUsdCompact(total)}.`,
    },
    {
      question: `Which countries do ${info.industry.toLowerCase()} billionaires come from?`,
      answer:
        countries.length === 1
          ? `Every tracked ${info.industry.toLowerCase()} billionaire we track is based in ${countries[0]}.`
          : `The tracked ${info.industry.toLowerCase()} billionaires span ${countries.slice(0, -1).join(", ")} and ${countries[countries.length - 1]}.`,
    },
  ];

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: `${info.industry} Billionaires`,
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
        <Breadcrumbs crumbs={[{ label: "Industries", href: "/industries" }, { label: info.industry }]} />

        <PageHero
          h1={`${info.industry} Billionaires`}
          lede={`${view.people.length} tracked ${view.people.length === 1 ? "billionaire made" : "billionaires made"} their fortune in ${info.industry.toLowerCase()}, ranked live by real-time net worth.`}
          people={view.people}
          topGainer={view.topGainers[0]}
        />

        <LeaderboardTable people={view.people} />

        <section className="rounded-2xl border border-line bg-surface p-6 text-sm leading-relaxed text-foreground/70 sm:p-8">
          <h2 className="font-display text-2xl font-semibold text-foreground">
            The {info.industry.toLowerCase()} billionaires
          </h2>
          <p className="mt-4">
            We track {view.people.length} {view.people.length === 1 ? "billionaire" : "billionaires"}{" "}
            in {info.industry.toLowerCase()}, worth a combined {formatUsdCompact(total)} by our
            latest estimate. {leader.name} leads the group, with a fortune built on{" "}
            {leader.primarySource}.
          </p>
          <ul className="mt-4 flex flex-col gap-2">
            {view.people.map((person) => (
              <li key={person.id} className="flex flex-wrap items-baseline justify-between gap-x-3 border-t border-line pt-2 first:border-t-0 first:pt-0">
                <Link href={`/billionaire/${person.id}`} className="font-medium text-foreground hover:text-brand hover:underline">
                  #{person.rank} {person.name}
                </Link>
                <span className="text-xs text-[--muted]">
                  {formatUsdCompact(person.netWorthUsd)} &middot; {person.country}
                </span>
              </li>
            ))}
          </ul>
          <p className="mt-4">
            Many fortunes span more than one industry — we tag people by
            every category their business genuinely spans, so the same
            person can appear on more than one industry page. Figures are
            independent, directional estimates from public stock holdings,
            not audited valuations.
          </p>
        </section>

        <FaqBlock faqs={faqs} />

        <RelatedCoverage links={getRelatedCoverage(view.people)} />

        <p className="text-xs text-[--muted]">
          <Link href="/industries" className="text-brand hover:underline">
            Browse billionaires by industry &rarr;
          </Link>
        </p>
      </main>
      <SiteFooter />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <LiveWebPageJsonLd
        url={`${siteUrl()}/industry/${info.slug}`}
        name={`${info.industry} Billionaires`}
        asOf={leaderboard.asOf}
      />
    </div>
  );
}
