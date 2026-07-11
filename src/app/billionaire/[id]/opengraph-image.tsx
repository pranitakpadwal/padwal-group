import { findBillionaireById, getLeaderboard } from "@/lib/net-worth";
import { formatUsdCompact } from "@/lib/format";
import { brandOgImage, OG_SIZE } from "@/lib/og";

export const alt = "Real-time net worth card";
export const size = OG_SIZE;
export const contentType = "image/png";

export default async function Image({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const person = findBillionaireById(id);

  if (!person) {
    return brandOgImage({
      eyebrow: "Live wealth rankings",
      title: "The World's Richest, In Real Time",
    });
  }

  const leaderboard = await getLeaderboard();
  const ranked = leaderboard.people.find((p) => p.id === id);

  return brandOgImage({
    eyebrow: "Real-time net worth",
    title: person.name,
    stat: ranked ? formatUsdCompact(ranked.netWorthUsd) : undefined,
    subtitle: ranked
      ? `#${ranked.rank} in the world · ${person.primarySource}`
      : person.primarySource,
  });
}
