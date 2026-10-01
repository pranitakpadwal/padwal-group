import type { Metadata } from "next";
import { PageHeader, Placeholder, Container } from "@/components/ui";
import { firm } from "@/lib/site";
import ContactForm from "./ContactForm";

export const metadata: Metadata = { title: "Contact" };

export default function Contact() {
  return (
    <>
      <PageHeader crumbs={[{ label: "Contact" }]} title="Contact us" intro="Tell us about the role or mandate and a partner will respond within one business day." />
      <Container className="grid gap-14 py-12 sm:py-16 md:grid-cols-[3fr_2fr]">
        <ContactForm to={firm.email} />
        <div>
          <h2 className="border-t-2 border-navy pt-3 text-xl font-semibold text-navy">Our office{firm.contactPlaceholder && <Placeholder />}</h2>
          <dl className="mt-5 space-y-5 text-muted">
            <div><dt className="text-xs font-semibold uppercase tracking-widest text-brass">Address</dt><dd>{firm.address}</dd></div>
            <div><dt className="text-xs font-semibold uppercase tracking-widest text-brass">Phone</dt><dd>{firm.phone}</dd></div>
            <div><dt className="text-xs font-semibold uppercase tracking-widest text-brass">Email</dt><dd>{firm.email}</dd></div>
            <div><dt className="text-xs font-semibold uppercase tracking-widest text-brass">Hours</dt><dd>{firm.hours}</dd></div>
          </dl>
        </div>
      </Container>
    </>
  );
}
