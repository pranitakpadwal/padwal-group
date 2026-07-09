import type { Metadata } from "next";
import CategoryLeaderboardPage from "@/components/CategoryLeaderboardPage";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "India's Richest — Real-Time Billionaires",
  description:
    "Live-updating net worth estimates for India's billionaires, based on public stock holdings.",
};

export default function IndiaPage() {
  return <CategoryLeaderboardPage category="india" />;
}
