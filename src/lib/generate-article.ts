import { getLeaderboard, type Leaderboard } from "@/lib/net-worth";
import { CATEGORIES, getCategoryView, type Category } from "@/lib/categories";
import { hydrateHistoricalCategoryView, saveSnapshot } from "@/lib/snapshots";
import { computeArticleFacts } from "@/lib/article-facts";
import { buildArticleText } from "@/lib/article-template";
import { getArticle, saveArticle, type StoredArticle } from "@/lib/articles";
import { generateBigMoverNews, listNews, type NewsArticle } from "@/lib/news";
import { previousDateString, todayDateString } from "@/lib/dates";

function generateOne(date: string, category: Category, leaderboard: Leaderboard): StoredArticle {
  const today = getCategoryView(leaderboard, category);
  const yesterdayView = hydrateHistoricalCategoryView(previousDateString(date), category);
  const facts = computeArticleFacts(today, yesterdayView);
  const text = buildArticleText(date, category, facts);
  return saveArticle(date, category, text, facts);
}

/**
 * Snapshots today's leaderboard and (re)generates all four category
 * articles for today, overwriting any earlier same-day draft. This is
 * what the daily cron job calls, ideally once near market close so the
 * numbers represent a consistent end-of-day figure.
 */
export async function generateAllTodayArticles(): Promise<StoredArticle[]> {
  const date = todayDateString();
  const leaderboard = await getLeaderboard();
  saveSnapshot(date, leaderboard.people);

  // Event-driven news: one article per person whose net worth moved big today.
  generateBigMoverNews(leaderboard, date);

  return CATEGORIES.map((category) => generateOne(date, category, leaderboard));
}

/**
 * Makes sure today's big-mover news exists (used by the /news index so
 * the section works even before the daily cron fires), then returns the
 * latest stories. Regenerates today's stories at most once per visit
 * wave — saveNewsArticle upserts, so repeats are harmless.
 */
export async function ensureTodayNews(): Promise<NewsArticle[]> {
  const date = todayDateString();
  const existingToday = listNews({ limit: 1 }).filter((n) => n.date === date);
  if (existingToday.length === 0) {
    const leaderboard = await getLeaderboard();
    generateBigMoverNews(leaderboard, date);
  }
  return listNews({ limit: 30 });
}

/**
 * Returns today's article for a category, generating and persisting it on
 * the fly if the cron hasn't run yet today. For any past date, an article
 * either already exists (the cron ran that day) or it doesn't — we never
 * had a snapshot to retroactively build one from, so this returns null.
 */
export async function ensureArticle(date: string, category: Category): Promise<StoredArticle | null> {
  const existing = getArticle(date, category);
  if (existing) {
    return existing;
  }

  if (date !== todayDateString()) {
    return null;
  }

  const leaderboard = await getLeaderboard();
  saveSnapshot(date, leaderboard.people);
  return generateOne(date, category, leaderboard);
}
