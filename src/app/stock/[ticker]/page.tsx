import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getLeaderboard } from "@/lib/net-worth";
import { getTickerHolders } from "@/lib/holdings";
import { getStockSummary } from "@/lib/stock";
import { companyName } from "@/lib/companies";
import { siteUrl, NOINDEX } from "@/lib/site";
import {
  formatCompactNumber,
  formatPercentChange,
  formatUsdCompact,
} from "@/lib/format";
import PersonAvatar from "@/components/PersonAvatar";
import Breadcrumbs from "@/components/Breadcrumbs";
import LiveWebPageJsonLd from "@/components/LiveWebPageJsonLd";
import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";

export const dynamic = "force-dynamic";

type RouteParams = { ticker: string };

function normalizeTicker(raw: string): string {
  return decodeURIComponent(raw).toUpperCase();
}

export async function generateMetadata({
  params,
}: {
  params: Promise<RouteParams>;
}): Promise<Metadata> {
  const { ticker: rawTicker } = await params;
  const ticker = normalizeTicker(rawTicker);
  const company = companyName(ticker);
  const title = `${company} Billionaires — Who Owns ${ticker}? Live Net Worth`;
  const description = `The billionaires who hold ${company} (${ticker}) stock, their estimated stakes, and the live share price behind their net worth.`;
  return {
    title,
    description,
    keywords: [
      `${company} billionaires`,
      `who owns ${ticker}`,
      `${ticker} shareholders`,
      `${ticker} billionaire owners`,
      ticker,
    ],
    alternates: { canonical: `${siteUrl()}/stock/${ticker}` },
    robots: NOINDEX,
    openGraph: { title, description, type: "website" },
  };
}

export default async function StockPage({ params }: { params: Promise<RouteParams> }) {
  const { ticker: rawTicker } = await params;
  const ticker = normalizeTicker(rawTicker);
  const company = companyName(ticker);

  const [leaderboard, summary] = await Promise.all([
    getLeaderboard(),
    getStockSummary(ticker),
  ]);

  const holders = getTickerHolders(leaderboard, ticker);

  if (holders.length === 0) {
    notFound();
  }

  const changePercent = summary?.changePercent ?? null;
  const changeColor =
    changePercent === null
      ? "text-[--muted]"
      : changePercent > 0
        ? "text-emerald-500"
        : changePercent < 0
          ? "text-rose-500"
          : "text-[--muted]";

  return (
    <div className="flex flex-1 flex-col">
      <SiteHeader activeCategory="world" />
      <main className="mx-auto flex w-full max-w-3xl flex-1 flex-col gap-6 px-4 py-8 sm:px-8">
        <Breadcrumbs crumbs={[{ label: "Companies", href: "/companies" }, { label: company }]} />

        <header>
          <h1 className="font-display text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
            {company} Billionaires
          </h1>
          <p className="mt-1 text-sm text-[--muted]">
            Who owns {ticker}
            {summary?.name && summary.name !== company ? ` (${summary.name})` : ""}
          </p>
        </header>

        {summary && (summary.price !== null || summary.marketCap !== null) && (
          <div className="grid grid-cols-1 gap-4 rounded-2xl border border-line bg-surface p-5 sm:grid-cols-3">
            {summary.price !== null && (
              <div>
                <div className="text-xs uppercase tracking-wide text-[--muted]">Share Price</div>
                <div className="font-display text-xl font-semibold tabular-nums text-foreground">
                  {summary.price.toFixed(2)} {summary.currency ?? ""}
                </div>
              </div>
            )}
            {changePercent !== null && (
              <div>
                <div className="text-xs uppercase tracking-wide text-[--muted]">Today</div>
                <div className={`font-display text-xl font-semibold tabular-nums ${changeColor}`}>
                  {formatPercentChange(changePercent)}
                </div>
              </div>
            )}
            {summary.marketCap !== null && (
              <div>
                <div className="text-xs uppercase tracking-wide text-[--muted]">Market Cap</div>
                <div className="font-display text-xl font-semibold tabular-nums text-foreground">
                  {formatCompactNumber(summary.marketCap)} {summary.currency ?? ""}
                </div>
              </div>
            )}
          </div>
        )}

        <section aria-labelledby="holders-heading">
          <h2 id="holders-heading" className="mb-3 text-lg font-bold text-foreground">
            Tracked Billionaire Holders
          </h2>
          <ul className="divide-y divide-line">
            {holders.map(({ person, valueUsd }) => (
              <li key={person.id} className="flex items-center justify-between gap-3 py-3">
                <Link href={`/billionaire/${person.id}`} className="flex items-center gap-3">
                  <PersonAvatar name={person.name} photoUrl={person.photoUrl} size={36} />
                  <span className="font-medium text-foreground hover:underline">{person.name}</span>
                </Link>
                <span className="text-right text-sm tabular-nums text-foreground">
                  {valueUsd !== null ? formatUsdCompact(valueUsd) : "—"}
                  <span className="block text-xs text-[--muted]">estimated stake</span>
                </span>
              </li>
            ))}
          </ul>
        </section>

        <p className="text-xs text-[--muted]">
          Share counts are manually curated estimates; stake values are those
          share counts multiplied by the live price. Directional estimates,
          not audited figures, and not affiliated with Forbes.{" "}
          <Link href="/companies" className="text-brand hover:underline">
            Browse billionaires by company &rarr;
          </Link>
        </p>
      </main>
      <SiteFooter />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "BreadcrumbList",
            itemListElement: [
              { "@type": "ListItem", position: 1, name: "Home", item: siteUrl() },
              { "@type": "ListItem", position: 2, name: "Companies", item: `${siteUrl()}/companies` },
              { "@type": "ListItem", position: 3, name: `${company} Billionaires`, item: `${siteUrl()}/stock/${ticker}` },
            ],
          }),
        }}
      />
      <LiveWebPageJsonLd
        url={`${siteUrl()}/stock/${ticker}`}
        name={`${company} Billionaires`}
        asOf={leaderboard.asOf}
      />
    </div>
  );
}
