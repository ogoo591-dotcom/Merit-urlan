import "server-only";

import { updateDb } from "@/server/mock/db";
import type { Pattern } from "@/types/patterns";

// Схем засах (админ).

export async function savePattern(pattern: Pattern, originalId?: string) {
  await updateDb((db) => {
    const index = db.patterns.findIndex((item) => item.id === (originalId ?? pattern.id));
    const clash = db.patterns.some((item, itemIndex) => item.id === pattern.id && itemIndex !== index);
    if (clash) throw new Error("Энэ ID-тай схем аль хэдийн байна.");
    if (index === -1) db.patterns.push(pattern);
    else db.patterns[index] = pattern;
  });
}

export async function deletePattern(id: string) {
  await updateDb((db) => {
    db.patterns = db.patterns.filter((item) => item.id !== id);
  });
}
