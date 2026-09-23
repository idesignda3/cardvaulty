import type { Metadata } from "next";

export const metadata: Metadata = { title: "Terms" };

export default function TermsPage() {
  return (
    <main className="mx-auto max-w-2xl flex-1 px-4 py-16 sm:px-6">
      <h1 className="text-3xl font-semibold tracking-tight">Terms of use</h1>
      <p className="mt-4 text-sm text-zinc-500">Placeholder — Phase 1 stub.</p>
      <div className="mt-8 space-y-4 text-sm leading-7 text-zinc-700 dark:text-zinc-300">
        <p>
          CardVaulty is provided as-is for personal collection tracking. Estimated prices you enter
          (or any future market feeds) are informational only and are not sale guarantees or financial
          advice.
        </p>
        <p>
          You are responsible for content you add to your vault and for securing your deployment
          credentials. Full terms will replace this stub before public launch.
        </p>
      </div>
    </main>
  );
}
