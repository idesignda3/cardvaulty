import Image from "next/image";
import Link from "next/link";

const trustItems = [
  {
    title: "Private vault",
    subtitle: "Your cards stay yours",
    icon: (
      <path
        d="M12 3l7 3v5c0 4.5-3 7.5-7 9-4-1.5-7-4.5-7-9V6l7-3z"
        stroke="currentColor"
        strokeWidth="1.8"
        fill="none"
      />
    ),
  },
  {
    title: "Fast scan",
    subtitle: "Identify in seconds",
    icon: (
      <path
        d="M13 2L4 14h7l-1 8 9-12h-7l1-8z"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinejoin="round"
        fill="none"
      />
    ),
  },
  {
    title: "Price estimates",
    subtitle: "Honestly labelled",
    icon: (
      <>
        <circle cx="12" cy="12" r="8" stroke="currentColor" strokeWidth="1.8" fill="none" />
        <path d="M12 7v10M9.5 9.5c.6-1 1.5-1.5 2.5-1.5 1.4 0 2.5.8 2.5 2s-1.1 2-2.5 2h-1c-1.4 0-2.5.8-2.5 2s1.1 2 2.5 2c1 0 1.9-.5 2.5-1.5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" fill="none" />
      </>
    ),
  },
  {
    title: "UK collectors",
    subtitle: "GBP-first defaults",
    icon: (
      <path
        d="M12 21s-7-4.5-7-11a7 7 0 0114 0c0 6.5-7 11-7 11z"
        stroke="currentColor"
        strokeWidth="1.8"
        fill="none"
      />
    ),
  },
];

const categories = [
  {
    href: "/auth",
    label: "Scan",
    blurb: "Snap & identify cards",
    accent: "from-yellow-300/20",
  },
  {
    href: "/vault",
    label: "Vault",
    blurb: "Private collection hub",
    accent: "from-blue-400/20",
  },
  {
    href: "/prices",
    label: "Prices",
    blurb: "Browse estimates",
    accent: "from-emerald-400/20",
  },
  {
    href: "/dashboard",
    label: "Wishlist",
    blurb: "Track what you want",
    accent: "from-fuchsia-400/20",
  },
  {
    href: "/sets",
    label: "Shop",
    blurb: "Browse sets & singles",
    accent: "from-orange-400/20",
  },
];

