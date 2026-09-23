import Link from "next/link";
import { auth } from "@/auth";

const nav = [
  { href: "/#features", label: "Features" },
  { href: "/#prices", label: "Prices" },
  { href: "/vault", label: "Vault" },
  { href: "/dashboard", label: "Dashboard" },
];

export async function SiteHeader() {
  const session = await auth();
  const signedIn = Boolean(session?.user);

  return (
    <header className="border-b border-zinc-200/80 bg-white/80 backdrop-blur dark:border-zinc-800 dark:bg-zinc-950/80">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-4 px-4 sm:px-6">
        <Link href="/" className="flex items-center gap-2 font-semibold tracking-tight text-zinc-900 dark:text-zinc-50">
          <span className="inline-flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-600 text-sm font-bold text-white">
            CV
          </span>
          <span>CardVaulty</span>
        </Link>
        <nav className="hidden items-center gap-6 text-sm text-zinc-600 dark:text-zinc-300 md:flex">
          {nav.map((item) => (
            <Link key={item.href} href={item.href} className="hover:text-emerald-700 dark:hover:text-emerald-400">
              {item.label}
            </Link>
          ))}
        </nav>
        <div className="flex items-center gap-2 text-sm">
          {signedIn ? (
            <>
              <Link
                href="/account"
                className="rounded-lg px-3 py-1.5 text-zinc-700 hover:bg-zinc-100 dark:text-zinc-200 dark:hover:bg-zinc-800"
              >
                Account
              </Link>
              <Link
                href="/vault"
                className="rounded-lg bg-emerald-600 px-3 py-1.5 font-medium text-white hover:bg-emerald-500"
              >
                Open vault
              </Link>
            </>
          ) : (
            <>
              <Link
                href="/auth"
                className="rounded-lg px-3 py-1.5 text-zinc-700 hover:bg-zinc-100 dark:text-zinc-200 dark:hover:bg-zinc-800"
              >
                Sign in
              </Link>
              <Link
                href="/auth?mode=register"
                className="rounded-lg bg-emerald-600 px-3 py-1.5 font-medium text-white hover:bg-emerald-500"
              >
                Create vault
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
