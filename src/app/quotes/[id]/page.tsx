import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { findBillionaireById, getLeaderboard } from "@/lib/net-worth";
import { getPersonQuotes } from "@/data/quotes";
import { getPersonProfile } from "@/data/profiles";
import { netWorthUrl } from "@/lib/net-worth-explainer";
import { formatUsdCompact } from "@/lib/format";
import { siteUrl } from "@/lib/site";
import { publisherJsonLd, SITE_NAME } from "@/lib/schema";
import { listQuotePeopleIds } from "@/data/quotes";
import Breadcrumbs from "@/components/Breadcrumbs";
import QuoteShare from "@/components/QuoteShare";
import ShareBar from "@/components/ShareBar";
import FaqBlock from "@/components/FaqBlock";
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
  const url = `${siteUrl()}/quotes/${person.id}`;
  return {
    title,
    description,
    keywords: [
      `${person.name} quotes`,
      `${person.name} famous quotes`,
      `${person.name} quotes on success`,
      `${person.name} motivational quotes`,
      `${person.name} quotes on investing`,
      `real ${person.name} quotes`,
      `${person.name} inspirational quotes`,
      "quote of the day",
    ],
    alternates: { canonical: url },
    openGraph: { title, description, type: "article", url, siteName: SITE_NAME },
    twitter: { card: "summary_large_image", title, description },
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

  const url = `${siteUrl()}/quotes/${person.id}`;
  const relatedQuotePeople = listQuotePeopleIds()
    .filter((otherId) => otherId !== id)
    .map((otherId) => findBillionaireById(otherId))
    .filter((other) => other !== undefined);
  const sourceNames = Array.from(new Set(quotes.map((q) => q.source)));
  const faqs = [
    {
      question: `What are ${person.name}'s most well-known verified quotes?`,
      answer: `We've verified ${quotes.length} ${quotes.length === 1 ? "quote" : "quotes"} from ${person.name}, each traced to a named source${sourceNames.length > 0 ? ` — including ${sourceNames.slice(0, 3).join(", ")}` : ""}. See the full list above, each with its original source.`,
    },
    {
      question: `Are these quotes really from ${person.name}?`,
      answer: `Yes. Every quote on this page is checked against a real, named source — a shareholder letter, filmed interview, signed op-ed, or speech — before it's published. We don't include quotes we can't verify, unlike many "inspirational quotes" sites that copy unattributed text.`,
    },
    ...(ranked
      ? [
          {
            question: `What is ${person.name}'s net worth right now?`,
            answer: `${person.name} is worth an estimated ${formatUsdCompact(ranked.netWorthUsd)} (#${ranked.rank} in the world), tracked live from public stock holdings.`,
          },
        ]
      : []),
  ];

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: `${person.name} Quotes — Verified, With Sources`,
    description: `Verified quotes by ${person.name}, each with its original source.`,
    image: [`${url}/opengraph-image`],
    author: { "@type": "Organization", name: SITE_NAME, url: siteUrl() },
    publisher: publisherJsonLd(),
    mainEntityOfPage: { "@type": "WebPage", "@id": url },
    url,
    articleSection: "Quotes",
    inLanguage: "en",
    isAccessibleForFree: true,
    keywords: `${person.name} quotes, verified quotes, ${person.primarySource}`,
    about: { "@type": "Person", name: person.name, url: `${siteUrl()}/billionaire/${person.id}` },
    hasPart: quotes.map((quote) => ({
      "@type": "Quotation",
      text: quote.text,
      creator: { "@type": "Person", name: person.name },
      ...(quote.year ? { dateCreated: String(quote.year) } : {}),
    })),
  };

  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: siteUrl() },
      { "@type": "ListItem", position: 2, name: "Quotes", item: `${siteUrl()}/quotes` },
      { "@type": "ListItem", position: 3, name: `${person.name} Quotes`, item: url },
    ],
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

        <FaqBlock faqs={faqs} heading={`${firstName}'s Quotes: FAQ`} />

        <div className="rounded-2xl border border-line bg-brand-soft/40 p-5 text-sm">
          <span className="text-foreground/70">Keep going: </span>
          <Link href={`/billionaire/${person.id}`} className="font-medium text-brand hover:underline">
            {firstName}&apos;s live net worth
          </Link>
          <span className="text-foreground/70"> · </span>
          <Link
            href={netWorthUrl(person.id, person.name, new Date().getFullYear())}
            className="font-medium text-brand hover:underline"
          >
            {firstName}&apos;s net worth explained
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

        {relatedQuotePeople.length > 0 && (
          <section aria-labelledby="related-quotes" className="border-t border-line pt-5">
            <h2 id="related-quotes" className="mb-2 text-lg font-bold">
              More Verified Quotes
            </h2>
            <ul className="flex flex-wrap gap-2 text-sm">
              {relatedQuotePeople.map((other) => (
                <li key={other.id}>
                  <Link
                    href={`/quotes/${other.id}`}
                    className="inline-block rounded-full border border-line px-3.5 py-1.5 font-medium text-foreground/80 transition-colors hover:border-brand hover:text-brand"
                  >
                    {other.name} quotes
                  </Link>
                </li>
              ))}
            </ul>
          </section>
        )}

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
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />
    </div>
  );
}
