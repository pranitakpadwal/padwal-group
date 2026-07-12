import { findBillionaireById } from "@/lib/net-worth";
import { getPersonQuotes } from "@/data/quotes";
import { brandOgImage, OG_SIZE } from "@/lib/og";

export const alt = "Verified quotes with sources";
export const size = OG_SIZE;
export const contentType = "image/png";

export default async function Image({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const person = findBillionaireById(id);
  const quotes = getPersonQuotes(id);

  if (!person || quotes.length === 0) {
    return brandOgImage({ eyebrow: "Verified quotes", title: "Billionaire Quotes, Verified" });
  }

  const sample = quotes[0].text;
  return brandOgImage({
    eyebrow: "Verified quotes · with sources",
    title: `${person.name} Quotes`,
    subtitle: `“${sample.length > 90 ? `${sample.slice(0, 90)}…` : sample}”`,
  });
}
