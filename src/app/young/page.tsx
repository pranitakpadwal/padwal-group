import type { Metadata } from "next";
import CategoryLeaderboardPage from "@/components/CategoryLeaderboardPage";
import { YOUNG_AGE_THRESHOLD } from "@/lib/categories";
import { siteUrl } from "@/lib/site";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: `Youngest Billionaires in the World (Under ${YOUNG_AGE_THRESHOLD}) — Real-Time Net Worth`,
  description: `The real-time list of the world's youngest billionaires under ${YOUNG_AGE_THRESHOLD}: live net worth and rankings, updated continuously from public stock holdings.`,
  keywords: [
    "youngest billionaires",
    "youngest billionaires in the world",
    "richest young billionaires",
    `billionaires under ${YOUNG_AGE_THRESHOLD}`,
    "self made young billionaires",
  ],
  alternates: { canonical: `${siteUrl()}/young` },
};

export default function YoungPage() {
  return <CategoryLeaderboardPage category="young" />;
}
