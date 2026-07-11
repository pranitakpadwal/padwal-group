import type { Metadata } from "next";
import CategoryLeaderboardPage from "@/components/CategoryLeaderboardPage";
import { siteUrl } from "@/lib/site";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Real-Time Billionaires India — Live Net Worth of India's Richest",
  description:
    "The real-time billionaires list for India: live net worth and rankings of India's richest people, updated continuously from public stock holdings.",
  keywords: [
    "real time billionaires india",
    "richest person in india",
    "india billionaires list",
    "indian billionaires net worth",
    "richest man in india",
  ],
  alternates: { canonical: `${siteUrl()}/india` },
};

export default function IndiaPage() {
  return <CategoryLeaderboardPage category="india" />;
}
