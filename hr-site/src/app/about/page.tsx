import type { Metadata } from "next";
import { CtaBand, PageHeader, Placeholder, Section } from "@/components/ui";
import { firm } from "@/lib/site";

export const metadata: Metadata = { title: "About" };

const principles = [
  ["Confidentiality", "Searches and candidate details are handled with discretion."],
  ["Candour", "We tell clients and candidates what we actually see in the market."],
  ["Depth over volume", "A short, well-assessed shortlist rather than a stack of CVs."],
  ["Accountability", "A named lead on every mandate and regular progress updates."],
];

export default function About() {
  return (
    <>
      <PageHeader eyebrow="About" title={`About ${firm.name}.`} intro="An executive search and talent advisory firm focused on experienced technology, business and marketing professionals." />
      <Section>
        <div className="grid gap-10 md:grid-cols-2">
          <div className="space-y-4 leading-relaxed text-muted">
            <p>{firm.name} helps organisations hire experienced professionals for roles where the cost of a wrong hire is high. We work with private companies, international clients and government bodies.<Placeholder /></p>
            <p>Add your founding story, years of experience and leadership background here. A firm&apos;s credibility rests on the people behind it, so this page should name them.</p>
          </div>
          <div className="grid gap-px border border-rule bg-rule">
            {principles.map(([t, b]) => (
              <div key={t} className="bg-panel p-6">
                <h2 className="text-lg font-semibold text-navy">{t}</h2>
                <p className="mt-1 text-sm text-muted">{b}</p>
              </div>
            ))}
          </div>
        </div>
      </Section>
      <Section tone="panel">
        <h2 className="text-3xl font-semibold text-navy">Leadership<Placeholder /></h2>
        <div className="mt-8 grid gap-6 sm:grid-cols-3">
          {["Founder & Managing Partner", "Partner, Technology", "Partner, Business & Marketing"].map((r) => (
            <div key={r} className="border border-rule bg-paper p-6">
              <div className="mb-4 h-20 w-20 bg-rule" aria-hidden />
              <p className="font-serif text-xl text-navy">Name</p>
              <p className="text-sm text-muted">{r}</p>
            </div>
          ))}
        </div>
      </Section>
      <CtaBand />
    </>
  );
}
