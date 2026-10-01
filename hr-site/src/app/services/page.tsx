import type { Metadata } from "next";
import { CtaBand, PageHeader, Section } from "@/components/ui";
import { process, services } from "@/lib/site";

export const metadata: Metadata = { title: "Services" };

export default function Services() {
  return (
    <>
      <PageHeader eyebrow="Services" title="Search and hiring services for experienced professionals." intro="From a single confidential CXO search to a multi-location hiring programme, we match the engagement model to the role." />
      <Section>
        <div className="divide-y divide-rule border-y border-rule">
          {services.map((s) => (
            <div key={s.title} className="grid gap-4 py-8 md:grid-cols-[1fr_2fr_auto] md:gap-10">
              <h2 className="text-2xl font-semibold text-navy">{s.title}</h2>
              <p className="leading-relaxed text-muted">{s.body}</p>
              <p className="text-sm font-semibold text-brass md:text-right">{s.band}</p>
            </div>
          ))}
        </div>
      </Section>
      <Section tone="panel">
        <h2 className="text-3xl font-semibold text-navy">Our process</h2>
        <ol className="mt-8 space-y-6">
          {process.map((p) => (
            <li key={p.n} className="grid gap-2 md:grid-cols-[80px_200px_1fr]">
              <span className="font-serif text-2xl text-brass">{p.n}</span>
              <span className="font-semibold text-navy">{p.title}</span>
              <span className="text-muted">{p.body}</span>
            </li>
          ))}
        </ol>
      </Section>
      <CtaBand />
    </>
  );
}
