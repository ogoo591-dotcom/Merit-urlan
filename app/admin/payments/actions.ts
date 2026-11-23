"use server";

import { revalidatePath } from "next/cache";

import { requireAdmin } from "@/lib/auth";
import { approvePayment, rejectPayment } from "@/lib/data/payments";

// Банкны хуулгатай тулгаад баталгаажуулах / татгалзах.
export async function approvePaymentAction(formData: FormData) {
  await requireAdmin();
  const id = String(formData.get("id") ?? "");
  if (id) await approvePayment(id);
  revalidatePath("/admin", "layout");
}

export async function rejectPaymentAction(formData: FormData) {
  await requireAdmin();
  const id = String(formData.get("id") ?? "");
  if (id) await rejectPayment(id);
  revalidatePath("/admin", "layout");
}
