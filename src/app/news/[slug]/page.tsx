import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getNewsArticle, listNews, buildNewsBody } from "@/lib/news";
import { getPersonProfile } from "@/data/profiles";
import { getPersonQuotes } from "@/data/quotes";
import { formatDateLong } from "@/lib/dates";
import { formatUsdCompact, formatClock } from "@/lib/format";
import { countrySlug } from "@/lib/countries";
import { siteUrl } from "@/lib/site";
import { publisherJsonLd, SITE_NAME } from "@/lib/schema";
import Breadcrumbs from "@/components/Breadcrumbs";
import ShareBar from "@/components/ShareBar";
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
  const article = getNewsArticle(slug);
  if (!article) {
    return { title: "Story not found" };
  }
  const facts = article.facts;
  const gained = facts.deltaUsd > 0;
  const url = `${siteUrl()}/news/${article.slug}`;
  return {
    title: article.title,
    description: article.summary,
    keywords: [
      `${facts.name} net worth`,
      `${facts.name} net worth today`,
      `${facts.name} ${gained ? "gains" : "loses"} billions`,
      `${facts.name} news`,
      ...(facts.ticker
        ? [
            `${facts.ticker} stock today`,
            `why did ${facts.ticker} ${gained ? "go up" : "fall"} today`,
          ]
        : []),
      "billionaire news today",
      `richest people ${facts.date}`,
    ],
    alternates: { canonical: url },
    openGraph: {
      title: article.title,
      description: article.summary,
      type: "article",
      url,
      publishedTime: article.generatedAt,
      modifiedTime: article.generatedAt,
      siteName: SITE_NAME,
    },
    twitter: { card: "summary_large_image", title: article.title, description: article.summary },
  };
}

