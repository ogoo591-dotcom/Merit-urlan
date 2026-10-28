"use server";

import { requireUserId } from "@/lib/auth";
import { getSupabase, isSupabaseConfigured } from "@/lib/supabase";

export type CheckoutState = { error?: string; orderId?: number };

type CartPayload = Array<{ slug: string; quantity: number }>;

function field(formData: FormData, name: string, max = 300) {
  return String(formData.get(name) ?? "").trim().slice(0, max);
}

export async function placeOrder(_state: CheckoutState, formData: FormData): Promise<CheckoutState> {
  const userId = await requireUserId();

  if (!isSupabaseConfigured()) {
    return { error: "Захиалгын систем хараахан тохируулагдаагүй байна. Messenger-ээр холбогдоно уу." };
  }

  const customerName = field(formData, "name", 120);
  const phone = field(formData, "phone", 20);
  const email = field(formData, "email", 160);
  const district = field(formData, "district", 60);
  const khoroo = field(formData, "khoroo", 20);
  const detail = field(formData, "detail", 400);
  const address = district && detail ? [district, khoroo && `${khoroo}-р хороо`, detail].filter(Boolean).join(", ") : "";
  const note = field(formData, "note", 1000);

  if (!customerName || !/^[0-9+\s-]{8,}$/.test(phone) || !address) {
    return { error: "Нэр, утас (8+ оронтой), хаягаа бүрэн бөглөнө үү." };
  }

  let items: CartPayload;
  try {
    items = (JSON.parse(field(formData, "items", 20_000)) as CartPayload)
      .map((item) => ({ slug: String(item.slug), quantity: Math.floor(Number(item.quantity)) }))
      .filter((item) => item.slug && item.quantity > 0);
  } catch {
    return { error: "Сагсны мэдээлэл буруу байна." };
  }
  if (!items.length) return { error: "Сагс хоосон байна." };

  const { data, error } = await getSupabase().rpc("place_order", {
    p_user_id: userId,
    p_customer_name: customerName,
    p_phone: phone,
    p_email: email || null,
    p_address: address,
    p_note: note || null,
    p_items: items,
  });

  if (error) {
    const outOfStock = error.message.match(/OUT_OF_STOCK:(.+)/);
    if (outOfStock) return { error: `"${outOfStock[1]}" бараа хүрэлцэхгүй байна. Тоогоо багасгана уу.` };
    if (error.message.includes("NOT_FOUND")) return { error: "Сагсанд байгаа зарим бараа зарагдахаа больсон байна." };
    console.error("place_order failed", error);
    return { error: "Захиалга үүсгэхэд алдаа гарлаа. Дахин оролдоно уу." };
  }

  return { orderId: data as number };
}
