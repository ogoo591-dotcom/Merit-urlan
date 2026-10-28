import "server-only";

import { createClient, type SupabaseClient } from "@supabase/supabase-js";

let client: SupabaseClient | null = null;

export function isSupabaseConfigured() {
  return Boolean(process.env.SUPABASE_URL && process.env.SUPABASE_SERVICE_ROLE_KEY);
}

// Зөвхөн сервер дээр ажиллана. service_role түлхүүр RLS-ийг алгасдаг тул
// энэ клиентийг хэзээ ч браузер руу дамжуулахгүй.
export function getSupabase() {
  if (!isSupabaseConfigured()) {
    throw new Error("SUPABASE_URL болон SUPABASE_SERVICE_ROLE_KEY .env.local-д тохируулаагүй байна.");
  }

  client ??= createClient(process.env.SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!, {
    auth: { persistSession: false, autoRefreshToken: false },
  });

  return client;
}

export const productImageBucket = "product-images";
