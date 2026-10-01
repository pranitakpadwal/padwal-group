import Link from "next/link";
import { Container } from "@/components/ui";

export default function NotFound() {
  return (
    <Container className="py-24">
      <h1 className="text-4xl font-semibold text-navy">Page not found</h1>
      <p className="mt-4 text-muted">The page you are looking for does not exist or has moved.</p>
      <Link href="/" className="mt-6 inline-block bg-navy px-6 py-3 text-sm font-semibold text-white">Back to home</Link>
    </Container>
  );
}
