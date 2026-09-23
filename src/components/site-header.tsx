import Link from "next/link";
import { auth } from "@/auth";
import { MobileNav } from "@/components/mobile-nav";

const nav = [
  { href: "/", label: "Home" },
  { href: "/prices", label: "Prices" },
  { href: "/vault", label: "Vault" },
  { href: "/sets", label: "Shop" },
];

function IconSearch() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden>
      <circle cx="11" cy="11" r="7" stroke="currentColor" strokeWidth="1.8" />
      <path d="M20 20l-3.5-3.5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  );
}

function IconUser() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden>
      <circle cx="12" cy="8" r="3.5" stroke="currentColor" strokeWidth="1.8" />
      <path
        d="M5 19c1.5-3.2 3.8-5 7-5s5.5 1.8 7 5"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
    </svg>
  );
}

function IconBag() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        d="M6 8h12l-1 11H7L6 8z"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinejoin="round"
      />
      <path d="M9 8V7a3 3 0 016 0v1" stroke="currentColor" strokeWidth="1.8" />
    </svg>
  );
}

export async function SiteHeader() {
  const session = await auth();
  const signedIn = Boolean(session?.user);
  const accountHref = signedIn ? "/account" : "/auth";

  return (
    <header className="sticky top-0 z-40 border-b border-slate-200/80 bg-white/80 backdrop-blur-md">
      <div className="relative mx-auto flex h-16 max-w-6xl items-center justify-between gap-3 px-4 sm:px-6">
        <Link href="/" className="flex items-center gap-2">
          <span className="inline-flex h-8 w-8 items-center justify-center rounded-lg bg-brand text-sm font-black text-brand-ink shadow-[0_0_18px_rgba(232,255,71,0.45)]">
            CV
          </span>
          <span className="text-lg font-bold tracking-tight text-[#0b1020]">
            Card<span className="text-brand drop-shadow-[0_0_10px_rgba(232,255,71,0.55)]">Vaulty</span>
          </span>
        </Link>

        <nav className="hidden items-center gap-1 text-sm font-semibold uppercase tracking-wide text-slate-600 md:flex">
          {nav.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="rounded-lg px-3 py-2 hover:bg-slate-100 hover:text-[#0b1020]"
            >
              {item.label}
            </Link>
          ))}
          <Link
            href={accountHref}
            className="rounded-lg px-3 py-2 hover:bg-slate-100 hover:text-[#0b1020]"
          >
            Account
          </Link>
        </nav>

        <div className="flex items-center gap-2">
          <span className="hidden items-center gap-1 text-slate-600 sm:flex" aria-hidden>
            <span className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 bg-white">
              <IconSearch />
            </span>
            <Link
              href={accountHref}
              className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 bg-white hover:border-brand/50"
              aria-label={signedIn ? "Account" : "Sign in"}
            >
              <IconUser />
            </Link>
            <span className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 bg-white">
              <IconBag />
            </span>
          </span>

          {signedIn ? (
            <Link
              href="/vault"
              className="neon-btn hidden rounded-lg px-3 py-2 text-xs font-bold uppercase tracking-wide sm:inline-flex"
            >
              Open vault
            </Link>
          ) : (
            <Link
              href="/auth?mode=register"
              className="neon-btn hidden rounded-lg px-3 py-2 text-xs font-bold uppercase tracking-wide sm:inline-flex"
            >
              Free vault
            </Link>
          )}

          <MobileNav accountHref={accountHref} />
        </div>
      </div>
    </header>
  );
}
