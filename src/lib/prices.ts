import { convertMinorUnits } from "@/lib/fx";
import type { DisplayCurrency } from "@/lib/currency";
import {
  pickCardmarketEur,
  pickTcgplayerUsd,
  type TcgCard,
} from "@/lib/pokemontcg";

export type DisplayPrice = {
  amountMinor: number;
  currency: DisplayCurrency;
  source: "TCGPlayer (USD→display)" | "Cardmarket (EUR→display)";
  originalLabel: string;
};

/** API fields only. Empty if no figures. Never fabricates market values. */
export async function displayPricesForCard(
  card: TcgCard,
  display: DisplayCurrency,
): Promise<DisplayPrice[]> {
  const out: DisplayPrice[] = [];

  const usd = pickTcgplayerUsd(card);
  if (usd != null) {
    const cents = Math.round(usd * 100);
    const converted = await convertMinorUnits(cents, "USD", display);
    if (converted != null) {
      out.push({
        amountMinor: converted,
        currency: display,
        source: "TCGPlayer (USD→display)",
        originalLabel: `$${usd.toFixed(2)} USD`,
      });
    }
  }

  const eur = pickCardmarketEur(card);
  if (eur != null) {
    const cents = Math.round(eur * 100);
    const converted = await convertMinorUnits(cents, "EUR", display);
    if (converted != null) {
      out.push({
        amountMinor: converted,
        currency: display,
        source: "Cardmarket (EUR→display)",
        originalLabel: `€${eur.toFixed(2)} EUR`,
      });
    }
  }

  return out;
}

export function formatMinor(
  amountMinor: number,
  currency: DisplayCurrency,
): string {
  return new Intl.NumberFormat("en-GB", {
    style: "currency",
    currency,
  }).format(amountMinor / 100);
}
