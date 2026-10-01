import fs from "node:fs";
import path from "node:path";

// Drop real photos into hr-site/public/images/ using the file names below.
// If a file is missing, the page lays itself out without it.
export function hasPhoto(name: string) {
  return fs.existsSync(path.join(process.cwd(), "public", "images", name));
}

export function Photo({ name, alt, className = "" }: { name: string; alt: string; className?: string }) {
  if (!hasPhoto(name)) return null;
  // eslint-disable-next-line @next/next/no-img-element
  return <img src={`/images/${name}`} alt={alt} className={`h-full w-full object-cover ${className}`} />;
}
