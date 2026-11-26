"use server";

import { runAdminAction } from "@/server/shared/admin-action";
import { approvePayment, rejectPayment } from "@/server/services/payments/service";
import { isUuid } from "@/server/shared/uuid";

// Банкны хуулгатай тулгаад баталгаажуулах / татгалзах.
export async function approvePaymentAction(formData: FormData) {
  const id = String(formData.get("id") ?? "");
  await runAdminAction((adminId) => (isUuid(id) ? approvePayment(id, adminId) : Promise.resolve()));
}

export async function rejectPaymentAction(formData: FormData) {
  const id = String(formData.get("id") ?? "");
  await runAdminAction((adminId) => (isUuid(id) ? rejectPayment(id, adminId) : Promise.resolve()));
}
