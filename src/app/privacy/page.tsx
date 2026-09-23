import type { Metadata } from "next";

export const metadata: Metadata = { title: "Privacy" };

export default function PrivacyPage() {
  return (
    <main className="mx-auto max-w-2xl flex-1 px-4 py-16 sm:px-6">
      <h1 className="text-3xl font-semibold tracking-tight">Privacy policy</h1>
      <p className="mt-4 text-sm text-zinc-500">Placeholder — Phase 1 stub.</p>
      <div className="mt-8 space-y-4 text-sm leading-7 text-zinc-700 dark:text-zinc-300">
        <p>
          CardVaulty stores the account details you provide (email, optional trainer name) and the
          vault cards you create. Your vault data is private to your account; the application
          scopes every query by your user id.
        </p>
        <p>
          If you self-host, you control the database and backups. Do not commit secrets. A full
          privacy policy will replace this stub before public marketing launch.
        </p>
      </div>
    </main>
  );
}
