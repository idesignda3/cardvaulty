import Link from "next/link";

export function SiteFooter() {
  return (
    <footer className="mt-auto border-t border-zinc-200 bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-950">
      <div className="mx-auto flex max-w-6xl flex-col gap-4 px-4 py-10 text-sm text-zinc-600 sm:flex-row sm:items-center sm:justify-between sm:px-6 dark:text-zinc-400">
        <p>
          © {new Date().getFullYear()} CardVaulty — UK Pokémon card vault. Private by design.
        </p>
        <div className="flex flex-wrap gap-4">
          <Link href="/privacy" className="hover:text-emerald-700 dark:hover:text-emerald-400">
            Privacy
          </Link>
          <Link href="/terms" className="hover:text-emerald-700 dark:hover:text-emerald-400">
            Terms
          </Link>
          <Link href="/cookies" className="hover:text-emerald-700 dark:hover:text-emerald-400">
            Cookies
          </Link>
        </div>
      </div>
    </footer>
  );
}
