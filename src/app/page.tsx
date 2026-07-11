import type { Metadata } from "next";
import CategoryLeaderboardPage from "@/components/CategoryLeaderboardPage";
import { siteUrl } from "@/lib/site";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Real-Time Billionaires — Live Net Worth of the World's Richest People",
  description:
    "The real-time billionaires list: live net worth and rankings of the world's richest people, updated continuously from public stock holdings. See today's biggest gainers and losers.",
  keywords: [
    "real time billionaires",
    "real time billionaires list",
    "real time billionaires index",
    "billionaires real time",
    "billionaires real time net worth",
    "real time world billionaires",
    "world billionaires list",
    "richest people in the world",
    "live billionaire net worth",
  ],
  alternates: { canonical: siteUrl() },
};

export default function Home() {
  return <CategoryLeaderboardPage category="world" />;
}
