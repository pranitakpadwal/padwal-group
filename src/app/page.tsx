import Leaderboard from "@/components/Leaderboard";
import { getLeaderboard } from "@/lib/net-worth";

export const dynamic = "force-dynamic";

export default async function Home() {
  const initialData = await getLeaderboard();

  return (
    <div className="flex flex-1 flex-col items-center bg-zinc-50 px-4 py-12 font-sans dark:bg-black sm:px-8">
      <main className="flex w-full max-w-4xl flex-col items-center gap-6">
        <header className="flex flex-col items-center gap-2 text-center">
          <h1 className="text-3xl font-bold tracking-tight text-black dark:text-zinc-50 sm:text-4xl">
            Real-Time Billionaires
          </h1>
          <p className="max-w-xl text-sm text-zinc-600 dark:text-zinc-400">
            Net worth estimated from live public stock prices for each
            person&apos;s primary holding, plus a static estimate for private
            assets. Not affiliated with Forbes &mdash; figures are
            directional approximations, not audited valuations.
          </p>
        </header>
        <Leaderboard initialData={initialData} />
      </main>
    </div>
  );
}
