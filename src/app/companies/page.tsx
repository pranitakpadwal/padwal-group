import type { Metadata } from "next";
import Link from "next/link";
import { listCompanies } from "@/lib/companies";
import { getLeaderboard } from "@/lib/net-worth";
import { formatUsdCompact } from "@/lib/format";
import { siteUrl } from "@/lib/site";
import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";
import LiveWebPageJsonLd from "@/components/LiveWebPageJsonLd";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Billionaires by Company — Tesla, Reliance, Adani & More",
  description:
    "Which billionaires own which companies? Browse Tesla, Amazon, Reliance, Adani, Alibaba, Tencent and more, ranked live by the net worth tied to each stock.",
  keywords: [
    "billionaires by company",
    "Tesla billionaires",
    "Reliance billionaires",
    "Adani billionaires",
    "who owns Tesla stock",
  ],
  alternates: { canonical: `${siteUrl()}/companies` },
};

export default async function CompaniesIndex() {
  const companies = listCompanies();
  const leaderboard = await getLeaderboard();
  const netWorthById = new Map(leaderboard.people.map((p) => [p.id, p.netWorthUsd]));

  const rows = companies.map((c) => ({
    ...c,
    combinedNetWorth: c.personIds.reduce((sum, id) => sum + (netWorthById.get(id) ?? 0), 0),
  }));

  return (
    <div className="flex flex-1 flex-col">
      <SiteHeader activeCategory="world" />
      <main className="mx-auto flex w-full max-w-4xl flex-1 flex-col gap-8 px-4 py-8 sm:px-8">
        <header>
          <h1 className="font-display text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
            Billionaires by Company
          </h1>
          <p className="mt-2 max-w-2xl text-foreground/70">
            Every tracked company with a billionaire owner — see who holds
            what, and what it&apos;s worth right now.
          </p>
        </header>

        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          {rows.map((c) => (
            <Link
              key={c.ticker}
              href={`/stock/${c.ticker}`}
              className="flex flex-col gap-1 rounded-xl border border-line bg-surface px-4 py-3 transition-colors hover:border-brand"
            >
              <div className="flex items-center justify-between">
                <span className="font-medium text-foreground">{c.name}</span>
                <span className="text-xs text-[--muted]">{c.ticker}</span>
              </div>
              <div className="flex items-center justify-between text-sm text-[--muted]">
                <span>
                  {c.personIds.length} {c.personIds.length === 1 ? "billionaire" : "billionaires"}
                </span>
                <span className="tabular-nums text-brand-dark">
                  {formatUsdCompact(c.combinedNetWorth)}
                </span>
              </div>
            </Link>
          ))}
        </div>
      </main>
      <SiteFooter />
      <LiveWebPageJsonLd
        url={`${siteUrl()}/companies`}
        name="Billionaires by Company"
        asOf={leaderboard.asOf}
      />
    </div>
  );
}
