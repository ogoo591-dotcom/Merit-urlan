// Схем зааврын төрлүүд (client, server хоёуланд). Pattern (filePath-тай) нь зөвхөн админ форм болон серверт.

export type PatternType = "toy" | "clothes" | "home" | "accessory";
export type PatternLevel = "beginner" | "intermediate" | "advanced";

export type Pattern = {
  id: string;
  name: string;
  description: string;
  // 0 бол үнэгүй: нэвтрэлт, төлбөргүйгээр шууд үзэж, татна.
  price: number;
  coverImage: string;
  type: PatternType;
  level: PatternLevel;
  // materialId байвал "Материал" хэсгийн бараа руу холбоно.
  materials: Array<{ name: string; materialId?: string }>;
  size: string;
  sourceLanguage: string;
  // Схемийн эх зохиогч.
  credit?: string;
  createdAt: string;
  filePath: string;
};

export type PatternMaterial = { name: string; href?: string; category?: string };

export type PatternSummary = {
  id: string;
  name: string;
  description: string;
  price: number;
  isFree: boolean;
  // Нийтэд нээлттэй бүтээлийн зураг. Бүтэн схем биш.
  cover: { src: string };
  fileKind: "image" | "pdf";
  credit?: string;
  type: PatternType;
  typeLabel: string;
  level: PatternLevel;
  levelLabel: string;
  size: string;
  sourceLanguage: string;
  createdAt: string;
};

export type PatternDetail = PatternSummary & { materials: PatternMaterial[] };

export const patternTypeLabels: Record<PatternType, string> = {
  toy: "Тоглоом",
  clothes: "Хувцас",
  home: "Гэр ахуй",
  accessory: "Аксессуар",
};

export const patternLevelLabels: Record<PatternLevel, string> = {
  beginner: "Анхан шат",
  intermediate: "Дунд шат",
  advanced: "Ахисан шат",
};

export function formatPatternPrice(value: number) {
  return value === 0 ? "Үнэгүй" : `${value.toLocaleString("en-US")}₮`;
}
