import "server-only";

import { currentUser } from "@clerk/nextjs/server";
import type { WebhookEvent } from "@clerk/nextjs/webhooks";

import * as userRepo from "@/server/repository/user/user";
import type { DbExecutor } from "@/server/repository/transaction";

type ClerkUserJSON = Extract<
  WebhookEvent,
  { type: "user.created" | "user.updated" }
>["data"];

// Clerk webhook (user.created / user.updated): md_user-ийг Clerk-ийн хуулбараар шинэчилнэ.
export async function saveClerkUser(data: ClerkUserJSON) {
  const email =
    data.email_addresses.find(
      (item) => item.id === data.primary_email_address_id,
    )?.email_address ?? null;
  const phone =
    data.phone_numbers.find((item) => item.id === data.primary_phone_number_id)
      ?.phone_number ?? null;
  const name =
    [data.first_name, data.last_name].filter(Boolean).join(" ") || null;
  await userRepo.upsertUser({
    id: data.id,
    email,
    name,
    phone,
    imageUrl: data.image_url ?? null,
  });
}

// Clerk webhook (user.deleted).
export async function removeClerkUser(userId: string) {
  await userRepo.softDeleteUser(userId);
}

// Захиалга, төлбөр үүсгэхээс өмнө md_user-д хэрэглэгч байгааг баталгаажуулна (webhook хоцорсон үеийн нөөц).
export async function syncUser(userId: string, db?: DbExecutor) {
  const user = await currentUser().catch(() => null);
  const profile =
    user?.id === userId
      ? {
          email: user.primaryEmailAddress?.emailAddress ?? null,
          name: user.fullName ?? null,
          phone: user.primaryPhoneNumber?.phoneNumber ?? null,
          imageUrl: user.imageUrl ?? null,
        }
      : {};
  await userRepo.upsertUser({ id: userId, ...profile }, db);
}
