import type { Metadata } from "next";
import Link from "next/link";
import { listArticles } from "@/lib/articles";
import { buildArticleText } from "@/lib/article-template";
import { CATEGORIES, categoryLabel, isCategory, type Category } from "@/lib/categories";
import { formatDateLong } from "@/lib/dates";
import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Daily Recaps — Real-Time Billionaires",
  description:
    "Daily recap articles covering who gained, who lost, and how the rankings shifted across World, India, Women, and Under-45 billionaire lists.",
};

export default async function ArticlesIndexPage({
  searchParams,
}: {
  searchParams: Promise<{ category?: string }>;
}) {
  const resolved = await searchParams;
  const category: Category | undefined =
    resolved.category && isCategory(resolved.category) ? resolved.category : undefined;

  const articles = listArticles({ category, limit: 60 });

  return (
    <div className="flex flex-1 flex-col bg-zinc-50 dark:bg-black">
      <SiteHeader activeCategory="world" />
      <main className="mx-auto flex w-full max-w-3xl flex-1 flex-col gap-6 px-4 py-8 sm:px-8">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-black dark:text-zinc-50 sm:text-3xl">
            Daily Recaps
          </h1>
          <p className="mt-1 text-sm text-neutral-500 dark:text-neutral-400">
            A new recap for each list, every day: who&apos;s on top, who
            gained, who lost, and how the rankings shifted.
          </p>
        </div>

        <nav className="flex flex-wrap gap-2 text-sm" aria-label="Filter by category">
          <Link
            href="/articles"
            className={`rounded-full border px-3 py-1 ${
              !category
                ? "border-black bg-black text-white dark:border-white dark:bg-white dark:text-black"
                : "border-neutral-300 text-neutral-600 dark:border-neutral-700 dark:text-neutral-300"
            }`}
          >
            All
          </Link>
          {CATEGORIES.map((c) => (
            <Link
              key={c}
              href={`/articles?category=${c}`}
              className={`rounded-full border px-3 py-1 ${
                category === c
                  ? "border-black bg-black text-white dark:border-white dark:bg-white dark:text-black"
                  : "border-neutral-300 text-neutral-600 dark:border-neutral-700 dark:text-neutral-300"
              }`}
            >
              {categoryLabel(c)}
            </Link>
          ))}
        </nav>

        {articles.length === 0 ? (
          <p className="text-sm text-neutral-500 dark:text-neutral-400">
            No recaps have been generated yet. Visit a{" "}
            <Link href="/" className="hover:underline">
              billionaire list
            </Link>{" "}
            first, or check back after the next daily update.
          </p>
        ) : (
          <ul className="divide-y divide-neutral-200 dark:divide-neutral-800">
            {articles.map((article) => {
              const { title, summary } = buildArticleText(article.date, article.category, article.facts);
              return (
                <li key={`${article.date}-${article.category}`} className="py-4">
                  <Link
                    href={`/articles/${article.date}/${article.category}`}
                    className="text-lg font-semibold hover:underline"
                  >
                    {title}
                  </Link>
                  <p className="mt-1 text-sm text-neutral-500 dark:text-neutral-400">
                    <time dateTime={article.date}>{formatDateLong(article.date)}</time> &middot;{" "}
                    {categoryLabel(article.category)}
                  </p>
                  <p className="mt-1 text-sm text-neutral-600 dark:text-neutral-300">{summary}</p>
                </li>
              );
            })}
          </ul>
        )}
      </main>
      <SiteFooter />
    </div>
  );
}
