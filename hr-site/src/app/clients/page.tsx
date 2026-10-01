import type { Metadata } from "next";
import { CtaBand, PageHeader, Placeholder, Section } from "@/components/ui";
import { notFound } from "next/navigation";
import { clients, showClients } from "@/lib/site";

export const metadata: Metadata = { title: "Clients" };

export default function Clients() {
  if (!showClients) notFound();
  return (
    <>
      <PageHeader eyebrow="Clients" title="Organisations that trust us with senior hiring." intro="A selection of clients across technology, financial services, manufacturing, healthcare, energy and the public sector." />
      <Section>
        <p className="mb-6 text-sm text-muted">Logos are placeholders. Replace them with client logos you have permission to display.<Placeholder /></p>
        <div className="grid grid-cols-2 gap-px border border-rule bg-rule sm:grid-cols-3 lg:grid-cols-4">
          {clients.map((c) => (
            <div key={c.name} className="flex h-36 flex-col items-center justify-center gap-1 bg-panel px-3 text-center">
              <span className="font-serif text-xl text-navy">{c.name}</span>
              <span className="text-xs uppercase tracking-wider text-muted">{c.sector} · {c.region}</span>
            </div>
          ))}
        </div>
      </Section>
      <CtaBand />
    </>
  );
}
