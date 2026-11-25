import "server-only";

// Схем зааврын mock өгөгдөл. filePath нь private/ хавтас доторх бүтэн схем (зураг эсвэл PDF) — зөвхөн сервер уншина.
// coverImage нь нийтэд нээлттэй тул зөвхөн бүтээлийн зураг байна, заавар агуулахгүй. Үнэ түр утга.

export type PatternType = "toy" | "clothes" | "home" | "accessory";
export type PatternLevel = "beginner" | "intermediate" | "advanced";

export type MockPattern = {
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

export const mockPatterns: MockPattern[] = [
  {
    id: "little-frog",
    name: "Бяцхан мэлхий",
    description: "Том нүдтэй, ногоон бяцхан мэлхий. Толгой, бие, нүд, гар, хөлийн схем нэг хуудсанд.",
    price: 0,
    coverImage: "/patterns/little-frog-cover.jpg",
    type: "toy",
    level: "beginner",
    materials: [{ name: "Цайвар ногоон, хар ногоон, цагаан утас" }, { name: "Нүд (хар)" }, { name: "Чихмэл" }],
    size: "",
    sourceLanguage: "Англи",
    credit: "@panpan.crochet",
    createdAt: "2026-11-02",
    filePath: "private/patterns/little-frog.jpg",
  },
  {
    id: "angry-bird",
    name: "Улаан шувуу — түлхүүрийн оосор",
    description: "Жижиг, хурдан хийгддэг түлхүүрийн оосор. Мөр бүрийн утасны өнгийг схем дээр ялгаж тэмдэглэсэн.",
    price: 0,
    coverImage: "/patterns/angry-bird-cover.jpg",
    type: "accessory",
    level: "beginner",
    materials: [{ name: "Улаан, цагаан, улбар шар, хар утас" }, { name: "2.5мм дэгээ" }, { name: "Түлхүүрийн цагираг" }],
    size: "",
    sourceLanguage: "Англи",
    credit: "@YarnVarioussse",
    createdAt: "2026-11-02",
    filePath: "private/patterns/angry-bird.jpg",
  },
  {
    id: "little-spider",
    name: "Бяцхан аалз баатар",
    description: "Толгой, бие, гар, хөл, нүд болон аалзны торын дэлгэрэнгүй схем.",
    price: 8000,
    coverImage: "/patterns/little-spider-cover.jpg",
    type: "toy",
    level: "intermediate",
    materials: [{ name: "Улаан, цэнхэр, цагаан, хар утас" }, { name: "Тохирох дэгээ" }, { name: "2 ширхэг дугуй сувд (нүдэнд)" }, { name: "Чихмэл" }],
    size: "",
    sourceLanguage: "Англи",
    createdAt: "2026-11-01",
    filePath: "private/patterns/little-spider.jpg",
  },
  {
    id: "cat-ear-doll",
    name: "Муур чихтэй хүүхэлдэй",
    description: "Муур чихтэй, хувцас, цүнх, муур нөхөртэй хүүхэлдэй. Товчлол, материалын жагсаалттай.",
    price: 12000,
    coverImage: "/patterns/cat-ear-doll-cover.jpg",
    type: "toy",
    level: "advanced",
    materials: [
      { name: "Schachenmayr Catania утас (олон өнгө)" },
      { name: "2мм дэгээ" },
      { name: "Аюулгүй нүд 7мм, 3мм" },
      { name: "Хатгамлын утас, зүү, хайч, 6мм товч, даавууны цавуу" },
    ],
    size: "Өндөр ~19 см",
    sourceLanguage: "Англи",
    credit: "moonlightcrochet89",
    createdAt: "2026-11-01",
    filePath: "private/patterns/cat-ear-doll.jpg",
  },
];
