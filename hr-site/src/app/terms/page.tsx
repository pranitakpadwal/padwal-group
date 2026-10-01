import type { Metadata } from "next";
import { Container, PageHeader, Placeholder, Prose } from "@/components/ui";
import { firm } from "@/lib/site";

export const metadata: Metadata = { title: "Terms of Use" };

export default function Terms() {
  return (
    <>
      <PageHeader crumbs={[{ label: "Terms of use" }]} title="Terms of use" />
      <Container className="max-w-3xl py-12 sm:py-16">
        <Prose>
          <p className="text-sm text-muted">Draft text for review by your legal adviser before launch.<Placeholder /></p>
          <h2 className="text-xl font-semibold text-navy">Use of this website</h2>
          <p>The content of this website is provided for general information about {firm.name} and its services. It does not constitute advice or an offer of employment.</p>
          <h2 className="text-xl font-semibold text-navy">Intellectual property</h2>
          <p>All content on this website is owned by {firm.name} or its licensors and may not be reproduced without permission.</p>
          <h2 className="text-xl font-semibold text-navy">Limitation of liability</h2>
          <p>We make reasonable efforts to keep the information on this website accurate but do not warrant that it is complete or current.</p>
        </Prose>
      </Container>
    </>
  );
}
