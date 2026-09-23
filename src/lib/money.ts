/** Format integer pence as GBP (e.g. 18250 → "£182.50"). */
export function formatPence(pence: number | null | undefined): string {
  if (pence == null || Number.isNaN(pence)) return "—";
  const pounds = pence / 100;
  return new Intl.NumberFormat("en-GB", {
    style: "currency",
    currency: "GBP",
  }).format(pounds);
}

/** Parse a pounds string or number into integer pence. Returns null if empty/invalid. */
export function parsePoundsToPence(input: FormDataEntryValue | null): number | null {
  if (input == null) return null;
  const raw = String(input).trim();
  if (!raw) return null;
  const cleaned = raw.replace(/£/g, "").replace(/,/g, "");
  const value = Number(cleaned);
  if (!Number.isFinite(value) || value < 0) return null;
  return Math.round(value * 100);
}
