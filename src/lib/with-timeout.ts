/**
 * Bounds an external call so a slow or hanging upstream (e.g. Yahoo Finance)
 * can never block a page response indefinitely. Resolves to `fallback`
 * instead of rejecting, matching this codebase's existing "degrade, don't
 * error" convention for live-data fetches — a page missing a live number is
 * fine; a page that never responds is what shows up in Search Console as a
 * server-connectivity failure.
 */
export async function withTimeout<T>(promise: Promise<T>, ms: number, fallback: T): Promise<T> {
  let timer: ReturnType<typeof setTimeout> | undefined;
  const timeout = new Promise<T>((resolve) => {
    timer = setTimeout(() => resolve(fallback), ms);
  });
  try {
    return await Promise.race([promise, timeout]);
  } finally {
    clearTimeout(timer);
  }
}
