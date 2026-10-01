import type { Metadata } from "next";
import { PageHeader, Placeholder, Section } from "@/components/ui";
import { firm } from "@/lib/site";
import ContactForm from "./ContactForm";

export const metadata: Metadata = { title: "Contact" };

export default function Contact() {
  return (
    <>
      <PageHeader eyebrow="Contact" title="Discuss a hiring mandate." intro="Share a few details about the role and we will respond within one business day." />
      <Section>
        <div className="grid gap-14 md:grid-cols-[3fr_2fr]">
          <ContactForm to={firm.email} />
          <div>
            <h2 className="text-xl font-semibold text-navy">Direct contact{firm.contactPlaceholder && <Placeholder />}</h2>
            <dl className="mt-4 space-y-4 text-muted">
              <div><dt className="text-xs font-semibold uppercase tracking-widest text-brass">Email</dt><dd>{firm.email}</dd></div>
              <div><dt className="text-xs font-semibold uppercase tracking-widest text-brass">Phone</dt><dd>{firm.phone}</dd></div>
              <div><dt className="text-xs font-semibold uppercase tracking-widest text-brass">Office</dt><dd>{firm.address}</dd></div>
            </dl>
          </div>
        </div>
      </Section>
    </>
  );
}
