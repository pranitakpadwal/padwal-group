import type { ArticleFacts, MoverFact } from "@/lib/article-facts";
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
  /** Substantive prose paragraphs for the article body — not just a data table caption. */
  narrative: string[];
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

/** Mechanical explanation of a mover's swing, using the same honesty rule as explainMove: we can only cite the stock move itself, never a reason behind it. */
function moverMechanism(mover: MoverFact): string | null {
  if (!mover.ticker || mover.stockChangePercent === null || mover.stockChangePercent === undefined) {
    return null;
  }
  const verb = mover.stockChangePercent >= 0 ? "climbed" : "fell";
  const company = mover.primarySource ? mover.primarySource.split(",")[0].trim() : mover.ticker;
  return `The move traces to ${company} (${mover.ticker}), which ${verb} ${formatPercentMagnitude(mover.stockChangePercent)} on the day — most of a billionaire's daily swing simply follows their main stock's share price.`;
}

function nameList(people: { name: string }[]): string {
  const names = people.map((p) => p.name);
  if (names.length <= 1) return names.join("");
  if (names.length === 2) return `${names[0]} and ${names[1]}`;
  return `${names.slice(0, -1).join(", ")}, and ${names[names.length - 1]}`;
}

/**
 * Deterministic, template-based article text generated purely from
 * computed facts — no AI writing involved. Every sentence below maps to a
 * real number from the day's snapshot, which is what keeps this useful
 * (and non-spammy) rather than generic filler. The narrative paragraphs
 * vary in structure depending on which facts are actually available
 * (comparison data, tickers, rank moves) rather than following one fixed
 * template every time.
 */
export function buildArticleText(date: string, category: Category, facts: ArticleFacts): ArticleText {
  const dateLabel = formatDateLong(date);
  const leader = facts.topByNetWorth[0] ?? null;
  const runnersUp = facts.topByNetWorth.slice(1, 3);
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

  // --- Narrative paragraphs: real prose, not a data-table caption ---
  const narrative: string[] = [];

  if (leader) {
    const openingSentences = [
      `${leader.name} closed out ${dateLabel} atop ${theListPhrase(category)}, an estimated ${formatUsdCompact(leader.netWorthUsd)}${leader.primarySource ? `, built primarily on ${leader.primarySource}` : ""}.`,
    ];
    if (runnersUp.length > 0) {
      openingSentences.push(
        `Right behind: ${nameList(runnersUp)}${runnersUp.length === 1 ? " sits" : " follow"} in the next spots, at ${runnersUp.map((p) => formatUsdCompact(p.netWorthUsd)).join(" and ")} respectively.`,
      );
    }
    if (facts.totalNetWorthDeltaUsd !== null) {
      const totalUp = facts.totalNetWorthDeltaUsd >= 0;
      openingSentences.push(
        `Combined, the ${facts.personCount} people we track here are worth ${formatUsdCompact(facts.totalNetWorthUsd)}, ${totalUp ? "up" : "down"} ${formatUsdCompact(Math.abs(facts.totalNetWorthDeltaUsd))} from the prior session.`,
      );
    }
    narrative.push(openingSentences.join(" "));
  } else {
    narrative.push(
      `We track ${facts.personCount} billionaires in ${theListPhrase(category)}, worth a combined estimated ${formatUsdCompact(facts.totalNetWorthUsd)} as of ${dateLabel}.`,
    );
  }

  if (topGainer) {
    const mechanism = moverMechanism(topGainer);
    narrative.push(
      `${topGainer.name} posted the day's biggest gain, adding ${magnitude(topGainer.deltaUsd, topGainer.deltaPercent)} to reach ${formatUsdCompact(topGainer.netWorthUsd)} (#${topGainer.rank}).${mechanism ? ` ${mechanism}` : ""}`,
    );
  }

  if (topLoser && topLoser.id !== topGainer?.id) {
    const mechanism = moverMechanism(topLoser);
    narrative.push(
      `On the other side, ${topLoser.name} took the day's steepest loss, down ${magnitude(topLoser.deltaUsd, topLoser.deltaPercent)} to ${formatUsdCompact(topLoser.netWorthUsd)} (#${topLoser.rank}).${mechanism ? ` ${mechanism}` : ""}`,
    );
  }

  if (facts.risers.length > 0 || facts.fallers.length > 0) {
    const moveSentences: string[] = [];
    if (facts.risers.length > 0) {
      const top = facts.risers[0];
      moveSentences.push(
        `${top.name} made the biggest rank jump, climbing from #${top.fromRank} to #${top.toRank}${facts.risers.length > 1 ? `, with ${nameList(facts.risers.slice(1))} also moving up` : ""}.`,
      );
    }
    if (facts.fallers.length > 0) {
      const top = facts.fallers[0];
      moveSentences.push(
        `${top.name} slipped the furthest, from #${top.fromRank} to #${top.toRank}${facts.fallers.length > 1 ? `, alongside ${nameList(facts.fallers.slice(1))}` : ""}.`,
      );
    }
    narrative.push(moveSentences.join(" "));
  } else if (!facts.hasComparison) {
    narrative.push(
      "This is the first snapshot we have for this list, so there's no prior day to compare against yet — gainers, losers, and rank moves will start appearing once tomorrow's numbers come in.",
    );
  }

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

  return { title, summary, narrative, faqs };
}
