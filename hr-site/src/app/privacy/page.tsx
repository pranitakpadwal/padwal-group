import type { Metadata } from "next";
import { Container, PageHeader, Placeholder, Prose } from "@/components/ui";
import { firm } from "@/lib/site";

export const metadata: Metadata = { title: "Privacy Policy" };

export default function Privacy() {
  return (
    <>
      <PageHeader crumbs={[{ label: "Privacy policy" }]} title="Privacy policy" />
      <Container className="max-w-3xl py-12 sm:py-16">
        <Prose>
          <p className="text-sm text-muted">Draft text for review by your legal adviser before launch.<Placeholder /></p>
          <h2 className="text-xl font-semibold text-navy">Information we collect</h2>
          <p>We collect information you give us directly, such as your name, contact details, CV and employment history, and information you provide when you contact us on behalf of an organisation.</p>
          <h2 className="text-xl font-semibold text-navy">How we use it</h2>
          <p>We use candidate information to assess suitability for roles and, with your permission, to share your profile with a client. We use client information to respond to enquiries and to deliver our services.</p>
          <h2 className="text-xl font-semibold text-navy">Sharing</h2>
          <p>We do not sell personal information. We share candidate profiles with clients only with the candidate&apos;s consent, and share information with service providers only where needed to run our business.</p>
          <h2 className="text-xl font-semibold text-navy">Your rights</h2>
          <p>You may ask us to access, correct or delete the personal information we hold about you, and to withdraw your consent. Write to {firm.email}.</p>
        </Prose>
      </Container>
    </>
  );
}
