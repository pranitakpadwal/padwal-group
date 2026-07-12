import { getNewsArticle } from "@/lib/news";
import { formatUsdCompact } from "@/lib/format";
import { formatDateLong } from "@/lib/dates";
import { brandOgImage, OG_SIZE } from "@/lib/og";

export const alt = "Billionaire wealth move";
export const size = OG_SIZE;
export const contentType = "image/png";

export default async function Image({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const article = getNewsArticle(slug);

  if (!article) {
    return brandOgImage({ eyebrow: "Billionaire news", title: "Today's Biggest Wealth Moves" });
  }

  const gained = article.facts.deltaUsd > 0;
  return brandOgImage({
    eyebrow: `${formatDateLong(article.date)} · Wealth move`,
    title: article.facts.name,
    stat: `${gained ? "▲ +" : "▼ −"}${formatUsdCompact(Math.abs(article.facts.deltaUsd))} in a day`,
    statColor: gained ? "#7ee2c0" : "#ff9d9d",
    subtitle: `Now ${formatUsdCompact(article.facts.netWorthUsd)} · #${article.facts.rank} in the world`,
  });
}
