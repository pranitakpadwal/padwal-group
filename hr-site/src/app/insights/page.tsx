import type { Metadata } from "next";
import Link from "next/link";
import { Container, CtaBand, PageHeader } from "@/components/ui";
import { articles } from "@/lib/insights";

export const metadata: Metadata = { title: "Insights" };

export default function Insights() {
  return (
    <>
      <PageHeader crumbs={[{ label: "Insights" }]} title="Insights" intro="Practical notes on senior hiring, compensation and working across markets, for hiring leaders and for candidates." />
      <Container className="py-12 sm:py-16">
        <ul className="divide-y divide-rule border-y border-rule">
          {articles.map((a) => (
            <li key={a.slug}>
              <Link href={`/insights/${a.slug}`} className="grid gap-2 py-7 hover:bg-panel md:grid-cols-[160px_1fr] md:gap-8 md:px-4">
                <span className="text-xs font-semibold uppercase tracking-widest text-brass">{a.category}</span>
                <span><span className="block text-xl font-semibold text-navy">{a.title}</span><span className="mt-1 block text-muted">{a.summary}</span></span>
              </Link>
            </li>
          ))}
        </ul>
      </Container>
      <CtaBand />
    </>
  );
}
