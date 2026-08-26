import type { Metadata } from "next";
import Link from "next/link";
import { NOINDEX } from "@/lib/site";
import GrowthSimulator from "@/components/growth-simulator/GrowthSimulator";

// This tool is a separate product line from the billionaires tracker it's
// hosted alongside — not part of that site's editorial content, so it
// stays out of the sitewide index rather than diluting that site's topical
// focus (see NOINDEX usage convention in src/lib/site.ts).
export const metadata: Metadata = {
  title: "Growth Strategy Simulator — Personal Loans, India",
  description:
    "Plan growth before you spend the money: benchmark your funnel, model conservative/base/upside forecasts, find your biggest constraint, and see where the next rupee should go.",
  robots: NOINDEX,
};

export default function GrowthSimulatorPage() {
  return (
    <div className="flex min-h-screen flex-col bg-background">
      <header className="border-b border-line bg-surface">
        <div className="mx-auto flex max-w-6xl flex-col gap-2 px-4 py-6 sm:px-8">
          <span className="text-xs font-medium uppercase tracking-wide text-brand">
            Growth Strategy Simulator
          </span>
          <h1 className="font-display text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
            Plan your growth before you spend the money
          </h1>
          <p className="max-w-2xl text-sm text-foreground/70 sm:text-base">
            If we invest this much money, in this market, through these channels, with our current
            business economics — what is realistically achievable, and where should the next rupee go?
            This build covers <strong className="text-foreground">Personal Loans, India</strong> end to
            end; more industry packs follow the same benchmark + forecast + scenario architecture.
          </p>
        </div>
      </header>
      <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-8 sm:px-8">
        <GrowthSimulator />
      </main>
      <footer className="border-t border-line px-4 py-6 text-center text-xs text-foreground/40 sm:px-8">
        <Link href="/" className="hover:text-foreground/70">
          ← Back
        </Link>
      </footer>
    </div>
  );
}
