import Link from "next/link";
import type { CoverageLink } from "@/lib/related-coverage";

/** Renders a grid of real links into other content about the people on the page. */
export default function RelatedCoverage({ links }: { links: CoverageLink[] }) {
  if (links.length === 0) {
    return null;
  }

  return (
    <section aria-labelledby="related-coverage-heading" className="flex flex-col gap-3">
      <h2 id="related-coverage-heading" className="text-lg font-bold text-foreground">
        More Coverage
      </h2>
      <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
        {links.map((link, index) => (
          <Link
            key={`${link.href}-${index}`}
            href={link.href}
            className="rounded-xl border border-line bg-surface px-4 py-2.5 text-sm text-foreground/80 transition-colors hover:border-brand hover:text-brand"
          >
            {link.label} &rarr;
          </Link>
        ))}
      </div>
    </section>
  );
}
