import Link from "next/link";
import { firm, nav } from "@/lib/site";
import { Container, Placeholder } from "./ui";

export default function SiteFooter() {
  return (
    <footer className="bg-navy-deep text-white/75">
      <Container className="grid gap-10 py-14 sm:grid-cols-3">
        <div>
          <p className="font-serif text-xl text-white">{firm.name}</p>
          <p className="mt-2 text-sm">{firm.tagline}</p>
        </div>
        <div>
          <p className="text-xs font-semibold uppercase tracking-widest text-white">Explore</p>
          <ul className="mt-3 space-y-2 text-sm">
            {nav.map((n) => (
              <li key={n.href}>
                <Link href={n.href} className="hover:text-white">{n.label}</Link>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <p className="text-xs font-semibold uppercase tracking-widest text-white">Contact{firm.contactPlaceholder && <Placeholder />}</p>
          <ul className="mt-3 space-y-2 text-sm">
            <li>{firm.email}</li>
            <li>{firm.phone}</li>
            <li>{firm.address}</li>
          </ul>
        </div>
      </Container>
      <div className="border-t border-white/10">
        <Container className="py-5 text-xs text-white/50">© {new Date().getFullYear()} {firm.name}. All rights reserved.</Container>
      </div>
    </footer>
  );
}
