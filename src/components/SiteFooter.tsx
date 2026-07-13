import Link from "next/link";
import { CrownMark } from "@/components/Logo";

export default function SiteFooter() {
  return (
    <footer className="mt-8 w-full border-t border-line bg-brand-soft/40">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-6 px-4 py-10 sm:px-8">
        <div className="flex flex-col gap-6 sm:flex-row sm:justify-between">
          <div className="max-w-sm">
            <div className="flex items-center gap-2">
              <CrownMark size={26} />
              <span className="font-display text-lg font-semibold text-foreground">
                RealTime<span className="text-brand">Billionaire</span>
              </span>
            </div>
            <p className="mt-3 text-sm text-[--muted]">
              A structured, live database of global wealth — billionaires,
              the companies and markets behind their fortunes, and the tools
              to explore it all. Not affiliated with or endorsed by Forbes.
            </p>
          </div>
          <nav className="grid grid-cols-2 gap-x-10 gap-y-2 text-sm">
            <Link href="/" className="text-foreground/70 hover:text-brand">
              World Billionaires
            </Link>
            <Link href="/india" className="text-foreground/70 hover:text-brand">
              India
            </Link>
            <Link href="/women" className="text-foreground/70 hover:text-brand">
              Women
            </Link>
            <Link href="/young" className="text-foreground/70 hover:text-brand">
              Under 45
            </Link>
            <Link href="/countries" className="text-foreground/70 hover:text-brand">
              By Country
            </Link>
            <Link href="/crypto" className="text-foreground/70 hover:text-brand">
              Crypto Wealth
            </Link>
            <Link href="/energy" className="text-foreground/70 hover:text-brand">
              Energy & Oil
            </Link>
            <Link href="/calculators" className="text-foreground/70 hover:text-brand">
              Calculators
            </Link>
            <Link href="/news" className="text-foreground/70 hover:text-brand">
              News
            </Link>
            <Link href="/good-news" className="text-foreground/70 hover:text-brand">
              Good News
            </Link>
            <Link href="/quotes" className="text-foreground/70 hover:text-brand">
              Quotes
            </Link>
            <Link href="/articles" className="text-foreground/70 hover:text-brand">
              Daily Recaps
            </Link>
            <Link href="/about" className="text-foreground/70 hover:text-brand">
              Methodology
            </Link>
          </nav>
        </div>
        <div className="border-t border-line pt-4 text-xs text-[--muted]">
          <p>
            Net worth = live public stock price × estimated shares held, plus a
            static estimate for private assets. Figures are directional
            estimates, not audited valuations. Share prices from Yahoo Finance;
            portraits from Wikipedia where available.
          </p>
          <p className="mt-2">
            © {new Date().getFullYear()} RealTimeBillionaire. All estimates
            provided for informational purposes only.
          </p>
        </div>
      </div>
    </footer>
  );
}
