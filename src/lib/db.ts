import fs from "node:fs";
import path from "node:path";
import Database from "better-sqlite3";

/**
 * Single-instance SQLite persistence for daily snapshots and generated
 * articles. This is intentionally simple (a file on disk, not a managed
 * DB) — fine for one Railway service with a mounted volume, but it will
 * NOT work correctly if you scale this app to multiple instances (each
 * would have its own separate file). Swap for Postgres if you need that.
 *
 * On Railway: add a Volume to this service and set DATABASE_PATH to a
 * file path inside it (e.g. /data/tracker.db), or the DB resets on every
 * deploy/restart. Locally it defaults to ./.data/tracker.db.
 */

declare global {
  var __trackerDb: Database.Database | undefined;
}

function openDatabase(): Database.Database {
  const dbPath = process.env.DATABASE_PATH ?? path.join(process.cwd(), ".data", "tracker.db");
  fs.mkdirSync(path.dirname(dbPath), { recursive: true });

  const db = new Database(dbPath);
  db.pragma("journal_mode = WAL");

  db.exec(`
    CREATE TABLE IF NOT EXISTS snapshots (
      snapshot_date TEXT NOT NULL,
      person_id TEXT NOT NULL,
      net_worth_usd REAL NOT NULL,
      captured_at TEXT NOT NULL,
      PRIMARY KEY (snapshot_date, person_id)
    );

    CREATE TABLE IF NOT EXISTS articles (
      article_date TEXT NOT NULL,
      category TEXT NOT NULL,
      slug TEXT NOT NULL UNIQUE,
      title TEXT NOT NULL,
      summary TEXT NOT NULL,
      facts_json TEXT NOT NULL,
      generated_at TEXT NOT NULL,
      PRIMARY KEY (article_date, category)
    );

    CREATE INDEX IF NOT EXISTS idx_articles_date ON articles (article_date);

    CREATE TABLE IF NOT EXISTS news_articles (
      slug TEXT PRIMARY KEY,
      article_date TEXT NOT NULL,
      person_id TEXT NOT NULL,
      title TEXT NOT NULL,
      summary TEXT NOT NULL,
      facts_json TEXT NOT NULL,
      generated_at TEXT NOT NULL
    );

    CREATE INDEX IF NOT EXISTS idx_news_date ON news_articles (article_date);
    CREATE INDEX IF NOT EXISTS idx_news_person ON news_articles (person_id);

    CREATE TABLE IF NOT EXISTS quote_of_day (
      article_date TEXT PRIMARY KEY,
      slug TEXT NOT NULL UNIQUE,
      person_id TEXT NOT NULL,
      quote_text TEXT NOT NULL,
      quote_source TEXT NOT NULL,
      quote_year INTEGER,
      title TEXT NOT NULL,
      generated_at TEXT NOT NULL
    );
  `);

  return db;
}

export function getDb(): Database.Database {
  if (!globalThis.__trackerDb) {
    globalThis.__trackerDb = openDatabase();
  }
  return globalThis.__trackerDb;
}
