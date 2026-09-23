import Link from "next/link";

export function SiteFooter() {
  return (
    <footer className="mt-auto border-t border-white/10 bg-[#05070c]">
      <div className="mx-auto flex max-w-6xl flex-col gap-6 px-4 py-10 sm:px-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <p className="text-lg font-bold text-white">
              Card<span className="text-brand">Vaulty</span>
            </p>
            <p className="mt-2 max-w-md text-sm text-zinc-400">
              UK Pokémon card vault — scan, organise and track estimated values for your private
              collection.
            </p>
          </div>
          <div className="flex flex-wrap gap-4 text-sm text-zinc-400">
            <Link href="/privacy" className="hover:text-brand">
              Privacy
            </Link>
            <Link href="/terms" className="hover:text-brand">
              Terms
            </Link>
            <Link href="/cookies" className="hover:text-brand">
              Cookies
            </Link>
            <Link href="/auth" className="hover:text-brand">
              Sign in
            </Link>
          </div>
        </div>
        <div className="space-y-2 border-t border-white/10 pt-6 text-xs leading-5 text-zinc-500">
          <p>© {new Date().getFullYear()} CardVaulty. Built for collectors.</p>
          <p>
            Fan-made site. CardVaulty is not affiliated with, endorsed by, or sponsored by Nintendo,
            Game Freak, Creatures, or The Pokémon Company. Pokémon and all related trademarks are
            the property of their respective owners.
          </p>
        </div>
      </div>
    </footer>
  );
}
