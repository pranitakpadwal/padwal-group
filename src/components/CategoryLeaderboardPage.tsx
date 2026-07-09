import { getLeaderboard } from "@/lib/net-worth";
import { categoryDescription, categoryLabel, getCategoryView, type Category } from "@/lib/categories";
import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";
import Sidebar from "@/components/Sidebar";
import Leaderboard from "@/components/Leaderboard";
import ItemListJsonLd from "@/components/ItemListJsonLd";

export default async function CategoryLeaderboardPage({ category }: { category: Category }) {
  const leaderboard = await getLeaderboard();
  const view = getCategoryView(leaderboard, category);

  return (
    <div className="flex flex-1 flex-col bg-zinc-50 dark:bg-black">
      <SiteHeader activeCategory={category} />
      <main className="mx-auto flex w-full max-w-6xl flex-1 flex-col gap-4 px-4 py-8 sm:px-8">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-black dark:text-zinc-50 sm:text-3xl">
            {categoryLabel(category)}&apos;s Billionaires
          </h1>
          <p className="mt-1 text-sm text-neutral-500 dark:text-neutral-400">
            {categoryDescription(category)}
          </p>
        </div>
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
      </main>
      <SiteFooter />
      <ItemListJsonLd category={category} people={view.people} />
    </div>
  );
}
