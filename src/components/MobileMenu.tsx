"use client";

import { useState } from "react";
import Link from "next/link";
import type { NavSection } from "@/components/CategoryTabs";

interface MenuLink {
  href: string;
  label: string;
  section?: NavSection;
}

const GROUPS: { heading: string; links: MenuLink[] }[] = [
  {
    heading: "Rankings",
    links: [
      { href: "/", label: "World", section: "world" },
      { href: "/india", label: "India", section: "india" },
      { href: "/women", label: "Women", section: "women" },
      { href: "/young", label: "Under 45", section: "young" },
      { href: "/countries", label: "By Country" },
    ],
  },
  {
    heading: "Markets",
    links: [
      { href: "/crypto", label: "Crypto Wealth", section: "crypto" },
      { href: "/energy", label: "Energy & Oil", section: "energy" },
    ],
  },
  {
    heading: "Tools & Reads",
    links: [
      { href: "/news", label: "News" },
      { href: "/good-news", label: "Good News" },
      { href: "/quote-of-the-day", label: "Quote of the Day" },
      { href: "/quotes", label: "Quotes" },
      { href: "/calculators", label: "Calculators" },
      { href: "/why", label: "Why Today" },
      { href: "/articles", label: "Daily Recaps" },
      { href: "/about", label: "Methodology" },
    ],
  },
];

export default function MobileMenu({ active }: { active: NavSection }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="sm:hidden">
      <button
        type="button"
        onClick={() => setOpen((value) => !value)}
        aria-expanded={open}
        aria-label={open ? "Close menu" : "Open menu"}
        className="flex h-9 w-9 items-center justify-center rounded-lg border border-line text-foreground"
      >
        {open ? (
          <span aria-hidden className="text-lg leading-none">✕</span>
        ) : (
          <span aria-hidden className="flex flex-col gap-[5px]">
            <span className="block h-[2px] w-5 rounded bg-current" />
            <span className="block h-[2px] w-5 rounded bg-current" />
            <span className="block h-[2px] w-5 rounded bg-current" />
          </span>
        )}
      </button>

      {open && (
        <div className="absolute inset-x-0 top-full border-b border-line bg-background shadow-lg">
          <nav className="mx-auto grid max-w-6xl grid-cols-2 gap-6 px-4 py-5" aria-label="Site menu">
            {GROUPS.map((group) => (
              <div key={group.heading} className="flex flex-col gap-1.5">
                <div className="text-xs font-semibold uppercase tracking-wide text-[--muted]">
                  {group.heading}
                </div>
                {group.links.map((link) => {
                  const isActive = link.section !== undefined && link.section === active;
                  return (
                    <Link
                      key={link.href}
                      href={link.href}
                      onClick={() => setOpen(false)}
                      className={`py-1 text-sm font-medium ${
                        isActive ? "text-brand" : "text-foreground/80 hover:text-brand"
                      }`}
                    >
                      {link.label}
                    </Link>
                  );
                })}
              </div>
            ))}
          </nav>
        </div>
      )}
    </div>
  );
}
