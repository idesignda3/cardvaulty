"use client";

import { useActionState, useState } from "react";
import { useRouter } from "next/navigation";
import type { VaultCard } from "@prisma/client";
import { formatPence } from "@/lib/money";
import {
  createVaultCard,
  deleteVaultCard,
  updateVaultCard,
  type VaultActionState,
} from "./actions";

const initial: VaultActionState = { ok: false };

function CardFormFields({
  card,
  errors,
}: {
  card?: VaultCard;
  errors?: Record<string, string[]>;
}) {
  const pricePounds =
    card?.priceAvgPence != null ? (card.priceAvgPence / 100).toFixed(2) : "";

  return (
    <div className="grid gap-3 sm:grid-cols-2">
      <div className="sm:col-span-2">
        <label className="block text-xs font-medium text-zinc-600 dark:text-zinc-400">Name *</label>
        <input
          name="name"
          required
          defaultValue={card?.name ?? ""}
          className="mt-1 w-full rounded-lg border border-zinc-300 px-3 py-2 text-sm dark:border-zinc-700 dark:bg-zinc-950"
        />
        {errors?.name && <p className="mt-1 text-xs text-red-600">{errors.name[0]}</p>}
      </div>
      <div>
        <label className="block text-xs font-medium text-zinc-600 dark:text-zinc-400">Set</label>
        <input
          name="setName"
          defaultValue={card?.setName ?? ""}
          className="mt-1 w-full rounded-lg border border-zinc-300 px-3 py-2 text-sm dark:border-zinc-700 dark:bg-zinc-950"
        />
      </div>
      <div>
        <label className="block text-xs font-medium text-zinc-600 dark:text-zinc-400">Number</label>
        <input
          name="number"
          defaultValue={card?.number ?? ""}
          className="mt-1 w-full rounded-lg border border-zinc-300 px-3 py-2 text-sm dark:border-zinc-700 dark:bg-zinc-950"
        />
      </div>
      <div>
        <label className="block text-xs font-medium text-zinc-600 dark:text-zinc-400">Rarity</label>
        <input
          name="rarity"
          defaultValue={card?.rarity ?? ""}
          className="mt-1 w-full rounded-lg border border-zinc-300 px-3 py-2 text-sm dark:border-zinc-700 dark:bg-zinc-950"
        />
      </div>
      <div>
        <label className="block text-xs font-medium text-zinc-600 dark:text-zinc-400">TCG ID</label>
        <input
          name="tcgId"
          defaultValue={card?.tcgId ?? ""}
          className="mt-1 w-full rounded-lg border border-zinc-300 px-3 py-2 text-sm dark:border-zinc-700 dark:bg-zinc-950"
        />
      </div>
      <div>
        <label className="block text-xs font-medium text-zinc-600 dark:text-zinc-400">Quantity</label>
        <input
          name="quantity"
          type="number"
          min={1}
          defaultValue={card?.quantity ?? 1}
          className="mt-1 w-full rounded-lg border border-zinc-300 px-3 py-2 text-sm dark:border-zinc-700 dark:bg-zinc-950"
        />
      </div>
      <div>
        <label className="block text-xs font-medium text-zinc-600 dark:text-zinc-400">Condition</label>
        <input
          name="condition"
          defaultValue={card?.condition ?? ""}
          placeholder="NM / LP / MP…"
          className="mt-1 w-full rounded-lg border border-zinc-300 px-3 py-2 text-sm dark:border-zinc-700 dark:bg-zinc-950"
        />
      </div>
      <div>
        <label className="block text-xs font-medium text-zinc-600 dark:text-zinc-400">
          Avg estimate (£)
        </label>
        <input
          name="priceAvgPounds"
          type="number"
          step="0.01"
          min="0"
          defaultValue={pricePounds}
          placeholder="e.g. 12.50"
          className="mt-1 w-full rounded-lg border border-zinc-300 px-3 py-2 text-sm dark:border-zinc-700 dark:bg-zinc-950"
        />
        <p className="mt-1 text-[11px] text-zinc-500">
          Stored as integer pence. Optional — your estimate only.
        </p>
      </div>
      <div className="sm:col-span-2">
        <label className="block text-xs font-medium text-zinc-600 dark:text-zinc-400">Image URL</label>
        <input
          name="imageUrl"
          type="url"
          defaultValue={card?.imageUrl ?? ""}
          className="mt-1 w-full rounded-lg border border-zinc-300 px-3 py-2 text-sm dark:border-zinc-700 dark:bg-zinc-950"
        />
      </div>
      <div className="sm:col-span-2">
        <label className="block text-xs font-medium text-zinc-600 dark:text-zinc-400">Notes</label>
        <textarea
          name="notes"
          rows={2}
          defaultValue={card?.notes ?? ""}
          className="mt-1 w-full rounded-lg border border-zinc-300 px-3 py-2 text-sm dark:border-zinc-700 dark:bg-zinc-950"
        />
      </div>
      <label className="flex items-center gap-2 text-sm text-zinc-700 dark:text-zinc-300">
        <input name="favourite" type="checkbox" defaultChecked={card?.favourite ?? false} />
        Favourite
      </label>
    </div>
  );
}

