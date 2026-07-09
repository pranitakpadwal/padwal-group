import Link from "next/link";
import { CATEGORIES, categoryLabel, type Category } from "@/lib/categories";

const HREF_BY_CATEGORY: Record<Category, string> = {
  world: "/",
  india: "/india",
  women: "/women",
  young: "/young",
};

export default function CategoryTabs({ active }: { active: Category }) {
  return (
    <nav className="-mb-px flex gap-1 overflow-x-auto" aria-label="Billionaire list categories">
      {CATEGORIES.map((category) => {
        const isActive = category === active;
        return (
          <Link
            key={category}
            href={HREF_BY_CATEGORY[category]}
            className={`shrink-0 border-b-2 px-3 py-2 text-sm font-medium transition-colors ${
              isActive
                ? "border-black text-black dark:border-white dark:text-white"
                : "border-transparent text-neutral-500 hover:text-black dark:text-neutral-400 dark:hover:text-white"
            }`}
          >
            {categoryLabel(category)}
          </Link>
        );
      })}
    </nav>
  );
}
