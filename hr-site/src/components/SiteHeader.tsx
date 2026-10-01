import Link from "next/link";
import { firm, nav } from "@/lib/site";
import { Container } from "./ui";

export default function SiteHeader() {
  return (
    <header className="border-b border-rule bg-paper">
      <Container className="flex flex-wrap items-center justify-between gap-x-8 gap-y-3 py-5">
        <Link href="/" className="leading-tight">
          <span className="block font-serif text-2xl font-semibold text-navy">{firm.name}</span>
          <span className="block text-[11px] uppercase tracking-[0.2em] text-muted">{firm.descriptor}</span>
        </Link>
        <nav aria-label="Main" className="flex flex-wrap items-center gap-x-6 gap-y-2 text-sm text-ink">
          {nav.map((n) => (
            <Link key={n.href} href={n.href} className="hover:text-brass">
              {n.label}
            </Link>
          ))}
          <Link href="/contact" className="bg-navy px-4 py-2 font-semibold text-white hover:bg-navy-deep">
            Contact
          </Link>
        </nav>
      </Container>
    </header>
  );
}
