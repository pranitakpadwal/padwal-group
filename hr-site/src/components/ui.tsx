import Link from "next/link";
import type { ReactNode } from "react";

export function Placeholder() {
  return (
    <span className="ml-2 align-middle rounded-sm border border-dashed border-brass px-1.5 py-0.5 text-[10px] font-medium uppercase tracking-wider text-brass">
      Placeholder
    </span>
  );
}

export function Container({ children, className = "" }: { children: ReactNode; className?: string }) {
  return <div className={`mx-auto w-full max-w-6xl px-5 sm:px-8 ${className}`}>{children}</div>;
}

export type Crumb = { label: string; href?: string };

export function Breadcrumbs({ items }: { items: Crumb[] }) {
  return (
    <nav aria-label="Breadcrumb" className="text-xs text-muted">
      <ol className="flex flex-wrap items-center gap-x-2">
        <li><Link href="/" className="hover:text-navy">Home</Link></li>
        {items.map((c, i) => (
          <li key={c.label} className="flex items-center gap-x-2">
            <span aria-hidden>/</span>
            {c.href && i < items.length - 1 ? <Link href={c.href} className="hover:text-navy">{c.label}</Link> : <span className="text-ink">{c.label}</span>}
          </li>
        ))}
      </ol>
    </nav>
  );
}

export function PageHeader({ crumbs, title, intro }: { crumbs: Crumb[]; title: string; intro?: string }) {
  return (
    <section className="bg-navy text-white">
      <Container className="py-10 sm:py-14">
        <nav aria-label="Breadcrumb" className="text-xs text-white/70">
          <ol className="flex flex-wrap items-center gap-x-2">
            <li><Link href="/" className="hover:text-white">Home</Link></li>
            {crumbs.map((c, i) => (
              <li key={c.label} className="flex items-center gap-x-2">
                <span aria-hidden>/</span>
                {c.href && i < crumbs.length - 1 ? <Link href={c.href} className="hover:text-white">{c.label}</Link> : <span className="text-white">{c.label}</span>}
              </li>
            ))}
          </ol>
        </nav>
        <h1 className="mt-5 max-w-3xl text-3xl font-bold leading-tight sm:text-5xl">{title}</h1>
        {intro && <p className="mt-4 max-w-2xl text-lg leading-relaxed text-white/80">{intro}</p>}
      </Container>
    </section>
  );
}

export function Section({ children, tone = "paper" }: { children: ReactNode; tone?: "paper" | "panel" }) {
  return (
    <section className={tone === "panel" ? "border-y border-rule bg-panel" : ""}>
      <Container className="py-12 sm:py-16">{children}</Container>
    </section>
  );
}

export function SectionTitle({ children, link }: { children: ReactNode; link?: { href: string; label: string } }) {
  return (
    <div className="mb-8 flex items-baseline justify-between gap-4 border-t-2 border-navy pt-4">
      <h2 className="text-2xl font-semibold text-navy sm:text-3xl">{children}</h2>
      {link && <Link href={link.href} className="shrink-0 text-sm font-medium text-navy underline underline-offset-4 hover:text-brass">{link.label}</Link>}
    </div>
  );
}

export function Prose({ children }: { children: ReactNode }) {
  return <div className="space-y-5 text-[17px] leading-8 text-ink/90">{children}</div>;
}

export function BulletList({ items }: { items: string[] }) {
  return (
    <ul className="space-y-2.5">
      {items.map((i) => (
        <li key={i} className="flex gap-3 leading-7">
          <span className="mt-3 h-px w-3 shrink-0 bg-brass" aria-hidden />
          <span>{i}</span>
        </li>
      ))}
    </ul>
  );
}

export function Sidebar({ title, links, current }: { title: string; links: { href: string; label: string }[]; current: string }) {
  return (
    <aside className="space-y-8">
      <div>
        <p className="border-b border-navy pb-2 text-xs font-semibold uppercase tracking-widest text-navy">{title}</p>
        <ul>
          {links.map((l) => (
            <li key={l.href} className="border-b border-rule">
              <Link href={l.href} className={`block py-2.5 text-sm ${l.href === current ? "font-semibold text-brass" : "text-ink hover:text-brass"}`}>
                {l.label}
              </Link>
            </li>
          ))}
        </ul>
      </div>
      <div className="bg-navy-deep p-6 text-white">
        <p className="font-serif text-xl">Discuss a mandate</p>
        <p className="mt-2 text-sm text-white/70">Speak to a partner about how we would approach your requirement.</p>
        <Link href="/contact" className="mt-4 inline-block bg-white px-4 py-2 text-sm font-semibold text-navy hover:bg-paper">Contact us</Link>
      </div>
    </aside>
  );
}

export function WithSidebar({ children, aside }: { children: ReactNode; aside: ReactNode }) {
  return (
    <Container className="grid gap-12 py-12 sm:py-16 lg:grid-cols-[1fr_300px]">
      <div>{children}</div>
      {aside}
    </Container>
  );
}

export function ButtonLink({ href, children, variant = "solid" }: { href: string; children: ReactNode; variant?: "solid" | "outline" }) {
  const styles = variant === "solid" ? "bg-navy text-white hover:bg-navy-deep" : "border border-navy text-navy hover:bg-navy hover:text-white";
  return <Link href={href} className={`inline-block px-6 py-3 text-sm font-semibold tracking-wide transition-colors ${styles}`}>{children}</Link>;
}

export function CtaBand({ title = "Have a senior role to fill?", text = "Tell us about the mandate. We will respond within one business day with how we would approach it." }: { title?: string; text?: string }) {
  return (
    <section className="bg-navy-deep text-white">
      <Container className="flex flex-col items-start justify-between gap-6 py-12 sm:flex-row sm:items-center">
        <div>
          <h2 className="text-2xl font-semibold sm:text-3xl">{title}</h2>
          <p className="mt-2 max-w-xl text-white/70">{text}</p>
        </div>
        <Link href="/contact" className="shrink-0 bg-white px-6 py-3 text-sm font-semibold text-navy hover:bg-paper">Discuss a hiring mandate</Link>
      </Container>
    </section>
  );
}
