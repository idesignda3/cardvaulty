import type { Metadata } from "next";
import Link from "next/link";
import { listSets } from "@/lib/pokemontcg";

export const metadata: Metadata = {
  title: "Sets",
  description: "Pokémon TCG set list from the public Pokémon TCG API.",
};

export const dynamic = "force-dynamic";

export default async function SetsPage() {
  let sets: Awaited<ReturnType<typeof listSets>> = [];
  let error: string | null = null;
  try {
    sets = await listSets();
  } catch (e) {
    error = e instanceof Error ? e.message : "Failed to load sets";
  }

  return (
    <main className="mx-auto w-full max-w-4xl flex-1 px-4 py-10 sm:px-6">
      <h1 className="text-2xl font-semibold text-zinc-900 dark:text-zinc-50">Sets</h1>
      <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">
        Data from{" "}
        <a className="underline" href="https://docs.pokemontcg.io/" rel="noreferrer" target="_blank">
          pokemontcg.io
        </a>
        . Cached to respect rate limits.
      </p>

      {error && (
        <p className="mt-6 rounded border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-800 dark:border-red-900 dark:bg-red-950 dark:text-red-200">
          {error}
          {!process.env.POKEMONTCG_API_KEY
            ? " Tip: set POKEMONTCG_API_KEY for higher rate limits."
            : null}
        </p>
      )}

      {!error && (
        <div className="mt-6 overflow-x-auto">
          <table className="w-full border-collapse text-left text-sm">
            <thead>
              <tr className="border-b border-zinc-200 dark:border-zinc-700">
                <th className="py-2 pr-3 font-medium">Set</th>
                <th className="py-2 pr-3 font-medium">Series</th>
                <th className="py-2 pr-3 font-medium">Released</th>
                <th className="py-2 font-medium">Cards</th>
              </tr>
            </thead>
            <tbody>
              {sets.map((s) => (
                <tr key={s.id} className="border-b border-zinc-100 dark:border-zinc-800">
                  <td className="py-2 pr-3">
                    <Link
                      href={`/sets/${encodeURIComponent(s.id)}`}
                      className="underline hover:text-zinc-900 dark:hover:text-zinc-100"
                    >
                      {s.name}
                    </Link>
                    <span className="ml-2 text-xs text-zinc-400">{s.id}</span>
                  </td>
                  <td className="py-2 pr-3 text-zinc-600 dark:text-zinc-400">{s.series}</td>
                  <td className="py-2 pr-3 text-zinc-600 dark:text-zinc-400">
                    {s.releaseDate?.replaceAll("/", "-") ?? "—"}
                  </td>
                  <td className="py-2 text-zinc-600 dark:text-zinc-400">
                    {s.printedTotal}/{s.total}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <p className="mt-3 text-xs text-zinc-500">{sets.length} sets</p>
        </div>
      )}
    </main>
  );
}
