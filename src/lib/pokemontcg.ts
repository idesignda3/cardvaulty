import { cacheGetJson, cacheSetJson } from "@/lib/cache";
import { prisma } from "@/lib/prisma";

const API_BASE = "https://api.pokemontcg.io/v2";
const TTL_SETS = 60 * 60 * 12;
const TTL_SET_CARDS = 60 * 60 * 6;
const TTL_CARD = 60 * 60 * 1;

export type TcgSet = {
  id: string;
  name: string;
  series: string;
  printedTotal: number;
  total: number;
  releaseDate: string;
  images?: { symbol?: string; logo?: string };
};

export type TcgPriceVariant = {
  low?: number | null;
  mid?: number | null;
  high?: number | null;
  market?: number | null;
  directLow?: number | null;
};

export type TcgCard = {
  id: string;
  name: string;
  number: string;
  rarity?: string;
  artist?: string;
  set: {
    id: string;
    name: string;
    series?: string;
    releaseDate?: string;
    images?: { symbol?: string; logo?: string };
  };
  images?: { small?: string; large?: string };
  tcgplayer?: {
    url?: string;
    updatedAt?: string;
    prices?: Record<string, TcgPriceVariant | undefined>;
  };
  cardmarket?: {
    url?: string;
    updatedAt?: string;
    prices?: {
      averageSellPrice?: number | null;
      lowPrice?: number | null;
      trendPrice?: number | null;
      avg1?: number | null;
      avg7?: number | null;
      avg30?: number | null;
    };
  };
};

type ListResponse<T> = {
  data: T[];
  page: number;
  pageSize: number;
  count: number;
  totalCount: number;
};

function apiHeaders(): HeadersInit {
  const headers: Record<string, string> = { Accept: "application/json" };
  const key = process.env.POKEMONTCG_API_KEY?.trim();
  if (key) headers["X-Api-Key"] = key;
  return headers;
}

async function sleep(ms: number) {
  await new Promise((r) => setTimeout(r, ms));
}

async function tcgFetch<T>(pathWithQuery: string, attempt = 0): Promise<T> {
  const res = await fetch(`${API_BASE}${pathWithQuery}`, {
    headers: apiHeaders(),
    cache: "no-store",
  });
  if (res.status === 429 && attempt < 3) {
    const retryAfter = Number(res.headers.get("retry-after") ?? "2");
    await sleep(Math.min(10, Math.max(1, retryAfter)) * 1000 * (attempt + 1));
    return tcgFetch<T>(pathWithQuery, attempt + 1);
  }
  if (!res.ok) {
    throw new Error(`Pokémon TCG API ${res.status} for ${pathWithQuery}`);
  }
  return (await res.json()) as T;
}

/** Best available TCGPlayer USD major-unit price. Never invents. */
export function pickTcgplayerUsd(card: TcgCard): number | null {
  const prices = card.tcgplayer?.prices;
  if (!prices) return null;
  const priority = [
    "holofoil",
    "reverseHolofoil",
    "normal",
    "1stEditionHolofoil",
    "1stEditionNormal",
  ];
  for (const key of priority) {
    const v = prices[key];
    const n = v?.market ?? v?.mid ?? null;
    if (n != null && Number.isFinite(n) && n >= 0) return n;
  }
  for (const v of Object.values(prices)) {
    const n = v?.market ?? v?.mid ?? null;
    if (n != null && Number.isFinite(n) && n >= 0) return n;
  }
  return null;
}

/** Cardmarket EUR major-unit trend/avg when present. Never invents. */
export function pickCardmarketEur(card: TcgCard): number | null {
  const p = card.cardmarket?.prices;
  if (!p) return null;
  const n = p.trendPrice ?? p.averageSellPrice ?? p.avg30 ?? null;
  if (n != null && Number.isFinite(n) && n >= 0) return n;
  return null;
}

function dollarsToCents(n: number): number {
  return Math.round(n * 100);
}

