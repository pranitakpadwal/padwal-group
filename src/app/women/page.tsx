import type { Metadata } from "next";
import CategoryLeaderboardPage from "@/components/CategoryLeaderboardPage";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "The Richest Women — Real-Time Billionaires",
  description:
    "Live-updating net worth estimates for women billionaires, based on public stock holdings.",
};

export default function WomenPage() {
  return <CategoryLeaderboardPage category="women" />;
}
