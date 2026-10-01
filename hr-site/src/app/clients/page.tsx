import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Container, CtaBand, PageHeader, Placeholder } from "@/components/ui";
import { clients, showClients } from "@/lib/site";

export const metadata: Metadata = { title: "Clients" };

export default function Clients() {
  if (!showClients) notFound();
  return (
    <>
      <PageHeader crumbs={[{ label: "About", href: "/about" }, { label: "Clients" }]} title="Clients" intro="Organisations across technology, financial services, manufacturing, healthcare, energy and the public sector." />
      <Container className="py-12 sm:py-16">
        <p className="mb-6 text-sm text-muted">Hold list: replace with real clients you have permission to display.<Placeholder /></p>
        <div className="grid grid-cols-2 gap-px border border-rule bg-rule sm:grid-cols-3 lg:grid-cols-4">
          {clients.map((c) => (
            <div key={c.name} className="flex h-36 flex-col items-center justify-center gap-1 bg-panel px-3 text-center">
              <span className="font-serif text-xl text-navy">{c.name}</span>
              <span className="text-xs uppercase tracking-wider text-muted">{c.sector} · {c.region}</span>
            </div>
          ))}
        </div>
      </Container>
      <CtaBand />
    </>
  );
}
