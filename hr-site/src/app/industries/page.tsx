import type { Metadata } from "next";
import { CtaBand, PageHeader, Section } from "@/components/ui";
import { functions, sectors } from "@/lib/site";

export const metadata: Metadata = { title: "Industries & Roles" };

export default function Industries() {
  return (
    <>
      <PageHeader eyebrow="Industries & roles" title="The functions and sectors we hire for." intro="We focus on experienced professionals, with compensation ranging from ₹10 lakh to ₹5 crore and above." />
      <Section>
        <div className="grid gap-10 md:grid-cols-3">
          {functions.map((f) => (
            <div key={f.name}>
              <h2 className="border-b border-navy pb-2 text-2xl font-semibold text-navy">{f.name}</h2>
              <ul className="mt-4 space-y-2 text-muted">{f.roles.map((r) => (<li key={r}>{r}</li>))}</ul>
            </div>
          ))}
        </div>
      </Section>
      <Section tone="panel">
        <h2 className="text-3xl font-semibold text-navy">Sectors</h2>
        <ul className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {sectors.map((s) => (<li key={s} className="border border-rule bg-paper px-4 py-3 text-ink">{s}</li>))}
        </ul>
      </Section>
      <CtaBand />
    </>
  );
}
