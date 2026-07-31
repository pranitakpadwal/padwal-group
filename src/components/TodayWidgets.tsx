import Link from "next/link";
import { ensureTodayNews } from "@/lib/generate-article";
import { todayDateString, formatDateLong } from "@/lib/dates";

/**
 * Below-the-fold homepage widget row: today's biggest wealth move (if any) and
 * a link into the daily recap — so there's a reason to scroll past the
 * (now-collapsed) leaderboard.
 *
 * The Quote of the Day card was removed: /quote-of-the-day is noindexed, and
 * the homepage is the strongest page on the site — linking from it was the
 * single best crawl path into a page we want dropped from the index.
 */
export default async function TodayWidgets() {
  const news = await ensureTodayNews();
  const topStory = news[0];
  const today = todayDateString();

  return (
    <section aria-labelledby="today-heading" className="flex flex-col gap-4">
      <h2 id="today-heading" className="font-display text-2xl font-semibold text-foreground">
        Today
      </h2>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        {topStory ? (
          <Link
            href={`/news/${topStory.slug}`}
            className="flex flex-col gap-2 rounded-2xl border border-line bg-surface p-5 transition-colors hover:border-brand"
          >
            <span className="text-xs font-semibold uppercase tracking-wide text-brand-dark">
              Today&apos;s Biggest Move
            </span>
            <p className="line-clamp-4 text-sm font-medium text-foreground">{topStory.title}</p>
            <span className="mt-auto text-xs text-brand">Read the story &rarr;</span>
          </Link>
        ) : (
          <Link
            href="/news"
            className="flex flex-col gap-2 rounded-2xl border border-line bg-surface p-5 transition-colors hover:border-brand"
          >
            <span className="text-xs font-semibold uppercase tracking-wide text-brand-dark">
              Billionaire News
            </span>
            <p className="text-sm text-foreground/70">
              No billion-dollar moves yet today — check back after the next
              market session.
            </p>
            <span className="mt-auto text-xs text-brand">See all news &rarr;</span>
          </Link>
        )}

        <Link
          href={`/articles/${today}/world`}
          className="flex flex-col gap-2 rounded-2xl border border-line bg-surface p-5 transition-colors hover:border-brand"
        >
          <span className="text-xs font-semibold uppercase tracking-wide text-brand-dark">
            Daily Recap
          </span>
          <p className="text-sm text-foreground/70">
            The full world leaderboard recap for {formatDateLong(today)} —
            top gainers, losers, and the day&apos;s total wealth change.
          </p>
          <span className="mt-auto text-xs text-brand">Read today&apos;s recap &rarr;</span>
        </Link>
      </div>
    </section>
  );
}
