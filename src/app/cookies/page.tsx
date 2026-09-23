import type { Metadata } from "next";

export const metadata: Metadata = { title: "Cookies" };

export default function CookiesPage() {
  return (
    <main className="mx-auto max-w-2xl flex-1 px-4 py-16 sm:px-6">
      <h1 className="text-3xl font-semibold tracking-tight">Cookies</h1>
      <p className="mt-4 text-sm text-zinc-500">Placeholder — Phase 1 stub.</p>
      <div className="mt-8 space-y-4 text-sm leading-7 text-zinc-700 dark:text-zinc-300">
        <p>
          We use essential session cookies (Auth.js / NextAuth) so you can stay signed in. These are
          required for protected routes such as Vault, Dashboard and Account.
        </p>
        <p>
          Optional analytics cookies are not enabled in Phase 1. This stub will be expanded with a
          full cookie notice before public launch.
        </p>
      </div>
    </main>
  );
}
