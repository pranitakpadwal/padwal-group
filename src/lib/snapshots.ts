import { getDb } from "@/lib/db";
import { billionaires } from "@/data/billionaires";
import { calculateAge } from "@/lib/age";
import type { RankedBillionaire } from "@/lib/net-worth";
import { deriveCategoryView, type Category, type CategoryView } from "@/lib/categories";

interface SnapshotRow {
  person_id: string;
  net_worth_usd: number;
}

export function saveSnapshot(date: string, people: RankedBillionaire[]): void {
  const db = getDb();
  const capturedAt = new Date().toISOString();

  const upsert = db.prepare(`
    INSERT INTO snapshots (snapshot_date, person_id, net_worth_usd, captured_at)
    VALUES (@date, @personId, @netWorth, @capturedAt)
    ON CONFLICT(snapshot_date, person_id) DO UPDATE SET
      net_worth_usd = excluded.net_worth_usd,
      captured_at = excluded.captured_at
  `);

  const upsertAll = db.transaction((rows: RankedBillionaire[]) => {
    for (const person of rows) {
      upsert.run({
        date,
        personId: person.id,
        netWorth: person.netWorthUsd,
        capturedAt,
      });
    }
  });

  upsertAll(people);
}

export function hasSnapshot(date: string): boolean {
  const db = getDb();
  const row = db.prepare(`SELECT 1 FROM snapshots WHERE snapshot_date = ? LIMIT 1`).get(date);
  return Boolean(row);
}

function getSnapshotMap(date: string): Map<string, number> | null {
  const db = getDb();
  const rows = db
    .prepare(`SELECT person_id, net_worth_usd FROM snapshots WHERE snapshot_date = ?`)
    .all(date) as SnapshotRow[];

  if (rows.length === 0) {
    return null;
  }

  return new Map(rows.map((row) => [row.person_id, row.net_worth_usd]));
}

/**
 * Rebuilds a ranked world roster as it stood on a past date, from stored
 * snapshot net-worth figures joined against the (mostly static)
 * biographical data. Historical rows have no live price/day-change —
 * those fields are zeroed out; only netWorthUsd and the resulting rank
 * are meaningful here.
 */
export function hydrateSnapshotPeople(date: string): RankedBillionaire[] | null {
  const netWorthByPersonId = getSnapshotMap(date);
  if (!netWorthByPersonId) {
    return null;
  }

  const asOf = new Date(`${date}T00:00:00Z`);

  const people: RankedBillionaire[] = billionaires
    .filter((person) => netWorthByPersonId.has(person.id))
    .map((person) => ({
      id: person.id,
      name: person.name,
      gender: person.gender,
      age: calculateAge(person.birthDate, asOf),
      country: person.country,
      primarySource: person.primarySource,
      industry: person.industry,
      bio: person.bio,
      photoUrl: null,
      ticker: person.ticker ?? null,
      netWorthUsd: netWorthByPersonId.get(person.id) as number,
      dayChangeUsd: 0,
      dayChangePercent: 0,
      sharePrice: null,
      currency: null,
      marketState: null,
      rank: 0,
    }));

  people.sort((a, b) => b.netWorthUsd - a.netWorthUsd);
  return people.map((person, index) => ({ ...person, rank: index + 1 }));
}

export function hydrateHistoricalCategoryView(
  date: string,
  category: Category,
): CategoryView | null {
  const people = hydrateSnapshotPeople(date);
  if (!people) {
    return null;
  }
  return deriveCategoryView(people, category);
}
