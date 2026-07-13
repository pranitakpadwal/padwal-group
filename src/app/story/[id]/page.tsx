import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { findBillionaireById, getLeaderboard } from "@/lib/net-worth";
import { getPersonProfile } from "@/data/profiles";
import { getPersonQuotes } from "@/data/quotes";
import { formatUsdCompact } from "@/lib/format";
import { formatDateLong } from "@/lib/dates";
import { listNews } from "@/lib/news";
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
  if (!person || !profile?.careerTimeline?.length) {
    return { title: "Story not found" };
  }
  const title = `How ${person.name} Built the Fortune — The Full Story`;
  const description = `From the first documented milestone to a place among the world's richest: ${person.name}'s wealth journey, year by year and age by age, with the numbers behind it.`;
  return {
    title,
    description,
    keywords: [
      `how did ${person.name} get rich`,
      `${person.name} success story`,
      `${person.name} biography`,
      `${person.name} career timeline`,
    ],
    alternates: { canonical: `${siteUrl()}/story/${person.id}` },
    openGraph: { title, description, type: "article" },
  };
}

export default async function StoryPage({ params }: { params: Promise<RouteParams> }) {
  const { id } = await params;
  const person = findBillionaireById(id);
  const profile = getPersonProfile(id);
  const timeline = profile?.careerTimeline;

  if (!person || !timeline || timeline.length === 0) {
    notFound();
  }

  const leaderboard = await getLeaderboard();
  const ranked = leaderboard.people.find((p) => p.id === id);
  const birthYear = Number(person.birthDate.slice(0, 4));
  const firstName = person.name.split(" ")[0];
  const quotes = getPersonQuotes(id);

  const milestones = timeline.map((entry) => {
    const year = Number(entry.year);
    const age = Number.isFinite(year) ? year - birthYear : null;
    return { ...entry, age };
  });
  const firstMilestone = milestones[0];

  const intro = [
    ranked
      ? `${person.name} is worth an estimated ${formatUsdCompact(ranked.netWorthUsd)} today — #${ranked.rank} on the world's rich list. ${person.bio}`
      : person.bio,
    firstMilestone.age !== null
      ? `The fortune didn't appear overnight. The first milestone on the public record came at age ${firstMilestone.age}: ${firstMilestone.title.toLowerCase()}. Everything after that is a chain of documented decisions — this is that chain, year by year.`
      : `The fortune didn't appear overnight — this is the documented chain of decisions behind it, year by year.`,
  ];

  const url = `${siteUrl()}/story/${person.id}`;
  const personNews = listNews({ personId: id, limit: 3 });

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: `How ${person.name} Built the Fortune`,
    description: intro[0],
    image: [`${url}/opengraph-image`],
    author: { "@type": "Organization", name: SITE_NAME, url: siteUrl() },
    publisher: publisherJsonLd(),
    mainEntityOfPage: { "@type": "WebPage", "@id": url },
    url,
    articleSection: "Wealth Stories",
    inLanguage: "en",
    isAccessibleForFree: true,
    keywords: `how did ${person.name} get rich, ${person.name} success story, ${person.primarySource}`,
    about: { "@type": "Person", name: person.name, url: `${siteUrl()}/billionaire/${person.id}` },
  };

  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: siteUrl() },
      {
        "@type": "ListItem",
        position: 2,
        name: person.name,
        item: `${siteUrl()}/billionaire/${person.id}`,
      },
      { "@type": "ListItem", position: 3, name: "The Full Story", item: url },
    ],
  };

  return (
    <div className="flex flex-1 flex-col">
      <SiteHeader activeCategory="world" />
      <main className="mx-auto flex w-full max-w-3xl flex-1 flex-col gap-6 px-4 py-8 sm:px-8">
        <Breadcrumbs
          crumbs={[
            { label: person.name, href: `/billionaire/${person.id}` },
            { label: "The Full Story" },
          ]}
        />

        <article className="flex flex-col gap-6">
          <header>
            <div className="text-xs uppercase tracking-wide text-[--muted]">Wealth Story</div>
            <h1 className="mt-1 font-display text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
              How {person.name} Built the Fortune
            </h1>
          </header>

          {/* Visible hero — same generated card used for shares/Discover. */}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={`/story/${person.id}/opengraph-image`}
            alt={`How ${person.name} built the fortune`}
            width={1200}
            height={630}
            className="w-full rounded-2xl border border-line"
          />

          <div className="flex flex-col gap-4 text-[15px] leading-relaxed text-foreground/85">
            {intro.map((paragraph, index) => (
              <p key={index}>{paragraph}</p>
            ))}
          </div>

          <section aria-labelledby="milestones-heading" className="flex flex-col gap-4">
            <h2 id="milestones-heading" className="font-display text-xl font-semibold text-foreground">
              The Milestones
            </h2>
            {milestones.map((milestone, index) => (
              <div key={index} className="rounded-2xl border border-line bg-surface p-5">
                <div className="flex flex-wrap items-baseline justify-between gap-2">
                  <h3 className="font-display text-lg font-semibold text-brand-dark">
                    {milestone.year}: {milestone.title}
                  </h3>
                  {milestone.age !== null && milestone.age >= 0 && (
                    <span className="rounded-full bg-brand-soft px-2.5 py-0.5 text-xs font-medium text-brand-dark">
                      at age {milestone.age}
                    </span>
                  )}
                </div>
                <p className="mt-1.5 text-sm text-foreground/70">{milestone.description}</p>
              </div>
            ))}
            {ranked && (
              <div className="rounded-2xl border border-brand/40 bg-brand-soft/50 p-5">
                <h3 className="font-display text-lg font-semibold text-brand-dark">
                  Today: #{ranked.rank} in the world
                </h3>
                <p className="mt-1.5 text-sm text-foreground/70">
                  {firstName}&apos;s net worth is an estimated{" "}
                  {formatUsdCompact(ranked.netWorthUsd)}, updated in real time from public
                  holdings.{" "}
                  <Link href={`/billionaire/${person.id}`} className="font-medium text-brand hover:underline">
                    See the live number &rarr;
                  </Link>
                </p>
              </div>
            )}
          </section>

          {quotes.length > 0 && (
            <section className="rounded-2xl border border-line bg-surface p-5 text-sm">
              <span className="text-foreground/70">In {firstName}&apos;s own words: </span>
              <Link href={`/quotes/${person.id}`} className="font-medium text-brand hover:underline">
                {quotes.length} verified quotes, each with its source &rarr;
              </Link>
            </section>
          )}

          <ShareBar
            text={
              firstMilestone.age !== null && ranked
                ? `At ${firstMilestone.age}, ${person.name} ${firstMilestone.title.toLowerCase()}. Today: ${formatUsdCompact(ranked.netWorthUsd)}. The full story, year by year:`
                : `How ${person.name} built the fortune — the full story, year by year:`
            }
          />

          {personNews.length > 0 && (
            <section aria-labelledby="story-news" className="border-t border-line pt-5">
              <h2 id="story-news" className="mb-2 text-lg font-bold">
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
            Milestones are drawn from widely-reported public history; ages are
            computed from the birth year and can be off by one depending on
            the month. Net worth is our real-time estimate.
          </p>
        </article>
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
