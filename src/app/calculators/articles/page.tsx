import type { Metadata } from "next";
import Link from "next/link";
import { CALCULATOR_ARTICLE_INDEX } from "@/lib/calculator-articles";
import { siteUrl } from "@/lib/site";
import Breadcrumbs from "@/components/Breadcrumbs";
import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";

export const metadata: Metadata = {
  title: "Calculator Articles — Real Numbers From Our Wealth Calculators",
  description:
    "Every article here comes straight out of one of our live wealth calculators — real net worth, real market caps, real documented purchases, no fabricated numbers.",
  keywords: [
    "billionaire calculator articles",
    "net worth comparison articles",
    "wealth calculator stories",
  ],
  alternates: { canonical: `${siteUrl()}/calculators/articles` },
};

export default function CalculatorArticlesIndex() {
  return (
    <div className="flex flex-1 flex-col">
      <SiteHeader activeCategory="world" />
      <main className="mx-auto flex w-full max-w-4xl flex-1 flex-col gap-6 px-4 py-8 sm:px-8">
        <Breadcrumbs crumbs={[{ label: "Calculators", href: "/calculators" }, { label: "Articles" }]} />
        <header>
          <h1 className="font-display text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
            Calculator Articles
          </h1>
          <p className="mt-2 max-w-2xl text-foreground/70">
            Every one of our wealth calculators runs on real, live data. These
            articles pull a genuine story out of each one — recalculated fresh
            every time you read it, never a static snapshot.
          </p>
        </header>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          {CALCULATOR_ARTICLE_INDEX.map((article) => (
            <Link
              key={article.slug}
              href={`/calculators/articles/${article.slug}`}
              className="flex flex-col gap-2 rounded-2xl border border-line bg-surface p-6 transition-colors hover:border-brand"
            >
              <span className="text-xs font-semibold uppercase tracking-wide text-brand-dark">
                {article.calculatorLabel}
              </span>
              <h2 className="font-display text-xl font-semibold text-foreground">{article.title}</h2>
              <p className="text-sm text-foreground/70">{article.blurb}</p>
              <span className="mt-1 text-sm font-medium text-brand">Read it &rarr;</span>
            </Link>
          ))}
        </div>

        <p className="text-xs text-neutral-400">
          More of these get added as we build out new calculators and new
          angles on the existing ones.
        </p>
      </main>
      <SiteFooter />
    </div>
  );
}
