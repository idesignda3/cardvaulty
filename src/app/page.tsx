export default function Home() {
  return (
    <div className="flex flex-1 flex-col items-center justify-center bg-zinc-50 px-6 py-24 font-sans dark:bg-zinc-950">
      <main className="mx-auto max-w-2xl text-center">
        <p className="mb-3 text-sm font-medium uppercase tracking-widest text-zinc-500 dark:text-zinc-400">
          Pokémon card vault
        </p>
        <h1 className="text-4xl font-semibold tracking-tight text-zinc-900 dark:text-zinc-50 sm:text-5xl">
          CardVaulty
        </h1>
        <p className="mt-6 text-lg leading-8 text-zinc-600 dark:text-zinc-300">
          This is the self-hosted rebuild. Scan, vault, prices, and wishlist —
          UK-first foundation for running on your own VPS.
        </p>
        <p className="mt-4 text-sm text-zinc-500 dark:text-zinc-400">
          Scaffold only — features come next.
        </p>
      </main>
    </div>
  );
}
