import Link from "next/link";
import type { RankedBillionaire } from "@/lib/net-worth";
import { CATEGORIES, categoryLabel, type Category } from "@/lib/categories";
import { formatPercentChange, formatUsdChange, formatUsdCompact } from "@/lib/format";
import PersonAvatar from "@/components/PersonAvatar";

const HREF_BY_CATEGORY: Record<Category, string> = {
  world: "/",
  india: "/india",
  women: "/women",
  young: "/young",
};

function QuickStats({ people }: { people: RankedBillionaire[] }) {
  const totalNetWorth = people.reduce((sum, person) => sum + person.netWorthUsd, 0);
  const averageAge = people.length
    ? Math.round(people.reduce((sum, person) => sum + person.age, 0) / people.length)
    : 0;

  return (
    <div className="rounded-xl border border-neutral-200 p-4 dark:border-neutral-800">
      <h2 className="mb-3 text-xs font-semibold uppercase tracking-wide text-neutral-500 dark:text-neutral-400">
        Quick Stats
      </h2>
      <dl className="flex flex-col gap-2 text-sm">
        <div className="flex justify-between">
          <dt className="text-neutral-500 dark:text-neutral-400">People tracked</dt>
          <dd className="font-semibold tabular-nums">{people.length}</dd>
        </div>
        <div className="flex justify-between">
          <dt className="text-neutral-500 dark:text-neutral-400">Combined net worth</dt>
          <dd className="font-semibold tabular-nums">{formatUsdCompact(totalNetWorth)}</dd>
        </div>
        <div className="flex justify-between">
          <dt className="text-neutral-500 dark:text-neutral-400">Average age</dt>
          <dd className="font-semibold tabular-nums">{averageAge}</dd>
        </div>
      </dl>
    </div>
  );
}

function TopMover({ person }: { person: RankedBillionaire }) {
  const isUp = person.dayChangeUsd > 0;
  const color = isUp ? "text-emerald-500" : "text-rose-500";

  return (
    <div className="rounded-xl border border-neutral-200 p-4 dark:border-neutral-800">
      <h2 className="mb-3 text-xs font-semibold uppercase tracking-wide text-neutral-500 dark:text-neutral-400">
        Today&apos;s Top Mover
      </h2>
      <Link href={`/billionaire/${person.id}`} className="flex items-center gap-3">
        <PersonAvatar name={person.name} photoUrl={person.photoUrl} size={44} />
        <div>
          <div className="text-sm font-medium hover:underline">{person.name}</div>
          <div className={`text-sm font-semibold tabular-nums ${color}`}>
            {formatUsdChange(person.dayChangeUsd)}{" "}
            <span className="font-normal">{formatPercentChange(person.dayChangePercent)}</span>
          </div>
        </div>
      </Link>
    </div>
  );
}

function RelatedLists({ active }: { active: Category }) {
  return (
    <div className="rounded-xl border border-neutral-200 p-4 dark:border-neutral-800">
      <h2 className="mb-3 text-xs font-semibold uppercase tracking-wide text-neutral-500 dark:text-neutral-400">
        Related Lists
      </h2>
      <ul className="flex flex-col gap-2 text-sm">
        {CATEGORIES.filter((category) => category !== active).map((category) => (
          <li key={category}>
            <Link href={HREF_BY_CATEGORY[category]} className="hover:underline">
              {categoryLabel(category)}&apos;s Billionaires &rarr;
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default function Sidebar({
  people,
  topGainers,
  activeCategory,
}: {
  people: RankedBillionaire[];
  topGainers: RankedBillionaire[];
  activeCategory: Category;
}) {
  return (
    <aside className="flex w-full flex-col gap-4 lg:sticky lg:top-6 lg:w-[300px] lg:shrink-0">
      <QuickStats people={people} />
      {topGainers[0] && <TopMover person={topGainers[0]} />}
      <RelatedLists active={activeCategory} />
    </aside>
  );
}
