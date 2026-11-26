import "server-only";

import * as userCourseRepo from "@/server/repository/access/user-course";
import * as userPatternRepo from "@/server/repository/access/user-pattern";
import type { DbExecutor } from "@/server/repository/transaction";

type Grant = { itemId: string; price: number };

// Төлбөр баталгаажихад (эсвэл админ гараар) эрх олгоно. Аль хэдийн эрхтэй бол алгасна.
export async function grantAccess(
  input: { userId: string; paymentId?: string; courses: Grant[]; patterns: Grant[] },
  db?: DbExecutor,
) {
  const base = { userId: input.userId, paymentId: input.paymentId ?? null };
  await userCourseRepo.grantUserCourses(
    input.courses.map((item) => ({ ...base, courseId: item.itemId, price: item.price })),
    db,
  );
  await userPatternRepo.grantUserPatterns(
    input.patterns.map((item) => ({ ...base, patternId: item.itemId, price: item.price })),
    db,
  );
}
