import type { Metadata } from "next";
import { CtaBand, PageHeader, Section } from "@/components/ui";

export const metadata: Metadata = { title: "Government & Public Sector" };

const points = [
  ["Procurement-ready", "We understand tender and empanelment processes, documentation requirements and compliance expectations."],
  ["Transparent process", "Clear selection criteria, documented assessments and audit-friendly records at every stage."],
  ["Specialist talent", "Technology, programme management, finance and policy professionals for departments, PSUs and public bodies."],
  ["Confidentiality", "Careful handling of sensitive appointments and candidate information."],
];

export default function Government() {
  return (
    <>
      <PageHeader eyebrow="Government & public sector" title="Hiring support for government and public bodies." intro="We work with government departments, public sector undertakings and institutions that need experienced professionals through a transparent, well-documented process." />
      <Section>
        <div className="grid gap-px border border-rule bg-rule sm:grid-cols-2">
          {points.map(([t, b]) => (
            <div key={t} className="bg-panel p-7">
              <h2 className="text-xl font-semibold text-navy">{t}</h2>
              <p className="mt-3 leading-relaxed text-muted">{b}</p>
            </div>
          ))}
        </div>
      </Section>
      <CtaBand />
    </>
  );
}
