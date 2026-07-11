import Link from "next/link";
import { getLeaderboard } from "@/lib/net-worth";
import { getCategoryView, type Category } from "@/lib/categories";
import { getHero, getFaqs, getMethodology } from "@/data/page-content";
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
  const methodology = getMethodology(category);

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
    </div>
  );
}
