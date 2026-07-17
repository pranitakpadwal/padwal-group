import Link from "next/link";
import { getMarketQuotes } from "@/lib/markets";

/**
 * Homepage hub: one card per section of the database, so the homepage
 * reads as the front door to everything — not just the World list.
 * Pulls two live prices (Bitcoin, WTI crude) as teasers where available.
 */
export default async function ExploreHub() {
  const quotes = await getMarketQuotes(["BTC-USD", "CL=F"]);
  const btc = quotes.get("BTC-USD");
  const wti = quotes.get("CL=F");

  const cards = [
    {
      href: "/billionaires",
      title: "The Full List",
      description: "Every billionaire we cover, live-tracked and researched, ranked together.",
      teaser: null,
    },
    {
      href: "/india",
      title: "India's Richest",
      description: "The Indian billionaires, re-ranked live within their own list.",
      teaser: null,
    },
    {
      href: "/women",
      title: "Richest Women",
      description: "Women billionaires across every industry we track.",
      teaser: null,
    },
    {
      href: "/young",
      title: "Under 45",
      description: "The youngest fortunes — founders still building.",
      teaser: null,
    },
    {
      href: "/crypto",
      title: "Crypto Wealth",
      description: "Live coin prices and the billionaires riding them.",
      teaser: btc ? `BTC $${Math.round(btc.price).toLocaleString("en-US")}` : "Live prices",
    },
    {
      href: "/energy",
      title: "Energy & Oil",
      description: "Crude, gas, petrol, diesel — and the empires behind them.",
      teaser: wti ? `WTI $${wti.price.toFixed(2)}/bbl` : "Live prices",
    },
    {
      href: "/calculators",
      title: "Wealth Tools",
      description: "Spend a fortune, race two billionaires, and more.",
      teaser: "7 interactive tools",
    },
    {
      href: "/companies",
      title: "By Company",
      description: "Tesla, Reliance, Adani, Tencent — who owns what.",
      teaser: null,
    },
    {
      href: "/universities",
      title: "By University",
      description: "Where the world's richest studied — or dropped out.",
      teaser: null,
    },
    {
      href: "/cities",
      title: "By City",
      description: "Mumbai, Austin, Paris, Dubai — where fortunes live.",
      teaser: null,
    },
    {
      href: "/industries",
      title: "By Industry",
      description: "Technology, AI, retail, mining, crypto, and more.",
      teaser: null,
    },
    {
      href: "/families",
      title: "By Family",
      description: "The Waltons, the Sawiris brothers, and more.",
      teaser: null,
    },
    {
      href: "/expensive",
      title: "What They Own",
      description: "Yachts, jets, mansions, islands, and cars — sourced.",
      teaser: null,
    },
  ];

  return (
    <section aria-labelledby="explore-heading" className="flex flex-col gap-4">
      <div>
        <h2 id="explore-heading" className="font-display text-2xl font-semibold text-foreground">
          Explore the Wealth Database
        </h2>
        <p className="mt-1 text-sm text-foreground/70">
          One structured database — billionaires, markets, and the tools to play with both.
        </p>
      </div>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {cards.map((card) => (
          <Link
            key={card.href}
            href={card.href}
            className="group flex flex-col gap-1.5 rounded-2xl border border-line bg-surface p-5 transition-colors hover:border-brand"
          >
            <div className="flex items-baseline justify-between gap-2">
              <h3 className="font-display text-lg font-semibold text-foreground group-hover:text-brand">
                {card.title}
              </h3>
              {card.teaser && (
                <span className="shrink-0 rounded-full bg-brand-soft px-2.5 py-0.5 text-xs font-medium tabular-nums text-brand-dark">
                  {card.teaser}
                </span>
              )}
            </div>
            <p className="text-sm text-foreground/70">{card.description}</p>
          </Link>
        ))}
      </div>
    </section>
  );
}
