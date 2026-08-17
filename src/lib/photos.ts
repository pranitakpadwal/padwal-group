/**
 * Best-effort portrait lookup via Wikipedia's public REST summary API.
 *
 * This is a pragmatic choice for a side project, not a licensed photo feed:
 * thumbnails come from whatever image the linked Wikipedia article uses,
 * which is usually (but not guaranteed to be) freely licensed on Wikimedia
 * Commons. If you productionize this, swap in a licensed photo API or your
 * own vetted image assets instead.
 */

const CACHE_TTL_MS = 24 * 60 * 60 * 1000; // photos rarely change; cache a day
const cache = new Map<string, { url: string | null; expiresAt: number }>();

// This cache is in-memory and resets on every deploy, and getPhotoUrls fans
// out one request per billionaire with no batching — so right after a
// redeploy, the leaderboard (which every page on the site depends on) was
// waiting on up to ~50 concurrent, unbounded Wikipedia fetches before it
// could resolve. A hung or slow one blocked the whole leaderboard, which
// blocks the whole site — indistinguishable from a dead server to a crawler
// timing out its connection. AbortSignal.timeout bounds each individual
// fetch so that can't happen.
const FETCH_TIMEOUT_MS = 6_000;

async function fetchThumbnail(wikipediaTitle: string): Promise<string | null> {
  const response = await fetch(
    `https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(wikipediaTitle)}`,
    { headers: { accept: "application/json" }, signal: AbortSignal.timeout(FETCH_TIMEOUT_MS) },
  );

  if (!response.ok) {
    return null;
  }

  const data = (await response.json()) as {
    thumbnail?: { source?: string };
  };

  return data.thumbnail?.source ?? null;
}

export async function getPhotoUrl(wikipediaTitle: string): Promise<string | null> {
  const cached = cache.get(wikipediaTitle);
  if (cached && cached.expiresAt > Date.now()) {
    return cached.url;
  }

  let url: string | null;
  try {
    url = await fetchThumbnail(wikipediaTitle);
  } catch {
    url = null;
  }

  cache.set(wikipediaTitle, { url, expiresAt: Date.now() + CACHE_TTL_MS });
  return url;
}

export async function getPhotoUrls(
  wikipediaTitles: string[],
): Promise<Map<string, string | null>> {
  const uniqueTitles = Array.from(new Set(wikipediaTitles));
  const results = await Promise.all(
    uniqueTitles.map(async (title) => [title, await getPhotoUrl(title)] as const),
  );
  return new Map(results);
}
