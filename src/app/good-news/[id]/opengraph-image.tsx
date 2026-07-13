import { findBillionaireById, getLeaderboard } from "@/lib/net-worth";
import { getPersonProfile } from "@/data/profiles";
import { isSpotlightEligible, buildSpotlight } from "@/lib/spotlight";
import { formatUsdCompact } from "@/lib/format";
import { brandOgImage, OG_SIZE } from "@/lib/og";

export const alt = "Good news spotlight";
export const size = OG_SIZE;
export const contentType = "image/png";

export default async function Image({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const person = findBillionaireById(id);
  const profile = getPersonProfile(id);

  if (!person || !isSpotlightEligible(profile)) {
    return brandOgImage({ eyebrow: "Good news", title: "Billionaire Wins & Giving Back" });
  }

  const leaderboard = await getLeaderboard();
  const ranked = leaderboard.people.find((p) => p.id === id);
  const spotlight = buildSpotlight(person, profile, ranked, leaderboard);

  return brandOgImage({
    eyebrow: "Good news",
    title: person.name,
    stat: ranked ? formatUsdCompact(ranked.netWorthUsd) : undefined,
    subtitle: spotlight.dek.length > 90 ? `${spotlight.dek.slice(0, 90)}…` : spotlight.dek,
  });
}
