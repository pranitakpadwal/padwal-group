import Link from "next/link";
import CategoryTabs from "@/components/CategoryTabs";
import type { Category } from "@/lib/categories";

export default function SiteHeader({ activeCategory }: { activeCategory: Category }) {
  return (
    <header className="w-full border-b border-neutral-200 dark:border-neutral-800">
      <div className="mx-auto flex max-w-6xl flex-col gap-4 px-4 py-6 sm:px-8">
        <div className="flex flex-wrap items-baseline justify-between gap-2">
          <Link href="/" className="flex items-baseline gap-2">
            <span className="text-xl font-black tracking-tight text-black dark:text-zinc-50">
              Real-Time Billionaires
            </span>
          </Link>
          <div className="flex items-center gap-4">
            <Link
              href="/articles"
              className="text-sm font-medium text-neutral-600 hover:underline dark:text-neutral-300"
            >
              Daily Recaps
            </Link>
            <p className="hidden text-xs text-neutral-500 dark:text-neutral-400 sm:block">
              Live estimates from public stock holdings &mdash; not affiliated with Forbes
            </p>
          </div>
        </div>
        <CategoryTabs active={activeCategory} />
      </div>
    </header>
  );
}
