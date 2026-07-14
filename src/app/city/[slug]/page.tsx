import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getLeaderboard } from "@/lib/net-worth";
import { cityFromSlug, getCityView } from "@/lib/cities";
import { formatUsdCompact } from "@/lib/format";
import { siteUrl } from "@/lib/site";
import Breadcrumbs from "@/components/Breadcrumbs";
import PageHero from "@/components/PageHero";
import LeaderboardTable from "@/components/LeaderboardTable";
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
          <p className="mt-3">
            Home cities are curated from public reporting at city/region
            level, not exact addresses. Figures are independent, directional
            estimates from public stock holdings, not audited valuations.
          </p>
        </section>

        <p className="text-xs text-[--muted]">
          <Link href="/cities" className="text-brand hover:underline">
            Browse billionaires by city &rarr;
          </Link>
        </p>
      </main>
      <SiteFooter />
    </div>
  );
}