export default async function NewsArticlePage({ params }: { params: Promise<RouteParams> }) {
  const { slug } = await params;
  const article = getNewsArticle(slug);

  if (!article) {
    notFound();
  }

  const facts = article.facts;
  const body = buildNewsBody(facts);
  const url = `${siteUrl()}/news/${article.slug}`;
  const imageUrl = `${siteUrl()}/news/${article.slug}/opengraph-image`;
  const profile = getPersonProfile(article.personId);
  const quotes = getPersonQuotes(article.personId);
  const personNews = listNews({ personId: article.personId, limit: 4 }).filter(
    (item) => item.slug !== slug,
  );
  const more = listNews({ limit: 8 })
    .filter((item) => item.slug !== slug && item.personId !== article.personId)
    .slice(0, 5);

  const exploreLinks = [
    {
      href: `/billionaire/${article.personId}`,
      label: `${facts.name}'s live net worth & rank`,
    },
    profile?.careerTimeline && profile.careerTimeline.length > 0
      ? { href: `/story/${article.personId}`, label: `How ${facts.name} built the fortune` }
      : null,
    quotes.length > 0
      ? { href: `/quotes/${article.personId}`, label: `${facts.name}'s verified quotes` }
      : null,
    facts.ticker
      ? { href: `/stock/${facts.ticker}`, label: `Who owns ${facts.ticker}?` }
      : null,
    {
      href: `/country/${countrySlug(facts.country)}`,
      label: `Richest people in ${facts.country}`,
    },
    { href: `/articles/${article.date}/world`, label: `Full recap for ${formatDateLong(article.date)}` },
  ].filter((link) => link !== null);

  const newsJsonLd = {
    "@context": "https://schema.org",
    "@type": "NewsArticle",
    headline: article.title,
    description: article.summary,
    image: [imageUrl],
    datePublished: article.generatedAt,
    dateModified: article.generatedAt,
    author: { "@type": "Organization", name: SITE_NAME, url: siteUrl() },
    publisher: publisherJsonLd(),
    mainEntityOfPage: { "@type": "WebPage", "@id": url },
    url,
    articleSection: "Billionaire News",
    articleBody: body.join("\n\n"),
    wordCount: body.join(" ").split(/\s+/).length,
    inLanguage: "en",
    isAccessibleForFree: true,
    keywords: `${facts.name}, net worth, billionaire news${facts.ticker ? `, ${facts.ticker}` : ""}`,
    about: {
      "@type": "Person",
      name: facts.name,
      url: `${siteUrl()}/billionaire/${article.personId}`,
    },
  };

  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: siteUrl() },
      { "@type": "ListItem", position: 2, name: "News", item: `${siteUrl()}/news` },
      { "@type": "ListItem", position: 3, name: article.title, item: url },
    ],
  };

  return (
    <div className="flex flex-1 flex-col">
      <SiteHeader activeCategory="world" />
      <main className="mx-auto flex w-full max-w-3xl flex-1 flex-col gap-6 px-4 py-8 sm:px-8">
        <Breadcrumbs crumbs={[{ label: "News", href: "/news" }, { label: facts.name }]} />

        <article className="flex flex-col gap-5">
          <header>
            <div className="text-xs uppercase tracking-wide text-[--muted]">
              Wealth Move · {facts.primarySource}
            </div>
            <h1 className="mt-1 font-display text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
              {article.title}
            </h1>
            <p className="mt-2 text-base text-foreground/70">{article.summary}</p>
            <p className="mt-2 text-xs text-[--muted]">
              Published{" "}
              <time dateTime={article.generatedAt}>
                {formatDateLong(article.date)}, {formatClock(article.generatedAt)}
              </time>{" "}
              · Updated as figures moved · By {SITE_NAME} Data Desk
            </p>
          </header>

          {/* Visible hero — same generated card used for shares/Discover. */}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={`/news/${article.slug}/opengraph-image`}
            alt={article.title}
            width={1200}
            height={630}
            className="w-full rounded-2xl border border-line"
          />

          <div className="flex flex-col gap-4 text-[15px] leading-relaxed text-foreground/85">
            {body.map((paragraph, index) => (
              <p key={index}>{paragraph}</p>
            ))}
          </div>

          <section
            aria-labelledby="explore-links"
            className="rounded-2xl border border-line bg-brand-soft/40 p-5"
          >
            <h2 id="explore-links" className="mb-2 text-sm font-semibold text-foreground">
              Go deeper on {facts.name.split(" ")[0]} ({formatUsdCompact(facts.netWorthUsd)}, #{facts.rank})
            </h2>
            <ul className="flex flex-col gap-1.5 text-sm">
              {exploreLinks.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="text-brand hover:underline">
                    {link.label} &rarr;
                  </Link>
                </li>
              ))}
            </ul>
          </section>

          <ShareBar text={`${article.title} — the story behind the move:`} />
        </article>

        {personNews.length > 0 && (
          <section aria-labelledby="person-news" className="border-t border-line pt-5">
            <h2 id="person-news" className="mb-3 text-lg font-bold">
              Previous {facts.name} Moves
            </h2>
            <ul className="flex flex-col gap-2 text-sm">
              {personNews.map((item) => (
                <li key={item.slug}>
                  <Link href={`/news/${item.slug}`} className="text-brand hover:underline">
                    {item.title}
                  </Link>{" "}
                  <span className="text-xs text-[--muted]">({formatDateLong(item.date)})</span>
                </li>
              ))}
            </ul>
          </section>
        )}

        {more.length > 0 && (
          <section aria-labelledby="more-news" className="border-t border-line pt-5">
            <h2 id="more-news" className="mb-3 text-lg font-bold">
              More Wealth Moves
            </h2>
            <ul className="flex flex-col gap-2 text-sm">
              {more.map((item) => (
                <li key={item.slug}>
                  <Link href={`/news/${item.slug}`} className="text-brand hover:underline">
                    {item.title}
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
        dangerouslySetInnerHTML={{ __html: JSON.stringify(newsJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />
    </div>
  );
}
