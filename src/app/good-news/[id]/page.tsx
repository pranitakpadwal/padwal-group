import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { findBillionaireById, getLeaderboard } from "@/lib/net-worth";
import { getPersonProfile } from "@/data/profiles";
import { getPersonQuotes } from "@/data/quotes";
import { isSpotlightEligible, buildSpotlight } from "@/lib/spotlight";
import { listNews } from "@/lib/news";
import { formatUsdCompact } from "@/lib/format";
import { formatDateLong } from "@/lib/dates";
import { siteUrl } from "@/lib/site";
import { publisherJsonLd, SITE_NAME } from "@/lib/schema";
import Breadcrumbs from "@/components/Breadcrumbs";
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
  const profile = getPersonProfile(id);
  if (!person || !isSpotlightEligible(profile)) {
    return { title: "Not found" };
  }
  const spotlight = buildSpotlight(person, profile, undefined);
  const url = `${siteUrl()}/good-news/${person.id}`;
  return {
    title: `${spotlight.headline} — Good News`,
    description: spotlight.dek,
    keywords: [
      `${person.name} good news`,
      `${person.name} achievements`,
      `${person.name} success story`,
      `${person.name} philanthropy`,
      `${person.name} net worth`,
    ],
    alternates: { canonical: url },
    openGraph: { title: spotlight.headline, description: spotlight.dek, type: "article", url, siteName: SITE_NAME },
    twitter: { card: "summary_large_image", title: spotlight.headline, description: spotlight.dek },
  };
}

export default async function GoodNewsPage({ params }: { params: Promise<RouteParams> }) {
  const { id } = await params;
  const person = findBillionaireById(id);
  const profile = getPersonProfile(id);

  if (!person || !isSpotlightEligible(profile)) {
    notFound();
  }

  const leaderboard = await getLeaderboard();
  const ranked = leaderboard.people.find((p) => p.id === id);
  const spotlight = buildSpotlight(person, profile, ranked, leaderboard);
  const firstName = person.name.split(" ")[0];
  const quotes = getPersonQuotes(id);
  const personNews = listNews({ personId: id, limit: 3 });
  const url = `${siteUrl()}/good-news/${person.id}`;

  const exploreLinks = [
    { href: `/billionaire/${id}`, label: `${firstName}'s live net worth & rank` },
    profile.careerTimeline && profile.careerTimeline.length > 0
      ? { href: `/story/${id}`, label: `How ${firstName} built the fortune, year by year` }
      : null,
    quotes.length > 0 ? { href: `/quotes/${id}`, label: `${firstName}'s verified quotes` } : null,
    profile.ventures && profile.ventures.length > 0
      ? { href: `/billionaire/${id}/ventures`, label: `${firstName}'s ventures & investments` }
      : null,
  ].filter((link) => link !== null);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: spotlight.headline,
    description: spotlight.dek,
    image: [`${url}/opengraph-image`],
    author: { "@type": "Organization", name: SITE_NAME, url: siteUrl() },
    publisher: publisherJsonLd(),
    mainEntityOfPage: { "@type": "WebPage", "@id": url },
    url,
    articleSection: "Good News",
    articleBody: spotlight.paragraphs.join("\n\n"),
    wordCount: spotlight.wordCount,
    inLanguage: "en",
    isAccessibleForFree: true,
    keywords: `${person.name}, good news, philanthropy, ${person.primarySource}`,
    about: { "@type": "Person", name: person.name, url: `${siteUrl()}/billionaire/${id}` },
  };

  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: siteUrl() },
      { "@type": "ListItem", position: 2, name: "News", item: `${siteUrl()}/news` },
      { "@type": "ListItem", position: 3, name: "Good News", item: `${siteUrl()}/good-news` },
      { "@type": "ListItem", position: 4, name: person.name, item: url },
    ],
  };

  return (
    <div className="flex flex-1 flex-col">
      <SiteHeader activeCategory="world" />
      <main className="mx-auto flex w-full max-w-3xl flex-1 flex-col gap-6 px-4 py-8 sm:px-8">
        <Breadcrumbs
          crumbs={[
            { label: "News", href: "/news" },
            { label: "Good News", href: "/good-news" },
            { label: person.name },
          ]}
        />

        <article className="flex flex-col gap-5">
          <header>
            <div className="text-xs uppercase tracking-wide text-[--muted]">
              Good News · {person.primarySource}
            </div>
            <h1 className="mt-1 font-display text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
              {spotlight.headline}
            </h1>
            <p className="mt-2 text-base text-foreground/70">{spotlight.dek}</p>
          </header>

          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={`/good-news/${id}/opengraph-image`}
            alt={spotlight.headline}
            width={1200}
            height={630}
            className="w-full rounded-2xl border border-line"
          />

          <div className="flex flex-col gap-4 text-[15px] leading-relaxed text-foreground/85">
            {spotlight.paragraphs.map((paragraph, index) => (
              <p key={index}>{paragraph}</p>
            ))}
          </div>

          <section
            aria-labelledby="explore-links"
            className="rounded-2xl border border-line bg-brand-soft/40 p-5"
          >
            <h2 id="explore-links" className="mb-2 text-sm font-semibold text-foreground">
              Go deeper on {firstName}
              {ranked ? ` (${formatUsdCompact(ranked.netWorthUsd)}, #${ranked.rank})` : ""}
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

          <ShareBar text={`${spotlight.headline} — the full story:`} />
        </article>

        {personNews.length > 0 && (
          <section aria-labelledby="related-news" className="border-t border-line pt-5">
            <h2 id="related-news" className="mb-2 text-lg font-bold">
              {firstName} in the News
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

        <p className="text-xs text-neutral-400">
          Built from fact-checked profile data, not a live news feed — dates
          and figures reflect our verified records, and net worth is our
          real-time estimate.
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
