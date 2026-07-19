import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getLeaderboard } from "@/lib/net-worth";
import { industryFromSlug, getIndustryView } from "@/lib/industries";
import { isGroupIndexable } from "@/lib/seo-thresholds";
import { formatUsdCompact } from "@/lib/format";
import { siteUrl } from "@/lib/site";
import Breadcrumbs from "@/components/Breadcrumbs";
import PageHero from "@/components/PageHero";
import LeaderboardTable from "@/components/LeaderboardTable";
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
    robots: isGroupIndexable(info.personIds.length) ? undefined : { index: false, follow: true },
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
          <p className="mt-3">
            Many fortunes span more than one industry — we tag people by
            every category their business genuinely spans, so the same
            person can appear on more than one industry page. Figures are
            independent, directional estimates from public stock holdings,
            not audited valuations.
          </p>
        </section>

        <p className="text-xs text-[--muted]">
          <Link href="/industries" className="text-brand hover:underline">
            Browse billionaires by industry &rarr;
          </Link>
        </p>
      </main>
      <SiteFooter />
      <LiveWebPageJsonLd
        url={`${siteUrl()}/industry/${info.slug}`}
        name={`${info.industry} Billionaires`}
        asOf={leaderboard.asOf}
      />
    </div>
  );
}