export default function HomePage() {
  return (
    <main className="flex-1">
      {/* Hero */}
      <section className="hero-glow relative overflow-hidden border-b border-slate-200/80">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 opacity-50"
          style={{
            backgroundImage:
              "radial-gradient(circle at 1px 1px, rgba(15,23,42,0.06) 1px, transparent 0)",
            backgroundSize: "28px 28px",
          }}
        />
        {/* decorative lightning SVG */}
        <svg
          aria-hidden
          className="pointer-events-none absolute -left-6 top-16 h-40 w-24 text-brand opacity-70 sm:left-8"
          viewBox="0 0 80 160"
          fill="none"
        >
          <path
            className="lightning-stroke"
            d="M48 8L18 78h28L28 152l42-86H48L62 8H48z"
            strokeWidth="3"
            fill="rgba(232,255,71,0.2)"
          />
        </svg>

        <div className="relative mx-auto grid max-w-6xl items-center gap-8 px-4 pb-10 pt-12 sm:px-6 lg:grid-cols-2 lg:gap-4 lg:pb-14 lg:pt-16">
          <div className="relative z-10 order-2 lg:order-1">
            <p className="mb-3 text-xs font-bold uppercase tracking-[0.25em] text-brand drop-shadow-[0_0_12px_rgba(232,255,71,0.55)]">
              UK Pokémon card vault
            </p>
            <h1 className="text-4xl font-black uppercase leading-[0.95] tracking-tight text-[#0b1020] sm:text-5xl lg:text-6xl">
              Vault.
              <br />
              Scan.
              <br />
              <span className="text-brand drop-shadow-[0_0_24px_rgba(232,255,71,0.45)]">
                Collect.
              </span>
            </h1>
            <p className="mt-5 max-w-md text-base leading-7 text-slate-600 sm:text-lg">
              Private vault for UK collectors. Identify cards, organise your binder, and track
              estimated values — without the Shopify storefront noise.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                href="/auth?mode=register"
                className="neon-btn inline-flex items-center rounded-xl px-6 py-3 text-sm font-black uppercase tracking-wide"
              >
                Create free vault
              </Link>
              <Link
                href="/prices"
                className="inline-flex items-center rounded-xl border border-glow-blue/40 bg-glow-blue/10 px-6 py-3 text-sm font-bold uppercase tracking-wide text-[#0b1020] shadow-[0_0_20px_rgba(59,130,246,0.18)] hover:bg-glow-blue/20"
              >
                Browse prices
              </Link>
            </div>
          </div>

          <div className="relative order-1 mx-auto w-full max-w-md lg:order-2 lg:max-w-none">
            <div
              aria-hidden
              className="absolute left-1/2 top-1/2 h-[70%] w-[70%] -translate-x-1/2 -translate-y-1/2 rounded-full bg-glow-blue/25 blur-3xl"
            />
            <div className="relative mx-auto aspect-square w-full max-w-[420px]">
              <Image
                src="/hero-pikachu.png"
                alt="Pikachu leaping with lightning — CardVaulty hero"
                fill
                priority
                sizes="(max-width: 768px) 90vw, 420px"
                className="object-contain drop-shadow-[0_20px_60px_rgba(59,130,246,0.28)]"
              />
            </div>
          </div>
        </div>

        {/* Trust bar */}
        <div className="relative border-t border-slate-200/80 bg-white/70 backdrop-blur-sm">
          <ul className="mx-auto grid max-w-6xl grid-cols-2 gap-4 px-4 py-5 sm:grid-cols-4 sm:px-6 sm:py-6">
            {trustItems.map((item) => (
              <li key={item.title} className="flex items-start gap-3">
                <span className="mt-0.5 inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-brand/40 bg-brand/20 text-brand-ink">
                  <svg width="18" height="18" viewBox="0 0 24 24">
                    {item.icon}
                  </svg>
                </span>
                <span>
                  <span className="block text-sm font-bold text-[#0b1020]">{item.title}</span>
                  <span className="block text-xs text-slate-500">{item.subtitle}</span>
                </span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Categories */}
      <section className="border-b border-slate-200/80 bg-[#f4f6fb] py-16 sm:py-20">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <div className="mb-8 flex flex-wrap items-end justify-between gap-3">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#64748b]">Explore</p>
              <h2 className="mt-2 text-2xl font-black uppercase tracking-tight text-[#0b1020] sm:text-3xl">
                Shop by category
              </h2>
            </div>
            <p className="max-w-sm text-sm text-slate-500">
              Jump into the tools that matter — scan, vault, prices, wishlist and sets.
            </p>
          </div>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
            {categories.map((cat) => (
              <Link
                key={cat.label}
                href={cat.href}
                className="panel-card group relative overflow-hidden rounded-2xl p-4 transition hover:-translate-y-0.5 hover:border-brand/50"
              >
                <div
                  className={`absolute inset-0 bg-gradient-to-br ${cat.accent} to-transparent opacity-70 transition group-hover:opacity-100`}
                />
                <div className="relative">
                  <div className="mb-8 flex h-14 items-end">
                    <span className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-brand/50 bg-brand/25 text-sm font-black text-brand-ink">
                      {cat.label.slice(0, 1)}
                    </span>
                  </div>
                  <p className="text-sm font-black uppercase tracking-wide text-[#0b1020]">{cat.label}</p>
                  <p className="mt-1 text-xs text-slate-500">{cat.blurb}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="bg-[#f7f8fc] py-16 sm:py-20">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <h2 className="text-center text-2xl font-black uppercase tracking-tight text-[#0b1020] sm:text-3xl">
            How it works
          </h2>
          <p className="mx-auto mt-3 max-w-2xl text-center text-slate-500">
            Three steps from binder pile to organised vault.
          </p>
          <div className="mt-10 grid gap-4 md:grid-cols-3">
            {[
              {
                n: "01",
                title: "Scan",
                body: "Point your camera or upload a photo. AI candidates appear — you confirm before anything is saved.",
              },
              {
                n: "02",
                title: "Vault",
                body: "Keep quantity, condition, notes and favourites in a private vault scoped to your account.",
              },
              {
                n: "03",
                title: "Track",
                body: "Browse estimated prices and set your own averages. Estimates are labelled — never invented as guarantees.",
              },
            ].map((step) => (
              <article key={step.n} className="panel-card rounded-2xl p-6">
                <p className="text-xs font-black tracking-[0.2em] text-[#64748b]">{step.n}</p>
                <h3 className="mt-2 text-xl font-bold text-[#0b1020]">{step.title}</h3>
                <p className="mt-3 text-sm leading-6 text-slate-500">{step.body}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* Bottom CTA */}
      <section className="border-t border-slate-200/80 bg-gradient-to-b from-white to-[#eef2ff] py-16">
        <div className="mx-auto max-w-3xl px-4 text-center sm:px-6">
          <h2 className="text-2xl font-black uppercase tracking-tight text-[#0b1020] sm:text-3xl">
            Ready to organise your binder?
          </h2>
          <p className="mx-auto mt-3 max-w-xl text-slate-500">
            Create a free CardVaulty account and start your private UK Pokémon card vault today.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <Link
              href="/auth?mode=register"
              className="neon-btn inline-flex rounded-xl px-6 py-3 text-sm font-black uppercase tracking-wide"
            >
              Create free vault
            </Link>
            <Link
              href="/auth"
              className="inline-flex rounded-xl border border-slate-300 px-6 py-3 text-sm font-bold uppercase tracking-wide text-[#0b1020] hover:border-brand/60 hover:text-brand-ink"
            >
              Sign in
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
