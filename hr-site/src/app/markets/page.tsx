import type { Metadata } from "next";
import Link from "next/link";
import { Container, CtaBand, PageHeader } from "@/components/ui";
import { markets } from "@/lib/markets";

export const metadata: Metadata = { title: "Markets" };

export default function Markets() {
  return (
    <>
      <PageHeader crumbs={[{ label: "Markets" }]} title="Markets" intro="We work with domestic clients, international organisations with India operations, Indian companies expanding abroad, and government bodies." />
      <Container className="py-12 sm:py-16">
        <ul className="divide-y divide-rule border-y border-rule">
          {[...markets.map((m) => ({ href: `/markets/${m.slug}`, name: m.name, summary: m.summary })), { href: "/government", name: "Government & Public Sector", summary: "Hiring support for departments, PSUs and public institutions through a transparent process." }].map((m) => (
            <li key={m.href}>
              <Link href={m.href} className="grid gap-2 py-8 hover:bg-panel md:grid-cols-[1fr_2fr] md:gap-10 md:px-4">
                <h2 className="text-2xl font-semibold text-navy">{m.name}</h2>
                <p className="text-muted">{m.summary}</p>
              </Link>
            </li>
          ))}
        </ul>
      </Container>
      <CtaBand />
    </>
  );
}