async function upsertCardCache(card: TcgCard, ttlSeconds: number): Promise<void> {
  const usd = pickTcgplayerUsd(card);
  const eur = pickCardmarketEur(card);
  const expiresAt = new Date(Date.now() + ttlSeconds * 1000);
  try {
    await prisma.cardCache.upsert({
      where: { tcgId: card.id },
      create: {
        tcgId: card.id,
        name: card.name,
        setId: card.set?.id,
        setName: card.set?.name,
        number: card.number,
        rarity: card.rarity,
        imageSmall: card.images?.small,
        imageLarge: card.images?.large,
        payload: card as object,
        tcgMarketUsdCents: usd != null ? dollarsToCents(usd) : null,
        cmTrendEurCents: eur != null ? dollarsToCents(eur) : null,
        priceUpdatedAt: usd != null || eur != null ? new Date() : null,
        expiresAt,
      },
      update: {
        name: card.name,
        setId: card.set?.id,
        setName: card.set?.name,
        number: card.number,
        rarity: card.rarity,
        imageSmall: card.images?.small,
        imageLarge: card.images?.large,
        payload: card as object,
        tcgMarketUsdCents: usd != null ? dollarsToCents(usd) : null,
        cmTrendEurCents: eur != null ? dollarsToCents(eur) : null,
        priceUpdatedAt: usd != null || eur != null ? new Date() : null,
        fetchedAt: new Date(),
        expiresAt,
      },
    });
  } catch {
    /* ignore if DB unavailable */
  }
}

export async function listSets(): Promise<TcgSet[]> {
  const cacheKey = "pokemontcg:sets:all";
  const cached = await cacheGetJson<TcgSet[]>(cacheKey);
  if (cached?.length) return cached;

  const all: TcgSet[] = [];
  let page = 1;
  for (;;) {
    const data = await tcgFetch<ListResponse<TcgSet>>(
      `/sets?page=${page}&pageSize=250&orderBy=-releaseDate`,
    );
    all.push(...data.data);
    if (all.length >= data.totalCount || data.data.length === 0) break;
    page += 1;
    if (page > 20) break;
  }

  await cacheSetJson(cacheKey, all, TTL_SETS);
  return all;
}

export async function getSet(setId: string): Promise<TcgSet | null> {
  const sets = await listSets();
  return sets.find((s) => s.id === setId) ?? null;
}

export async function listCardsForSet(setId: string): Promise<TcgCard[]> {
  const cacheKey = `pokemontcg:set-cards:${setId}`;
  const cached = await cacheGetJson<TcgCard[]>(cacheKey);
  if (cached?.length) return cached;

  const all: TcgCard[] = [];
  let page = 1;
  for (;;) {
    const q = encodeURIComponent(`set.id:${setId}`);
    const data = await tcgFetch<ListResponse<TcgCard>>(
      `/cards?q=${q}&page=${page}&pageSize=250&orderBy=number`,
    );
    all.push(...data.data);
    if (all.length >= data.totalCount || data.data.length === 0) break;
    page += 1;
    if (page > 40) break;
  }

  await cacheSetJson(cacheKey, all, TTL_SET_CARDS);
  await Promise.all(all.map((c) => upsertCardCache(c, TTL_SET_CARDS)));
  return all;
}

export async function getCard(cardId: string): Promise<TcgCard | null> {
  const cacheKey = `pokemontcg:card:${cardId}`;
  const cached = await cacheGetJson<TcgCard>(cacheKey);
  if (cached?.id) return cached;

  try {
    const row = await prisma.cardCache.findUnique({ where: { tcgId: cardId } });
    if (row && row.expiresAt.getTime() > Date.now()) {
      return row.payload as unknown as TcgCard;
    }
  } catch {
    /* continue */
  }

  try {
    const data = await tcgFetch<{ data: TcgCard }>(
      `/cards/${encodeURIComponent(cardId)}`,
    );
    await cacheSetJson(cacheKey, data.data, TTL_CARD);
    await upsertCardCache(data.data, TTL_CARD);
    return data.data;
  } catch {
    return null;
  }
}

export async function recentSets(limit = 8): Promise<TcgSet[]> {
  const sets = await listSets();
  return sets.slice(0, limit);
}

/**
 * Sample of API-priced cards from recent sets.
 * Sorted by TCGPlayer USD when present — labelled as a sample, not a full market board.
 */
export async function samplePricedCards(limit = 12): Promise<TcgCard[]> {
  const cacheKey = `pokemontcg:sample-priced:${limit}`;
  const cached = await cacheGetJson<TcgCard[]>(cacheKey);
  if (cached?.length) return cached;

  const sets = await recentSets(3);
  const collected: TcgCard[] = [];
  for (const set of sets) {
    const cards = await listCardsForSet(set.id);
    for (const c of cards) {
      if (pickTcgplayerUsd(c) != null || pickCardmarketEur(c) != null) {
        collected.push(c);
      }
    }
    if (collected.length >= limit * 3) break;
  }

  collected.sort(
    (a, b) => (pickTcgplayerUsd(b) ?? 0) - (pickTcgplayerUsd(a) ?? 0),
  );
  const top = collected.slice(0, limit);
  await cacheSetJson(cacheKey, top, TTL_SET_CARDS);
  return top;
}
