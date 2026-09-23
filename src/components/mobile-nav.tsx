"use client";

import Link from "next/link";
import { useState } from "react";

const links = [
  { href: "/", label: "Home" },
  { href: "/prices", label: "Prices" },
  { href: "/vault", label: "Vault" },
  { href: "/sets", label: "Shop" },
  { href: "/auth", label: "Account" },
];

export function MobileNav({ accountHref }: { accountHref: string }) {
  const [open, setOpen] = useState(false);
  const items = links.map((l) =>
    l.label === "Account" ? { ...l, href: accountHref } : l,
  );

  return (
    <div className="md:hidden">
      <button
        type="button"
        aria-expanded={open}
        aria-label="Open menu"
        onClick={() => setOpen((v) => !v)}
        className="inline-flex h-10 w-10 items-center justify-center rounded-lg border border-white/10 text-brand"
      >
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden>
          {open ? (
            <path d="M6 6l12 12M18 6L6 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
          ) : (
            <path d="M4 7h16M4 12h16M4 17h16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
          )}
        </svg>
      </button>
      {open ? (
        <div className="absolute left-0 right-0 top-16 z-50 border-b border-white/10 bg-[#07090f]/95 px-4 py-4 backdrop-blur-md">
          <nav className="flex flex-col gap-1">
            {items.map((item) => (
              <Link
                key={item.href + item.label}
                href={item.href}
                onClick={() => setOpen(false)}
                className="rounded-lg px-3 py-2.5 text-sm font-semibold uppercase tracking-wide text-zinc-200 hover:bg-white/5 hover:text-brand"
              >
                {item.label}
              </Link>
            ))}
          </nav>
        </div>
      ) : null}
    </div>
  );
}
