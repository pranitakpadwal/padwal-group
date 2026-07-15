import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getLeaderboard } from "@/lib/net-worth";
import { categoryFromSlug, getAssetsByCategory, ASSET_CATEGORY_LABEL } from "@/lib/assets";
import { formatUsdCompact } from "@/lib/format";
import { siteUrl } from "@/lib/site";
import Breadcrumbs from "@/components/Breadcrumbs";
import PersonAvatar from "@/components/PersonAvatar";
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
  const category = categoryFromSlug(slug);
  if (!category) {
    return { title: "Not found" };
  }
  const label = ASSET_CATEGORY_LABEL[category];
  const title = `Most Expensive ${label} Owned by Billionaires`;
  const description = `${label} owned by the world's richest people, each sourced to a named report — with the live net worth of the billionaire behind it.`;
  return {
    title,
    description,
    keywords: [
      `billionaire ${label.toLowerCase()}`,
      `most expensive ${label.toLowerCase()}`,
      `who owns the most expensive ${label.toLowerCase().replace(/s$/, "")}`,
    ],
    alternates: { canonical: `${siteUrl()}/expensive/${slug}` },
    openGraph: { title, description, type: "website" },
  };
}

export default async function ExpensiveCategoryPage({ params }: { params: Promise<RouteParams> }) {
  const { slug } = await params;
  const category = categoryFromSlug(slug);
  if (!category) {
    notFound();
  }

  const leaderboard = await getLeaderboard();
  const assets = getAssetsByCategory(category, leaderboard);
  if (assets.length === 0) {
    notFound();
  }

  const label = ASSET_CATEGORY_LABEL[category];
  const netWorthById = new Map(leaderboard.people.map((p) => [p.id, p]));

  return (
    <div className="flex flex-1 flex-col">
      <SiteHeader activeCategory="world" />
      <main className="mx-auto flex w-full max-w-3xl flex-1 flex-col gap-6 px-4 py-8 sm:px-8">
        <Breadcrumbs crumbs={[{ label: "Expensive Things", href: "/expensive" }, { label }]} />

        <header>
          <h1 className="font-display text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
            Most Expensive {label} Owned by Billionaires
          </h1>
          <p className="mt-2 text-foreground/70">
            {assets.length} {assets.length === 1 ? "entry" : "entries"},
            each traced to a named source — not our own estimate.
          </p>
        </header>

        <div className="flex flex-col gap-4">
          {assets.map((asset, index) => {
            const ranked = netWorthById.get(asset.personId);
            return (
              <div key={index} className="rounded-2xl border border-line bg-surface p-5">
                <div className="flex flex-wrap items-baseline justify-between gap-x-3 gap-y-1">
                  <h2 className="font-display text-lg font-semibold text-foreground">
                    {asset.name}
                  </h2>
                </div>
                <p className="mt-2 text-sm text-foreground/70">{asset.description}</p>
                <div className="mt-3 flex flex-wrap items-center justify-between gap-3 border-t border-line pt-3">
                  <Link
                    href={`/billionaire/${asset.personId}`}
                    className="flex items-center gap-2 hover:opacity-80"
                  >
                    <PersonAvatar
                      name={asset.personName}
                      photoUrl={ranked?.photoUrl ?? null}
                      size={28}
                    />
                    <span className="text-sm font-medium text-foreground">{asset.personName}</span>
                    {ranked && (
                      <span className="text-xs text-[--muted]">
                        · {formatUsdCompact(ranked.netWorthUsd)}, #{ranked.rank}
                      </span>
                    )}
                  </Link>
                  <a
                    href={asset.sourceUrl}
                    target="_blank"
                    rel="noopener noreferrer nofollow"
                    className="text-xs text-[--muted] hover:text-brand hover:underline"
                  >
                    Source: {asset.sourceName}
                  </a>
                </div>
              </div>
            );
          })}
        </div>

        <p className="text-xs text-neutral-400">
          Curated from public reporting at a point in time, not a live feed
          — ownership and prices can change. Sorted by the owner&apos;s
          current real-time net worth.{" "}
          <Link href="/expensive" className="text-brand hover:underline">
            Browse all categories &rarr;
          </Link>
        </p>
      </main>
      <SiteFooter />
      <LiveWebPageJsonLd
        url={`${siteUrl()}/expensive/${slug}`}
        name={`Most Expensive ${label} Owned by Billionaires`}
        asOf={leaderboard.asOf}
      />
    </div>
  );
}
