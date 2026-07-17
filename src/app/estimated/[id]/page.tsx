import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getEstimatedBillionaire } from "@/data/estimated-billionaires";
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
      <main className="mx-auto flex w-full max-w-3xl flex-1 flex-col gap-6 px-4 py-8 sm:px-8">
        <Breadcrumbs crumbs={[{ label: "Full Billionaires List", href: "/billionaires" }, { label: person.name }]} />

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

        <ShareBar
          text={`${person.name}'s estimated net worth: ${formatUsdCompact(person.netWorthUsd)}, per ${person.netWorthSourceName}.`}
        />

        <p className="text-xs text-neutral-400">
          {person.name} isn&apos;t part of our live-tracked core roster — we
          haven&apos;t verified their public shareholdings to price them
          minute-to-minute, so this figure is a static, point-in-time
          estimate from {person.netWorthSourceName}, not derived from a
          live stock price like the rest of this site.{" "}
          <Link href="/billionaires" className="text-brand hover:underline">
            See the full ranked list &rarr;
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
