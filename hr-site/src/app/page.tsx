import Link from "next/link";
import { ButtonLink, Container, CtaBand, Eyebrow, Placeholder, Section } from "@/components/ui";
import { clients, firm, showClients, functions, process, regions, services, stats } from "@/lib/site";

export default function Home() {
  return (
    <>
      <section className="bg-navy-deep text-white">
        <Container className="py-20 sm:py-28">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#c9a96a]">{firm.descriptor}</p>
          <h1 className="mt-4 max-w-3xl text-4xl font-semibold leading-[1.1] sm:text-6xl">
            Senior hiring for technology, business and marketing leaders.
          </h1>
          <p className="mt-6 max-w-2xl text-lg leading-relaxed text-white/75">
            We help organisations in India, the USA and Canada find and hire experienced professionals, from ₹10 lakh specialist roles to ₹5 crore leadership appointments.
          </p>
          <div className="mt-9 flex flex-wrap gap-4">
            <Link href="/contact" className="bg-white px-6 py-3 text-sm font-semibold text-navy hover:bg-paper">Discuss a hiring mandate</Link>
            <Link href="/services" className="border border-white/40 px-6 py-3 text-sm font-semibold text-white hover:bg-white/10">Our services</Link>
          </div>
        </Container>
      </section>

      <section className="border-b border-rule bg-panel">
        <Container className="grid grid-cols-2 gap-y-8 py-10 lg:grid-cols-4">
          {stats.map((s) => (
            <div key={s.label} className="border-l border-rule pl-5 first:border-l-0 first:pl-0 lg:first:pl-0">
              <p className="font-serif text-3xl font-semibold text-navy">
                {s.value}
                {s.placeholder && <Placeholder />}
              </p>
              <p className="mt-1 text-sm text-muted">{s.label}</p>
            </div>
          ))}
        </Container>
      </section>

      <Section>
        <Eyebrow>What we do</Eyebrow>
        <h2 className="mt-3 max-w-2xl text-3xl font-semibold text-navy sm:text-4xl">Search and hiring services built around the seniority of the role.</h2>
        <div className="mt-10 grid gap-px border border-rule bg-rule sm:grid-cols-2">
          {services.map((s) => (
            <div key={s.title} className="bg-panel p-7">
              <p className="text-xs font-semibold uppercase tracking-widest text-brass">{s.band}</p>
              <h3 className="mt-2 text-xl font-semibold text-navy">{s.title}</h3>
              <p className="mt-3 leading-relaxed text-muted">{s.body}</p>
            </div>
          ))}
        </div>
      </Section>

      <Section tone="panel">
        <Eyebrow>Functions we cover</Eyebrow>
        <h2 className="mt-3 max-w-2xl text-3xl font-semibold text-navy sm:text-4xl">Technology, business and marketing, at every level of experience.</h2>
        <div className="mt-10 grid gap-10 md:grid-cols-3">
          {functions.map((f) => (
            <div key={f.name}>
              <h3 className="border-b border-navy pb-2 text-xl font-semibold text-navy">{f.name}</h3>
              <ul className="mt-4 space-y-2 text-muted">
                {f.roles.map((r) => (<li key={r}>{r}</li>))}
              </ul>
            </div>
          ))}
        </div>
        <div className="mt-10"><ButtonLink href="/industries" variant="outline">View industries and roles</ButtonLink></div>
      </Section>

      <Section>
        <Eyebrow>How an engagement works</Eyebrow>
        <h2 className="mt-3 max-w-2xl text-3xl font-semibold text-navy sm:text-4xl">A structured process, with regular updates.</h2>
        <ol className="mt-10 grid gap-8 sm:grid-cols-2 lg:grid-cols-5">
          {process.map((p) => (
            <li key={p.n} className="border-t-2 border-navy pt-4">
              <p className="font-serif text-2xl text-brass">{p.n}</p>
              <h3 className="mt-1 text-lg font-semibold text-navy">{p.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted">{p.body}</p>
            </li>
          ))}
        </ol>
      </Section>

      <Section tone="panel">
        <Eyebrow>Where we work</Eyebrow>
        <h2 className="mt-3 max-w-2xl text-3xl font-semibold text-navy sm:text-4xl">Clients across India, North America and beyond, including government.</h2>
        <div className="mt-10 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {regions.map((r) => (
            <div key={r.name}>
              <h3 className="text-lg font-semibold text-navy">{r.name}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted">{r.body}</p>
            </div>
          ))}
        </div>
      </Section>

      {showClients && <Section>
        <div className="flex items-end justify-between gap-4">
          <div>
            <Eyebrow>Clients<Placeholder /></Eyebrow>
            <h2 className="mt-3 text-3xl font-semibold text-navy">Organisations we have worked with</h2>
          </div>
          <Link href="/clients" className="hidden text-sm font-semibold text-navy underline underline-offset-4 sm:block">All clients</Link>
        </div>
        <div className="mt-8 grid grid-cols-2 gap-px border border-rule bg-rule sm:grid-cols-4">
          {clients.map((c) => (
            <div key={c.name} className="flex h-24 items-center justify-center bg-panel px-3 text-center font-serif text-lg text-muted">{c.name}</div>
          ))}
        </div>
      </Section>}

      <CtaBand />
    </>
  );
}
