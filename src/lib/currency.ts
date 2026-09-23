export const DISPLAY_CURRENCIES = ["GBP", "EUR", "USD"] as const;
export type DisplayCurrency = (typeof DISPLAY_CURRENCIES)[number];

export function parseDisplayCurrency(
  value: string | string[] | undefined,
): DisplayCurrency {
  const raw = Array.isArray(value) ? value[0] : value;
  const upper = (raw ?? "GBP").toUpperCase();
  if (upper === "EUR" || upper === "USD" || upper === "GBP") return upper;
  return "GBP";
}

export function currencySymbol(code: DisplayCurrency): string {
  if (code === "EUR") return "€";
  if (code === "USD") return "$";
  return "£";
}
