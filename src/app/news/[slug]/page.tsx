import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getNewsArticle, listNews, buildNewsBody } from "@/lib/news";
import { formatDateLong } from "@/lib/dates";
import { siteUrl } from "@/lib/site";
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
  return {
    title: article.title,
    description: article.summary,
    alternates: { canonical: `${siteUrl()}/news/${article.slug}` },
    openGraph: {
      title: article.title,
      description: article.summary,
      type: "article",
      publishedTime: article.generatedAt,
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

  const body = buildNewsBody(article.facts);
  const more = listNews({ limit: 6 }).filter((item) => item.slug !== slug).slice(0, 5);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "NewsArticle",
    headline: article.title,
    description: article.summary,
    datePublished: article.generatedAt,
    dateModified: article.generatedAt,
    author: { "@type": "Organization", name: "RealTimeBillionaire" },
    publisher: { "@type": "Organization", name: "RealTimeBillionaire", url: siteUrl() },
    mainEntityOfPage: `${siteUrl()}/news/${article.slug}`,
    about: {
      "@type": "Person",
      name: article.facts.name,
      url: `${siteUrl()}/billionaire/${article.personId}`,
    },
  };

  return (
    <div className="flex flex-1 flex-col">
      <SiteHeader activeCategory="world" />
      <main className="mx-auto flex w-full max-w-3xl flex-1 flex-col gap-6 px-4 py-8 sm:px-8">
        <Breadcrumbs crumbs={[{ label: "News", href: "/news" }, { label: article.facts.name }]} />

        <article className="flex flex-col gap-5">
          <header>
            <div className="text-xs uppercase tracking-wide text-[--muted]">
              {formatDateLong(article.date)} · Wealth Move
            </div>
            <h1 className="mt-1 font-display text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
              {article.title}
            </h1>
            <p className="mt-2 text-base text-foreground/70">{article.summary}</p>
          </header>

          <div className="flex flex-col gap-4 text-[15px] leading-relaxed text-foreground/85">
            {body.map((paragraph, index) => (
              <p key={index}>{paragraph}</p>
            ))}
          </div>

          <div className="rounded-2xl border border-line bg-brand-soft/40 p-5 text-sm">
            <span className="text-foreground/70">Follow the live number: </span>
            <Link
              href={`/billionaire/${article.personId}`}
              className="font-medium text-brand hover:underline"
            >
              {article.facts.name}&apos;s real-time net worth &rarr;
            </Link>
          </div>

          <ShareBar
            text={`${article.title} — the story behind the move:`}
          />
        </article>

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
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
    </div>
  );
}
