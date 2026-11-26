import "server-only";

import { clerkClient } from "@clerk/nextjs/server";
import type { WebhookEvent } from "@clerk/nextjs/webhooks";

import * as userRepo from "@/server/repository/user/user";
import type { DbExecutor } from "@/server/repository/transaction";

type ClerkUserJSON = Extract<WebhookEvent, { type: "user.created" | "user.updated" }>["data"];

// Google эсвэл имэйл кодоор бүртгүүлдэг тул имэйл үргэлж байна; байхгүй бол md_user бичихгүй (алдаа).
function requireEmail(email: string | undefined, userId: string) {
  if (!email) throw new Error(`Clerk хэрэглэгч ${userId}-д имэйл алга.`);
  return email;
}

// Clerk webhook (user.created / user.updated): md_user-ийг Clerk-ийн хуулбараар шинэчилнэ.
export async function saveClerkUser(data: ClerkUserJSON) {
  const primary = data.email_addresses.find((item) => item.id === data.primary_email_address_id);
  await userRepo.upsertUser({
    id: data.id,
    email: requireEmail((primary ?? data.email_addresses[0])?.email_address, data.id),
    name: [data.first_name, data.last_name].filter(Boolean).join(" ") || null,
    imageUrl: data.image_url ?? "",
  });
}

// Clerk webhook (user.deleted).
export async function removeClerkUser(userId: string) {
  await userRepo.softDeleteUser(userId);
}

// Webhook хоцорсон үеийн нөөц: Clerk API-аас уншиж md_user-д бичнэ.
export async function syncUser(userId: string, db?: DbExecutor) {
  const user = await (await clerkClient()).users.getUser(userId);
  return userRepo.upsertUser(
    {
      id: userId,
      email: requireEmail((user.primaryEmailAddress ?? user.emailAddresses[0])?.emailAddress, userId),
      name: user.fullName,
      imageUrl: user.imageUrl,
    },
    db,
  );
}

// Захиалга, төлбөр үүсгэхээс өмнө: md_user-ийг баталгаажуулж, админ хаасан бол татгалзана.
export async function ensureActiveUser(userId: string, db?: DbExecutor) {
  const user = await syncUser(userId, db);
  if (!user.isActive) throw new Error("Таны бүртгэл хаагдсан тул захиалга хийх боломжгүй. Messenger-ээр холбогдоно уу.");
  return user;
}

// Админ хэрэглэгчийг хаах/нээх: Clerk ban нь бүх session-ийг таслаж нэвтрэхийг хориглоно, is_active нь захиалгыг.
export async function setUserActive(userId: string, isActive: boolean) {
  const clerk = await clerkClient();
  await (isActive ? clerk.users.unbanUser(userId) : clerk.users.banUser(userId));
  await userRepo.setUserActive(userId, isActive);
}
