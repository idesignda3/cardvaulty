import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { CurrencySwitcher } from "@/components/currency-switcher";
import { SignInHint } from "@/components/sign-in-hint";
import { parseDisplayCurrency } from "@/lib/currency";
import {
  getCard,
  pickCardmarketEur,
  pickTcgplayerUsd,
} from "@/lib/pokemontcg";
import { displayPricesForCard, formatMinor } from "@/lib/prices";
import { getOptionalUser } from "@/lib/session";
import { resolveCardImage } from "@/lib/tcgdex";

export const dynamic = "force-dynamic";

type Props = {
  params: Promise<{ cardId: string }>;
  searchParams: Promise<{ currency?: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { cardId } = await params;
  const card = await getCard(cardId).catch(() => null);
  return {
    title: card ? `${card.name} price` : "Card price",
    description: card
      ? `API price fields for ${card.name} (${card.set.name} #${card.number})`
      : "Pokémon TCG card price detail",
  };
}

export default async function CardPricePage({ params, searchParams }: Props) {
  const { cardId } = await params;
  const sp = await searchParams;
  const currency = parseDisplayCurrency(sp.currency);

  const card = await getCard(cardId).catch(() => null);
  if (!card) notFound();

  const user = await getOptionalUser();
  const img = await resolveCardImage({
    tcgId: card.id,
    small: card.images?.small,
    large: card.images?.large,
  });
  const prices = await displayPricesForCard(card, currency);
  const rawUsd = pickTcgplayerUsd(card);
  const rawEur = pickCardmarketEur(card);

  return (
    <main className="mx-auto w-full max-w-3xl flex-1 px-4 py-10 sm:px-6">
      <p className="text-sm">
        <Link href="/prices" className="underline">
          ← Prices
        </Link>
        {" · "}
        <Link
          href={`/sets/${encodeURIComponent(card.set.id)}`}
          className="underline"
        >
          {card.set.name}
        </Link>
      </p>

      <div className="mt-6 flex flex-col gap-6 sm:flex-row">
        {img.large || img.small ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={(img.large ?? img.small) as string}
            alt=""
            width={245}
            height={342}
            className="h-auto w-40 shrink-0 rounded border border-zinc-200 dark:border-zinc-700"
          />
        ) : (
          <div className="flex h-48 w-40 shrink-0 items-center justify-center rounded border border-dashed border-zinc-300 text-sm text-zinc-400">
            No image
          </div>
        )}

        <div className="min-w-0 flex-1">
          <h1 className="text-2xl font-semibold text-zinc-900 dark:text-zinc-50">
            {card.name}
          </h1>
          <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
            {card.set.name} · #{card.number}
            {card.rarity ? ` · ${card.rarity}` : ""}
            {card.artist ? ` · art ${card.artist}` : ""}
          </p>
          <p className="mt-1 text-xs text-zinc-500">
            id {card.id}
            {img.source === "tcgdex" ? " · image via TCGdex fallback" : null}
          </p>

          <div className="mt-4">
            <CurrencySwitcher
              current={currency}
              basePath={`/prices/${encodeURIComponent(card.id)}`}
            />
          </div>

          <section className="mt-6">
            <h2 className="text-base font-medium">API price fields</h2>
            <p className="mt-1 text-xs text-zinc-500">
              Only values present on the Pokémon TCG API response. Converted
              with Frankfurter (daily cache). Not live quotes; not financial
              advice.
            </p>

            {prices.length === 0 ? (
              <p className="mt-3 text-sm text-zinc-600 dark:text-zinc-400">
                No market price fields on the API for this card
                {rawUsd == null && rawEur == null
                  ? " (TCGPlayer and Cardmarket both empty)."
                  : "."}
              </p>
            ) : (
              <ul className="mt-3 space-y-2 text-sm">
                {prices.map((p) => (
                  <li
                    key={p.source}
                    className="rounded border border-zinc-200 px-3 py-2 dark:border-zinc-700"
                  >
                    <span className="font-medium">
                      {formatMinor(p.amountMinor, p.currency)}
                    </span>
                    <span className="ml-2 text-zinc-500">
                      {p.source} · source {p.originalLabel}
                    </span>
                  </li>
                ))}
              </ul>
            )}

            {(card.tcgplayer?.url || card.cardmarket?.url) && (
              <p className="mt-3 text-xs text-zinc-500">
                Upstream:{" "}
                {card.tcgplayer?.url ? (
                  <a
                    className="underline"
                    href={card.tcgplayer.url}
                    rel="noreferrer"
                    target="_blank"
                  >
                    TCGPlayer
                  </a>
                ) : null}
                {card.tcgplayer?.url && card.cardmarket?.url ? " · " : null}
                {card.cardmarket?.url ? (
                  <a
                    className="underline"
                    href={card.cardmarket.url}
                    rel="noreferrer"
                    target="_blank"
                  >
                    Cardmarket
                  </a>
                ) : null}
              </p>
            )}
          </section>

          {!user && (
            <div className="mt-6">
              <SignInHint message="Sign in to link this card to your vault and track ownership." />
            </div>
          )}
          {user && (
            <p className="mt-6 text-sm">
              <Link href="/vault" className="underline">
                Open vault
              </Link>{" "}
              to add or match this card (tcg id: {card.id}).
            </p>
          )}
        </div>
      </div>
    </main>
  );
}
