import Link from "next/link";
import Logo from "@/components/Logo";
import CategoryTabs from "@/components/CategoryTabs";
import type { Category } from "@/lib/categories";

const NAV_LINKS = [
  { href: "/why", label: "Why Today" },
  { href: "/crypto", label: "Crypto" },
  { href: "/energy", label: "Energy" },
  { href: "/calculators", label: "Calculators" },
  { href: "/articles", label: "Daily Recaps" },
];

export default function SiteHeader({ activeCategory }: { activeCategory: Category }) {
  return (
    <header className="sticky top-0 z-30 w-full border-b border-line bg-background/85 backdrop-blur">
      <div className="mx-auto flex max-w-6xl flex-col gap-3 px-4 py-3 sm:px-8">
        <div className="flex items-center justify-between gap-3">
          <Logo />
          <div className="hidden items-center gap-5 text-sm sm:flex">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="font-medium text-foreground/70 transition-colors hover:text-brand"
              >
                {link.label}
              </Link>
            ))}
            <span className="flex items-center gap-1.5 text-xs text-[--muted]">
              <span className="inline-block h-1.5 w-1.5 animate-pulse rounded-full bg-brand" />
              Live
            </span>
          </div>
        </div>

        {/* Mobile utility nav — always shows every link, scrolls if needed */}
        <nav className="flex gap-4 overflow-x-auto text-sm sm:hidden" aria-label="Site sections">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="shrink-0 font-medium text-foreground/70 hover:text-brand"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <CategoryTabs active={activeCategory} />
      </div>
    </header>
  );
}
