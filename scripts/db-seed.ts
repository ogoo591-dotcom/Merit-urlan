// Mock өгөгдлийг (server/mock, lib/navigation) хоосон DB рүү хуулна. Ажиллуулах: npm run db:seed
// Бараа аль хэдийн байвал юу ч хийхгүй. Бүгд нэг transaction-д — алдаа гарвал юу ч бичигдэхгүй.
import Module from "node:module";

// server/ файлууд "server-only" import хийдэг (Next-ээс гадна алдаа шиддэг) — скриптэд хоосон модулиар орлуулна.
const loader = Module as unknown as { _load: (request: string, ...rest: unknown[]) => unknown };
const originalLoad = loader._load;
loader._load = (request, ...rest) => (request === "server-only" ? {} : originalLoad(request, ...rest));

async function main() {
  process.loadEnvFile(".env.local");

  const { getDb } = await import("@/server/db/client");
  const { catalogCategories } = await import("@/lib/navigation");
  const { productColors } = await import("@/types/catalog");
  const { mockProducts } = await import("@/server/mock/products");
  const { mockCourses } = await import("@/server/mock/courses");
  const { mockPatterns } = await import("@/server/mock/patterns");
  const galleryImages = (await import("@/lib/content/gallery-images.json")).default;
  const color = await import("@/server/repository/catalog/color");
  const brand = await import("@/server/repository/catalog/brand");
  const category = await import("@/server/repository/catalog/category");
  const product = await import("@/server/repository/catalog/product");
  const productImage = await import("@/server/repository/catalog/product-image");
  const productColor = await import("@/server/repository/catalog/product-color");
  const course = await import("@/server/repository/course/course");
  const courseImage = await import("@/server/repository/course/course-image");
  const courseOutcome = await import("@/server/repository/course/course-outcome");
  const courseTopic = await import("@/server/repository/course/course-topic");
  const lesson = await import("@/server/repository/course/lesson");
  const pattern = await import("@/server/repository/pattern/pattern");
  const patternMaterial = await import("@/server/repository/pattern/pattern-material");

  const db = getDb();
  const existing = await product.countProducts(db);
  if (existing > 0) {
    console.log(`DB-д ${existing} бараа аль хэдийн байна — seed алгаслаа.`);
    return;
  }

  // Жагсаалтын дараалал mock-ийнхтэй ижил байхаар created_at-ийг секундээр зөрүүлнэ (бараа: шинэ нь эхэнд, сургалт: хуучин нь эхэнд).
  const base = Date.now();
  const at = (offsetSeconds: number) => new Date(base + offsetSeconds * 1000);

  await db.transaction(async (tx) => {
    await color.insertColors(
      Object.entries(productColors).map(([key, value], position) => ({
        key: key as keyof typeof productColors,
        label: value.label,
        hex: value.hex,
        position,
      })),
      tx,
    );

    const brandNames = [...new Set(mockProducts.map((item) => item.brand).filter((name): name is string => !!name))];
    const brandIds = new Map((await brand.insertBrands(brandNames.map((name) => ({ name })), tx)).map((row) => [row.name, row.id]));

    // Ангилал: "<type>|<нэр>" ба "<type>|<нэр>|<дэд нэр>" → id
    const categoryIds = new Map<string, string>();
    for (const type of ["product", "material"] as const) {
      for (const [position, top] of catalogCategories[type].entries()) {
        const [parent] = await category.insertCategories([{ type, slug: top.slug, name: top.label, position }], tx);
        categoryIds.set(`${type}|${top.label}`, parent.id);
        const subs = top.groups.flatMap((group) => group.subs);
        const children = await category.insertCategories(
          subs.map((sub, index) => ({ type, parentId: parent.id, slug: sub.slug, name: sub.label, position: index })),
          tx,
        );
        for (const child of children) categoryIds.set(`${type}|${top.label}|${child.name}`, child.id);
      }
    }

    await product.insertProducts(
      mockProducts.map((item, index) => {
        const key = item.subcategory ? `${item.type}|${item.category}|${item.subcategory}` : `${item.type}|${item.category}`;
        const categoryId = categoryIds.get(key);
        if (!categoryId) throw new Error(`Ангилал олдсонгүй: ${key} (${item.id})`);
        return {
          id: item.id,
          type: item.type,
          categoryId,
          brandId: item.brand ? brandIds.get(item.brand) : null,
          name: item.name,
          description: item.description,
          price: item.price,
          stock: item.stock,
          availability: item.availability,
          leadDays: item.leadDays ?? null,
          origin: item.origin ?? null,
          createdAt: at(-index),
        };
      }),
      tx,
    );
    await productImage.insertProductImages(
      mockProducts.flatMap((item) => item.images.map((path, position) => ({ productId: item.id, path, position }))),
      tx,
    );
    await productColor.insertProductColors(
      mockProducts.flatMap((item) => [...new Set(item.colors ?? [])].map((colorKey) => ({ productId: item.id, colorKey }))),
      tx,
    );

    // Сургалтын зураг server/mock/db.ts-тэй ижлээр gallery-images.json-оос олдоно.
    const coverFor = (source: string) => galleryImages.find((image) => image.source === source)?.src ?? "/Hero.jpg";
    await course.insertCourses(
      mockCourses.map((item, index) => ({
        id: item.id,
        title: item.title,
        description: item.description,
        price: item.price,
        coverImage: coverFor(item.coverSource),
        level: item.level,
        totalDuration: item.totalDuration,
        createdAt: at(index),
      })),
      tx,
    );
    await courseImage.insertCourseImages(
      mockCourses.flatMap((item) =>
        (item.gallerySources ?? []).map((source, position) => ({ courseId: item.id, path: coverFor(source), position })),
      ),
      tx,
    );
    await courseOutcome.insertCourseOutcomes(
      mockCourses.flatMap((item) => item.outcomes.map((content, position) => ({ courseId: item.id, content, position }))),
      tx,
    );
    await courseTopic.insertCourseTopics(
      mockCourses.flatMap((item) => item.topics.map((topic) => ({ courseId: item.id, topic }))),
      tx,
    );
    await lesson.insertLessons(
      mockCourses.flatMap((item) =>
        item.lessons.map((entry, index) => ({
          courseId: item.id,
          position: index + 1,
          title: entry.title,
          duration: entry.duration,
          isFree: entry.isFree,
          videoUrl: entry.videoUrl,
        })),
      ),
      tx,
    );

    await pattern.insertPatterns(
      mockPatterns.map((item) => ({
        id: item.id,
        name: item.name,
        description: item.description,
        price: item.price,
        coverImage: item.coverImage,
        type: item.type,
        level: item.level,
        size: item.size,
        sourceLanguage: item.sourceLanguage,
        credit: item.credit ?? null,
        filePath: item.filePath,
        createdAt: new Date(item.createdAt),
      })),
      tx,
    );
    await patternMaterial.insertPatternMaterials(
      mockPatterns.flatMap((item) =>
        item.materials.map((entry, position) => ({
          patternId: item.id,
          name: entry.name,
          productId: entry.materialId ?? null,
          position,
        })),
      ),
      tx,
    );
  });

  console.log(
    `✓ Seed: ${mockProducts.length} бараа, ${mockCourses.length} сургалт, ${mockPatterns.length} схем, ${categoryCount(catalogCategories)} ангилал`,
  );
}

function categoryCount(categories: Record<string, Array<{ groups: Array<{ subs: unknown[] }> }>>) {
  return Object.values(categories)
    .flat()
    .reduce((sum, top) => sum + 1 + top.groups.flatMap((group) => group.subs).length, 0);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("✗ Seed амжилтгүй:", error instanceof Error ? error.message : error);
    process.exit(1);
  });
