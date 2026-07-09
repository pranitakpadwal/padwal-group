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
          <p className="text-xs text-neutral-500 dark:text-neutral-400">
            Live estimates from public stock holdings &mdash; not affiliated with Forbes
          </p>
        </div>
        <CategoryTabs active={activeCategory} />
      </div>
    </header>
  );
}
