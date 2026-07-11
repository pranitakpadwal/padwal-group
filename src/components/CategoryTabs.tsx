import Link from "next/link";
import { CATEGORIES, categoryLabel, type Category } from "@/lib/categories";

/** Sections that get a top-level tab: the list categories plus the market verticals. */
export type NavSection = Category | "crypto" | "energy";

const HREF_BY_CATEGORY: Record<Category, string> = {
  world: "/",
  india: "/india",
  women: "/women",
  young: "/young",
};

const MARKET_TABS: { section: NavSection; href: string; label: string }[] = [
  { section: "crypto", href: "/crypto", label: "Crypto" },
  { section: "energy", href: "/energy", label: "Energy" },
];

function tabClass(isActive: boolean): string {
  return `shrink-0 border-b-2 px-3 py-2 text-sm font-medium transition-colors ${
    isActive
      ? "border-brand text-brand"
      : "border-transparent text-foreground/60 hover:text-brand"
  }`;
}

export default function CategoryTabs({ active }: { active: NavSection }) {
  return (
    <nav className="-mb-px flex gap-1 overflow-x-auto" aria-label="Site sections">
      {CATEGORIES.map((category) => (
        <Link key={category} href={HREF_BY_CATEGORY[category]} className={tabClass(category === active)}>
          {categoryLabel(category)}
        </Link>
      ))}
      {MARKET_TABS.map((tab) => (
        <Link key={tab.section} href={tab.href} className={tabClass(tab.section === active)}>
          {tab.label}
        </Link>
      ))}
      <Link
        href="/countries"
        className="shrink-0 border-b-2 border-transparent px-3 py-2 text-sm font-medium text-foreground/60 transition-colors hover:text-brand"
      >
        Countries
      </Link>
    </nav>
  );
}
