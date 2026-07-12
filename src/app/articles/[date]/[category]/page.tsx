import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ensureArticle } from "@/lib/generate-article";
import { isCategory, categoryArticleTitle } from "@/lib/categories";
import { isValidDateString, formatDateLong } from "@/lib/dates";
import { formatClock } from "@/lib/format";
import { siteUrl } from "@/lib/site";
import Breadcrumbs from "@/components/Breadcrumbs";
import ShareBar from "@/components/ShareBar";
import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";
import ArticleBody from "@/components/ArticleBody";
import FaqSection from "@/components/FaqSection";
import ArticleJsonLd from "@/components/ArticleJsonLd";
import { buildArticleText } from "@/lib/article-template";

export const dynamic = "force-dynamic";

type RouteParams = { date: string; category: string };

async function loadArticle(params: RouteParams) {
  const { date, category } = params;
  if (!isValidDateString(date) || !isCategory(category)) {
    return null;
  }
  const article = await ensureArticle(date, category);
  return article;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<RouteParams>;
}): Promise<Metadata> {
  const resolved = await params;
  const article = await loadArticle(resolved);
  if (!article) {
    return { title: "Article not found" };
  }

  const { title, summary } = buildArticleText(article.date, article.category, article.facts);
  const leader = article.facts.topByNetWorth[0]?.name;
  const url = `${siteUrl()}/articles/${article.date}/${article.category}`;
  return {
    title,
    description: summary,
    keywords: [
      "billionaires today",
      "richest people today",
      "biggest gainers billionaires",
      "biggest losers billionaires",
      ...(leader ? [`richest person ${article.date}`, `${leader} net worth today`] : []),
    ],
    alternates: { canonical: url },
    openGraph: { title, description: summary, type: "article", url },
    twitter: { card: "summary", title, description: summary },
  };
}

export default async function ArticlePage({ params }: { params: Promise<RouteParams> }) {
  const resolved = await params;
  const article = await loadArticle(resolved);

  if (!article) {
    notFound();
  }

  const { title, summary, faqs } = buildArticleText(article.date, article.category, article.facts);

  return (
    <div className="flex flex-1 flex-col">
      <SiteHeader activeCategory={article.category} />
      <main className="mx-auto flex w-full max-w-3xl flex-1 flex-col gap-6 px-4 py-8 sm:px-8">
        <Breadcrumbs
          crumbs={[
            { label: "Daily Recaps", href: "/articles" },
            { label: categoryArticleTitle(article.category) },
          ]}
        />

        <header>
          <h1 className="font-display text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
            {title}
          </h1>
          <p className="mt-2 text-xs text-[--muted]">
            Published <time dateTime={article.generatedAt}>{formatDateLong(article.date)}, {formatClock(article.generatedAt)}</time>{" "}
            · By RealTimeBillionaire Data Desk
          </p>
          <p className="mt-4 text-base text-foreground/80">{summary}</p>
        </header>

        <ArticleBody facts={article.facts} />
        <FaqSection faqs={faqs} />

        <section className="rounded-2xl border border-line bg-brand-soft/40 p-5 text-sm">
          <span className="text-foreground/70">Keep going: </span>
          <Link href="/news" className="font-medium text-brand hover:underline">
            today&apos;s biggest wealth moves
          </Link>
          <span className="text-foreground/70"> · </span>
          <Link href="/" className="font-medium text-brand hover:underline">
            the live leaderboard
          </Link>
          <span className="text-foreground/70"> · </span>
          <Link href="/quotes" className="font-medium text-brand hover:underline">
            verified billionaire quotes
          </Link>
        </section>

        <ShareBar text={`${title} — the daily numbers:`} />

        <p className="text-xs text-neutral-400">
          Figures are directional estimates from public stock holdings, not
          audited valuations, and this site is not affiliated with Forbes.
        </p>
      </main>
      <SiteFooter />
      <ArticleJsonLd
        date={article.date}
        category={article.category}
        title={title}
        summary={summary}
        faqs={faqs}
        generatedAt={article.generatedAt}
      />
    </div>
  );
}
