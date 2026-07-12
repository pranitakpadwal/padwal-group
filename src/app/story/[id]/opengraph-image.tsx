import { findBillionaireById, getLeaderboard } from "@/lib/net-worth";
import { formatUsdCompact } from "@/lib/format";
import { brandOgImage, OG_SIZE } from "@/lib/og";

export const alt = "How the fortune was built";
export const size = OG_SIZE;
export const contentType = "image/png";

export default async function Image({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const person = findBillionaireById(id);

  if (!person) {
    return brandOgImage({ eyebrow: "Wealth story", title: "How the Fortune Was Built" });
  }

  const leaderboard = await getLeaderboard();
  const ranked = leaderboard.people.find((p) => p.id === id);

  return brandOgImage({
    eyebrow: "Wealth story",
    title: `How ${person.name} Built the Fortune`,
    stat: ranked ? formatUsdCompact(ranked.netWorthUsd) : undefined,
    subtitle: ranked ? `#${ranked.rank} in the world · year by year` : "Year by year",
  });
}
