import type { ArticleFacts } from "@/lib/article-facts";
import { categoryArticleTitle, categoryRichestPhrase, type Category } from "@/lib/categories";
import { formatDateLong } from "@/lib/dates";
import { formatPercentMagnitude, formatUsdCompact } from "@/lib/format";

export interface Faq {
  question: string;
  answer: string;
}

export interface ArticleText {
  title: string;
  summary: string;
  faqs: Faq[];
}

function magnitude(deltaUsd: number, deltaPercent: number): string {
  return `${formatUsdCompact(Math.abs(deltaUsd))} (${formatPercentMagnitude(deltaPercent)})`;
}

/** "the {list name} list", without a doubled article for names already starting with "The". */
function theListPhrase(category: Category): string {
  const title = categoryArticleTitle(category);
  return title.startsWith("The ") ? `${title} list` : `the ${title} list`;
}

/**
 * Deterministic, template-based article text generated purely from
 * computed facts — no AI writing involved. Every sentence below maps to a
 * real number from the day's snapshot, which is what keeps this useful
 * (and non-spammy) rather than generic filler.
 */
export function buildArticleText(date: string, category: Category, facts: ArticleFacts): ArticleText {
  const dateLabel = formatDateLong(date);
  const leader = facts.topByNetWorth[0] ?? null;
  const topGainer = facts.gainers[0] ?? null;
  const topLoser = facts.losers[0] ?? null;

  const title = leader
    ? `${categoryArticleTitle(category)}: ${leader.name} Tops the List — ${dateLabel}`
    : `${categoryArticleTitle(category)} Daily Recap — ${dateLabel}`;

  const summaryParts: string[] = [];
  if (leader) {
    summaryParts.push(
      `${leader.name} led ${categoryArticleTitle(category)} on ${dateLabel} with an estimated net worth of ${formatUsdCompact(leader.netWorthUsd)}.`,
    );
  }
  if (topGainer) {
    summaryParts.push(
      `${topGainer.name} gained the most, up ${magnitude(topGainer.deltaUsd, topGainer.deltaPercent)}.`,
    );
  }
  if (topLoser && topLoser.id !== topGainer?.id) {
    summaryParts.push(
      `${topLoser.name} fell the most, down ${magnitude(topLoser.deltaUsd, topLoser.deltaPercent)}.`,
    );
  }
  if (summaryParts.length === 0) {
    summaryParts.push(
      `Tracking ${facts.personCount} billionaires in ${theListPhrase(category)}, with a combined estimated net worth of ${formatUsdCompact(facts.totalNetWorthUsd)}.`,
    );
  }
  const summary = summaryParts.join(" ");

  const faqs: Faq[] = [];
  if (leader) {
    faqs.push({
      question: `Who is the richest ${categoryRichestPhrase(category)} on ${dateLabel}?`,
      answer: `${leader.name}, with an estimated net worth of ${formatUsdCompact(leader.netWorthUsd)}.`,
    });
  }
  if (topGainer) {
    faqs.push({
      question: `Who gained the most net worth on ${dateLabel}?`,
      answer: `${topGainer.name} added an estimated ${magnitude(topGainer.deltaUsd, topGainer.deltaPercent)}, bringing their net worth to ${formatUsdCompact(topGainer.netWorthUsd)}.`,
    });
  }
  if (topLoser) {
    faqs.push({
      question: `Who lost the most net worth on ${dateLabel}?`,
      answer: `${topLoser.name} fell an estimated ${magnitude(topLoser.deltaUsd, topLoser.deltaPercent)}, bringing their net worth to ${formatUsdCompact(topLoser.netWorthUsd)}.`,
    });
  }
  faqs.push({
    question: `How many billionaires are on ${theListPhrase(category)}?`,
    answer: `${facts.personCount}, with a combined estimated net worth of ${formatUsdCompact(facts.totalNetWorthUsd)} as of ${dateLabel}.`,
  });

  return { title, summary, faqs };
}
