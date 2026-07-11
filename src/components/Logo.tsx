import Link from "next/link";

/** Crown mark used in the header and as a standalone badge. */
export function CrownMark({ size = 28 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 32 32"
      aria-hidden
      className="shrink-0"
    >
      <rect width="32" height="32" rx="7" className="fill-brand-dark" />
      <path
        d="M6.5 21.5 L5.4 11.2 A0.9 0.9 0 0 1 6.8 10.4 L11 13.6 L15.2 7.6 A1 1 0 0 1 16.8 7.6 L21 13.6 L25.2 10.4 A0.9 0.9 0 0 1 26.6 11.2 L25.5 21.5 Z"
        fill="#f2c85c"
      />
      <rect x="6.6" y="22.4" width="18.8" height="3.1" rx="1.1" fill="#f2c85c" />
    </svg>
  );
}

export default function Logo() {
  return (
    <Link href="/" className="flex items-center gap-2.5">
      <CrownMark size={30} />
      <span className="font-display text-xl font-semibold tracking-tight text-foreground">
        RealTime<span className="text-brand">Billionaire</span>
      </span>
    </Link>
  );
}
