import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getQuoteOfDayBySlug, listQuoteOfDay } from "@/lib/quote-of-day";
import { getPersonQuotes } from "@/data/quotes";
import { formatDateLong } from "@/lib/dates";
import { siteUrl } from "@/lib/site";
import { publisherJsonLd, SITE_NAME } from "@/lib/schema";
import Breadcrumbs from "@/components/Breadcrumbs";
import ShareBar from "@/components/ShareBar";
import QuoteShare from "@/components/QuoteShare";
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
  const entry = getQuoteOfDayBySlug(slug);
  if (!entry) {
    return { title: "Not found" };
  }
  const description = `"${entry.quoteText}" — ${entry.personName}, ${entry.quoteSource}. A new verified billionaire quote every day.`;
  const url = `${siteUrl()}/quote-of-the-day/${entry.slug}`;
  return {
    title: entry.title,
    description,
    keywords: [
      "quote of the day",
      `${entry.personName} quote`,
      `${entry.personName} quote of the day`,
      "motivational quote today",
      "inspirational quote of the day",
    ],
    alternates: { canonical: url },
    openGraph: {
      title: entry.title,
      description,
      type: "article",
      url,
      publishedTime: entry.generatedAt,
      siteName: SITE_NAME,
    },
    twitter: { card: "summary_large_image", title: entry.title, description },
  };
}

export default async function QuoteOfDayPage({ params }: { params: Promise<RouteParams> }) {
  const { slug } = await params;
  const entry = getQuoteOfDayBySlug(slug);

  if (!entry) {
    notFound();
  }

  const url = `${siteUrl()}/quote-of-the-day/${entry.slug}`;
  const otherQuotes = getPersonQuotes(entry.personId).filter((q) => q.text !== entry.quoteText);
  const recentDays = listQuoteOfDay(6).filter((item) => item.slug !== slug);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: entry.title,
    description: `"${entry.quoteText}" — ${entry.personName}, ${entry.quoteSource}.`,
    image: [`${url}/opengraph-image`],
    datePublished: entry.generatedAt,
    dateModified: entry.generatedAt,
    author: { "@type": "Organization", name: SITE_NAME, url: siteUrl() },
    publisher: publisherJsonLd(),
    mainEntityOfPage: { "@type": "WebPage", "@id": url },
    url,
    articleSection: "Quote of the Day",
    inLanguage: "en",
    isAccessibleForFree: true,
    keywords: `quote of the day, ${entry.personName}, motivational quotes`,
    about: {
      "@type": "Person",
      name: entry.personName,
      url: `${siteUrl()}/billionaire/${entry.personId}`,
    },
    citation: {
      "@type": "Quotation",
      text: entry.quoteText,
      creator: { "@type": "Person", name: entry.personName },
      ...(entry.quoteYear ? { dateCreated: String(entry.quoteYear) } : {}),
    },
  };

  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: siteUrl() },
      { "@type": "ListItem", position: 2, name: "Quote of the Day", item: `${siteUrl()}/quote-of-the-day` },
      { "@type": "ListItem", position: 3, name: entry.personName, item: url },
    ],
  };

  return (
    <div className="flex flex-1 flex-col">
      <SiteHeader activeCategory="world" />
      <main className="mx-auto flex w-full max-w-3xl flex-1 flex-col gap-6 px-4 py-8 sm:px-8">
        <Breadcrumbs
          crumbs={[{ label: "Quote of the Day", href: "/quote-of-the-day" }, { label: entry.personName }]}
        />

        <article className="flex flex-col gap-5">
          <div className="text-xs uppercase tracking-wide text-[--muted]">
            {formatDateLong(entry.date)} · Quote of the Day
          </div>

          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={`/quote-of-the-day/${entry.slug}/opengraph-image`}
            alt={entry.title}
            width={1200}
            height={630}
            className="w-full rounded-2xl border border-line"
          />

          <figure className="flex flex-col gap-3 rounded-2xl border border-line bg-surface p-6">
            <blockquote className="font-display text-2xl leading-snug text-foreground">
              &ldquo;{entry.quoteText}&rdquo;
            </blockquote>
            <figcaption className="text-sm text-[--muted]">
              — {entry.personName}, {entry.quoteSource}
              {entry.quoteYear ? ` (${entry.quoteYear})` : ""}
            </figcaption>
            <QuoteShare text={entry.quoteText} attribution={entry.personName} />
          </figure>

          <div className="rounded-2xl border border-line bg-brand-soft/40 p-5 text-sm">
            <span className="text-foreground/70">Keep reading: </span>
            <Link href={`/quotes/${entry.personId}`} className="font-medium text-brand hover:underline">
              All of {entry.personName}&apos;s verified quotes
            </Link>
            <span className="text-foreground/70"> · </span>
            <Link href={`/billionaire/${entry.personId}`} className="font-medium text-brand hover:underline">
              {entry.personName}&apos;s live net worth
            </Link>
          </div>

          <ShareBar text={`${entry.title.split(":")[0]}: "${entry.quoteText}"`} />
        </article>

        {otherQuotes.length > 0 && (
          <section aria-labelledby="more-from-person" className="border-t border-line pt-5">
            <h2 id="more-from-person" className="mb-2 text-lg font-bold">
              More From {entry.personName}
            </h2>
            <ul className="flex flex-col gap-2 text-sm">
              {otherQuotes.slice(0, 3).map((quote, index) => (
                <li key={index} className="italic text-foreground/70">
                  &ldquo;{quote.text}&rdquo;
                </li>
              ))}
            </ul>
          </section>
        )}

        {recentDays.length > 0 && (
          <section aria-labelledby="recent-days" className="border-t border-line pt-5">
            <h2 id="recent-days" className="mb-2 text-lg font-bold">
              Recent Days
            </h2>
            <ul className="flex flex-col gap-2 text-sm">
              {recentDays.map((item) => (
                <li key={item.slug}>
                  <Link href={`/quote-of-the-day/${item.slug}`} className="text-brand hover:underline">
                    {item.personName}: &ldquo;{item.quoteText.length > 60 ? `${item.quoteText.slice(0, 60)}…` : item.quoteText}&rdquo;
                  </Link>
                </li>
              ))}
            </ul>
          </section>
        )}
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
