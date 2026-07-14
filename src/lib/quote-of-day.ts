import { getDb } from "@/lib/db";
import { findBillionaireById } from "@/lib/net-worth";
import { personQuotes, type PersonQuote } from "@/data/quotes";
import { slugifyTitle } from "@/lib/schema";
import { todayDateString } from "@/lib/dates";

/**
 * Daily "Quote of the Day" — the Economic Times pattern: one quote, one
 * person, a dated URL with the full quote text baked into the slug, fresh
 * every day. Unlike the /quotes hub (a static evergreen page), this is
 * meant to be generated once per day and posted.
 *
 * Once a date's pick is made, it's stored verbatim in SQLite — so even as
 * the quote bank grows, already-published URLs and their content never
 * drift. The daily cron calls ensureQuoteOfDay(today) alongside the news
 * and recap generation.
 */

export interface QuoteOfDay {
  date: string;
  slug: string;
  personId: string;
  personName: string;
  quoteText: string;
  quoteSource: string;
  quoteYear: number | null;
  title: string;
  generatedAt: string;
}

interface FlatQuote {
  personId: string;
  quote: PersonQuote;
}

/** Every verified quote, in a fixed, stable order (data-file order — grows only by appending). */
function flattenQuoteBank(): FlatQuote[] {
  const flat: FlatQuote[] = [];
  for (const [personId, quotes] of Object.entries(personQuotes)) {
    for (const quote of quotes) {
      flat.push({ personId, quote });
    }
  }
  return flat;
}

/** Simple deterministic string hash — same date always picks the same index for a given bank size. */
function hashToIndex(input: string, modulus: number): number {
  let hash = 0;
  for (let i = 0; i < input.length; i++) {
    hash = (hash * 31 + input.charCodeAt(i)) >>> 0;
  }
  return hash % modulus;
}

function buildTitle(personName: string, quoteText: string): string {
  return `Motivational Quote of the Day by ${personName}: "${quoteText}" — Inspiring Words to Start Your Day`;
}

function buildSlug(personName: string, quoteText: string, date: string): string {
  const base = slugifyTitle(
    `motivational quote of the day by ${personName} ${quoteText} inspiring words to start your day`,
  );
  return `${base}-${date}`;
}

interface QuoteOfDayRow {
  article_date: string;
  slug: string;
  person_id: string;
  quote_text: string;
  quote_source: string;
  quote_year: number | null;
  title: string;
  generated_at: string;
}

function rowToQuoteOfDay(row: QuoteOfDayRow): QuoteOfDay {
  const person = findBillionaireById(row.person_id);
  return {
    date: row.article_date,
    slug: row.slug,
    personId: row.person_id,
    personName: person?.name ?? row.person_id,
    quoteText: row.quote_text,
    quoteSource: row.quote_source,
    quoteYear: row.quote_year,
    title: row.title,
    generatedAt: row.generated_at,
  };
}

/** Generates (if needed) and returns the quote of the day for a given date. */
export function ensureQuoteOfDay(date: string): QuoteOfDay {
  const db = getDb();
  const existing = db
    .prepare(`SELECT * FROM quote_of_day WHERE article_date = ?`)
    .get(date) as QuoteOfDayRow | undefined;
  if (existing) {
    return rowToQuoteOfDay(existing);
  }

  const bank = flattenQuoteBank();
  const index = hashToIndex(date, bank.length);
  const { personId, quote } = bank[index];
  const person = findBillionaireById(personId);
  const personName = person?.name ?? personId;

  const title = buildTitle(personName, quote.text);
  const slug = buildSlug(personName, quote.text, date);
  const generatedAt = new Date().toISOString();

  db.prepare(
    `INSERT INTO quote_of_day (article_date, slug, person_id, quote_text, quote_source, quote_year, title, generated_at)
     VALUES (@date, @slug, @personId, @quoteText, @quoteSource, @quoteYear, @title, @generatedAt)
     ON CONFLICT(article_date) DO NOTHING`,
  ).run({
    date,
    slug,
    personId,
    quoteText: quote.text,
    quoteSource: quote.source,
    quoteYear: quote.year ?? null,
    title,
    generatedAt,
  });

  return {
    date,
    slug,
    personId,
    personName,
    quoteText: quote.text,
    quoteSource: quote.source,
    quoteYear: quote.year ?? null,
    title,
    generatedAt,
  };
}

export function getQuoteOfDayBySlug(slug: string): QuoteOfDay | null {
  const db = getDb();
  const row = db.prepare(`SELECT * FROM quote_of_day WHERE slug = ?`).get(slug) as
    | QuoteOfDayRow
    | undefined;
  return row ? rowToQuoteOfDay(row) : null;
}

export function listQuoteOfDay(limit = 30): QuoteOfDay[] {
  const db = getDb();
  const rows = db
    .prepare(`SELECT * FROM quote_of_day ORDER BY article_date DESC LIMIT ?`)
    .all(limit) as QuoteOfDayRow[];
  return rows.map(rowToQuoteOfDay);
}

/** Ensures today's pick exists and returns the recent history for the index page. */
export function ensureAndListQuoteOfDay(limit = 30): QuoteOfDay[] {
  ensureQuoteOfDay(todayDateString());
  return listQuoteOfDay(limit);
}
