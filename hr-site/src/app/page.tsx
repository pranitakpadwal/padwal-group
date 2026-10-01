import Link from "next/link";
import { Container, Placeholder, Section, SectionTitle } from "@/components/ui";
import { Photo, hasPhoto } from "@/components/Photo";
import QuickEnquiry from "@/components/QuickEnquiry";
import { clients, commitments, firm, process, showClients, stats, testimonials } from "@/lib/site";
import { services } from "@/lib/services";
import { industries } from "@/lib/industries";
import { markets } from "@/lib/markets";
import { articles } from "@/lib/insights";

export default function Home() {
  const hero = hasPhoto("hero.jpg");
  const team = hasPhoto("team.jpg");
  return (
    <>
      <section className="relative overflow-hidden bg-navy-deep text-white">
        {hero && (<div className="absolute inset-0"><Photo name="hero.jpg" alt="" /><div className="absolute inset-0 bg-navy-deep/80" /></div>)}
        <Container className="relative grid gap-10 py-14 sm:py-20 lg:grid-cols-[1.35fr_1fr] lg:items-center">
          <div>
            <h1 className="max-w-2xl text-4xl font-extrabold leading-[1.1] sm:text-[3.4rem]">
              We find leaders for companies that cannot afford a wrong hire.
            </h1>
            <p className="mt-5 max-w-xl text-lg leading-relaxed text-white/80">
              Executive search for technology, business and marketing roles paying ₹10 lakh to ₹5 crore, for clients in India, the USA and Canada, and for government bodies.
            </p>
          </div>
          <div className="grid gap-3">
            <Link href="/contact" className="group bg-white p-6 text-ink hover:bg-paper">
              <span className="text-xs font-bold uppercase tracking-wider text-brass">For companies</span>
              <span className="mt-1 block text-2xl font-bold text-navy">I want to hire</span>
              <span className="mt-1 block text-muted">Tell us about the role. A partner replies within one working day.</span>
              <span className="mt-3 block text-sm font-semibold text-navy group-hover:text-brass">Discuss a hiring mandate →</span>
            </Link>
            <Link href="/candidates" className="group border border-white/40 p-6 hover:bg-white/10">
              <span className="text-xs font-bold uppercase tracking-wider text-[#f0b48f]">For professionals</span>
              <span className="mt-1 block text-2xl font-bold">I am looking for a role</span>
              <span className="mt-1 block text-white/75">Register with us. Free, and your details stay confidential.</span>
              <span className="mt-3 block text-sm font-semibold">Register your profile →</span>
            </Link>
          </div>
        </Container>
      </section>

      <section className="bg-navy text-white">
        <Container className="grid grid-cols-2 gap-y-6 py-7 lg:grid-cols-4">
          {stats.map((s, i) => (
            <div key={s.label} className={`${i % 2 === 1 ? "border-l border-white/25 pl-6" : ""} ${i > 0 ? "lg:border-l lg:border-white/25 lg:pl-6" : ""}`}>
              <p className="text-3xl font-extrabold">{s.value}{s.placeholder && <span className="ml-2 align-middle rounded-sm border border-dashed border-white/60 px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-white/80">Placeholder</span>}</p>
              <p className="mt-0.5 text-sm text-white/75">{s.label}</p>
            </div>
          ))}
        </Container>
      </section>

      <Section>
        <div className={team ? "grid gap-12 lg:grid-cols-2 lg:items-center" : ""}>
          <div>
            <SectionTitle link={{ href: "/services", label: "All services" }}>What we do</SectionTitle>
            <ul className="divide-y divide-rule border-y border-rule">
              {services.map((s, i) => (
                <li key={s.slug}>
                  <Link href={`/services/${s.slug}`} className="flex gap-5 py-4 hover:bg-panel md:px-3">
                    <span className="w-7 shrink-0 text-lg font-bold text-brass">{String(i + 1).padStart(2, "0")}</span>
                    <span>
                      <span className="block text-lg font-bold text-navy">{s.title}</span>
                      <span className="block text-muted">{s.summary}</span>
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          {team && <div className="aspect-[4/3] overflow-hidden"><Photo name="team.jpg" alt={`The ${firm.name} team`} /></div>}
        </div>
      </Section>

      <Section tone="panel">
        <SectionTitle>Why companies hire through us</SectionTitle>
        <div className="grid gap-x-10 gap-y-8 sm:grid-cols-2">
          {commitments.map((c) => (
            <div key={c.h} className="border-l-4 border-navy pl-5">
              <h3 className="text-xl font-bold text-navy">{c.h}</h3>
              <p className="mt-1.5 text-muted">{c.p}</p>
            </div>
          ))}
        </div>
      </Section>

      <Section>
        <SectionTitle link={{ href: "/industries", label: "All industries" }}>Sectors we hire in</SectionTitle>
        <ul className="grid gap-px border border-rule bg-rule sm:grid-cols-2 lg:grid-cols-4">
          {industries.map((i) => (
            <li key={i.slug} className="bg-panel">
              <Link href={`/industries/${i.slug}`} className="block h-full p-5 hover:bg-navy hover:text-white">
                <span className="block font-bold">{i.name}</span>
                <span className="mt-1 block text-sm opacity-70">{i.summary}</span>
              </Link>
            </li>
          ))}
          <li className="bg-panel">
            <Link href="/roles" className="flex h-full items-center p-5 font-bold text-brass hover:bg-navy hover:text-white">Roles and compensation →</Link>
          </li>
        </ul>
      </Section>

      <Section tone="panel">
        <SectionTitle link={{ href: "/about/approach", label: "Our approach" }}>How a search runs</SectionTitle>
        <ol className="grid gap-8 sm:grid-cols-2 lg:grid-cols-5">
          {process.map((p) => (
            <li key={p.n} className="border-t-4 border-navy pt-3">
              <p className="text-sm font-bold text-brass">Step {p.n}</p>
              <h3 className="text-lg font-bold text-navy">{p.title}</h3>
              <p className="mt-1 text-sm text-muted">{p.body.split(". ")[0].replace(/\.$/, "")}.</p>
            </li>
          ))}
        </ol>
      </Section>

      <Section>
        <SectionTitle>What clients say<Placeholder /></SectionTitle>
        <div className="grid gap-6 md:grid-cols-2">
          {testimonials.map((t, i) => (
            <figure key={i} className="border border-rule bg-panel p-7">
              <blockquote className="text-lg leading-8 text-ink">&ldquo;{t.quote}&rdquo;</blockquote>
              <figcaption className="mt-4 text-sm"><span className="font-bold text-navy">{t.name}</span><span className="text-muted">, {t.title}</span></figcaption>
            </figure>
          ))}
        </div>
      </Section>

      <Section tone="panel">
        <SectionTitle>Where we work</SectionTitle>
        <div className="grid gap-8 md:grid-cols-3">
          {markets.slice(0, 3).map((m) => (
            <Link key={m.slug} href={`/markets/${m.slug}`} className="group block">
              <h3 className="text-xl font-bold text-navy group-hover:text-brass">{m.name}</h3>
              <p className="mt-1 text-muted">{m.summary}</p>
            </Link>
          ))}
        </div>
        <p className="mt-8 text-muted">We also work with <Link href="/government" className="font-semibold text-navy underline underline-offset-4">government and public sector</Link> bodies and <Link href="/markets/international" className="font-semibold text-navy underline underline-offset-4">international clients</Link> with India operations.</p>
      </Section>

      {showClients && (
        <Section>
          <SectionTitle link={{ href: "/clients", label: "All clients" }}>Clients<Placeholder /></SectionTitle>
          <div className="grid grid-cols-2 gap-px border border-rule bg-rule sm:grid-cols-4">
            {clients.map((c) => (<div key={c.name} className="flex h-20 items-center justify-center bg-panel px-3 text-center text-lg font-semibold text-muted">{c.name}</div>))}
          </div>
        </Section>
      )}

      <Section tone="panel">
        <SectionTitle link={{ href: "/insights", label: "All insights" }}>From our desk</SectionTitle>
        <div className="grid gap-6 md:grid-cols-3">
          {articles.slice(0, 3).map((a) => (
            <Link key={a.slug} href={`/insights/${a.slug}`} className="group block border-t-4 border-navy bg-paper p-5 hover:bg-white">
              <p className="text-xs font-bold uppercase tracking-wider text-brass">{a.category}</p>
              <h3 className="mt-2 text-lg font-bold text-navy group-hover:text-brass">{a.title}</h3>
              <p className="mt-2 text-sm text-muted">{a.summary}</p>
            </Link>
          ))}
        </div>
      </Section>

      <section className="bg-navy text-white">
        <Container className="py-12">
          <h2 className="text-2xl font-bold sm:text-3xl">Tell us what you are hiring for. We will call you.</h2>
          <p className="mb-6 mt-2 text-white/80">Leave your number and the role. A partner will call within one working day.</p>
          <QuickEnquiry to={firm.email} />
        </Container>
      </section>
    </>
  );
}
