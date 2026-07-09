export default function SiteFooter() {
  return (
    <footer className="w-full border-t border-neutral-200 dark:border-neutral-800">
      <div className="mx-auto flex max-w-6xl flex-col gap-2 px-4 py-6 text-xs text-neutral-500 dark:text-neutral-400 sm:px-8">
        <p>
          Net worth = live public stock price × estimated shares held, plus a
          static estimate for private assets. Figures are directional
          estimates for a personal project, not audited valuations, and this
          site is not affiliated with or endorsed by Forbes.
        </p>
        <p>
          Share prices from Yahoo Finance. Portraits from Wikipedia, where
          available.
        </p>
      </div>
    </footer>
  );
}
