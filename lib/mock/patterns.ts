import "server-only";

// Схем зааврын mock өгөгдөл. pdfPath нь private/ хавтас доторх файл — зөвхөн сервер уншина.
// Үнэ, текст түр утга; PDF-үүд нь жишээ файл.

export type PatternType = "toy" | "clothes" | "home" | "accessory";
export type PatternLevel = "beginner" | "intermediate" | "advanced";

export type MockPattern = {
  id: string;
  name: string;
  description: string;
  price: number;
  // raw-images доторх файлын нэр (gallery-images.json-оос олно).
  coverSource: string;
  previews: string[];
  type: PatternType;
  level: PatternLevel;
  // materialId байвал "Материал" хэсгийн бараа руу холбоно.
  materials: Array<{ name: string; materialId?: string }>;
  size: string;
  sourceLanguage: string;
  pages: number;
  createdAt: string;
  pdfPath: string;
};

const previews = (id: string) => [`/patterns/${id}-1.svg`, `/patterns/${id}-2.svg`];

export const mockPatterns: MockPattern[] = [
  {
    id: "snoopy-dog",
    name: "Snoopy нохой",
    description: "Хар чихтэй, улаан хүзүүвчтэй Snoopy нохойны дэлгэрэнгүй схем. Хэсэг бүрийг зурагтай тайлбарласан.",
    price: 15000,
    coverSource: "2-.jpg",
    previews: previews("snoopy-dog"),
    type: "toy",
    level: "intermediate",
    materials: [
      { name: "Цагаан, хар, улаан нэхмэлийн утас" },
      { name: "2.5мм дэгээ" },
      { name: "Чихмэл (hollow fiber)" },
      { name: "12мм бор товч — нүдэнд", materialId: "12mm-bor-tovch-10" },
    ],
    size: "Өндөр ~25 см",
    sourceLanguage: "Англи",
    pages: 12,
    createdAt: "2026-09-02",
    pdfPath: "private/patterns/snoopy-dog.pdf",
  },
  {
    id: "little-bunny",
    name: "Little Bunny туулай",
    description: "Даашинзтай, урт чихтэй туулай. Даашинз дээр нэр хатгах зааврыг оруулсан.",
    price: 12000,
    coverSource: "4.jpg",
    previews: previews("little-bunny"),
    type: "toy",
    level: "beginner",
    materials: [
      { name: "Саарал, улаан, ногоон нэхмэлийн утас" },
      { name: "2.5мм дэгээ" },
      { name: "Чихмэл" },
      { name: "Цэнхэр товч — гоёлд", materialId: "buttons-sky" },
    ],
    size: "Өндөр ~30 см",
    sourceLanguage: "Орос",
    pages: 10,
    createdAt: "2026-08-15",
    pdfPath: "private/patterns/little-bunny.pdf",
  },
  {
    id: "piggy-cow",
    name: "Piggy & Cow",
    description: "Гахай, үхэр хоёр тоглоомын схем нэг багцад. Хувцсыг нь тусад нь нэхэж өмсгөнө.",
    price: 18000,
    coverSource: "10.jpg",
    previews: previews("piggy-cow"),
    type: "toy",
    level: "intermediate",
    materials: [
      { name: "Ягаан, саарал, улаан нэхмэлийн утас" },
      { name: "2.5мм дэгээ" },
      { name: "Чихмэл" },
      { name: "Coral товч — хувцсанд", materialId: "buttons-coral" },
    ],
    size: "Өндөр ~22 см",
    sourceLanguage: "Англи",
    pages: 16,
    createdAt: "2026-10-10",
    pdfPath: "private/patterns/piggy-cow.pdf",
  },
  {
    id: "snowman",
    name: "Цасан хүн",
    description: "Ороолт, малгайтай шинэ жилийн цасан хүн. Гацуур чимэглэлд ч тохиромжтой.",
    price: 10000,
    coverSource: "27.jpg",
    previews: previews("snowman"),
    type: "toy",
    level: "beginner",
    materials: [
      { name: "Цагаан, улаан, ногоон нэхмэлийн утас" },
      { name: "2.5мм дэгээ" },
      { name: "Улаан синель утас — ороолтын захад", materialId: "pipe-cleaner-red-100" },
    ],
    size: "Өндөр ~28 см",
    sourceLanguage: "Англи",
    pages: 8,
    createdAt: "2026-10-25",
    pdfPath: "private/patterns/snowman.pdf",
  },
  {
    id: "keychain-jersey",
    name: "Хувцастай түлхүүрийн оосор",
    description: "Дугаартай жижиг спорт цамц хэлбэрийн түлхүүрийн оосор. Багаар захиалахад тохиромжтой.",
    price: 8000,
    coverSource: "16.jpg",
    previews: previews("keychain-jersey"),
    type: "accessory",
    level: "beginner",
    materials: [
      { name: "Нил ягаан, цагаан нэхмэлийн утас" },
      { name: "2мм дэгээ" },
      { name: "Шар синель утас — тоо хатгахад", materialId: "pipe-cleaner-yellow-100" },
      { name: "Түлхүүрийн цагираг" },
    ],
    size: "~7 × 6 см",
    sourceLanguage: "Солонгос",
    pages: 6,
    createdAt: "2026-07-20",
    pdfPath: "private/patterns/keychain-jersey.pdf",
  },
  {
    id: "flower-blanket",
    name: "Цэцэгтэй хучлага",
    description: "Granny square аргаар нэхсэн, өнгө бүрээр цэцэглэсэн хучлага. Хэмжээгээ дөрвөлжний тоогоор тааруулна.",
    price: 20000,
    coverSource: "18.jpg",
    previews: previews("flower-blanket"),
    type: "home",
    level: "intermediate",
    materials: [
      { name: "Олон өнгийн нэхмэлийн утас (~1.2 кг)" },
      { name: "4мм дэгээ" },
      { name: "Ногоон синель утас — навчны чимэглэлд", materialId: "pipe-cleaner-green-100" },
    ],
    size: "~90 × 60 см (24 дөрвөлжин)",
    sourceLanguage: "Англи",
    pages: 14,
    createdAt: "2026-09-18",
    pdfPath: "private/patterns/flower-blanket.pdf",
  },
  {
    id: "baby-booties",
    name: "Нярайн гутал",
    description: "0–6 сартай нярайд зориулсан зөөлөн гутал. Гурван хэмжээгээр бичигдсэн.",
    price: 9000,
    coverSource: "6.jpg",
    previews: previews("baby-booties"),
    type: "clothes",
    level: "beginner",
    materials: [
      { name: "Хүүхдийн зөөлөн утас (~50 гр)" },
      { name: "3мм дэгээ" },
      { name: "Lilac товч — оосорт", materialId: "buttons-lilac" },
    ],
    size: "0–3, 3–6, 6–12 сар",
    sourceLanguage: "Англи",
    pages: 7,
    createdAt: "2026-10-01",
    pdfPath: "private/patterns/baby-booties.pdf",
  },
];
