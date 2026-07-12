import { getDb } from "@/lib/db";
import type { Leaderboard, RankedBillionaire } from "@/lib/net-worth";
import { formatUsdCompact, formatUsdChange, formatPercentMagnitude } from "@/lib/format";
import { formatDateLong } from "@/lib/dates";
import { slugifyTitle } from "@/lib/schema";

/**
 * Event-driven news: when someone's net worth moves big in a day, we
 * generate a short, numbers-first news article — the same story the
 * business press writes, but straight from the data. Every sentence is
 * derived from tracked figures, so there's nothing to hallucinate.
 */

const BIG_MOVE_USD = 3_000_000_000;
const BIG_MOVE_PERCENT = 5;

export interface NewsFacts {
  personId: string;
  name: string;
  date: string;
  deltaUsd: number;
  deltaPercent: number;
  netWorthUsd: number;
  rank: number;
  ticker: string | null;
  stockChangePercent: number | null;
  sharePrice: number | null;
  primarySource: string;
  country: string;
  bio: string;
  /** Person directly above on the list (for "closing in on" context). */
  aboveName: string | null;
  aboveNetWorthUsd: number | null;
  belowName: string | null;
  belowNetWorthUsd: number | null;
}

export interface NewsArticle {
  slug: string;
  date: string;
  personId: string;
  title: string;
  summary: string;
  facts: NewsFacts;
  generatedAt: string;
}

interface NewsRow {
  slug: string;
  article_date: string;
  person_id: string;
  title: string;
  summary: string;
  facts_json: string;
  generated_at: string;
}

function rowToNews(row: NewsRow): NewsArticle {
  return {
    slug: row.slug,
    date: row.article_date,
    personId: row.person_id,
    title: row.title,
    summary: row.summary,
    facts: JSON.parse(row.facts_json) as NewsFacts,
    generatedAt: row.generated_at,
  };
}

export function isBigMove(person: RankedBillionaire): boolean {
  return (
    Math.abs(person.dayChangeUsd) >= BIG_MOVE_USD ||
    Math.abs(person.dayChangePercent) >= BIG_MOVE_PERCENT
  );
}

export function computeNewsFacts(
  leaderboard: Leaderboard,
  person: RankedBillionaire,
  date: string,
): NewsFacts {
  const above = leaderboard.people.find((p) => p.rank === person.rank - 1) ?? null;
  const below = leaderboard.people.find((p) => p.rank === person.rank + 1) ?? null;
  return {
    personId: person.id,
    name: person.name,
    date,
    deltaUsd: person.dayChangeUsd,
    deltaPercent: person.dayChangePercent,
    netWorthUsd: person.netWorthUsd,
    rank: person.rank,
    ticker: person.ticker,
    stockChangePercent: person.stockChangePercent,
    sharePrice: person.sharePrice,
    primarySource: person.primarySource,
    country: person.country,
    bio: person.bio,
    aboveName: above?.name ?? null,
    aboveNetWorthUsd: above?.netWorthUsd ?? null,
    belowName: below?.name ?? null,
    belowNetWorthUsd: below?.netWorthUsd ?? null,
  };
}

export function buildNewsTitle(facts: NewsFacts): string {
  const gained = facts.deltaUsd > 0;
  const amount = formatUsdCompact(Math.abs(facts.deltaUsd));
  if (facts.ticker && facts.stockChangePercent !== null) {
    const verb = gained ? "Jumps" : "Slides";
    return `${facts.name} ${gained ? "Gains" : "Loses"} ${amount} in a Day as ${facts.ticker} ${verb} ${formatPercentMagnitude(facts.stockChangePercent)}`;
  }
  return `${facts.name} ${gained ? "Gains" : "Loses"} ${amount} in a Day`;
}

export function buildNewsSummary(facts: NewsFacts): string {
  const gained = facts.deltaUsd > 0;
  return `${facts.name}'s net worth ${gained ? "rose" : "fell"} by ${formatUsdCompact(Math.abs(facts.deltaUsd))} (${formatPercentMagnitude(facts.deltaPercent)}) on ${formatDateLong(facts.date)}, putting the ${facts.primarySource} ${gained ? "fortune" : "fortune"} at an estimated ${formatUsdCompact(facts.netWorthUsd)} — #${facts.rank} in the world.`;
}

