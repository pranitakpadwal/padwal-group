import { timingSafeEqual } from "node:crypto";
import { NextResponse, type NextRequest } from "next/server";
import { generateAllTodayArticles } from "@/lib/generate-article";

export const dynamic = "force-dynamic";

function isAuthorized(request: NextRequest): boolean {
  const expected = process.env.CRON_SECRET;
  if (!expected) {
    // No secret configured — refuse rather than silently running unprotected.
    return false;
  }

  const provided = request.headers.get("x-cron-secret") ?? "";
  const expectedBuffer = Buffer.from(expected);
  const providedBuffer = Buffer.from(provided);

  return (
    expectedBuffer.length === providedBuffer.length &&
    timingSafeEqual(expectedBuffer, providedBuffer)
  );
}

/**
 * Triggered by an external scheduler (e.g. a Railway Cron Job service)
 * once a day, ideally after US markets close. Snapshots today's net
 * worth for every tracked person and (re)generates the four daily recap
 * articles from it. Safe to call more than once a day — each call
 * overwrites that day's snapshot/articles with the latest figures.
 */
export async function POST(request: NextRequest) {
  if (!isAuthorized(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const articles = await generateAllTodayArticles();
    return NextResponse.json({
      ok: true,
      generated: articles.map((article) => ({ date: article.date, category: article.category })),
    });
  } catch (error) {
    return NextResponse.json(
      {
        error: "Failed to generate daily articles.",
        message: error instanceof Error ? error.message : String(error),
      },
      { status: 500 },
    );
  }
}
