import Link from "next/link";

export function SiteFooter() {
  return (
    <footer className="mt-auto border-t border-slate-200/80 bg-white">
      <div className="mx-auto flex max-w-6xl flex-col gap-6 px-4 py-10 sm:px-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <p className="text-lg font-bold text-[#0b1020]">
              Card<span className="text-brand drop-shadow-[0_0_10px_rgba(232,255,71,0.45)]">Vaulty</span>
            </p>
            <p className="mt-2 max-w-md text-sm text-slate-500">
              UK Pokémon card vault — scan, organise and track estimated values for your private
              collection.
            </p>
          </div>
          <div className="flex flex-wrap gap-4 text-sm text-slate-500">
            <Link href="/privacy" className="hover:text-[#0b1020]">
              Privacy
            </Link>
            <Link href="/terms" className="hover:text-[#0b1020]">
              Terms
            </Link>
            <Link href="/cookies" className="hover:text-[#0b1020]">
              Cookies
            </Link>
            <Link href="/auth" className="hover:text-[#0b1020]">
              Sign in
            </Link>
          </div>
        </div>
        <div className="space-y-2 border-t border-slate-200/80 pt-6 text-xs leading-5 text-slate-500">
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
