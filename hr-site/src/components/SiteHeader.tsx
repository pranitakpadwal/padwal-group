import Link from "next/link";
import { firm, showClients, showJobs } from "@/lib/site";
import { services } from "@/lib/services";
import { industries } from "@/lib/industries";
import { roles } from "@/lib/roles";
import { markets } from "@/lib/markets";
import { Container } from "./ui";

type Item = { href: string; label: string };
type Group = { label: string; href: string; items?: Item[] };

export const navGroups: Group[] = [
  { label: "Services", href: "/services", items: services.map((s) => ({ href: `/services/${s.slug}`, label: s.title })) },
  { label: "Industries", href: "/industries", items: industries.map((i) => ({ href: `/industries/${i.slug}`, label: i.name })) },
  { label: "Roles", href: "/roles", items: roles.map((r) => ({ href: `/roles/${r.slug}`, label: r.name })) },
  {
    label: "Markets",
    href: "/markets",
    items: [...markets.map((m) => ({ href: `/markets/${m.slug}`, label: m.name })), { href: "/government", label: "Government & Public Sector" }],
  },
  { label: "Insights", href: "/insights" },
  {
    label: "About",
    href: "/about",
    items: [
      { href: "/about", label: "Overview" },
      { href: "/about/leadership", label: "Leadership" },
      { href: "/about/approach", label: "Our approach" },
      ...(showClients ? [{ href: "/clients", label: "Clients" }] : []),
      { href: "/faq", label: "FAQ" },
    ],
  },
  {
    label: "Candidates",
    href: "/candidates",
    items: [{ href: "/candidates", label: "For candidates" }, ...(showJobs ? [{ href: "/jobs", label: "Open mandates" }] : [])],
  },
];

export default function SiteHeader() {
  return (
    <header className="relative z-30">
      <div className="bg-navy-deep text-xs text-white/75">
        <Container className="flex flex-wrap items-center justify-between gap-x-6 gap-y-1 py-2">
          <span>{firm.tagline}</span>
          <span className="flex gap-5">
            <span>{firm.phone}</span>
            <span className="hidden sm:inline">{firm.email}</span>
          </span>
        </Container>
      </div>

      <div className="border-b border-rule bg-paper">
        <Container className="flex items-center justify-between gap-6 py-4">
          <Link href="/" className="leading-tight">
            <span className="block font-serif text-2xl font-semibold text-navy">{firm.name}</span>
            <span className="block text-[10px] uppercase tracking-[0.22em] text-muted">{firm.descriptor}</span>
          </Link>

          <nav aria-label="Main" className="hidden items-center gap-1 lg:flex">
            {navGroups.map((g) => (
              <div key={g.label} className="group relative">
                <Link href={g.href} className="block px-3 py-2 text-sm text-ink group-hover:text-brass group-focus-within:text-brass">
                  {g.label}
                  {g.items && <span className="ml-1 text-[9px]" aria-hidden>▾</span>}
                </Link>
                {g.items && (
                  <div className="invisible absolute left-0 top-full w-72 border border-rule bg-panel opacity-0 shadow-md group-hover:visible group-hover:opacity-100 group-focus-within:visible group-focus-within:opacity-100">
                    <ul className="py-2">
                      {g.items.map((i) => (
                        <li key={i.href}><Link href={i.href} className="block px-4 py-2 text-sm text-ink hover:bg-paper hover:text-brass">{i.label}</Link></li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            ))}
            <Link href="/contact" className="ml-3 bg-navy px-4 py-2 text-sm font-semibold text-white hover:bg-navy-deep">Contact</Link>
          </nav>

          <details className="group lg:hidden">
            <summary className="cursor-pointer list-none border border-navy px-3 py-2 text-sm font-semibold text-navy">Menu</summary>
            <div className="absolute left-0 right-0 top-full max-h-[75vh] overflow-y-auto border-b border-rule bg-panel shadow-md">
              <Container className="py-4">
                {navGroups.map((g) => (
                  <div key={g.label} className="border-b border-rule py-3">
                    <Link href={g.href} className="font-semibold text-navy">{g.label}</Link>
                    {g.items && (
                      <ul className="mt-2 space-y-1.5 pl-3 text-sm text-muted">
                        {g.items.map((i) => (<li key={i.href}><Link href={i.href}>{i.label}</Link></li>))}
                      </ul>
                    )}
                  </div>
                ))}
                <Link href="/contact" className="mt-4 block bg-navy px-4 py-3 text-center text-sm font-semibold text-white">Contact</Link>
              </Container>
            </div>
          </details>
        </Container>
      </div>
    </header>
  );
}
