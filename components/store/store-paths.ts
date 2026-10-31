import type { ProductType } from "@/lib/mock/products";

export const storeMeta: Record<ProductType, { base: string; title: string; description: string }> = {
  product: {
    base: "/products",
    title: "Бүтээгдэхүүн",
    description: "Гараар урласан тоглоом, бэлгийн багц, хавтага",
  },
  material: {
    base: "/materials",
    title: "Материал",
    description: "Хятад, Туркээс оруулж ирсэн нэхмэлийн утас болон туслах материал",
  },
};
