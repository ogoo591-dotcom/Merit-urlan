import "server-only";

import { updateDb } from "@/server/mock/db";
import type { Purchase } from "@/types/purchases";

export async function recordPurchase(input: Omit<Purchase, "id" | "createdAt">) {
  await updateDb((db) => {
    if (db.purchases.some((item) => item.userId === input.userId && item.kind === input.kind && item.itemId === input.itemId)) return;
    db.purchases.push({ ...input, id: crypto.randomUUID(), createdAt: new Date().toISOString() });
  });
}
