import type { Metadata } from "next";
import Link from "next/link";
import { Container, CtaBand, PageHeader } from "@/components/ui";
import { roles } from "@/lib/roles";

export const metadata: Metadata = { title: "Roles & Compensation" };

export default function Roles() {
  return (
    <>
      <PageHeader crumbs={[{ label: "Roles" }]} title="Roles and compensation" intro="We hire across three families of roles, at four levels of seniority. Compensation bands are indicative and vary by sector, city and company stage." />
      <Container className="py-12 sm:py-16">
        <ul className="divide-y divide-rule border-y border-rule">
          {roles.map((r) => (
            <li key={r.slug}>
              <Link href={`/roles/${r.slug}`} className="grid gap-2 py-8 hover:bg-panel md:grid-cols-[1fr_2fr] md:gap-10 md:px-4">
                <h2 className="text-2xl font-semibold text-navy">{r.name}</h2>
                <p className="text-muted">{r.summary}</p>
              </Link>
            </li>
          ))}
        </ul>
      </Container>
      <CtaBand />
    </>
  );
}
