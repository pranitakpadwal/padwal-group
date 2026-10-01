import type { Metadata } from "next";
import { CtaBand, PageHeader, Prose, Sidebar, WithSidebar } from "@/components/ui";
import { process } from "@/lib/site";
import { aboutLinks } from "../page";

export const metadata: Metadata = { title: "Our Approach" };

export default function Approach() {
  return (
    <>
      <PageHeader crumbs={[{ label: "About", href: "/about" }, { label: "Our approach" }]} title="Our approach" intro="A structured process, written down and shared with you at the start of every engagement." />
      <WithSidebar aside={<Sidebar title="About" current="/about/approach" links={aboutLinks} />}>
        <Prose>
          <ol className="space-y-8">
            {process.map((p) => (
              <li key={p.n} className="grid gap-2 border-t border-rule pt-5 md:grid-cols-[70px_1fr] md:gap-6">
                <span className="font-serif text-2xl text-brass">{p.n}</span>
                <div>
                  <h2 className="text-xl font-semibold text-navy">{p.title}</h2>
                  <p className="mt-2">{p.body}</p>
                </div>
              </li>
            ))}
          </ol>
          <h2 className="border-t-2 border-navy pt-3 text-2xl font-semibold text-navy">Reporting</h2>
          <p>You receive a written progress update every week, covering people approached, conversations held, feedback from the market and any change we recommend to the brief. Nothing is left for a final presentation.</p>
        </Prose>
      </WithSidebar>
      <CtaBand />
    </>
  );
}
