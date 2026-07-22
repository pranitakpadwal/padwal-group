import { ensureArticle } from "@/lib/generate-article";
import { isCategory, categoryArticleTitle } from "@/lib/categories";
import { isValidDateString, formatDateLong } from "@/lib/dates";
import { formatUsdCompact } from "@/lib/format";
import { brandOgImage, OG_SIZE } from "@/lib/og";

export const alt = "Billionaire daily recap";
export const size = OG_SIZE;
export const contentType = "image/png";

export default async function Image({
  params,
}: {
  params: Promise<{ date: string; category: string }>;
}) {
  const { date, category } = await params;
  if (!isValidDateString(date) || !isCategory(category)) {
    return brandOgImage({ eyebrow: "Daily Recap", title: "Billionaire Rankings" });
  }

  const article = await ensureArticle(date, category);
  if (!article) {
    return brandOgImage({ eyebrow: "Daily Recap", title: "Billionaire Rankings" });
  }

  const leader = article.facts.topByNetWorth[0];
  const topGainer = article.facts.gainers[0];

  return brandOgImage({
    eyebrow: `${formatDateLong(date)} · ${categoryArticleTitle(category)}`,
    title: leader ? leader.name : "Daily Recap",
    stat: leader ? `${formatUsdCompact(leader.netWorthUsd)} · #1` : undefined,
    subtitle: topGainer
      ? `Top gainer: ${topGainer.name}, +${formatUsdCompact(Math.abs(topGainer.deltaUsd))}`
      : `${article.facts.personCount} billionaires tracked`,
  });
}
