// Бүтээгдэхүүн, материалын mock өгөгдөл. Үнэ, үлдэгдэл түр утга — жинхэнэ тоогоор солино.
// id нь хуучин /shop/... хаягийн slug-тай ижил тул хуучин холбоосууд шинэ хуудас руу зөв шилжинэ.

export type ProductType = "product" | "material";
export type Availability = "ready" | "made_to_order";
export type Origin = "Хятад" | "Турк";

export type StoreProduct = {
  id: string;
  name: string;
  description: string;
  price: number;
  images: string[];
  category: string;
  type: ProductType;
  stock: number;
  availability: Availability;
  // Захиалгаар хийх бол хэдэн хоногт бэлэн болох.
  leadDays?: number;
  // Зөвхөн материалд.
  origin?: Origin;
};

export const mockProducts: StoreProduct[] = [
  {
    id: "snoopy-dog",
    name: "Snoopy нохой",
    description: "Улаан хүзүүвчтэй, гараар нэхсэн цагаан Snoopy нохой. Хүүхдэд бэлэглэхэд тохиромжтой.",
    price: 55000,
    images: ["/products/snoopy-dog.webp"],
    category: "Тоглоом",
    type: "product",
    stock: 1,
    availability: "ready",
  },
  {
    id: "little-bunny-sarnai",
    name: "Little Bunny — Сарнай",
    description: "Улаан даашинзтай, нэр хатгамалтай саарал туулай. Даашинзан дээрх нэрийг захиалгаар өөрчилж болно.",
    price: 45000,
    images: ["/products/little-bunny-sarnai.webp", "/products/little-bunny-white.webp"],
    category: "Тоглоом",
    type: "product",
    stock: 3,
    availability: "made_to_order",
    leadDays: 7,
  },
  {
    id: "big-bunny",
    name: "Big Bunny",
    description: "Ягаан туузтай, том хэмжээтэй цагаан туулай.",
    price: 55000,
    images: ["/products/big-bunny.webp"],
    category: "Тоглоом",
    type: "product",
    stock: 2,
    availability: "ready",
  },
  {
    id: "ukher",
    name: "Үхэр",
    description: "Шар судалтай өмдтэй, хөөрхөн үхэр тоглоом.",
    price: 50000,
    images: ["/products/ukher.webp"],
    category: "Тоглоом",
    type: "product",
    stock: 0,
    availability: "ready",
  },
  {
    id: "piggy-cow",
    name: "Piggy & Cow",
    description: "Гахай, үхэр хоёр тоглоомын хос. Найз нөхөд, ах дүүд бэлэглэхэд тохиромжтой.",
    price: 90000,
    images: ["/products/piggy-cow.webp"],
    category: "Тоглоом",
    type: "product",
    stock: 4,
    availability: "made_to_order",
    leadDays: 10,
  },
  {
    id: "baby-set",
    name: "Нярайн бэлгийн багц",
    description: "Нярай хүүхдэд зориулсан гараар нэхсэн тоглоом, хувцасны иж бүрдэл.",
    price: 85000,
    images: ["/products/baby-set.webp"],
    category: "Бэлгийн багц",
    type: "product",
    stock: 5,
    availability: "made_to_order",
    leadDays: 7,
  },
  {
    id: "khavtaga-morin-tovch",
    name: "Хавтага — Морьтон",
    description: "Морьтон хүний хатгамалтай, шар торгон хавтага.",
    price: 35000,
    images: ["/products/khavtaga-morin-tovch.webp", "/products/khavtaga-mori.webp"],
    category: "Хавтага",
    type: "product",
    stock: 2,
    availability: "ready",
  },
  {
    id: "khavtaga-mori",
    name: "Хавтага — Морь",
    description: "Морины хатгамалтай, шар торгон хавтага.",
    price: 35000,
    images: ["/products/khavtaga-mori.webp", "/products/khavtaga-morin-tovch.webp"],
    category: "Хавтага",
    type: "product",
    stock: 1,
    availability: "ready",
  },

  {
    id: "pipe-cleaner-black-100",
    name: "Синель утас — Хар (100ш)",
    description: "Гар урлал, цэцэг, жижиг дүрс хийхэд зориулагдсан зөөлөн хар синель утас.",
    price: 2900,
    images: ["/chenille-black.svg"],
    category: "Синель утас",
    type: "material",
    stock: 2,
    availability: "ready",
    origin: "Турк",
  },
  {
    id: "pipe-cleaner-red-100",
    name: "Синель утас — Улаан (100ш)",
    description: "Онцгой тод улаан өнгөтэй, гоёлын деталь хийхэд тохиромжтой синель утас.",
    price: 2900,
    images: ["/chenille-red.svg"],
    category: "Синель утас",
    type: "material",
    stock: 6,
    availability: "ready",
    origin: "Турк",
  },
  {
    id: "pipe-cleaner-yellow-100",
    name: "Синель утас — Шар (100ш)",
    description: "Хурц шар өнгийн гар урлалын синель утас.",
    price: 2900,
    images: ["/chenille-yellow.svg"],
    category: "Синель утас",
    type: "material",
    stock: 0,
    availability: "ready",
    origin: "Турк",
  },
  {
    id: "pipe-cleaner-green-100",
    name: "Синель утас — Ногоон (100ш)",
    description: "Навч, иш, ногоон деталь хийхэд тохирсон синель утас.",
    price: 2900,
    images: ["/chenille-green.svg"],
    category: "Синель утас",
    type: "material",
    stock: 8,
    availability: "ready",
    origin: "Турк",
  },
  {
    id: "12mm-bor-tovch-10",
    name: "12мм товч — Бор (10ш)",
    description: "Нэхмэл амьтан, хүүхдийн хувцас, жижиг гоёлын ажилд тохирох 12мм хэмжээтэй товч.",
    price: 2500,
    images: ["/buttons-brown.svg"],
    category: "Товч",
    type: "material",
    stock: 7,
    availability: "ready",
    origin: "Хятад",
  },
  {
    id: "buttons-sky",
    name: "12мм товч — Цэнхэр (10ш)",
    description: "Тэнгэрийн цэнхэр өнгийн 12мм товч, amigurumi детальд тохиромжтой.",
    price: 2500,
    images: ["/buttons-sky.svg"],
    category: "Товч",
    type: "material",
    stock: 7,
    availability: "ready",
    origin: "Хятад",
  },
  {
    id: "buttons-coral",
    name: "12мм товч — Coral (10ш)",
    description: "Шүрэн ягаан өнгийн 12мм товч.",
    price: 2500,
    images: ["/buttons-coral.svg"],
    category: "Товч",
    type: "material",
    stock: 4,
    availability: "ready",
    origin: "Хятад",
  },
  {
    id: "buttons-lilac",
    name: "12мм товч — Lilac (10ш)",
    description: "Цайвар нил ягаан өнгийн 12мм товч.",
    price: 2500,
    images: ["/buttons-lilac.svg"],
    category: "Товч",
    type: "material",
    stock: 10,
    availability: "made_to_order",
    leadDays: 14,
    origin: "Хятад",
  },
];
