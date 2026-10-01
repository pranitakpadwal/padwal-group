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

export function Eyebrow({ children }: { children: ReactNode }) {
  return <p className="text-xs font-semibold uppercase tracking-[0.18em] text-brass">{children}</p>;
}

export function PageHeader({ eyebrow, title, intro }: { eyebrow: string; title: string; intro: string }) {
  return (
    <section className="border-b border-rule bg-panel">
      <Container className="py-14 sm:py-20">
        <Eyebrow>{eyebrow}</Eyebrow>
        <h1 className="mt-3 max-w-3xl text-4xl font-semibold leading-tight text-navy sm:text-5xl">{title}</h1>
        <p className="mt-5 max-w-2xl text-lg leading-relaxed text-muted">{intro}</p>
      </Container>
    </section>
  );
}

export function Section({ children, tone = "paper", className = "" }: { children: ReactNode; tone?: "paper" | "panel"; className?: string }) {
  return (
    <section className={`${tone === "panel" ? "bg-panel border-y border-rule" : ""} ${className}`}>
      <Container className="py-14 sm:py-20">{children}</Container>
    </section>
  );
}

export function ButtonLink({ href, children, variant = "solid" }: { href: string; children: ReactNode; variant?: "solid" | "outline" }) {
  const base = "inline-block px-6 py-3 text-sm font-semibold tracking-wide transition-colors";
  const styles =
    variant === "solid"
      ? "bg-navy text-white hover:bg-navy-deep"
      : "border border-navy text-navy hover:bg-navy hover:text-white";
  return (
    <Link href={href} className={`${base} ${styles}`}>
      {children}
    </Link>
  );
}

export function CtaBand() {
  return (
    <section className="bg-navy-deep text-white">
      <Container className="flex flex-col items-start justify-between gap-6 py-14 sm:flex-row sm:items-center">
        <div>
          <h2 className="text-3xl font-semibold">Have a senior role to fill?</h2>
          <p className="mt-2 max-w-xl text-white/70">Tell us about the mandate. We will respond within one business day with how we would approach it.</p>
        </div>
        <Link href="/contact" className="bg-white px-6 py-3 text-sm font-semibold text-navy hover:bg-paper">
          Discuss a hiring mandate
        </Link>
      </Container>
    </section>
  );
}
