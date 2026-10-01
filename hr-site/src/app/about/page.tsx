import type { Metadata } from "next";
import { CtaBand, PageHeader, Placeholder, Prose, Sidebar, WithSidebar } from "@/components/ui";
import { firm, showClients } from "@/lib/site";

export const metadata: Metadata = { title: "About" };

export const aboutLinks = [
  { href: "/about", label: "Overview" },
  { href: "/about/leadership", label: "Leadership" },
  { href: "/about/approach", label: "Our approach" },
  ...(showClients ? [{ href: "/clients", label: "Clients" }] : []),
  { href: "/faq", label: "FAQ" },
];

const values = [
  ["Confidentiality", "Searches and candidate details are handled with discretion at every stage."],
  ["Candour", "We tell clients and candidates what we actually see in the market, including when the answer is unwelcome."],
  ["Depth over volume", "A short, well-assessed shortlist is worth more than a stack of CVs."],
  ["Accountability", "A named partner on every mandate, and regular written progress updates."],
];

export default function About() {
  return (
    <>
      <PageHeader crumbs={[{ label: "About" }]} title={`About ${firm.name}`} intro="An executive search and talent advisory firm focused on experienced technology, business and marketing professionals." />
      <WithSidebar aside={<Sidebar title="About" current="/about" links={aboutLinks} />}>
        <Prose>
          <p className="text-xl leading-9 text-navy">{firm.name} helps organisations hire experienced professionals for roles where a wrong appointment is expensive. We work with private companies, international clients and government bodies.<Placeholder /></p>
          <p>Our work covers compensation levels from ₹10 lakh to ₹5 crore and above, across India, the USA and Canada. We are deliberately selective: a small number of mandates, handled by senior people, with a clear account of progress at every stage.</p>
          <p>Add your founding story here: when and why the firm started, the experience of the founders, and the kind of work you are proudest of. A search firm&apos;s credibility rests on the people behind it, so this page should name them.</p>
          <h2 className="mt-8 border-t-2 border-navy pt-3 text-2xl font-semibold text-navy">What we stand for</h2>
          <div className="divide-y divide-rule border-y border-rule">
            {values.map(([t, b]) => (
              <div key={t} className="grid gap-1 py-4 md:grid-cols-[200px_1fr] md:gap-8">
                <h3 className="font-semibold text-navy">{t}</h3>
                <p className="text-base leading-7 text-muted">{b}</p>
              </div>
            ))}
          </div>
        </Prose>
      </WithSidebar>
      <CtaBand />
    </>
  );
}