/** Deterministic article body: every sentence derived from tracked data. */
export function buildNewsBody(facts: NewsFacts): string[] {
  const gained = facts.deltaUsd > 0;
  const amount = formatUsdCompact(Math.abs(facts.deltaUsd));
  const paragraphs: string[] = [];

  paragraphs.push(
    `${facts.name} ${gained ? "added" : "lost"} ${amount} of net worth on ${formatDateLong(facts.date)}, one of the day's biggest moves among the world's richest people. The swing (${formatUsdChange(facts.deltaUsd)}, or ${formatPercentMagnitude(facts.deltaPercent)}) leaves the fortune at an estimated ${formatUsdCompact(facts.netWorthUsd)}, ranked #${facts.rank} on our real-time list.`,
  );

  if (facts.ticker && facts.stockChangePercent !== null) {
    paragraphs.push(
      `The move traces to ${facts.ticker}, the listed company behind most of the fortune, which ${facts.stockChangePercent > 0 ? "climbed" : "fell"} ${formatPercentMagnitude(facts.stockChangePercent)} on the day${facts.sharePrice !== null ? ` to ${facts.sharePrice.toFixed(2)} USD per share` : ""}. Because a billionaire's wealth is concentrated in stock, daily net worth simply follows the share price multiplied by the shares held.`,
    );
  } else {
    paragraphs.push(
      `Most of this fortune is tied to ${facts.primarySource}. Where holdings aren't publicly traded, our figures move only when public estimates are updated, so swings like this reflect reassessments rather than a live share price.`,
    );
  }

  if (facts.aboveName && facts.aboveNetWorthUsd !== null) {
    const gap = facts.aboveNetWorthUsd - facts.netWorthUsd;
    paragraphs.push(
      gained
        ? `The gain narrows the gap to ${facts.aboveName}, who sits one place higher at ${formatUsdCompact(facts.aboveNetWorthUsd)} — now ${formatUsdCompact(gap)} away.${facts.belowName && facts.belowNetWorthUsd !== null ? ` Behind, ${facts.belowName} follows at ${formatUsdCompact(facts.belowNetWorthUsd)}.` : ""}`
        : `The loss leaves ${facts.name} ${formatUsdCompact(gap)} behind ${facts.aboveName} (${formatUsdCompact(facts.aboveNetWorthUsd)}) one spot up${facts.belowName && facts.belowNetWorthUsd !== null ? `, with ${facts.belowName} closing in from below at ${formatUsdCompact(facts.belowNetWorthUsd)}` : ""}.`,
    );
  }

  paragraphs.push(`${facts.bio}`);

  paragraphs.push(
    `Figures are our real-time estimates, derived from public stock holdings plus a static estimate for private assets — directional, not audited, and they will move again with the next trading session.`,
  );

  return paragraphs;
}

export function saveNewsArticle(facts: NewsFacts): NewsArticle {
  const db = getDb();
  const title = buildNewsTitle(facts);
  // Full headline in the URL (the pattern news sites rank with),
  // date-suffixed so each day's story on a person is its own URL.
  const slug = `${slugifyTitle(title)}-${facts.date}`;
  const summary = buildNewsSummary(facts);
  const generatedAt = new Date().toISOString();

  db.prepare(
    `INSERT INTO news_articles (slug, article_date, person_id, title, summary, facts_json, generated_at)
     VALUES (@slug, @date, @personId, @title, @summary, @factsJson, @generatedAt)
     ON CONFLICT(slug) DO UPDATE SET
       title = excluded.title,
       summary = excluded.summary,
       facts_json = excluded.facts_json,
       generated_at = excluded.generated_at`,
  ).run({
    slug,
    date: facts.date,
    personId: facts.personId,
    title,
    summary,
    factsJson: JSON.stringify(facts),
    generatedAt,
  });

  return { slug, date: facts.date, personId: facts.personId, title, summary, facts, generatedAt };
}

/** One news article per person per day, max — regenerating updates in place. */
export function generateBigMoverNews(leaderboard: Leaderboard, date: string): NewsArticle[] {
  const db = getDb();
  const generated: NewsArticle[] = [];
  for (const person of leaderboard.people) {
    if (!isBigMove(person)) {
      continue;
    }
    // If a story for this person/date already exists (possibly with a
    // different magnitude in the slug), update that row instead of
    // creating a near-duplicate.
    const existing = db
      .prepare(`SELECT slug FROM news_articles WHERE article_date = ? AND person_id = ?`)
      .get(date, person.id) as { slug: string } | undefined;
    if (existing) {
      db.prepare(`DELETE FROM news_articles WHERE slug = ?`).run(existing.slug);
    }
    generated.push(saveNewsArticle(computeNewsFacts(leaderboard, person, date)));
  }
  return generated;
}

export function getNewsArticle(slug: string): NewsArticle | null {
  const db = getDb();
  const row = db.prepare(`SELECT * FROM news_articles WHERE slug = ?`).get(slug) as
    | NewsRow
    | undefined;
  return row ? rowToNews(row) : null;
}

export function listNews(options: { limit?: number; offset?: number; personId?: string } = {}): NewsArticle[] {
  const db = getDb();
  const limit = options.limit ?? 30;
  const offset = options.offset ?? 0;
  const rows = options.personId
    ? (db
        .prepare(
          `SELECT * FROM news_articles WHERE person_id = ? ORDER BY article_date DESC LIMIT ? OFFSET ?`,
        )
        .all(options.personId, limit, offset) as NewsRow[])
    : (db
        .prepare(`SELECT * FROM news_articles ORDER BY article_date DESC, generated_at DESC LIMIT ? OFFSET ?`)
        .all(limit, offset) as NewsRow[]);
  return rows.map(rowToNews);
}
