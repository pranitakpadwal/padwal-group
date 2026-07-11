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
                ? "border-brand text-brand"
                : "border-transparent text-foreground/60 hover:text-brand"
            }`}
          >
            {categoryLabel(category)}
          </Link>
        );
      })}
      <Link
        href="/countries"
        className="shrink-0 border-b-2 border-transparent px-3 py-2 text-sm font-medium text-foreground/60 transition-colors hover:text-brand"
      >
        Countries
      </Link>
    </nav>
  );
}
