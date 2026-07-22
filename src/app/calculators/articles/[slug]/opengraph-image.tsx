import { getCalculatorArticle } from "@/lib/calculator-articles";
import { brandOgImage, OG_SIZE } from "@/lib/og";

export const alt = "Billionaire calculator article";
export const size = OG_SIZE;
export const contentType = "image/png";

export default async function Image({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const article = await getCalculatorArticle(slug);
  if (!article) {
    return brandOgImage({ eyebrow: "Calculators", title: "Billionaire Wealth Calculators" });
  }

  return brandOgImage({
    eyebrow: article.eyebrow,
    title: article.title,
    stat: article.stat,
    subtitle: article.subtitle,
  });
}
