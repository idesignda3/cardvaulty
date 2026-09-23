import { cacheGetJson, cacheSetJson } from "@/lib/cache";

const TTL = 60 * 60 * 24 * 7;

type TcgdexCard = {
  id: string;
  image?: string;
};

/**
 * Optional image fallback when Pokémon TCG API images are missing.
 * Returns a full image URL (high.webp) or null. Does not invent card data.
 */
export async function tcgdexImageUrl(tcgId: string): Promise<string | null> {
  const cacheKey = `tcgdex:image:${tcgId}`;
  const cached = await cacheGetJson<{ url: string | null }>(cacheKey);
  if (cached) return cached.url;

  try {
    const res = await fetch(
      `https://api.tcgdex.net/v2/en/cards/${encodeURIComponent(tcgId)}`,
      { cache: "no-store" },
    );
    if (!res.ok) {
      await cacheSetJson(cacheKey, { url: null }, TTL);
      return null;
    }
    const data = (await res.json()) as TcgdexCard;
    const url = data.image ? `${data.image}/high.webp` : null;
    await cacheSetJson(cacheKey, { url }, TTL);
    return url;
  } catch {
    return null;
  }
}

export async function resolveCardImage(opts: {
  tcgId: string;
  small?: string | null;
  large?: string | null;
}): Promise<{ small: string | null; large: string | null; source: "pokemontcg" | "tcgdex" | "none" }> {
  if (opts.small || opts.large) {
    return {
      small: opts.small ?? opts.large ?? null,
      large: opts.large ?? opts.small ?? null,
      source: "pokemontcg",
    };
  }
  const fallback = await tcgdexImageUrl(opts.tcgId);
  if (fallback) {
    return { small: fallback, large: fallback, source: "tcgdex" };
  }
  return { small: null, large: null, source: "none" };
}
