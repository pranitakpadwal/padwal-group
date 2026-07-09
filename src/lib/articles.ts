import { getDb } from "@/lib/db";
import type { Category } from "@/lib/categories";
import type { ArticleFacts } from "@/lib/article-facts";
import type { ArticleText } from "@/lib/article-template";

export interface StoredArticle {
  date: string;
  category: Category;
  slug: string;
  title: string;
  summary: string;
  facts: ArticleFacts;
  generatedAt: string;
}

interface ArticleRow {
  article_date: string;
  category: string;
  slug: string;
  title: string;
  summary: string;
  facts_json: string;
  generated_at: string;
}

function rowToArticle(row: ArticleRow): StoredArticle {
  return {
    date: row.article_date,
    category: row.category as Category,
    slug: row.slug,
    title: row.title,
    summary: row.summary,
    facts: JSON.parse(row.facts_json) as ArticleFacts,
    generatedAt: row.generated_at,
  };
}

export function saveArticle(date: string, category: Category, text: ArticleText, facts: ArticleFacts): StoredArticle {
  const db = getDb();
  const slug = `${date}-${category}-daily-recap`;
  const generatedAt = new Date().toISOString();

  db.prepare(`
    INSERT INTO articles (article_date, category, slug, title, summary, facts_json, generated_at)
    VALUES (@date, @category, @slug, @title, @summary, @factsJson, @generatedAt)
    ON CONFLICT(article_date, category) DO UPDATE SET
      slug = excluded.slug,
      title = excluded.title,
      summary = excluded.summary,
      facts_json = excluded.facts_json,
      generated_at = excluded.generated_at
  `).run({
    date,
    category,
    slug,
    title: text.title,
    summary: text.summary,
    factsJson: JSON.stringify(facts),
    generatedAt,
  });

  return { date, category, slug, title: text.title, summary: text.summary, facts, generatedAt };
}

export function getArticle(date: string, category: Category): StoredArticle | null {
  const db = getDb();
  const row = db
    .prepare(`SELECT * FROM articles WHERE article_date = ? AND category = ?`)
    .get(date, category) as ArticleRow | undefined;
  return row ? rowToArticle(row) : null;
}

export function listArticles(options: { category?: Category; limit?: number; offset?: number } = {}): StoredArticle[] {
  const db = getDb();
  const limit = options.limit ?? 20;
  const offset = options.offset ?? 0;

  const rows = options.category
    ? (db
        .prepare(
          `SELECT * FROM articles WHERE category = ? ORDER BY article_date DESC LIMIT ? OFFSET ?`,
        )
        .all(options.category, limit, offset) as ArticleRow[])
    : (db
        .prepare(`SELECT * FROM articles ORDER BY article_date DESC, category ASC LIMIT ? OFFSET ?`)
        .all(limit, offset) as ArticleRow[]);

  return rows.map(rowToArticle);
}
