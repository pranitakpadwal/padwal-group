import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { findBillionaireById, getLeaderboard } from "@/lib/net-worth";
import { getPersonQuotes } from "@/data/quotes";
import { getPersonProfile } from "@/data/profiles";
import { formatUsdCompact } from "@/lib/format";
import { siteUrl } from "@/lib/site";
import Breadcrumbs from "@/components/Breadcrumbs";
import QuoteShare from "@/components/QuoteShare";
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
  const person = findBillionaireById(id);
  const quotes = getPersonQuotes(id);
  if (!person || quotes.length === 0) {
    return { title: "Not found" };
  }
  const title = `${quotes.length} ${person.name} Quotes He Actually Said (With Sources)`;
  const description = `Verified ${person.name} quotes on investing, business, and life — each traced to its original source: shareholder letters, interviews, and speeches.`;
  return {
    title,
    description,
    keywords: [
      `${person.name} quotes`,
      `${person.name} famous quotes`,
      `${person.name} quotes on success`,
      `real ${person.name} quotes`,
    ],
    alternates: { canonical: `${siteUrl()}/quotes/${person.id}` },
    openGraph: { title, description, type: "article" },
  };
}

export default async function PersonQuotesPage({ params }: { params: Promise<RouteParams> }) {
  const { id } = await params;
  const person = findBillionaireById(id);
  const quotes = getPersonQuotes(id);

  if (!person || quotes.length === 0) {
    notFound();
  }

  const leaderboard = await getLeaderboard();
  const ranked = leaderboard.people.find((p) => p.id === id);
  const profile = getPersonProfile(id);
  const firstName = person.name.split(" ")[0];

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: `${person.name} Quotes — Verified, With Sources`,
    description: `Verified quotes by ${person.name}, each with its original source.`,
    author: { "@type": "Organization", name: "RealTimeBillionaire" },
    publisher: { "@type": "Organization", name: "RealTimeBillionaire", url: siteUrl() },
    mainEntityOfPage: `${siteUrl()}/quotes/${person.id}`,
    about: { "@type": "Person", name: person.name, url: `${siteUrl()}/billionaire/${person.id}` },
  };

  return (
    <div className="flex flex-1 flex-col">
      <SiteHeader activeCategory="world" />
      <main className="mx-auto flex w-full max-w-3xl flex-1 flex-col gap-6 px-4 py-8 sm:px-8">
        <Breadcrumbs
          crumbs={[{ label: "Quotes", href: "/quotes" }, { label: person.name }]}
        />

        <header>
          <h1 className="font-display text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
            {person.name} Quotes He Actually Said
          </h1>
          <p className="mt-2 text-sm text-foreground/70">
            {person.bio}{" "}
            {ranked &&
              `Today ${firstName} is worth an estimated ${formatUsdCompact(ranked.netWorthUsd)} (#${ranked.rank} in the world).`}{" "}
            Every quote below is traced to a named source — no internet
            misattributions.
          </p>
        </header>

        <div className="flex flex-col gap-4">
          {quotes.map((quote, index) => (
            <figure
              key={index}
              className="flex flex-col gap-3 rounded-2xl border border-line bg-surface p-6"
            >
              <blockquote className="font-display text-lg leading-snug text-foreground">
                &ldquo;{quote.text}&rdquo;
              </blockquote>
              <figcaption className="text-xs text-[--muted]">
                — {person.name}, {quote.source}
                {quote.year ? ` (${quote.year})` : ""}
              </figcaption>
              <QuoteShare text={quote.text} attribution={person.name} />
            </figure>
          ))}
        </div>

        <div className="rounded-2xl border border-line bg-brand-soft/40 p-5 text-sm">
          <span className="text-foreground/70">Keep going: </span>
          <Link href={`/billionaire/${person.id}`} className="font-medium text-brand hover:underline">
            {firstName}&apos;s live net worth
          </Link>
          {profile?.careerTimeline && profile.careerTimeline.length > 0 && (
            <>
              <span className="text-foreground/70"> · </span>
              <Link href={`/story/${person.id}`} className="font-medium text-brand hover:underline">
                How {firstName} built the fortune
              </Link>
            </>
          )}
        </div>

        <ShareBar
          text={`"${quotes[0].text}" — ${person.name}. More verified quotes (with sources):`}
        />

        <p className="text-xs text-neutral-400">
          Sources shown are where each quote was said or written. If you spot
          an error, we&apos;d rather remove a quote than keep a fake one.
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
