import Link from "next/link";

const features = [
  {
    title: "AI scan",
    body: "Point a camera at a card and identify set, number and rarity in seconds. Scan tools land in a later phase — the vault is ready now.",
    cta: { href: "/auth?mode=register", label: "Start free vault" },
  },
  {
    title: "Private vault",
    body: "Your cards stay yours. Every vault query is scoped to your account — quantity, condition, notes and favourites in one place.",
    cta: { href: "/vault", label: "Open vault" },
  },
  {
    title: "Estimated prices",
    body: "Store your own average estimates in pence. Live market feeds are optional later — we never invent prices for you.",
    cta: { href: "/#prices", label: "How pricing works" },
  },
];

export default function HomePage() {
  return (
    <main className="flex-1">
      <section className="relative overflow-hidden border-b border-zinc-200 bg-gradient-to-b from-emerald-50 to-zinc-50 dark:border-zinc-800 dark:from-emerald-950/40 dark:to-zinc-950">
        <div className="mx-auto grid max-w-6xl gap-10 px-4 py-20 sm:px-6 lg:grid-cols-2 lg:items-center lg:py-28">
          <div>
            <p className="mb-3 text-sm font-semibold uppercase tracking-widest text-emerald-700 dark:text-emerald-400">
              UK Pokémon card vault
            </p>
            <h1 className="text-4xl font-semibold tracking-tight text-zinc-900 sm:text-5xl dark:text-zinc-50">
              Your collection. Scanned, valued &amp; organised.
            </h1>
            <p className="mt-6 max-w-xl text-lg leading-8 text-zinc-600 dark:text-zinc-300">
              CardVaulty helps you identify cards, keep a private vault, and track estimated
              values — built for collectors who want control of their own data.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                href="/auth?mode=register"
                className="rounded-xl bg-emerald-600 px-5 py-3 text-sm font-semibold text-white shadow-sm hover:bg-emerald-500"
              >
                Create free vault
              </Link>
              <Link
                href="/auth"
                className="rounded-xl border border-zinc-300 bg-white px-5 py-3 text-sm font-semibold text-zinc-800 hover:bg-zinc-50 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-100 dark:hover:bg-zinc-800"
              >
                Sign in
              </Link>
              <Link
                href="/#prices"
                className="rounded-xl px-5 py-3 text-sm font-semibold text-emerald-800 hover:underline dark:text-emerald-300"
              >
                View prices info
              </Link>
            </div>
            <ul className="mt-8 flex flex-wrap gap-x-6 gap-y-2 text-sm text-zinc-600 dark:text-zinc-400">
              <li>✓ Private vault</li>
              <li>✓ Email sign-in (Google optional)</li>
              <li>✓ Self-hosted ready</li>
            </ul>
          </div>
          <div className="rounded-2xl border border-emerald-200/60 bg-white p-6 shadow-lg dark:border-emerald-900 dark:bg-zinc-900">
            <p className="text-xs font-medium uppercase tracking-wider text-zinc-500">Phase 1 MVP</p>
            <h2 className="mt-2 text-xl font-semibold text-zinc-900 dark:text-zinc-50">Vault first</h2>
            <p className="mt-3 text-sm leading-6 text-zinc-600 dark:text-zinc-300">
              Register, add cards by hand, edit quantity and notes, and see dashboard totals.
              AI scan and live market prices come next — placeholders only for now.
            </p>
            <div className="mt-6 grid grid-cols-3 gap-3 text-center text-sm">
              <div className="rounded-xl bg-zinc-50 p-3 dark:bg-zinc-800">
                <p className="font-semibold text-zinc-900 dark:text-zinc-50">Scan</p>
                <p className="mt-1 text-xs text-zinc-500">Soon</p>
              </div>
              <div className="rounded-xl bg-emerald-50 p-3 dark:bg-emerald-950">
                <p className="font-semibold text-emerald-800 dark:text-emerald-300">Vault</p>
                <p className="mt-1 text-xs text-emerald-700/80 dark:text-emerald-400">Ready</p>
              </div>
              <div className="rounded-xl bg-zinc-50 p-3 dark:bg-zinc-800">
                <p className="font-semibold text-zinc-900 dark:text-zinc-50">Prices</p>
                <p className="mt-1 text-xs text-zinc-500">Manual</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="features" className="mx-auto max-w-6xl px-4 py-20 sm:px-6">
        <h2 className="text-center text-3xl font-semibold tracking-tight text-zinc-900 dark:text-zinc-50">
          Built for collectors
        </h2>
        <p className="mx-auto mt-3 max-w-2xl text-center text-zinc-600 dark:text-zinc-400">
          Same purpose as the live CardVaulty product — scan, vault, prices — rebuilt clean for
          self-hosting.
        </p>
        <div className="mt-12 grid gap-6 md:grid-cols-3">
          {features.map((f) => (
            <article
              key={f.title}
              className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-900"
            >
              <h3 className="text-lg font-semibold text-zinc-900 dark:text-zinc-50">{f.title}</h3>
              <p className="mt-3 text-sm leading-6 text-zinc-600 dark:text-zinc-400">{f.body}</p>
              <Link
                href={f.cta.href}
                className="mt-5 inline-block text-sm font-semibold text-emerald-700 hover:underline dark:text-emerald-400"
              >
                {f.cta.label} →
              </Link>
            </article>
          ))}
        </div>
      </section>

      <section
        id="prices"
        className="border-y border-zinc-200 bg-zinc-100/70 py-16 dark:border-zinc-800 dark:bg-zinc-900/50"
      >
        <div className="mx-auto max-w-3xl px-4 text-center sm:px-6">
          <h2 className="text-2xl font-semibold text-zinc-900 dark:text-zinc-50">
            Estimated prices, honestly labelled
          </h2>
          <p className="mt-4 text-zinc-600 dark:text-zinc-400">
            Phase 1 stores optional average estimates you enter yourself (integer pence). We do not
            invent live market prices. Future market integrations will carry clear disclaimers —
            estimates are not sale guarantees.
          </p>
          <Link
            href="/auth?mode=register"
            className="mt-8 inline-flex rounded-xl bg-emerald-600 px-5 py-3 text-sm font-semibold text-white hover:bg-emerald-500"
          >
            Create free account
          </Link>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-20 sm:px-6">
        <div className="rounded-2xl bg-emerald-700 px-6 py-12 text-center text-white sm:px-12">
          <h2 className="text-2xl font-semibold sm:text-3xl">Ready to organise your binder?</h2>
          <p className="mx-auto mt-3 max-w-xl text-emerald-50">
            Sign up with email and password, then add your first cards to a private vault.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <Link
              href="/auth?mode=register"
              className="rounded-xl bg-white px-5 py-3 text-sm font-semibold text-emerald-800 hover:bg-emerald-50"
            >
              Create free vault
            </Link>
            <Link
              href="/auth"
              className="rounded-xl border border-emerald-400/50 px-5 py-3 text-sm font-semibold text-white hover:bg-emerald-600"
            >
              Sign in
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
