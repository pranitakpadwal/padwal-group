function initials(name: string): string {
  return name
    .split(" ")
    .map((part) => part[0])
    .filter(Boolean)
    .slice(0, 2)
    .join("")
    .toUpperCase();
}

export default function PersonAvatar({
  name,
  photoUrl,
  size = 36,
}: {
  name: string;
  photoUrl: string | null;
  size?: number;
}) {
  const dimension = `${size}px`;

  if (photoUrl) {
    return (
      // eslint-disable-next-line @next/next/no-img-element -- external Wikipedia CDN, not worth Next/Image config for a side project
      <img
        src={photoUrl}
        alt={name}
        width={size}
        height={size}
        className="shrink-0 rounded-full object-cover"
        style={{ width: dimension, height: dimension }}
      />
    );
  }

  return (
    <span
      className="flex shrink-0 items-center justify-center rounded-full bg-neutral-900 font-semibold text-white dark:bg-neutral-100 dark:text-neutral-900"
      style={{ width: dimension, height: dimension, fontSize: size * 0.4 }}
    >
      {initials(name)}
    </span>
  );
}
