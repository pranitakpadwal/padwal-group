import type { Metadata } from "next";
import Link from "next/link";
import { BulletList, CtaBand, PageHeader, Prose, Sidebar, WithSidebar } from "@/components/ui";
import { firm, showJobs } from "@/lib/site";

export const metadata: Metadata = { title: "For Candidates" };

export default function Candidates() {
  const links = [{ href: "/candidates", label: "For candidates" }, ...(showJobs ? [{ href: "/jobs", label: "Open mandates" }] : []), { href: "/faq", label: "FAQ" }];
  return (
    <>
      <PageHeader crumbs={[{ label: "Candidates" }]} title="For candidates" intro="We work with experienced professionals in technology, business and marketing. Registering with us is free and confidential." />
      <WithSidebar aside={<Sidebar title="Candidates" current="/candidates" links={links} />}>
        <Prose>
          <p className="text-xl leading-9 text-navy">Most of the roles we work on are never advertised. If you are open to hearing about senior opportunities, we would like to know your background.</p>
          <h2 className="mt-8 border-t-2 border-navy pt-3 text-2xl font-semibold text-navy">What to expect</h2>
          <BulletList items={[
            "A conversation with a consultant, not an automated screening",
            "Your profile shared with a client only with your explicit permission",
            "Honest feedback after interviews",
            "Support on offer negotiation and notice-period planning",
            "No fee to you, at any stage",
          ]} />
          <h2 className="mt-8 border-t-2 border-navy pt-3 text-2xl font-semibold text-navy">How to register</h2>
          <p>Email your CV to <a className="font-medium text-navy underline underline-offset-4" href={`mailto:${firm.email}?subject=Candidate%20registration`}>{firm.email}</a> with your current role, location, notice period and the kind of role you are looking for. {showJobs && <>You can also look at our <Link href="/jobs" className="font-medium text-navy underline underline-offset-4">open mandates</Link>.</>}</p>
          <p className="text-base text-muted">Please see our <Link href="/privacy" className="underline underline-offset-4">privacy policy</Link> for how we handle your information.</p>
        </Prose>
      </WithSidebar>
      <CtaBand title="Hiring rather than looking?" text="If you are a hiring leader, tell us about your requirement." />
    </>
  );
}
