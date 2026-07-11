"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { formatUsdCompact } from "@/lib/format";

export interface AgePerson {
  id: string;
  name: string;
  birthYear: number;
  currentAge: number;
  netWorthUsd: number | null;
  timeline: { year: string; title: string; description: string }[];
}

export default function BillionaireByAge({ people }: { people: AgePerson[] }) {
  const [personId, setPersonId] = useState(people[0]?.id ?? "");
  const [age, setAge] = useState(30);

  const person = useMemo(
    () => people.find((p) => p.id === personId) ?? people[0],
    [people, personId],
  );

  if (!person) {
    return null;
  }

  const milestones = person.timeline
    .map((entry) => ({ ...entry, atAge: Number(entry.year) - person.birthYear }))
    .filter((entry) => Number.isFinite(entry.atAge));
  const byAge = milestones.filter((entry) => entry.atAge <= age);
  const nextUp = milestones.find((entry) => entry.atAge > age);

  return (
    <div className="flex flex-col gap-6">
      <div className="grid grid-cols-1 gap-4 rounded-2xl border border-line bg-surface p-6 sm:grid-cols-2">
        <label className="flex flex-col gap-1.5 text-sm">
          <span className="font-medium text-foreground">Billionaire</span>
          <select
            value={person.id}
            onChange={(event) => setPersonId(event.target.value)}
            className="rounded-lg border border-line bg-background px-3 py-2 text-foreground outline-none focus:border-brand"
          >
            {people.map((p) => (
              <option key={p.id} value={p.id}>
                {p.name}
              </option>
            ))}
          </select>
        </label>
        <label className="flex flex-col gap-1.5 text-sm">
          <span className="font-medium text-foreground">
            At age <span className="tabular-nums text-brand-dark">{age}</span>
          </span>
          <input
            type="range"
            min={10}
            max={90}
            value={age}
            onChange={(event) => setAge(Number(event.target.value))}
            className="accent-[--brand]"
          />
        </label>
      </div>

      <div className="rounded-2xl border border-line bg-surface p-6">
        <h2 className="font-display text-lg font-semibold text-foreground">
          What {person.name} had done by age {age}
        </h2>
        {byAge.length === 0 ? (
          <p className="mt-3 text-sm text-foreground/70">
            Nothing on the public record yet — at {age},{" "}
            {person.name.split(" ")[0]}&apos;s first documented milestone
            {nextUp ? ` (${nextUp.title.toLowerCase()}) was still ${nextUp.atAge - age} years away` : " hadn't happened yet"}
            . Plenty of time.
          </p>
        ) : (
          <ul className="mt-4 flex flex-col gap-3">
            {byAge.map((entry, index) => (
              <li key={index} className="flex gap-3 text-sm">
                <span className="w-16 shrink-0 font-display font-semibold tabular-nums text-brand-dark">
                  Age {entry.atAge}
                </span>
                <span>
                  <span className="font-medium text-foreground">{entry.title}</span>{" "}
                  <span className="text-foreground/70">— {entry.description}</span>
                </span>
              </li>
            ))}
          </ul>
        )}
        {nextUp && byAge.length > 0 && (
          <p className="mt-4 border-t border-line pt-3 text-xs text-foreground/60">
            Next milestone: {nextUp.title}, at age {nextUp.atAge}.
          </p>
        )}
        <p className="mt-4 border-t border-line pt-3 text-sm text-foreground/70">
          Today, at {person.currentAge},{" "}
          <Link href={`/billionaire/${person.id}`} className="font-medium text-brand hover:underline">
            {person.name}
          </Link>{" "}
          {person.netWorthUsd
            ? `is worth an estimated ${formatUsdCompact(person.netWorthUsd)}.`
            : "ranks among the world's richest people."}
        </p>
      </div>
    </div>
  );
}
