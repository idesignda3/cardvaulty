import { prisma } from "@/lib/prisma";
import { cacheGetJson, cacheSetJson } from "@/lib/cache";
import type { DisplayCurrency } from "@/lib/currency";

const FRANKFURTER = "https://api.frankfurter.dev/v1";
const FX_TTL_SECONDS = 60 * 60 * 24; // refresh at most daily

type FrankfurterLatest = {
  amount: number;
  base: string;
  date: string;
  rates: Record<string, number>;
};

async function fetchFrankfurterRates(
  base: string,
  quotes: string[],
): Promise<{ date: string; rates: Record<string, number> } | null> {
  const to = quotes.join(",");
  const url = `${FRANKFURTER}/latest?from=${encodeURIComponent(base)}&to=${encodeURIComponent(to)}`;
  try {
    const res = await fetch(url, { next: { revalidate: FX_TTL_SECONDS } });
    if (!res.ok) return null;
    const data = (await res.json()) as FrankfurterLatest;
    if (!data?.rates) return null;
    return { date: data.date, rates: data.rates };
  } catch {
    return null;
  }
}

/** Rate to multiply an amount in `from` to get `to`. 1 if same currency. */
export async function getFxRate(
  from: DisplayCurrency | "USD" | "EUR" | "GBP",
  to: DisplayCurrency,
): Promise<number | null> {
  if (from === to) return 1;

  const cacheKey = `fx:${from}:${to}`;
  const cached = await cacheGetJson<{ rate: number; date: string }>(cacheKey);
  if (cached?.rate) return cached.rate;

  // Postgres daily row
  try {
    const today = new Date();
    today.setUTCHours(0, 0, 0, 0);
    const row = await prisma.fxRate.findFirst({
      where: {
        base: from,
        quote: to,
        asOfDate: { gte: new Date(Date.now() - FX_TTL_SECONDS * 1000) },
      },
      orderBy: { asOfDate: "desc" },
    });
    if (row) {
      await cacheSetJson(cacheKey, { rate: row.rate, date: row.asOfDate.toISOString() }, FX_TTL_SECONDS);
      return row.rate;
    }
  } catch {
    /* continue to network */
  }

  const fetched = await fetchFrankfurterRates(from, [to]);
  const rate = fetched?.rates?.[to];
  if (rate == null || !Number.isFinite(rate)) return null;

  await cacheSetJson(cacheKey, { rate, date: fetched!.date }, FX_TTL_SECONDS);
  try {
    const asOfDate = new Date(`${fetched!.date}T00:00:00.000Z`);
    await prisma.fxRate.upsert({
      where: {
        base_quote_asOfDate: { base: from, quote: to, asOfDate },
      },
      create: { base: from, quote: to, rate, asOfDate },
      update: { rate, fetchedAt: new Date() },
    });
  } catch {
    /* ignore persistence errors */
  }
  return rate;
}

/**
 * Convert integer minor units of `fromCurrency` into integer minor units of `to`.
 * Returns null if FX unavailable (never invents a rate).
 */
export async function convertMinorUnits(
  amountMinor: number,
  fromCurrency: "USD" | "EUR" | "GBP",
  to: DisplayCurrency,
): Promise<number | null> {
  const rate = await getFxRate(fromCurrency, to);
  if (rate == null) return null;
  return Math.round(amountMinor * rate);
}
