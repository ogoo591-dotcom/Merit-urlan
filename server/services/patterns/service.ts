import "server-only";

import * as productRepo from "@/server/repository/catalog/product";
import * as patternRepo from "@/server/repository/pattern/pattern";
import * as patternMaterialRepo from "@/server/repository/pattern/pattern-material";
import { transaction } from "@/server/repository/transaction";
import type { Pattern } from "@/types/patterns";

// Схем засах (админ).

export async function savePattern(pattern: Pattern, originalId?: string) {
  // Дэлгүүрт байхгүй material id-г холбоосгүй (зөвхөн нэртэй) болгоно.
  const linkedIds = pattern.materials.flatMap((material) => (material.materialId ? [material.materialId] : []));
  const existing = new Set((await productRepo.findProductsByIds(linkedIds)).map((product) => product.id));
  await transaction(async (tx) => {
    const id = originalId ?? pattern.id;
    const values = {
      name: pattern.name,
      description: pattern.description,
      price: pattern.price,
      coverImage: pattern.coverImage,
      type: pattern.type,
      level: pattern.level,
      size: pattern.size,
      sourceLanguage: pattern.sourceLanguage,
      credit: pattern.credit ?? null,
      filePath: pattern.filePath,
    };
    if (originalId) {
      await patternRepo.updatePattern(id, values, tx);
    } else {
      if (await patternRepo.patternIdExists(id, tx)) throw new Error("Энэ ID-тай схем аль хэдийн байна.");
      await patternRepo.insertPatterns([{ id, ...values, createdAt: new Date(pattern.createdAt) }], tx);
    }
    await patternMaterialRepo.deleteMaterialsByPattern(id, tx);
    await patternMaterialRepo.insertPatternMaterials(
      pattern.materials.map((material, position) => ({ patternId: id, name: material.name, productId: material.materialId && existing.has(material.materialId) ? material.materialId : null, position })),
      tx,
    );
  });
}

// Худалдан авалтын эрх эвдрэхгүйн тулд мөрийг устгахгүй, deleted_at тэмдэглэнэ.
export async function deletePattern(id: string) {
  await patternRepo.softDeletePattern(id);
}
