import type { Metadata } from "next";
import Link from "next/link";
import { CurrencySwitcher } from "@/components/currency-switcher";
import { parseDisplayCurrency } from "@/lib/currency";
import { recentSets, samplePricedCards } from "@/lib/pokemontcg";
import { displayPricesForCard, formatMinor } from "@/lib/prices";

export const metadata: Metadata = {
  title: "Prices",
  description:
    "Sample Pokémon TCG price estimates from TCGPlayer / Cardmarket via the Pokémon TCG API.",
};

export const dynamic = "force-dynamic";

type Props = { searchParams: Promise<{ currency?: string }> };

export default async function PricesPage({ searchParams }: Props) {
  const sp = await searchParams;
  const currency = parseDisplayCurrency(sp.currency);

  let recent: Awaited<ReturnType<typeof recentSets>> = [];
  let sample: Awaited<ReturnType<typeof samplePricedCards>> = [];
  let error: string | null = null;

  try {
    [recent, sample] = await Promise.all([
      recentSets(8),
      samplePricedCards(12),
    ]);
  } catch (e) {
    error = e instanceof Error ? e.message : "Failed to load price samples";
  }

  const priced = await Promise.all(
    sample.map(async (card) => ({
      card,
      prices: await displayPricesForCard(card, currency),
    })),
  );

  return (
    <main className="mx-auto w-full max-w-4xl flex-1 px-4 py-10 sm:px-6">
      <h1 className="text-2xl font-semibold text-zinc-900 dark:text-zinc-50">
        Prices
      </h1>
      <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">
        Estimates only. Values come from the Pokémon TCG API (TCGPlayer USD
        and/or Cardmarket EUR) and are converted with Frankfurter FX. We never
        invent market prices. GBP is the default display currency.
      </p>
      <div className="mt-3">
        <CurrencySwitcher current={currency} basePath="/prices" />
      </div>

      {error && (
        <p className="mt-6 rounded border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-800 dark:border-red-900 dark:bg-red-950 dark:text-red-200">
          {error}
          {!process.env.POKEMONTCG_API_KEY
            ? " Tip: set POKEMONTCG_API_KEY for higher rate limits."
            : null}
        </p>
      )}

      <section className="mt-10">
        <h2 className="text-lg font-medium text-zinc-900 dark:text-zinc-50">
          Recently released sets
        </h2>
        <ul className="mt-3 list-disc space-y-1 pl-5 text-sm">
          {recent.map((s) => (
            <li key={s.id}>
              <Link
                href={`/sets/${encodeURIComponent(s.id)}`}
                className="underline"
              >
                {s.name}
              </Link>
              <span className="text-zinc-500">
                {" "}
                · {s.releaseDate?.replaceAll("/", "-") ?? "—"} · {s.series}
              </span>
            </li>
          ))}
          {recent.length === 0 && !error && (
            <li className="text-zinc-500">No sets loaded.</li>
          )}
        </ul>
      </section>

      <section className="mt-10">
        <h2 className="text-lg font-medium text-zinc-900 dark:text-zinc-50">
          Sample higher estimates (recent sets)
        </h2>
        <p className="mt-1 text-xs text-zinc-500">
          Sorted by TCGPlayer USD market/mid when the API provides it. Sample
          from recently released sets only — not a complete market ranking.
        </p>
        <div className="mt-4 overflow-x-auto">
          <table className="w-full border-collapse text-left text-sm">
            <thead>
              <tr className="border-b border-zinc-200 dark:border-zinc-700">
                <th className="py-2 pr-3 font-medium">Card</th>
                <th className="py-2 pr-3 font-medium">Set</th>
                <th className="py-2 font-medium">API estimate ({currency})</th>
              </tr>
            </thead>
            <tbody>
              {priced.map(({ card, prices }) => {
                const primary = prices[0];
                return (
                  <tr
                    key={card.id}
                    className="border-b border-zinc-100 dark:border-zinc-800"
                  >
                    <td className="py-2 pr-3">
                      <Link
                        href={`/prices/${encodeURIComponent(card.id)}?currency=${currency}`}
                        className="underline"
                      >
                        {card.name}
                      </Link>
                      <span className="text-zinc-400"> #{card.number}</span>
                    </td>
                    <td className="py-2 pr-3 text-zinc-600 dark:text-zinc-400">
                      {card.set.name}
                    </td>
                    <td className="py-2">
                      {primary ? (
                        <span>
                          {formatMinor(primary.amountMinor, primary.currency)}
                          <span className="ml-2 text-xs text-zinc-500">
                            {primary.source} · was {primary.originalLabel}
                          </span>
                        </span>
                      ) : (
                        <span className="text-zinc-500">No API price</span>
                      )}
                    </td>
                  </tr>
                );
              })}
              {priced.length === 0 && !error && (
                <tr>
                  <td colSpan={3} className="py-3 text-zinc-500">
                    No priced cards in sample.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>
    </main>
  );
}
