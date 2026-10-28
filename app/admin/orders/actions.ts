"use server";

import { revalidatePath } from "next/cache";

import { getAdminSupabase } from "@/lib/auth";
import { enrollmentStatusLabels, orderStatusLabels } from "@/lib/orders";

export async function setOrderStatus(formData: FormData) {
  const supabase = await getAdminSupabase();
  const status = String(formData.get("status"));
  if (!(status in orderStatusLabels)) return;

  const { error } = await supabase.rpc("set_order_status", {
    p_order_id: Number(formData.get("id")),
    p_status: status,
  });
  if (error) console.error("set_order_status failed", error);

  revalidatePath("/admin", "layout");
}

export async function setEnrollmentStatus(formData: FormData) {
  const supabase = await getAdminSupabase();
  const status = String(formData.get("status"));
  if (!(status in enrollmentStatusLabels)) return;

  await supabase.from("course_enrollments").update({ status }).eq("id", Number(formData.get("id")));
  revalidatePath("/admin", "layout");
}
