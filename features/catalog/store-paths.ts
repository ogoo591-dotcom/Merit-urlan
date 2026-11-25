import type { ProductType } from "@/types/catalog";

export const storeMeta: Record<ProductType, { base: string; title: string; description: string }> = {
  product: {
    base: "/products",
    title: "Бүтээгдэхүүн",
    description: "Гараар урласан сүлжмэл бүтээгдэхүүн, бэлгийн багц, зүү ороосон бүтээл",
  },
  material: {
    base: "/materials",
    title: "Материал",
    description: "Хятад, Туркээс оруулж ирсэн нэхмэлийн утас болон туслах материал",
  },
};
