import Link from "next/link";
import Logo from "@/components/Logo";
import CategoryTabs, { type NavSection } from "@/components/CategoryTabs";
import MobileMenu from "@/components/MobileMenu";

const NAV_LINKS = [
  { href: "/news", label: "News" },
  { href: "/quotes", label: "Quotes" },
  { href: "/calculators", label: "Calculators" },
  { href: "/articles", label: "Daily Recaps" },
];

export default function SiteHeader({ activeCategory }: { activeCategory: NavSection }) {
  return (
    <header className="sticky top-0 z-30 w-full border-b border-line bg-background/85 backdrop-blur">
      <div className="relative mx-auto flex max-w-6xl flex-col gap-3 px-4 py-3 sm:px-8">
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
          <div className="flex items-center gap-3 sm:hidden">
            <span className="flex items-center gap-1.5 text-xs text-[--muted]">
              <span className="inline-block h-1.5 w-1.5 animate-pulse rounded-full bg-brand" />
              Live
            </span>
            <MobileMenu active={activeCategory} />
          </div>
        </div>

        {/* Category tabs — desktop only; mobile uses the menu above. */}
        <div className="hidden sm:block">
          <CategoryTabs active={activeCategory} />
        </div>
      </div>
    </header>
  );
}
