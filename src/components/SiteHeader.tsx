import Link from "next/link";
import Logo from "@/components/Logo";
import CategoryTabs from "@/components/CategoryTabs";
import type { Category } from "@/lib/categories";

export default function SiteHeader({ activeCategory }: { activeCategory: Category }) {
  return (
    <header className="sticky top-0 z-30 w-full border-b border-line bg-background/85 backdrop-blur">
      <div className="mx-auto flex max-w-6xl flex-col gap-3 px-4 py-3 sm:px-8">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <Logo />
          <div className="flex items-center gap-5 text-sm">
            <Link
              href="/why"
              className="font-medium text-foreground/70 transition-colors hover:text-brand"
            >
              Why Today
            </Link>
            <Link
              href="/calculators"
              className="hidden font-medium text-foreground/70 transition-colors hover:text-brand sm:inline"
            >
              Calculators
            </Link>
            <Link
              href="/articles"
              className="font-medium text-foreground/70 transition-colors hover:text-brand"
            >
              Daily Recaps
            </Link>
            <span className="hidden items-center gap-1.5 text-xs text-[--muted] sm:flex">
              <span className="inline-block h-1.5 w-1.5 animate-pulse rounded-full bg-brand" />
              Live estimates
            </span>
          </div>
        </div>
        <CategoryTabs active={activeCategory} />
      </div>
    </header>
  );
}
