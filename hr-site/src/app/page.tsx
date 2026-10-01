import Link from "next/link";
import { Container, CtaBand, Placeholder, Section, SectionTitle } from "@/components/ui";
import { clients, firm, process, showClients, stats } from "@/lib/site";
import { services } from "@/lib/services";
import { industries } from "@/lib/industries";
import { roles } from "@/lib/roles";
import { markets } from "@/lib/markets";
import { articles } from "@/lib/insights";

export default function Home() {
  return (
    <>
      <section className="bg-navy-deep text-white">
        <Container className="grid gap-12 py-16 sm:py-24 lg:grid-cols-[1.4fr_1fr]">
          <div>
            <h1 className="max-w-2xl text-4xl font-semibold leading-[1.12] sm:text-5xl">
              Senior hiring for technology, business and marketing leaders.
            </h1>
            <p className="mt-6 max-w-xl text-lg leading-relaxed text-white/75">
              {firm.name} is an executive search and talent advisory firm. We work with organisations in India, the USA and Canada, and with government bodies, to hire experienced professionals earning from ₹10 lakh to ₹5 crore.
            </p>
            <div className="mt-9 flex flex-wrap gap-4">
              <Link href="/contact" className="bg-white px-6 py-3 text-sm font-semibold text-navy hover:bg-paper">Discuss a hiring mandate</Link>
              <Link href="/candidates" className="border border-white/40 px-6 py-3 text-sm font-semibold text-white hover:bg-white/10">I am a candidate</Link>
            </div>
          </div>
          <div className="border-l border-white/20 pl-8">
            <p className="text-xs font-semibold uppercase tracking-widest text-[#c9a96a]">Practice areas</p>
            <ul className="mt-4 divide-y divide-white/15">
              {services.slice(0, 4).map((s) => (
                <li key={s.slug}>
                  <Link href={`/services/${s.slug}`} className="flex items-baseline justify-between gap-4 py-3 hover:text-[#c9a96a]">
                    <span>{s.title}</span><span className="text-xs text-white/50">{s.band}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </Container>
      </section>

      <section className="border-b border-rule bg-panel">
        <Container className="grid grid-cols-2 gap-y-6 py-8 lg:grid-cols-4">
          {stats.map((s, i) => (
            <div key={s.label} className={`${i > 0 ? "lg:border-l lg:border-rule lg:pl-6" : ""} ${i % 2 === 1 ? "pl-6 border-l border-rule lg:pl-6" : ""}`}>
              <p className="font-serif text-2xl font-semibold text-navy sm:text-3xl">{s.value}{s.placeholder && <Placeholder />}</p>
              <p className="mt-1 text-sm text-muted">{s.label}</p>
            </div>
          ))}
        </Container>
      </section>

      <Section>
        <SectionTitle link={{ href: "/services", label: "All services" }}>Services</SectionTitle>
        <ul className="divide-y divide-rule border-y border-rule">
          {services.map((s) => (
            <li key={s.slug}>
              <Link href={`/services/${s.slug}`} className="grid gap-2 py-5 hover:bg-panel md:grid-cols-[1fr_2fr_auto] md:gap-8 md:px-3">
                <span className="text-lg font-semibold text-navy">{s.title}</span>
                <span className="text-muted">{s.summary}</span>
                <span className="text-sm text-brass md:text-right">{s.band}</span>
              </Link>
            </li>
          ))}
        </ul>
      </Section>

      <Section tone="panel">
        <div className="grid gap-12 lg:grid-cols-2">
          <div>
            <SectionTitle link={{ href: "/industries", label: "All industries" }}>Industries</SectionTitle>
            <ul className="divide-y divide-rule border-y border-rule">
              {industries.map((i) => (
                <li key={i.slug}><Link href={`/industries/${i.slug}`} className="block py-3 text-ink hover:text-brass">{i.name}</Link></li>
              ))}
            </ul>
          </div>
          <div>
            <SectionTitle link={{ href: "/roles", label: "All roles" }}>Roles and compensation</SectionTitle>
            <table className="w-full text-left text-sm">
              <thead><tr className="border-b border-navy text-xs uppercase tracking-wider text-muted"><th className="py-2 font-semibold">Level</th><th className="py-2 font-semibold">Indicative annual pay</th></tr></thead>
              <tbody className="divide-y divide-rule">
                {roles[0].levels.map((l) => (<tr key={l.level}><td className="py-3 pr-4">{l.level}</td><td className="py-3 font-medium text-navy">{l.band}</td></tr>))}
              </tbody>
            </table>
            <p className="mt-3 text-xs text-muted">Bands shown are for technology roles and vary by function, sector and city.</p>
            <ul className="mt-6 flex flex-wrap gap-x-6 gap-y-2 text-sm">
              {roles.map((r) => (<li key={r.slug}><Link href={`/roles/${r.slug}`} className="font-medium text-navy underline underline-offset-4 hover:text-brass">{r.name}</Link></li>))}
            </ul>
          </div>
        </div>
      </Section>

      <Section>
        <SectionTitle link={{ href: "/about/approach", label: "Our approach" }}>How an engagement works</SectionTitle>
        <ol className="grid gap-x-8 gap-y-8 sm:grid-cols-2 lg:grid-cols-5">
          {process.map((p) => (
            <li key={p.n}>
              <p className="font-serif text-xl text-brass">{p.n}</p>
              <h3 className="mt-1 text-lg font-semibold text-navy">{p.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted">{p.body.split(". ")[0]}.</p>
            </li>
          ))}
        </ol>
      </Section>

      <Section tone="panel">
        <SectionTitle>Where we work</SectionTitle>
        <div className="grid gap-8 md:grid-cols-3">
          {markets.slice(0, 3).map((m) => (
            <Link key={m.slug} href={`/markets/${m.slug}`} className="group block">
              <h3 className="text-xl font-semibold text-navy group-hover:text-brass">{m.name}</h3>
              <p className="mt-2 text-muted">{m.summary}</p>
            </Link>
          ))}
        </div>
        <p className="mt-8 text-muted">We also work with <Link href="/government" className="font-medium text-navy underline underline-offset-4">government and public sector</Link> bodies and <Link href="/markets/international" className="font-medium text-navy underline underline-offset-4">international clients</Link> with India operations.</p>
      </Section>

      <Section>
        <SectionTitle link={{ href: "/insights", label: "All insights" }}>Insights</SectionTitle>
        <ul className="divide-y divide-rule border-y border-rule">
          {articles.slice(0, 3).map((a) => (
            <li key={a.slug}>
              <Link href={`/insights/${a.slug}`} className="grid gap-1 py-5 hover:bg-panel md:grid-cols-[160px_1fr] md:gap-8 md:px-3">
                <span className="text-xs font-semibold uppercase tracking-widest text-brass">{a.category}</span>
                <span><span className="block text-lg font-semibold text-navy">{a.title}</span><span className="text-muted">{a.summary}</span></span>
              </Link>
            </li>
          ))}
        </ul>
      </Section>

      {showClients && (
        <Section tone="panel">
          <SectionTitle link={{ href: "/clients", label: "All clients" }}>Clients<Placeholder /></SectionTitle>
          <div className="grid grid-cols-2 gap-px border border-rule bg-rule sm:grid-cols-4">
            {clients.map((c) => (<div key={c.name} className="flex h-20 items-center justify-center bg-paper px-3 text-center font-serif text-lg text-muted">{c.name}</div>))}
          </div>
        </Section>
      )}

      <CtaBand />
    </>
  );
}
