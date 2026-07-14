import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getLeaderboard } from "@/lib/net-worth";
import { familyFromSlug, getFamilyView } from "@/lib/families";
import { formatUsdCompact } from "@/lib/format";
import { siteUrl } from "@/lib/site";
import Breadcrumbs from "@/components/Breadcrumbs";
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
  const family = familyFromSlug(slug);
  if (!family) {
    return { title: "Not found" };
  }
  const title = `${family.name} Net Worth — Combined Family Fortune, Live`;
  const description = `The combined real-time net worth of the ${family.name}: ${family.description}`;
  return {
    title,
    description,
    keywords: [`${family.name} net worth`, `${family.name} fortune`, `${family.name} billionaires`],
    alternates: { canonical: `${siteUrl()}/family/${family.slug}` },
    openGraph: { title, description, type: "website" },
  };
}

export default async function FamilyPage({ params }: { params: Promise<RouteParams> }) {
  const { slug } = await params;
  const family = familyFromSlug(slug);
  if (!family) {
    notFound();
  }

  const leaderboard = await getLeaderboard();
  const view = getFamilyView(leaderboard, family);
  if (view.people.length === 0) {
    notFound();
  }

  const total = view.people.reduce((sum, p) => sum + p.netWorthUsd, 0);
  const leader = view.people[0];

  return (
    <div className="flex flex-1 flex-col">
      <SiteHeader activeCategory="world" />
      <main className="mx-auto flex w-full max-w-6xl flex-1 flex-col gap-8 px-4 py-8 sm:px-8">
        <Breadcrumbs crumbs={[{ label: "Families", href: "/families" }, { label: family.name }]} />

        <div className="rounded-2xl border border-line bg-gradient-to-br from-brand-soft to-surface p-6 sm:p-8">
          <h1 className="font-display text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
            {family.name}
          </h1>
          <p className="mt-2 max-w-2xl text-foreground/70">{family.description}</p>
          <div className="mt-4 flex flex-wrap gap-6">
            <div>
              <div className="text-xs uppercase tracking-wide text-[--muted]">Combined Net Worth</div>
              <div className="font-display text-2xl font-semibold tabular-nums text-brand-dark">
                {formatUsdCompact(total)}
              </div>
            </div>
            <div>
              <div className="text-xs uppercase tracking-wide text-[--muted]">Tracked Members</div>
              <div className="font-display text-2xl font-semibold tabular-nums text-foreground">
                {view.people.length}
              </div>
            </div>
            <div>
              <div className="text-xs uppercase tracking-wide text-[--muted]">Richest Member</div>
              <div className="font-display text-2xl font-semibold text-foreground">{leader.name}</div>
            </div>
          </div>
        </div>

        <LeaderboardTable people={view.people} />

        <p className="text-xs text-[--muted]">
          Combined net worth simply adds each tracked member&apos;s
          individual estimate — it isn&apos;t a single shared figure the
          family reports. Figures are independent, directional estimates,
          not audited valuations.{" "}
          <Link href="/families" className="text-brand hover:underline">
            Browse billionaire families &rarr;
          </Link>
        </p>
      </main>
      <SiteFooter />
    </div>
  );
}
