"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { requireUser } from "@/lib/session";
import { prisma } from "@/lib/prisma";
import { parsePoundsToPence } from "@/lib/money";

const cardSchema = z.object({
  name: z.string().trim().min(1, "Name is required").max(200),
  setName: z.string().trim().max(200).optional().or(z.literal("")),
  number: z.string().trim().max(50).optional().or(z.literal("")),
  rarity: z.string().trim().max(100).optional().or(z.literal("")),
  tcgId: z.string().trim().max(100).optional().or(z.literal("")),
  imageUrl: z.string().trim().url().optional().or(z.literal("")),
  quantity: z.coerce.number().int().min(1).max(9999),
  condition: z.string().trim().max(50).optional().or(z.literal("")),
  notes: z.string().trim().max(5000).optional().or(z.literal("")),
  favourite: z.coerce.boolean().optional(),
});

function emptyToNull(value: string | undefined | null) {
  if (!value) return null;
  return value;
}

export type VaultActionState = {
  ok: boolean;
  message?: string;
  errors?: Record<string, string[]>;
};

export async function createVaultCard(
  _prev: VaultActionState,
  formData: FormData,
): Promise<VaultActionState> {
  const user = await requireUser();
  const parsed = cardSchema.safeParse({
    name: formData.get("name"),
    setName: formData.get("setName") ?? "",
    number: formData.get("number") ?? "",
    rarity: formData.get("rarity") ?? "",
    tcgId: formData.get("tcgId") ?? "",
    imageUrl: formData.get("imageUrl") ?? "",
    quantity: formData.get("quantity") ?? "1",
    condition: formData.get("condition") ?? "",
    notes: formData.get("notes") ?? "",
    favourite: formData.get("favourite") === "on",
  });

  if (!parsed.success) {
    return {
      ok: false,
      message: "Check the form fields.",
      errors: parsed.error.flatten().fieldErrors as Record<string, string[]>,
    };
  }

  const priceAvgPence = parsePoundsToPence(formData.get("priceAvgPounds"));

  await prisma.vaultCard.create({
    data: {
      userId: user.id,
      name: parsed.data.name,
      setName: emptyToNull(parsed.data.setName),
      number: emptyToNull(parsed.data.number),
      rarity: emptyToNull(parsed.data.rarity),
      tcgId: emptyToNull(parsed.data.tcgId),
      imageUrl: emptyToNull(parsed.data.imageUrl),
      quantity: parsed.data.quantity,
      condition: emptyToNull(parsed.data.condition),
      notes: emptyToNull(parsed.data.notes),
      favourite: Boolean(parsed.data.favourite),
      priceAvgPence,
    },
  });

  revalidatePath("/vault");
  revalidatePath("/dashboard");
  return { ok: true, message: "Card added." };
}

export async function updateVaultCard(
  _prev: VaultActionState,
  formData: FormData,
): Promise<VaultActionState> {
  const user = await requireUser();
  const id = String(formData.get("id") ?? "");
  if (!id) return { ok: false, message: "Missing card id." };

  const existing = await prisma.vaultCard.findFirst({
    where: { id, userId: user.id },
  });
  if (!existing) return { ok: false, message: "Card not found." };

  const parsed = cardSchema.safeParse({
    name: formData.get("name"),
    setName: formData.get("setName") ?? "",
    number: formData.get("number") ?? "",
    rarity: formData.get("rarity") ?? "",
    tcgId: formData.get("tcgId") ?? "",
    imageUrl: formData.get("imageUrl") ?? "",
    quantity: formData.get("quantity") ?? "1",
    condition: formData.get("condition") ?? "",
    notes: formData.get("notes") ?? "",
    favourite: formData.get("favourite") === "on",
  });

  if (!parsed.success) {
    return {
      ok: false,
      message: "Check the form fields.",
      errors: parsed.error.flatten().fieldErrors as Record<string, string[]>,
    };
  }

  const priceAvgPence = parsePoundsToPence(formData.get("priceAvgPounds"));

  await prisma.vaultCard.update({
    where: { id: existing.id },
    data: {
      name: parsed.data.name,
      setName: emptyToNull(parsed.data.setName),
      number: emptyToNull(parsed.data.number),
      rarity: emptyToNull(parsed.data.rarity),
      tcgId: emptyToNull(parsed.data.tcgId),
      imageUrl: emptyToNull(parsed.data.imageUrl),
      quantity: parsed.data.quantity,
      condition: emptyToNull(parsed.data.condition),
      notes: emptyToNull(parsed.data.notes),
      favourite: Boolean(parsed.data.favourite),
      priceAvgPence,
    },
  });

  revalidatePath("/vault");
  revalidatePath("/dashboard");
  return { ok: true, message: "Card updated." };
}

export async function deleteVaultCard(formData: FormData) {
  const user = await requireUser();
  const id = String(formData.get("id") ?? "");
  if (!id) return;

  await prisma.vaultCard.deleteMany({
    where: { id, userId: user.id },
  });

  revalidatePath("/vault");
  revalidatePath("/dashboard");
}
