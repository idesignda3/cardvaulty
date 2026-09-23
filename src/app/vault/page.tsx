import type { Metadata } from "next";
import { requireUser } from "@/lib/session";
import { prisma } from "@/lib/prisma";
import { AddCardForm, VaultCardList } from "./vault-ui";

export const metadata: Metadata = {
  title: "Vault",
};

export default async function VaultPage() {
  const user = await requireUser();
  const cards = await prisma.vaultCard.findMany({
    where: { userId: user.id },
    orderBy: [{ favourite: "desc" }, { updatedAt: "desc" }],
  });

  return (
    <main className="mx-auto w-full max-w-3xl flex-1 px-4 py-10 sm:px-6">
      <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-zinc-900 dark:text-zinc-50">
            My vault
          </h1>
          <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
            Private cards for {user.email}. All queries are scoped to your account.
          </p>
        </div>
        <AddCardForm />
      </div>
      <VaultCardList cards={cards} />
    </main>
  );
}
