import Link from "next/link";
import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";

export default function ProfileSubpageLayout({
  personName,
  personId,
  sectionLabel,
  children,
}: {
  personName: string;
  personId: string;
  sectionLabel: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-1 flex-col">
      <SiteHeader activeCategory="world" />
      <main className="mx-auto flex w-full max-w-3xl flex-1 flex-col gap-6 px-4 py-8 sm:px-8">
        <nav className="text-sm text-neutral-500 dark:text-neutral-400" aria-label="Breadcrumb">
          <Link href="/" className="hover:underline">
            Home
          </Link>{" "}
          &rsaquo;{" "}
          <Link href={`/billionaire/${personId}`} className="hover:underline">
            {personName}
          </Link>{" "}
          &rsaquo; {sectionLabel}
        </nav>
        {children}
      </main>
      <SiteFooter />
    </div>
  );
}
