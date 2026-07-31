import type { Metadata } from "next";
import CategoryLeaderboardPage from "@/components/CategoryLeaderboardPage";
import { billionaires } from "@/data/billionaires";
import { listEstimatedBillionaires } from "@/data/estimated-billionaires";
import { siteUrl } from "@/lib/site";

export const dynamic = "force-dynamic";

// Search Console: this page sits at position ~7 on 11,973 impressions but
// converts at 0.89% — roughly a third of what position 7 normally earns. The
// snippet gave searchers no reason to pick it over Forbes or Bloomberg, both
// of which publish a *static annual* list. The count and the "updated as
// markets move" promise are the differentiator, so they lead now.
// "live billionaire" already converts at 4.66%, so that phrasing leads too.
const TRACKED_COUNT = billionaires.length + listEstimatedBillionaires().length;

export const metadata: Metadata = {
  title: "Real-Time Billionaires List — Live Net Worth, Updated as Markets Move",
  // Kept under ~155 chars so Google doesn't truncate away the differentiator.
  description: `Live net worth for ${TRACKED_COUNT} of the world's richest people, recalculated from public stock holdings as markets move — not a once-a-year snapshot.`,
  keywords: [
    "real time billionaires",
    "real time billionaires list",
    "live billionaire",
    "live billionaires list",
    "live billionaire list",
    "real time net worth",
    "billionaire live",
    "billionaire list real time",
    "world richest person real time",
    "richest people in the world",
  ],
  alternates: { canonical: siteUrl() },
};

export default function Home() {
  return <CategoryLeaderboardPage category="world" />;
}
