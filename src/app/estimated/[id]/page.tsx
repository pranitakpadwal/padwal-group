import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getEstimatedBillionaire, listEstimatedBillionaires } from "@/data/estimated-billionaires";
import { countryPagePath, listCountries } from "@/lib/countries";
import { getPhotoUrl } from "@/lib/photos";
import { formatUsdCompact } from "@/lib/format";
import { siteUrl } from "@/lib/site";
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
  const person = getEstimatedBillionaire(id);
  if (!person) {
    return { title: "Not found" };
  }
  const title = `${person.name} Net Worth — ${formatUsdCompact(person.netWorthUsd)} Estimate`;
  const description = `${person.name}'s estimated net worth (${formatUsdCompact(person.netWorthUsd)}), sourced to ${person.netWorthSourceName}. Not part of our live-tracked core list.`;
  return {
    title,
    description,
    keywords: [
      `${person.name} net worth`,
      `${person.name} billionaire`,
      `how rich is ${person.name}`,
    ],
    alternates: { canonical: `${siteUrl()}/estimated/${person.id}` },
    openGraph: { title, description, type: "profile" },
  };
}

export default async function EstimatedBillionairePage({ params }: { params: Promise<RouteParams> }) {
  const { id } = await params;
  const person = getEstimatedBillionaire(id);
  if (!person) {
    notFound();
  }

  const photoUrl = await getPhotoUrl(person.wikipediaTitle);

  // /country/[slug] only covers countries with a live-tracked billionaire — linking there for an
  // estimated-only country would 404, so fall back to the /countries hub instead.
  const hasCountryPage = listCountries().some((c) => c.country === person.country);

  const others = listEstimatedBillionaires().filter((p) => p.id !== person.id);
  const sameIndustry = others.filter((p) => p.industry === person.industry);
  const sameCountry = others.filter((p) => p.country === person.country);
  const related = (sameIndustry.length > 0 ? sameIndustry : sameCountry)
    .slice()
    .sort((a, b) => b.netWorthUsd - a.netWorthUsd)
    .slice(0, 4);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Person",
    name: person.name,
    description: person.bio,
    url: `${siteUrl()}/estimated/${person.id}`,
    nationality: person.country,
    jobTitle: person.primarySource,
  };

  return (
    <div className="flex flex-1 flex-col">
      <SiteHeader activeCategory="world" />
      <main className="mx-auto flex w-full max-w-5xl flex-1 flex-col gap-6 px-4 py-8 sm:px-8">
        <Breadcrumbs crumbs={[{ label: "Full Billionaires List", href: "/billionaire" }, { label: person.name }]} />

        <div className="flex flex-col gap-6 rounded-2xl border border-line bg-gradient-to-br from-brand-soft to-surface p-6 sm:flex-row sm:items-center sm:p-8">
          <PersonAvatar name={person.name} photoUrl={photoUrl} size={96} />
          <div className="flex-1">
            <h1 className="font-display text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
              {person.name}
            </h1>
            <p className="mt-1 text-sm text-[--muted]">
              {person.country} &middot; {person.industry} &middot; {person.primarySource}
            </p>
          </div>
          <div className="sm:text-right">
            <div className="text-xs uppercase tracking-wide text-[--muted]">
              Estimated Net Worth
            </div>
            <div className="font-display text-3xl font-semibold tabular-nums text-brand-dark sm:text-4xl">
              {formatUsdCompact(person.netWorthUsd)}
            </div>
            <div className="mt-1 text-xs text-[--muted]">
              Per {person.netWorthSourceName}, {person.netWorthAsOf} — not a live figure
            </div>
          </div>
        </div>

        <ShareBar
          text={`${person.name}'s estimated net worth: ${formatUsdCompact(person.netWorthUsd)}, per ${person.netWorthSourceName}.`}
        />

        <div className="flex flex-col gap-8 lg:flex-row">
          {/* Main column */}
          <div className="flex min-w-0 flex-1 flex-col gap-8">
            <section aria-labelledby="about-heading">
              <h2 id="about-heading" className="mb-2 text-lg font-bold text-foreground">
                About {person.name.split(" ")[0]}
              </h2>
              <p className="text-sm leading-relaxed text-foreground/80">{person.bio}</p>
            </section>

            <a
              href={person.netWorthSourceUrl}
              target="_blank"
              rel="noopener noreferrer nofollow"
              className="inline-block w-fit rounded-xl border border-line bg-surface px-4 py-2 text-xs text-[--muted] hover:text-brand hover:underline"
            >
              Net worth source: {person.netWorthSourceName}
            </a>

            <p className="text-xs text-neutral-400">
              {person.name} isn&apos;t part of our live-tracked core roster — we
              haven&apos;t verified their public shareholdings to price them
              minute-to-minute, so this figure is a static, point-in-time
              estimate from {person.netWorthSourceName}, not derived from a
              live stock price like the rest of this site.{" "}
              <Link href="/billionaire" className="text-brand hover:underline">
                See the full ranked list &rarr;
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
                  <dt className="shrink-0 text-neutral-500 dark:text-neutral-400">Source of Wealth</dt>
                  <dd className="text-right font-medium">{person.primarySource}</dd>
                </div>
                <div className="flex justify-between gap-4 border-t border-neutral-200 py-2 dark:border-neutral-800">
                  <dt className="shrink-0 text-neutral-500 dark:text-neutral-400">Industry</dt>
                  <dd className="text-right font-medium">{person.industry}</dd>
                </div>
                <div className="flex justify-between gap-4 border-t border-neutral-200 py-2 dark:border-neutral-800">
                  <dt className="shrink-0 text-neutral-500 dark:text-neutral-400">Country</dt>
                  <dd className="text-right font-medium">{person.country}</dd>
                </div>
                <div className="flex justify-between gap-4 border-t border-neutral-200 py-2 dark:border-neutral-800">
                  <dt className="shrink-0 text-neutral-500 dark:text-neutral-400">Net Worth As Of</dt>
                  <dd className="text-right font-medium">{person.netWorthAsOf}</dd>
                </div>
                <div className="flex justify-between gap-4 border-t border-neutral-200 py-2 dark:border-neutral-800">
                  <dt className="shrink-0 text-neutral-500 dark:text-neutral-400">Source</dt>
                  <dd className="text-right font-medium">{person.netWorthSourceName}</dd>
                </div>
              </dl>
            </div>

            {related.length > 0 && (
              <div className="rounded-xl border border-neutral-200 p-4 dark:border-neutral-800">
                <h2 className="mb-3 text-xs font-semibold uppercase tracking-wide text-neutral-500 dark:text-neutral-400">
                  {sameIndustry.length > 0 ? `More in ${person.industry}` : `More from ${person.country}`}
                </h2>
                <ul className="flex flex-col gap-3">
                  {related.map((other) => (
                    <li key={other.id}>
                      <Link
                        href={`/estimated/${other.id}`}
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
                  <Link
                    href={hasCountryPage ? countryPagePath(person.country) : "/countries"}
                    className="hover:underline"
                  >
                    {person.country} Billionaires &rarr;
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
