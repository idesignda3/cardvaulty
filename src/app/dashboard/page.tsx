import type { Metadata } from "next";
import Link from "next/link";
import { requireUser } from "@/lib/session";
import { prisma } from "@/lib/prisma";
import { formatPence } from "@/lib/money";

export const metadata: Metadata = {
  title: "Dashboard",
};

export default async function DashboardPage() {
  const user = await requireUser();

  const [cardCount, aggregates] = await Promise.all([
    prisma.vaultCard.count({ where: { userId: user.id } }),
    prisma.vaultCard.aggregate({
      where: { userId: user.id },
      _sum: { quantity: true, priceAvgPence: true },
    }),
  ]);

  const totalQty = aggregates._sum.quantity ?? 0;
  // Sum of stored estimates (not live market). Null prices contribute nothing.
  const priceSumPence = aggregates._sum.priceAvgPence ?? 0;

  const stats = [
    { label: "Cards", value: String(cardCount), hint: "Unique vault entries" },
    { label: "Total quantity", value: String(totalQty), hint: "Sum of quantities" },
    {
      label: "Est. value (stored)",
      value: formatPence(priceSumPence || null),
      hint: "Sum of your avg estimates — not live market",
    },
  ];

  return (
    <main className="mx-auto w-full max-w-4xl flex-1 px-4 py-10 sm:px-6">
      <h1 className="text-2xl font-semibold tracking-tight text-zinc-900 dark:text-zinc-50">
        Dashboard
      </h1>
      <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
        Quick totals for your private vault. Phase 1 stub — more insights later.
      </p>

      <div className="mt-8 grid gap-4 sm:grid-cols-3">
        {stats.map((s) => (
          <div
            key={s.label}
            className="rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm dark:border-zinc-800 dark:bg-zinc-900"
          >
            <p className="text-xs font-medium uppercase tracking-wider text-zinc-500">{s.label}</p>
            <p className="mt-2 text-2xl font-semibold text-zinc-900 dark:text-zinc-50">{s.value}</p>
            <p className="mt-1 text-xs text-zinc-500">{s.hint}</p>
          </div>
        ))}
      </div>

      <Link
        href="/vault"
        className="mt-8 inline-flex rounded-xl bg-emerald-600 px-4 py-2 text-sm font-semibold text-white hover:bg-emerald-500"
      >
        Manage vault
      </Link>
    </main>
  );
}
