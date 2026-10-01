import type { Metadata } from "next";
import Link from "next/link";
import { Container, CtaBand, PageHeader } from "@/components/ui";
import { industries } from "@/lib/industries";

export const metadata: Metadata = { title: "Industries" };

export default function Industries() {
  return (
    <>
      <PageHeader crumbs={[{ label: "Industries" }]} title="Industries" intro="We concentrate on sectors where we can speak to candidates with real depth, and where the leadership market is active." />
      <Container className="py-12 sm:py-16">
        <ul className="grid gap-x-12 md:grid-cols-2">
          {industries.map((i) => (
            <li key={i.slug} className="border-t border-rule py-7">
              <Link href={`/industries/${i.slug}`} className="group block">
                <h2 className="text-xl font-semibold text-navy group-hover:text-brass">{i.name}</h2>
                <p className="mt-2 text-muted">{i.summary}</p>
              </Link>
            </li>
          ))}
        </ul>
      </Container>
      <CtaBand />
    </>
  );
}
