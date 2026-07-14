import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getLeaderboard } from "@/lib/net-worth";
import { universityFromSlug, getUniversityView } from "@/lib/universities";
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
  const info = universityFromSlug(slug);
  if (!info) {
    return { title: "Not found" };
  }
  const title = `${info.university} Billionaires — Alumni Net Worth, Ranked Live`;
  const description = `Billionaires who studied at ${info.university}, ranked live by real-time net worth.`;
  return {
    title,
    description,
    keywords: [
      `${info.university} billionaires`,
      `${info.university} alumni net worth`,
      `richest ${info.university} graduates`,
    ],
    alternates: { canonical: `${siteUrl()}/university/${info.slug}` },
    openGraph: { title, description, type: "website" },
  };
}

export default async function UniversityPage({ params }: { params: Promise<RouteParams> }) {
  const { slug } = await params;
  const info = universityFromSlug(slug);
  if (!info) {
    notFound();
  }

  const leaderboard = await getLeaderboard();
  const view = getUniversityView(leaderboard, info);
  if (view.people.length === 0) {
    notFound();
  }

  const leader = view.people[0];
  const total = view.people.reduce((sum, p) => sum + p.netWorthUsd, 0);

  return (
    <div className="flex flex-1 flex-col">
      <SiteHeader activeCategory="world" />
      <main className="mx-auto flex w-full max-w-6xl flex-1 flex-col gap-8 px-4 py-8 sm:px-8">
        <Breadcrumbs
          crumbs={[{ label: "Universities", href: "/universities" }, { label: info.university }]}
        />

        <PageHero
          h1={`${info.university} Billionaires`}
          lede={`${view.people.length} tracked ${view.people.length === 1 ? "billionaire studied" : "billionaires studied"} at ${info.university}, ranked live by real-time net worth.`}
          people={view.people}
          topGainer={view.topGainers[0]}
        />

        <LeaderboardTable people={view.people} />

        <section className="rounded-2xl border border-line bg-surface p-6 text-sm leading-relaxed text-foreground/70 sm:p-8">
          <h2 className="font-display text-2xl font-semibold text-foreground">
            {info.university}&apos;s billionaire alumni
          </h2>
          <p className="mt-4">
            We track {view.people.length} {view.people.length === 1 ? "billionaire" : "billionaires"}{" "}
            connected to {info.university}, worth a combined {formatUsdCompact(total)} by our
            latest estimate. {leader.name} leads the group, with a fortune built on{" "}
            {leader.primarySource}.
          </p>
          <p className="mt-3">
            Education is one data point in a much longer story — plenty of
            billionaires never finished a degree at all. Figures are
            independent, directional estimates from public stock holdings,
            not audited valuations.
          </p>
        </section>

        <p className="text-xs text-[--muted]">
          <Link href="/universities" className="text-brand hover:underline">
            Browse billionaires by university &rarr;
          </Link>
        </p>
      </main>
      <SiteFooter />
    </div>
  );
}
