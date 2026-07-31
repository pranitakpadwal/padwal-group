import type { Metadata } from "next";
import Link from "next/link";
import { listRecentNews } from "@/lib/generate-article";
import { formatDateLong } from "@/lib/dates";
import { siteUrl } from "@/lib/site";
import Breadcrumbs from "@/components/Breadcrumbs";
import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Billionaire News — Today's Biggest Wealth Gains & Losses",
  description:
    "Auto-updated news on the biggest billionaire net worth moves: who gained billions today, who lost them, and the stock moves behind each swing.",
  keywords: [
    "billionaire news today",
    "who lost billions today",
    "biggest billionaire gains today",
    "billionaire net worth change",
  ],
  alternates: { canonical: `${siteUrl()}/news` },
};

export default async function NewsIndex() {
  const news = listRecentNews();

  return (
    <div className="flex flex-1 flex-col">
      <SiteHeader activeCategory="world" />
      <main className="mx-auto flex w-full max-w-4xl flex-1 flex-col gap-6 px-4 py-8 sm:px-8">
        <Breadcrumbs crumbs={[{ label: "News" }]} />
        <header>
          <h1 className="font-display text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
            Billionaire News
          </h1>
          <p className="mt-2 max-w-2xl text-foreground/70">
            When a fortune moves by billions in a day, it&apos;s a story. These
            are written automatically from our tracked data the moment a big
            move happens — numbers first, no fluff.
          </p>
        </header>


        <Link
          href="/net-worth"
          className="flex items-center justify-between gap-3 rounded-2xl border border-line bg-surface p-4 transition-colors hover:border-brand"
        >
          <span className="text-sm text-foreground">
            <span className="font-semibold text-foreground">Want the full story on someone&apos;s fortune?</span>{" "}
            Net worth explainers, updated live, for every billionaire we track.
          </span>
          <span className="shrink-0 text-sm font-medium text-brand">See Net Worth Explainers &rarr;</span>
        </Link>

        {news.length === 0 ? (
          <p className="rounded-2xl border border-line bg-surface p-6 text-sm text-foreground/70">
            No billion-dollar moves on the books yet today. Stories appear here
            automatically whenever someone on the list gains or loses more
            than $3B (or 5%) in a single day — check back after the next
            market session.
          </p>
        ) : (
          <ul className="flex flex-col gap-4">
            {news.map((article) => (
              <li key={article.slug}>
                <Link
                  href={`/news/${article.slug}`}
                  className="flex flex-col gap-1.5 rounded-2xl border border-line bg-surface p-5 transition-colors hover:border-brand"
                >
                  <div className="text-xs uppercase tracking-wide text-[--muted]">
                    {formatDateLong(article.date)}
                  </div>
                  <h2 className="font-display text-xl font-semibold text-foreground">
                    {article.title}
                  </h2>
                  <p className="text-sm text-foreground/70">{article.summary}</p>
                  <span className="text-sm font-medium text-brand">Read the story &rarr;</span>
                </Link>
              </li>
            ))}
          </ul>
        )}

        <p className="text-xs text-neutral-400">
          Every story is generated from the same real-time estimates that power
          the leaderboard — public stock holdings plus static estimates for
          private assets. Directional, not audited.
        </p>
      </main>
      <SiteFooter />
    </div>
  );
}
