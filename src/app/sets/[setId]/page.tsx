import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { SignInHint } from "@/components/sign-in-hint";
import { getOptionalUser } from "@/lib/session";
import { prisma } from "@/lib/prisma";
import { getSet, listCardsForSet } from "@/lib/pokemontcg";
import { resolveCardImage } from "@/lib/tcgdex";

export const dynamic = "force-dynamic";

type Props = { params: Promise<{ setId: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { setId } = await params;
  const set = await getSet(setId).catch(() => null);
  return {
    title: set ? set.name : "Set",
    description: set
      ? `${set.name} checklist (${set.series})`
      : "Pokémon TCG set checklist",
  };
}

function norm(s: string | null | undefined): string {
  return (s ?? "").trim().toLowerCase().replace(/\s+/g, " ");
}

export default async function SetDetailPage({ params }: Props) {
  const { setId } = await params;
  const set = await getSet(setId).catch(() => null);
  if (!set) notFound();

  let cards: Awaited<ReturnType<typeof listCardsForSet>> = [];
  let loadError: string | null = null;
  try {
    cards = await listCardsForSet(setId);
  } catch (e) {
    loadError = e instanceof Error ? e.message : "Failed to load cards";
  }

  const user = await getOptionalUser();
  const ownedByTcgId = new Map<string, number>();
  const ownedByKey = new Map<string, number>();

  if (user?.id) {
    const vault = await prisma.vaultCard.findMany({
      where: { userId: user.id },
      select: {
        tcgId: true,
        name: true,
        number: true,
        setName: true,
        quantity: true,
      },
    });
    for (const v of vault) {
      if (v.tcgId) {
        ownedByTcgId.set(
          v.tcgId,
          (ownedByTcgId.get(v.tcgId) ?? 0) + v.quantity,
        );
      }
      const key = `${norm(v.name)}|${norm(v.number)}|${norm(v.setName)}`;
      ownedByKey.set(key, (ownedByKey.get(key) ?? 0) + v.quantity);
    }
  }

  const rows = await Promise.all(
    cards.map(async (c) => {
      const img = await resolveCardImage({
        tcgId: c.id,
        small: c.images?.small,
        large: c.images?.large,
      });
      let owned = ownedByTcgId.get(c.id) ?? 0;
      if (!owned) {
        const key = `${norm(c.name)}|${norm(c.number)}|${norm(c.set.name)}`;
        owned = ownedByKey.get(key) ?? 0;
      }
      return { card: c, img, owned };
    }),
  );

  return (
    <main className="mx-auto w-full max-w-4xl flex-1 px-4 py-10 sm:px-6">
      <p className="text-sm">
        <Link href="/sets" className="underline">
          ← Sets
        </Link>
      </p>
      <h1 className="mt-4 text-2xl font-semibold text-zinc-900 dark:text-zinc-50">
        {set.name}
      </h1>
      <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
        {set.series} · released {set.releaseDate?.replaceAll("/", "-") ?? "—"} ·{" "}
        {set.printedTotal}/{set.total} cards · id {set.id}
      </p>

      {!user && (
        <div className="mt-4">
          <SignInHint message="Sign in to see owned counts from your vault on this checklist." />
        </div>
      )}

      {loadError && (
        <p className="mt-6 rounded border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-800 dark:border-red-900 dark:bg-red-950 dark:text-red-200">
          {loadError}
        </p>
      )}

      <ul className="mt-6 divide-y divide-zinc-100 dark:divide-zinc-800">
        {rows.map(({ card, img, owned }) => (
          <li key={card.id} className="flex gap-3 py-3">
            {img.small ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={img.small}
                alt=""
                width={48}
                height={68}
                className="h-[68px] w-12 shrink-0 rounded border border-zinc-200 object-cover dark:border-zinc-700"
              />
            ) : (
              <div className="flex h-[68px] w-12 shrink-0 items-center justify-center rounded border border-dashed border-zinc-300 text-xs text-zinc-400">
                —
              </div>
            )}
            <div className="min-w-0 flex-1">
              <Link
                href={`/prices/${encodeURIComponent(card.id)}`}
                className="font-medium underline"
              >
                {card.name}
              </Link>
              <p className="text-sm text-zinc-600 dark:text-zinc-400">
                #{card.number}
                {card.rarity ? ` · ${card.rarity}` : ""}
                {user ? ` · owned: ${owned}` : ""}
              </p>
            </div>
          </li>
        ))}
      </ul>
      <p className="mt-4 text-xs text-zinc-500">
        {cards.length} cards in checklist
      </p>
    </main>
  );
}
