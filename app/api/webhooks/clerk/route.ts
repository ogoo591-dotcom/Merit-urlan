import { verifyWebhook } from "@clerk/nextjs/webhooks";
import type { NextRequest } from "next/server";

import { removeClerkUser, saveClerkUser } from "@/server/services/users/service";

// Clerk → md_user хуулбар. Гарын үсгийг CLERK_WEBHOOK_SIGNING_SECRET-ээр шалгана; DB алдаа бол 500 → Clerk дахин илгээнэ.
export async function POST(request: NextRequest) {
  let event;
  try {
    event = await verifyWebhook(request);
  } catch {
    return new Response("Invalid signature", { status: 400 });
  }

  if (event.type === "user.created" || event.type === "user.updated") await saveClerkUser(event.data);
  else if (event.type === "user.deleted" && event.data.id) await removeClerkUser(event.data.id);

  return new Response("ok");
}
