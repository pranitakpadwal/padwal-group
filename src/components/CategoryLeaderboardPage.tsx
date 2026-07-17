import Link from "next/link";
import { getLeaderboard } from "@/lib/net-worth";
import { getCategoryView, type Category } from "@/lib/categories";
import { getCombinedRoster } from "@/lib/combined-roster";
import { getHero, getFaqs, getMethodology } from "@/data/page-content";
import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";
import Sidebar from "@/components/Sidebar";
import Leaderboard from "@/components/Leaderboard";
import PageHero from "@/components/PageHero";
import FaqBlock from "@/components/FaqBlock";
import ItemListJsonLd from "@/components/ItemListJsonLd";
import ExploreHub from "@/components/ExploreHub";
import TodayWidgets from "@/components/TodayWidgets";
import LiveWebPageJsonLd from "@/components/LiveWebPageJsonLd";
import { siteUrl } from "@/lib/site";

const PATH_BY_CATEGORY: Record<Category, string> = {
  world: "/",
  india: "/india",
  women: "/women",
  young: "/young",
};

export default async function CategoryLeaderboardPage({ category }: { category: Category }) {
  const leaderboard = await getLeaderboard();
  const view = getCategoryView(leaderboard, category);
  const hero = getHero(category);
  const faqs = getFaqs(category, view.people[0]?.name);
  const methodology = getMethodology(category);
  // The Estimated tier has country and gender data but not age, so
  // "coverage" stats that blend it in make sense for World, Women, and
  // India — Under 45 stays pure-live since we can't scope the Estimated
  // tier to an age cutoff.
  const combinedRoster =
    category === "world"
      ? getCombinedRoster(leaderboard)
      : category === "women"
        ? getCombinedRoster(leaderboard).filter((entry) => entry.gender === "female")
        : category === "india"
          ? getCombinedRoster(leaderboard).filter((entry) => entry.country === "India")
          : null;
  const coverageOverride = combinedRoster
    ? {
        peopleLabel: "People Covered",
        peopleValue: String(combinedRoster.length),
        combinedWealthUsd: combinedRoster.reduce((sum, entry) => sum + entry.netWorthUsd, 0),
        topRichestName: combinedRoster[0].name,
      }
    : undefined;

  return (
    <div className="flex flex-1 flex-col">
      <SiteHeader activeCategory={category} />
      <main className="mx-auto flex w-full max-w-6xl flex-1 flex-col gap-8 px-4 py-8 sm:px-8">
        <PageHero
          h1={hero.h1}
          lede={hero.lede}
          people={view.people}
          topGainer={view.topGainers[0]}
          coverageOverride={coverageOverride}
        />
        {combinedRoster && (
          <p className="-mt-4 text-sm text-[--muted]">
            {view.people.length} tracked live from public stock holdings, plus{" "}
            {combinedRoster.length - view.people.length} more from researched, sourced estimates.{" "}
            <Link href="/billionaire" className="text-brand hover:underline">
              See the full list &rarr;
            </Link>
          </p>
        )}

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

        {category === "world" && <TodayWidgets />}

        {category === "world" && <ExploreHub />}

        <section className="rounded-2xl border border-line bg-surface p-6 sm:p-8">
          <h2 className="font-display text-2xl font-semibold text-foreground">
            {methodology.heading}
          </h2>
          <div className="mt-4 flex flex-col gap-3 text-sm leading-relaxed text-foreground/70">
            {methodology.paragraphs.map((paragraph, index) => (
              <p key={index}>{paragraph}</p>
            ))}
          </div>
          <Link
            href="/about"
            className="mt-4 inline-block text-sm font-medium text-brand hover:underline"
          >
            Read our full methodology &amp; data sources &rarr;
          </Link>
        </section>

        <FaqBlock faqs={faqs} />
      </main>
      <SiteFooter />
      <ItemListJsonLd category={category} people={view.people} />
      <LiveWebPageJsonLd
        url={`${siteUrl()}${PATH_BY_CATEGORY[category]}`}
        name={hero.h1}
        description={hero.lede}
        asOf={leaderboard.asOf}
      />
    </div>
  );
}
