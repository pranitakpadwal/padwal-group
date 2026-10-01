import Link from "next/link";
import { firm, showClients, showJobs } from "@/lib/site";
import { services } from "@/lib/services";
import { industries } from "@/lib/industries";
import { markets } from "@/lib/markets";
import { Container, Placeholder } from "./ui";

function Col({ title, links }: { title: string; links: { href: string; label: string }[] }) {
  return (
    <div>
      <p className="text-xs font-semibold uppercase tracking-widest text-white">{title}</p>
      <ul className="mt-4 space-y-2 text-sm">
        {links.map((l) => (<li key={l.href}><Link href={l.href} className="hover:text-white">{l.label}</Link></li>))}
      </ul>
    </div>
  );
}

export default function SiteFooter() {
  return (
    <footer className="bg-navy-deep text-white/70">
      <Container className="grid gap-10 py-14 sm:grid-cols-2 lg:grid-cols-5">
        <div className="lg:col-span-1">
          <p className="font-serif text-xl text-white">{firm.name}</p>
          <p className="mt-2 text-sm">{firm.descriptor}</p>
          <div className="mt-5 space-y-1 text-sm">
            <p>{firm.address}{firm.contactPlaceholder && <Placeholder />}</p>
            <p>{firm.phone}</p>
            <p>{firm.email}</p>
            <p className="text-white/50">{firm.hours}</p>
          </div>
        </div>
        <Col title="Services" links={services.map((s) => ({ href: `/services/${s.slug}`, label: s.title }))} />
        <Col title="Industries" links={industries.map((i) => ({ href: `/industries/${i.slug}`, label: i.name.split(" & ")[0].split(",")[0] }))} />
        <Col title="Markets" links={[...markets.map((m) => ({ href: `/markets/${m.slug}`, label: m.name })), { href: "/government", label: "Government" }]} />
        <Col
          title="Company"
          links={[
            { href: "/about", label: "About us" },
            { href: "/about/leadership", label: "Leadership" },
            { href: "/about/approach", label: "Our approach" },
            { href: "/insights", label: "Insights" },
            ...(showClients ? [{ href: "/clients", label: "Clients" }] : []),
            { href: "/candidates", label: "Candidates" },
            ...(showJobs ? [{ href: "/jobs", label: "Open mandates" }] : []),
            { href: "/faq", label: "FAQ" },
            { href: "/contact", label: "Contact" },
          ]}
        />
      </Container>
      <div className="border-t border-white/10">
        <Container className="flex flex-wrap items-center justify-between gap-3 py-5 text-xs text-white/50">
          <span>© {new Date().getFullYear()} {firm.name}. All rights reserved.</span>
          <span className="flex gap-5"><Link href="/privacy" className="hover:text-white">Privacy policy</Link><Link href="/terms" className="hover:text-white">Terms of use</Link></span>
        </Container>
      </div>
    </footer>
  );
}
