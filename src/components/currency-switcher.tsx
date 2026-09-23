import Link from "next/link";
import {
  DISPLAY_CURRENCIES,
  type DisplayCurrency,
} from "@/lib/currency";

/** Plain query-param currency switcher (GBP default). */
export function CurrencySwitcher({
  current,
  basePath,
}: {
  current: DisplayCurrency;
  basePath: string;
}) {
  return (
    <p className="text-sm text-zinc-600 dark:text-zinc-400">
      Currency:{" "}
      {DISPLAY_CURRENCIES.map((c, i) => {
        const href =
          c === "GBP"
            ? basePath
            : `${basePath}${basePath.includes("?") ? "&" : "?"}currency=${c}`;
        return (
          <span key={c}>
            {i > 0 ? " · " : null}
            {c === current ? (
              <span className="font-medium text-zinc-900 dark:text-zinc-100">
                {c}
              </span>
            ) : (
              <Link
                href={href}
                className="underline hover:text-zinc-900 dark:hover:text-zinc-100"
              >
                {c}
              </Link>
            )}
          </span>
        );
      })}
    </p>
  );
}
