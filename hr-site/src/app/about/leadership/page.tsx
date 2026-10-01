import type { Metadata } from "next";
import { CtaBand, PageHeader, Placeholder, Sidebar, WithSidebar } from "@/components/ui";
import { aboutLinks } from "../page";

export const metadata: Metadata = { title: "Leadership" };

const people = [
  { role: "Founder & Managing Partner", focus: "Executive search, client relationships" },
  { role: "Partner, Technology", focus: "Technology and product leadership searches" },
  { role: "Partner, Business & Marketing", focus: "General management, sales and marketing searches" },
  { role: "Head, Government & Public Sector", focus: "Public-sector engagements and tenders" },
];

export default function Leadership() {
  return (
    <>
      <PageHeader crumbs={[{ label: "About", href: "/about" }, { label: "Leadership" }]} title="Leadership" intro="The partners who lead our searches and advise our clients." />
      <WithSidebar aside={<Sidebar title="About" current="/about/leadership" links={aboutLinks} />}>
        <p className="mb-6 text-sm text-muted">Names, photographs and biographies to be added.<Placeholder /></p>
        <div className="grid gap-px border border-rule bg-rule sm:grid-cols-2">
          {people.map((p) => (
            <div key={p.role} className="bg-panel p-6">
              <div className="mb-4 h-28 w-24 bg-rule" aria-hidden />
              <h2 className="font-serif text-xl text-navy">Full Name</h2>
              <p className="text-sm font-medium text-brass">{p.role}</p>
              <p className="mt-2 text-sm text-muted">{p.focus}. Add a short biography covering previous roles, education and sectors of experience.</p>
            </div>
          ))}
        </div>
      </WithSidebar>
      <CtaBand />
    </>
  );
}
