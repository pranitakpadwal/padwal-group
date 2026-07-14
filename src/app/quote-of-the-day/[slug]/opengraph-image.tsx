import { getQuoteOfDayBySlug } from "@/lib/quote-of-day";
import { brandOgImage, OG_SIZE } from "@/lib/og";

export const alt = "Quote of the day";
export const size = OG_SIZE;
export const contentType = "image/png";

export default async function Image({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const entry = getQuoteOfDayBySlug(slug);

  if (!entry) {
    return brandOgImage({ eyebrow: "Quote of the day", title: "Motivational Quote of the Day" });
  }

  const truncated = entry.quoteText.length > 110 ? `${entry.quoteText.slice(0, 110)}…` : entry.quoteText;
  return brandOgImage({
    eyebrow: "Quote of the day",
    title: `"${truncated}"`,
    subtitle: `— ${entry.personName}, ${entry.quoteSource}`,
  });
}
