import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getCelebrity } from "@/data/celebrities";
import { getPhotoUrl } from "@/lib/photos";
import { formatUsdCompact } from "@/lib/format";
import { siteUrl } from "@/lib/site";
import { ASSET_CATEGORY_LABEL } from "@/lib/assets";
import Breadcrumbs from "@/components/Breadcrumbs";
import PersonAvatar from "@/components/PersonAvatar";
import ShareBar from "@/components/ShareBar";
import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";

export const dynamic = "force-dynamic";

type RouteParams = { id: string };

export async function generateMetadata({
  params,
}: {
  params: Promise<RouteParams>;
}): Promise<Metadata> {
  const { id } = await params;
  const celebrity = getCelebrity(id);
  if (!celebrity) {
    return { title: "Not found" };
  }
  const title = `${celebrity.name} Net Worth & Notable Assets`;
  const description = `${celebrity.name}'s estimated net worth (${formatUsdCompact(celebrity.netWorthUsd)}) and notable assets, each sourced.`;
  return {
    title,
    description,
    keywords: [
      `${celebrity.name} net worth`,
      `${celebrity.name} cars`,
      `${celebrity.name} assets`,
    ],
    alternates: { canonical: `${siteUrl()}/celebrity/${celebrity.id}` },
    openGraph: { title, description, type: "profile" },
  };
}

export default async function CelebrityPage({ params }: { params: Promise<RouteParams> }) {
  const { id } = await params;
  const celebrity = getCelebrity(id);
  if (!celebrity) {
    notFound();
  }

  const photoUrl = await getPhotoUrl(celebrity.wikipediaTitle);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Person",
    name: celebrity.name,
    description: celebrity.bio,
    url: `${siteUrl()}/celebrity/${celebrity.id}`,
    jobTitle: celebrity.profession,
  };

  return (
    <div className="flex flex-1 flex-col">
      <SiteHeader activeCategory="world" />
      <main className="mx-auto flex w-full max-w-3xl flex-1 flex-col gap-6 px-4 py-8 sm:px-8">
        <Breadcrumbs crumbs={[{ label: "Expensive Things", href: "/expensive" }, { label: celebrity.name }]} />

        <div className="flex flex-col gap-6 rounded-2xl border border-line bg-gradient-to-br from-brand-soft to-surface p-6 sm:flex-row sm:items-center sm:p-8">
          <PersonAvatar name={celebrity.name} photoUrl={photoUrl} size={96} />
          <div className="flex-1">
            <h1 className="font-display text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
              {celebrity.name}
            </h1>
            <p className="mt-1 text-sm text-[--muted]">{celebrity.profession}</p>
          </div>
          <div className="sm:text-right">
            <div className="text-xs uppercase tracking-wide text-[--muted]">
              Estimated Net Worth
            </div>
            <div className="font-display text-3xl font-semibold tabular-nums text-brand-dark sm:text-4xl">
              {formatUsdCompact(celebrity.netWorthUsd)}
            </div>
            <div className="mt-1 text-xs text-[--muted]">
              Per {celebrity.netWorthSourceName}, {celebrity.netWorthAsOf} — not a live figure
            </div>
          </div>
        </div>

        <section aria-labelledby="about-heading">
          <h2 id="about-heading" className="mb-2 text-lg font-bold text-foreground">
            About {celebrity.name.split(" ")[0]}
          </h2>
          <p className="text-sm leading-relaxed text-foreground/80">{celebrity.bio}</p>
        </section>

        {celebrity.notableAssets && celebrity.notableAssets.length > 0 && (
          <section aria-labelledby="assets-heading">
            <h2 id="assets-heading" className="mb-3 text-lg font-bold text-foreground">
              Notable Assets
            </h2>
            <ul className="flex flex-col gap-4">
              {celebrity.notableAssets.map((asset, index) => (
                <li key={index} className="rounded-2xl border border-line bg-surface p-5">
                  <div className="flex flex-wrap items-baseline justify-between gap-x-3 gap-y-1">
                    <h3 className="font-display text-lg font-semibold text-foreground">
                      {asset.name}
                    </h3>
                    <span className="rounded-full bg-brand-soft px-2.5 py-0.5 text-xs font-medium uppercase tracking-wide text-brand-dark">
                      {ASSET_CATEGORY_LABEL[asset.category]}
                    </span>
                  </div>
                  <p className="mt-2 text-sm text-foreground/70">{asset.description}</p>
                  <a
                    href={asset.sourceUrl}
                    target="_blank"
                    rel="noopener noreferrer nofollow"
                    className="mt-2 inline-block text-xs text-[--muted] hover:text-brand hover:underline"
                  >
                    Source: {asset.sourceName}
                  </a>
                </li>
              ))}
            </ul>
          </section>
        )}

        <ShareBar
          text={`${celebrity.name}'s estimated net worth: ${formatUsdCompact(celebrity.netWorthUsd)}. See the sourced breakdown:`}
        />

        <p className="text-xs text-neutral-400">
          {celebrity.name} is not a billionaire and isn&apos;t part of our
          live-tracked roster — this net worth is a static, point-in-time
          estimate from public reporting, not derived from public stock
          holdings like the rest of this site.{" "}
          <Link href="/expensive" className="text-brand hover:underline">
            Browse more notable assets &rarr;
          </Link>
        </p>
      </main>
      <SiteFooter />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
    </div>
  );
}
