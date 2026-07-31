import { getLeaderboard, type Leaderboard } from "@/lib/net-worth";
import { getCategoryView, type Category } from "@/lib/categories";
import { hydrateHistoricalCategoryView, saveSnapshot } from "@/lib/snapshots";
import { computeArticleFacts, type SegmentHighlight } from "@/lib/article-facts";
import { buildArticleText } from "@/lib/article-template";
import { getArticle, saveArticle, type StoredArticle } from "@/lib/articles";
import { listNews, type NewsArticle } from "@/lib/news";
import { previousDateString, todayDateString } from "@/lib/dates";

/** The one category we still publish daily; the rest are summarised inside it. */
export const DAILY_CATEGORY: Category = "world";

/** Slices folded into the daily article instead of getting their own dated URLs. */
// Labels are written to read naturally mid-sentence ("the 11 women we track"),
// since they're dropped straight into the article prose.
const SEGMENTS: { category: Category; label: string }[] = [
  { category: "india", label: "Indian billionaires" },
  { category: "women", label: "women" },
  { category: "young", label: "billionaires under 45" },
];

function buildSegments(date: string, leaderboard: Leaderboard): SegmentHighlight[] {
  return SEGMENTS.map(({ category, label }) => {
    const view = getCategoryView(leaderboard, category);
    const prior = hydrateHistoricalCategoryView(previousDateString(date), category);
    const facts = computeArticleFacts(view, prior);
    const gain = facts.gainers[0] ?? null;
    const loss = facts.losers[0] ?? null;
    // Whichever moved further in absolute terms is the day's story for this slice.
    const topMover =
      gain && loss ? (Math.abs(gain.deltaUsd) >= Math.abs(loss.deltaUsd) ? gain : loss) : (gain ?? loss);
    return {
      label,
      leader: facts.topByNetWorth[0] ?? null,
      topMover,
      personCount: facts.personCount,
    };
  }).filter((segment) => segment.personCount > 0);
}

function generateOne(date: string, category: Category, leaderboard: Leaderboard): StoredArticle {
  const today = getCategoryView(leaderboard, category);
  const yesterdayView = hydrateHistoricalCategoryView(previousDateString(date), category);
  const facts = computeArticleFacts(today, yesterdayView);
  const withSegments =
    category === DAILY_CATEGORY ? { ...facts, segments: buildSegments(date, leaderboard) } : facts;
  const text = buildArticleText(date, category, withSegments);
  return saveArticle(date, category, text, withSegments);
}

/**
 * Snapshots today's leaderboard and (re)generates today's single daily
 * article, overwriting any earlier same-day draft. Called by the daily cron,
 * ideally near market close so the numbers are a consistent end-of-day figure.
 *
 * This used to publish four dated category recaps plus one news article per
 * big mover — roughly 5-8 new URLs every day. Over three months that produced
 * 104 URLs earning 13 clicks between them, so it now writes exactly one
 * article a day that covers the whole day, with the India/women/under-45
 * standouts reported inside it.
 */
export async function generateAllTodayArticles(): Promise<StoredArticle[]> {
  const date = todayDateString();
  const leaderboard = await getLeaderboard();
  saveSnapshot(date, leaderboard.people);

  return [generateOne(date, DAILY_CATEGORY, leaderboard)];
}

/**
 * The existing per-person news archive. No longer generates anything: writing
 * one article per big mover per day created 66 URLs for 5 clicks, and those
 * moves are now covered inside the single daily article instead. Previously
 * published stories stay live and indexed; this just stops adding to them.
 */
export function listRecentNews(): NewsArticle[] {
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
