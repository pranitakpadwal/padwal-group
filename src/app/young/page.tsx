import type { Metadata } from "next";
import CategoryLeaderboardPage from "@/components/CategoryLeaderboardPage";
import { YOUNG_AGE_THRESHOLD } from "@/lib/categories";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: `Youngest Billionaires (Under ${YOUNG_AGE_THRESHOLD}) — Real-Time Billionaires`,
  description: `Live-updating net worth estimates for billionaires under age ${YOUNG_AGE_THRESHOLD}, based on public stock holdings.`,
};

export default function YoungPage() {
  return <CategoryLeaderboardPage category="young" />;
}
