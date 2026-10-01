import type { Metadata } from "next";
import { CtaBand, PageHeader, Section } from "@/components/ui";
import { regions } from "@/lib/site";

export const metadata: Metadata = { title: "Global Reach" };

export default function Global() {
  return (
    <>
      <PageHeader eyebrow="Global" title="Hiring across India, the USA and Canada." intro="We work with domestic clients, international organisations with India operations, and Indian companies expanding abroad." />
      <Section>
        <div className="divide-y divide-rule border-y border-rule">
          {regions.map((r) => (
            <div key={r.name} className="grid gap-3 py-8 md:grid-cols-[1fr_2fr] md:gap-10">
              <h2 className="text-2xl font-semibold text-navy">{r.name}</h2>
              <p className="leading-relaxed text-muted">{r.body}</p>
            </div>
          ))}
        </div>
      </Section>
      <CtaBand />
    </>
  );
}
