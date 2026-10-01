import type { Metadata } from "next";
import { Container, CtaBand, PageHeader } from "@/components/ui";
import { faqs } from "@/lib/faq";

export const metadata: Metadata = { title: "FAQ" };

export default function Faq() {
  return (
    <>
      <PageHeader crumbs={[{ label: "About", href: "/about" }, { label: "FAQ" }]} title="Frequently asked questions" />
      <Container className="py-12 sm:py-16">
        {faqs.map((g) => (
          <div key={g.group} className="mb-12 max-w-3xl">
            <h2 className="mb-2 border-t-2 border-navy pt-3 text-2xl font-semibold text-navy">{g.group}</h2>
            <div className="divide-y divide-rule border-b border-rule">
              {g.items.map((f) => (
                <details key={f.q} className="group py-4">
                  <summary className="flex cursor-pointer list-none items-center justify-between gap-4 font-medium text-navy">
                    {f.q}<span className="text-brass group-open:rotate-45" aria-hidden>+</span>
                  </summary>
                  <p className="mt-3 leading-7 text-muted">{f.a}</p>
                </details>
              ))}
            </div>
          </div>
        ))}
      </Container>
      <CtaBand title="Still have a question?" text="Write to us and a partner will respond." />
    </>
  );
}
