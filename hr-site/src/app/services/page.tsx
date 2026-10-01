import type { Metadata } from "next";
import Link from "next/link";
import { Container, CtaBand, PageHeader } from "@/components/ui";
import { services } from "@/lib/services";

export const metadata: Metadata = { title: "Services" };

export default function Services() {
  return (
    <>
      <PageHeader crumbs={[{ label: "Services" }]} title="Services" intro="Search, hiring and advisory services matched to the seniority of the role and the way you prefer to work." />
      <Container className="py-12 sm:py-16">
        <ul className="divide-y divide-rule border-y border-rule">
          {services.map((s) => (
            <li key={s.slug}>
              <Link href={`/services/${s.slug}`} className="grid gap-3 py-8 hover:bg-panel md:grid-cols-[1fr_2fr_auto] md:gap-10 md:px-4">
                <h2 className="text-2xl font-semibold text-navy">{s.title}</h2>
                <p className="leading-relaxed text-muted">{s.summary}</p>
                <span className="text-sm font-medium text-brass md:text-right">{s.band}</span>
              </Link>
            </li>
          ))}
        </ul>
      </Container>
      <CtaBand />
    </>
  );
}