function AddCardFormInner({
  onCancel,
  onSuccessClose,
}: {
  onCancel: () => void;
  onSuccessClose: () => void;
}) {
  const router = useRouter();
  const [state, action, pending] = useActionState(createVaultCard, initial);

  if (state.ok) {
    return (
      <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-5 text-sm dark:border-emerald-900 dark:bg-emerald-950">
        <p className="font-medium text-emerald-900 dark:text-emerald-200">
          {state.message ?? "Card added."}
        </p>
        <button
          type="button"
          onClick={() => {
            router.refresh();
            onSuccessClose();
          }}
          className="mt-3 rounded-lg bg-emerald-600 px-3 py-1.5 text-xs font-semibold text-white"
        >
          Done
        </button>
      </div>
    );
  }

  return (
    <form
      action={action}
      className="space-y-4 rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm dark:border-zinc-800 dark:bg-zinc-900"
    >
      <div className="flex items-center justify-between">
        <h2 className="font-semibold text-zinc-900 dark:text-zinc-50">Add card</h2>
        <button type="button" onClick={onCancel} className="text-sm text-zinc-500 hover:underline">
          Cancel
        </button>
      </div>
      {state.message && !state.ok && <p className="text-sm text-red-600">{state.message}</p>}
      <CardFormFields errors={state.errors} />
      <button
        type="submit"
        disabled={pending}
        className="rounded-xl bg-emerald-600 px-4 py-2 text-sm font-semibold text-white hover:bg-emerald-500 disabled:opacity-60"
      >
        {pending ? "Saving…" : "Save card"}
      </button>
    </form>
  );
}

export function AddCardForm() {
  const [open, setOpen] = useState(false);
  const [instance, setInstance] = useState(0);

  if (!open) {
    return (
      <button
        type="button"
        onClick={() => {
          setInstance((n) => n + 1);
          setOpen(true);
        }}
        className="rounded-xl bg-emerald-600 px-4 py-2 text-sm font-semibold text-white hover:bg-emerald-500"
      >
        Add card
      </button>
    );
  }

  return (
    <AddCardFormInner
      key={instance}
      onCancel={() => setOpen(false)}
      onSuccessClose={() => setOpen(false)}
    />
  );
}

function EditCardForm({ card, onDone }: { card: VaultCard; onDone: () => void }) {
  const router = useRouter();
  const [state, action, pending] = useActionState(updateVaultCard, initial);

  if (state.ok) {
    return (
      <div className="mt-3 border-t border-zinc-100 pt-3 text-sm text-emerald-700 dark:border-zinc-800 dark:text-emerald-400">
        <p>{state.message ?? "Card updated."}</p>
        <button
          type="button"
          onClick={() => {
            router.refresh();
            onDone();
          }}
          className="mt-2 text-xs font-medium hover:underline"
        >
          Close
        </button>
      </div>
    );
  }

  return (
    <form action={action} className="mt-3 space-y-3 border-t border-zinc-100 pt-3 dark:border-zinc-800">
      <input type="hidden" name="id" value={card.id} />
      {state.message && !state.ok && <p className="text-sm text-red-600">{state.message}</p>}
      <CardFormFields card={card} errors={state.errors} />
      <div className="flex gap-2">
        <button
          type="submit"
          disabled={pending}
          className="rounded-lg bg-emerald-600 px-3 py-1.5 text-sm font-medium text-white disabled:opacity-60"
        >
          {pending ? "Saving…" : "Save"}
        </button>
        <button
          type="button"
          onClick={onDone}
          className="rounded-lg px-3 py-1.5 text-sm text-zinc-600 hover:bg-zinc-100 dark:hover:bg-zinc-800"
        >
          Cancel
        </button>
      </div>
    </form>
  );
}

export function VaultCardList({ cards }: { cards: VaultCard[] }) {
  const [editingId, setEditingId] = useState<string | null>(null);

  if (cards.length === 0) {
    return (
      <p className="rounded-2xl border border-dashed border-zinc-300 bg-white p-10 text-center text-sm text-zinc-500 dark:border-zinc-700 dark:bg-zinc-900">
        No cards yet. Add your first vault entry above.
      </p>
    );
  }

  return (
    <ul className="space-y-3">
      {cards.map((card) => (
        <li
          key={card.id}
          className="rounded-2xl border border-zinc-200 bg-white p-4 shadow-sm dark:border-zinc-800 dark:bg-zinc-900"
        >
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-semibold text-zinc-900 dark:text-zinc-50">{card.name}</h3>
                {card.favourite && (
                  <span className="rounded-full bg-amber-100 px-2 py-0.5 text-[10px] font-semibold uppercase text-amber-800 dark:bg-amber-950 dark:text-amber-300">
                    Fav
                  </span>
                )}
              </div>
              <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
                {[card.setName, card.number, card.rarity].filter(Boolean).join(" · ") ||
                  "No set details"}
              </p>
              <p className="mt-1 text-xs text-zinc-500">
                Qty {card.quantity}
                {card.condition ? ` · ${card.condition}` : ""}
                {" · "}
                Est. {formatPence(card.priceAvgPence)}
              </p>
              {card.notes && (
                <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">{card.notes}</p>
              )}
            </div>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setEditingId(editingId === card.id ? null : card.id)}
                className="rounded-lg border border-zinc-300 px-3 py-1.5 text-xs font-medium dark:border-zinc-700"
              >
                Edit
              </button>
              <form action={deleteVaultCard}>
                <input type="hidden" name="id" value={card.id} />
                <button
                  type="submit"
                  className="rounded-lg border border-red-200 px-3 py-1.5 text-xs font-medium text-red-700 hover:bg-red-50 dark:border-red-900 dark:text-red-400 dark:hover:bg-red-950"
                >
                  Delete
                </button>
              </form>
            </div>
          </div>
          {editingId === card.id && (
            <EditCardForm card={card} onDone={() => setEditingId(null)} />
          )}
        </li>
      ))}
    </ul>
  );
}
