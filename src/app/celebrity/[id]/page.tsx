import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getCelebrity, listCelebrities } from "@/data/celebrities";
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
  const otherCelebrities = listCelebrities()
    .filter((c) => c.id !== celebrity.id)
    .sort((a, b) => b.netWorthUsd - a.netWorthUsd)
    .slice(0, 4);

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
      <main className="mx-auto flex w-full max-w-5xl flex-1 flex-col gap-6 px-4 py-8 sm:px-8">
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

        <ShareBar
          text={`${celebrity.name}'s estimated net worth: ${formatUsdCompact(celebrity.netWorthUsd)}. See the sourced breakdown:`}
        />

        <div className="flex flex-col gap-8 lg:flex-row">
          {/* Main column */}
          <div className="flex min-w-0 flex-1 flex-col gap-8">
            <section aria-labelledby="about-heading">
              <h2 id="about-heading" className="mb-2 text-lg font-bold text-foreground">
                About {celebrity.name.split(" ")[0]}
              </h2>
              <p className="text-sm leading-relaxed text-foreground/80">{celebrity.bio}</p>
            </section>

            {celebrity.notableAssets && celebrity.notableAssets.length > 0 ? (
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
            ) : (
              <section className="rounded-xl border border-neutral-200 p-5 text-sm text-neutral-500 dark:border-neutral-800 dark:text-neutral-400">
                We haven&apos;t sourced any notable assets for {celebrity.name.split(" ")[0]} yet —
                check back as we research more.{" "}
                <Link href="/expensive" className="hover:underline">
                  Browse assets we have sourced &rarr;
                </Link>
              </section>
            )}

            <p className="text-xs text-neutral-400">
              {celebrity.name} is not a billionaire and isn&apos;t part of our
              live-tracked roster — this net worth is a static, point-in-time
              estimate from public reporting, not derived from public stock
              holdings like the rest of this site.{" "}
              <Link href="/expensive" className="text-brand hover:underline">
                Browse more notable assets &rarr;
              </Link>
            </p>
          </div>

          {/* Sidebar */}
          <aside className="flex w-full flex-col gap-4 lg:sticky lg:top-6 lg:w-[300px] lg:shrink-0 lg:self-start">
            <div className="rounded-xl border border-neutral-200 p-4 dark:border-neutral-800">
              <h2 className="mb-3 text-xs font-semibold uppercase tracking-wide text-neutral-500 dark:text-neutral-400">
                Quick Facts
              </h2>
              <dl className="text-sm">
                <div className="flex justify-between gap-4 border-t border-neutral-200 py-2 first:border-t-0 dark:border-neutral-800">
                  <dt className="shrink-0 text-neutral-500 dark:text-neutral-400">Profession</dt>
                  <dd className="text-right font-medium">{celebrity.profession}</dd>
                </div>
                <div className="flex justify-between gap-4 border-t border-neutral-200 py-2 dark:border-neutral-800">
                  <dt className="shrink-0 text-neutral-500 dark:text-neutral-400">Net Worth As Of</dt>
                  <dd className="text-right font-medium">{celebrity.netWorthAsOf}</dd>
                </div>
                <div className="flex justify-between gap-4 border-t border-neutral-200 py-2 dark:border-neutral-800">
                  <dt className="shrink-0 text-neutral-500 dark:text-neutral-400">Source</dt>
                  <dd className="text-right font-medium">{celebrity.netWorthSourceName}</dd>
                </div>
              </dl>
            </div>

            {otherCelebrities.length > 0 && (
              <div className="rounded-xl border border-neutral-200 p-4 dark:border-neutral-800">
                <h2 className="mb-3 text-xs font-semibold uppercase tracking-wide text-neutral-500 dark:text-neutral-400">
                  Other Notable People
                </h2>
                <ul className="flex flex-col gap-3">
                  {otherCelebrities.map((other) => (
                    <li key={other.id}>
                      <Link
                        href={`/celebrity/${other.id}`}
                        className="flex items-center justify-between gap-2 text-sm hover:underline"
                      >
                        <span className="truncate">{other.name}</span>
                        <span className="shrink-0 tabular-nums text-neutral-500 dark:text-neutral-400">
                          {formatUsdCompact(other.netWorthUsd)}
                        </span>
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            <div className="rounded-xl border border-neutral-200 p-4 dark:border-neutral-800">
              <h2 className="mb-3 text-xs font-semibold uppercase tracking-wide text-neutral-500 dark:text-neutral-400">
                Explore More
              </h2>
              <ul className="flex flex-col gap-2 text-sm">
                <li>
                  <Link href="/expensive" className="hover:underline">
                    What They Own &rarr;
                  </Link>
                </li>
                <li>
                  <Link href="/billionaire" className="hover:underline">
                    The Full Billionaires List &rarr;
                  </Link>
                </li>
              </ul>
            </div>
          </aside>
        </div>
      </main>
      <SiteFooter />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
    </div>
  );
}
