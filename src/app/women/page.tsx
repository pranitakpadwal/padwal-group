import type { Metadata } from "next";
import CategoryLeaderboardPage from "@/components/CategoryLeaderboardPage";
import { siteUrl } from "@/lib/site";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Richest Women in the World — Real-Time Billionaires",
  description:
    "The real-time list of the world's richest women: live net worth and rankings, updated continuously from public stock holdings.",
  keywords: [
    "richest women in the world",
    "richest woman in the world",
    "real time women billionaires",
    "wealthiest women billionaires",
  ],
  alternates: { canonical: `${siteUrl()}/women` },
};

export default function WomenPage() {
  return <CategoryLeaderboardPage category="women" />;
}
