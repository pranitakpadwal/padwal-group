import { getLeaderboard } from "@/lib/net-worth";
import { getCategoryView, type Category } from "@/lib/categories";
import { getHero, getFaqs } from "@/data/page-content";
import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";
import Sidebar from "@/components/Sidebar";
import Leaderboard from "@/components/Leaderboard";
import PageHero from "@/components/PageHero";
import FaqBlock from "@/components/FaqBlock";
import ItemListJsonLd from "@/components/ItemListJsonLd";

export default async function CategoryLeaderboardPage({ category }: { category: Category }) {
  const leaderboard = await getLeaderboard();
  const view = getCategoryView(leaderboard, category);
  const hero = getHero(category);
  const faqs = getFaqs(category, view.people[0]?.name);

  return (
    <div className="flex flex-1 flex-col">
      <SiteHeader activeCategory={category} />
      <main className="mx-auto flex w-full max-w-6xl flex-1 flex-col gap-8 px-4 py-8 sm:px-8">
        <PageHero
          h1={hero.h1}
          lede={hero.lede}
          people={view.people}
          topGainer={view.topGainers[0]}
        />

        <div className="flex flex-col gap-6 lg:flex-row">
          <Leaderboard
            key={category}
            initialData={{ ...leaderboard, ...view }}
            category={category}
          />
          <Sidebar
            people={view.people}
            topGainers={view.topGainers}
            activeCategory={category}
          />
        </div>

        <section className="rounded-2xl border border-line bg-surface p-6 sm:p-8">
          <h2 className="font-display text-2xl font-semibold text-foreground">
            How we calculate real-time net worth
          </h2>
          <div className="mt-4 flex flex-col gap-3 text-sm leading-relaxed text-foreground/70">
            <p>
              Most of a typical billionaire&apos;s fortune sits in
              publicly-traded company stock. We estimate each person&apos;s
              shareholdings from public filings and reporting, multiply those
              shares by the live market price, and convert everything to US
              dollars. That public-equity figure updates continuously while
              markets are open — which is what makes this a real-time
              billionaires list rather than a once-a-year snapshot.
            </p>
            <p>
              On top of that, we add a static estimate for wealth that
              isn&apos;t publicly traded — private companies, cash, real
              estate, art, and similar. Those figures don&apos;t tick
              minute-to-minute and are updated manually. Everything here is a
              directional estimate for informational purposes, not an audited
              valuation, and this site is independent and not affiliated with
              Forbes or Bloomberg.
            </p>
          </div>
        </section>

        <FaqBlock faqs={faqs} />
      </main>
      <SiteFooter />
      <ItemListJsonLd category={category} people={view.people} />
    </div>
  );
}
