import "server-only";

import { currentUser } from "@clerk/nextjs/server";

import * as userRepo from "@/server/repository/user/user";
import type { DbExecutor } from "@/server/repository/transaction";

// Захиалга, төлбөр үүсгэхээс өмнө md_user-д хэрэглэгч байгааг баталгаажуулна (Clerk webhook-ийн нөөц).
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
