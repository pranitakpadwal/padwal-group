import Link from "next/link";

export interface Crumb {
  label: string;
  href?: string;
}

/** Visible breadcrumb trail. The last crumb is the current page (no link). */
export default function Breadcrumbs({ crumbs }: { crumbs: Crumb[] }) {
  return (
    <nav className="text-sm text-[--muted]" aria-label="Breadcrumb">
      <ol className="flex flex-wrap items-center gap-1.5">
        <li>
          <Link href="/" className="hover:text-brand hover:underline">
            Home
          </Link>
        </li>
        {crumbs.map((crumb, index) => (
          <li key={index} className="flex items-center gap-1.5">
            <span aria-hidden>›</span>
            {crumb.href ? (
              <Link href={crumb.href} className="hover:text-brand hover:underline">
                {crumb.label}
              </Link>
            ) : (
              <span className="text-foreground/80">{crumb.label}</span>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}
