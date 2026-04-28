export type Product = {
  name: string;
  price: string;
  description: string;
  palette: [string, string];
  label: string;
};

export type Course = {
  title: string;
  duration: string;
  level: string;
  description: string;
  seats: string;
  palette: [string, string];
};

export type Stat = {
  value: string;
  label: string;
};

export type Category = {
  title: string;
  description: string;
  href: string;
  icon: string;
};

export type HomeCourse = {
  category: string;
  lessons: string;
  title: string;
  description: string;
  price: string;
  tint: string;
};

export type ShopCategoryKey = "supplies" | "finished";

export type CatalogItem = {
  slug: string;
  name: string;
  category: ShopCategoryKey;
  subcategory: string;
  price: string;
  priceValue: number;
  stock: number;
  brand: string;
  image: string;
  description: string;
  badge?: string;
  options?: Array<{
    slug: string;
    name: string;
    price: string;
    stock: number;
    image: string;
  }>;
  features?: string[];
};

export type ShopCategoryMeta = {
  key: ShopCategoryKey;
  label: string;
  breadcrumb: string;
  href: string;
  heroEyebrow: string;
  heroTitle: string;
  heroDescription: string;
  heroPrimaryCta: string;
  heroSecondaryCta: string;
  heroAccent: string;
};

export const navigation = [
  { href: "/shop", label: "Дэлгүүр" },
  { href: "/courses", label: "Сургалт" },
  { href: "/", label: "Сэтгүүл" },
] as const;

export const featuredProducts: Product[] = [
  {
    name: "Heirloom Bunny",
    price: "48,000 MNT",
    description: "A keepsake crochet toy with a calm neutral palette and hand-finished details.",
    palette: ["#f7e9dc", "#d8b3a0"],
    label: "Best Seller",
  },
  {
    name: "Soft Bloom Bag",
    price: "72,000 MNT",
    description: "Editorial-style everyday bag woven with structured cotton yarn and soft texture.",
    palette: ["#efe4d8", "#a57967"],
    label: "New Drop",
  },
  {
    name: "Baby Gift Set",
    price: "95,000 MNT",
    description: "A ready-to-gift bundle featuring a rattle, bonnet, and mini blanket.",
    palette: ["#f4ede7", "#c48e74"],
    label: "Gift Ready",
  },
];

export const featuredCourses: Course[] = [
  {
    title: "Crochet Foundations",
    duration: "4 weeks",
    level: "Beginner",
    description: "Learn stitches, tension, and finishing techniques through a guided first project.",
    seats: "12 seats",
    palette: ["#f5ece5", "#cfa893"],
  },
  {
    title: "Amigurumi Studio",
    duration: "6 weeks",
    level: "Intermediate",
    description: "Shape expressive character pieces while improving form, stuffing, and pattern reading.",
    seats: "10 seats",
    palette: ["#eee2d8", "#9f7667"],
  },
  {
    title: "Market Collection Lab",
    duration: "3 weeks",
    level: "Small Business",
    description: "Build a cohesive mini collection and pricing strategy for selling handmade work.",
    seats: "8 seats",
    palette: ["#f7efe9", "#b68772"],
  },
];

export const trustPoints = [
  "Handmade in Ulaanbaatar in small, carefully finished batches.",
  "Gentle fibers and gift-worthy packaging designed for meaningful keepsakes.",
  "Practical crochet teaching with clear pacing for beginners and growing makers.",
];

export const homeStats: Stat[] = [
  { value: "2,400+", label: "Идэвхтэй суралцагч" },
  { value: "180+", label: "Бүтээгдэхүүн" },
  { value: "24", label: "Мэргэжлийн курс" },
  { value: "98%", label: "Сэтгэл ханамж" },
];

export const homeCategories: Category[] = [
  {
    title: "Туслах материал",
    description: "Загвар, гарын авлага, шаблонууд",
    href: "/shop/supplies",
    icon: "◈",
  },
  {
    title: "Бэлэн бүтээгдэхүүн",
    description: "Тоглоом, багц, бэлгийн сонголт",
    href: "/shop/finished",
    icon: "◉",
  },
  {
    title: "Онлайн сургалт",
    description: "Мэргэжлийн видео курсууд",
    href: "/courses",
    icon: "▷",
  },
  {
    title: "Хямдралтай бараа",
    description: "Тусгай санал, хямдрал",
    href: "/shop/supplies",
    icon: "◐",
  },
];

export const homeFeaturedCourses: HomeCourse[] = [
  {
    category: "Бизнес",
    lessons: "12 хичээл",
    title: "Бизнес Эхлүүлэх Гарын Авлага",
    description: "Тэгнээс бизнес эхлүүлэх бүрэн курс",
    price: "149,000₮",
    tint: "#f1ebe5",
  },
  {
    category: "Маркетинг",
    lessons: "8 хичээл",
    title: "Дижитал Маркетинг Мастер",
    description: "Facebook, Instagram, Google аргачлал",
    price: "89,000₮",
    tint: "#f7ede7",
  },
  {
    category: "Excel",
    lessons: "10 хичээл",
    title: "Excel-ийн Мэргэжлийн Ашиглалт",
    description: "Pivot table, макро, формулын дэвшилтэт ашиглалт",
    price: "69,000₮",
    tint: "#e4f3eb",
  },
];

export const shopHighlights = [
  "Limited-run crochet pieces designed for gifting, nursery styling, and everyday softness.",
  "Every item is finished by hand, with editorial color stories that feel calm and timeless.",
  "Custom order windows can be opened for events, baby showers, and seasonal capsule drops.",
];

export const courseHighlights = [
  "Small-group sessions with direct feedback and a polished learning path.",
  "Designed for both hobby makers and future sellers who want production confidence.",
  "Downloadable guides, material lists, and finishing notes for every class.",
];

export const shopCategoryMeta: Record<ShopCategoryKey, ShopCategoryMeta> = {
  supplies: {
    key: "supplies",
    label: "Туслах материал",
    breadcrumb: "Туслах материал",
    href: "/shop/supplies",
    heroEyebrow: "Тавтай морил",
    heroTitle: "Гар\nурлан\nбол\nямар.",
    heroDescription:
      "Утас, зүү, хайр - гурвын нэгдлээр бүтдэг ертөнц.",
    heroPrimaryCta: "Материал үзэх",
    heroSecondaryCta: "Бэлэн бүтээгдэхүүн",
    heroAccent: "#b04a61",
  },
  finished: {
    key: "finished",
    label: "Бэлэн бүтээгдэхүүн",
    breadcrumb: "Бэлэн бүтээгдэхүүн",
    href: "/shop/finished",
    heroEyebrow: "Гараар урласан",
    heroTitle: "Дурсамжтай,\nзөөлөн,\nбэлэглэхэд бэлэн.",
    heroDescription:
      "Амьтад, хүүхдийн тоглоом, жижиг багцууд болон захиалгат бэлгийг тайван өнгө, цэвэр хийцтэйгээр.",
    heroPrimaryCta: "Бүтээгдэхүүн үзэх",
    heroSecondaryCta: "Туслах материал",
    heroAccent: "#b04a61",
  },
};

export const catalogItems: CatalogItem[] = [
  {
    slug: "12mm-bor-tovch-10",
    name: "12мм бор товч ( 10 ширхэг )",
    category: "supplies",
    subcategory: "Товч",
    price: "2,500₮",
    priceValue: 2500,
    stock: 46,
    brand: "-",
    image: "/buttons-brown.svg",
    description: "Нэхмэл амьтан, хүүхдийн хувцас, жижиг гоёлын ажилд тохирох 12мм хэмжээтэй бор товч.",
    badge: "6 сонголт",
    options: [
      { slug: "buttons-sky", name: "Тэнгэрийн цэнхэр", price: "2,500₮", stock: 7, image: "/buttons-sky.svg" },
      { slug: "12mm-bor-tovch-10", name: "Бор", price: "2,500₮", stock: 7, image: "/buttons-brown.svg" },
      { slug: "buttons-mint", name: "Mint", price: "2,500₮", stock: 5, image: "/buttons-mint.svg" },
      { slug: "buttons-coral", name: "Coral", price: "2,500₮", stock: 7, image: "/buttons-coral.svg" },
      { slug: "buttons-peach", name: "Peach", price: "2,500₮", stock: 10, image: "/buttons-peach.svg" },
      { slug: "buttons-lilac", name: "Lilac", price: "2,500₮", stock: 10, image: "/buttons-lilac.svg" },
    ],
    features: [
      "Шууд ашиглахад бэлэн, цэвэр савлагаатай.",
      "Гар урлал, хүүхдийн хувцас, amigurumi детальд тохиромжтой.",
      "Нэг удаагийн худалдан авалт, нэмэлт subscription байхгүй.",
      "Messenger болон Instagram-аар захиалгын дэмжлэг үзүүлнэ.",
    ],
  },
  {
    slug: "pipe-cleaner-black-100",
    name: "black ( 100ш )",
    category: "supplies",
    subcategory: "Синель утас",
    price: "2,900₮",
    priceValue: 2900,
    stock: 2,
    brand: "-",
    image: "/chenille-black.svg",
    description: "Гар урлал, цэцэг, жижиг дүрс хийхэд зориулагдсан зөөлөн хар синель утас.",
  },
  {
    slug: "pipe-cleaner-blue-100",
    name: "blue ( 100ш )",
    category: "supplies",
    subcategory: "Синель утас",
    price: "2,900₮",
    priceValue: 2900,
    stock: 1,
    brand: "-",
    image: "/chenille-blue.svg",
    description: "Цэцэг, тоглоом, декорын ажилд хэрэглэх тод цэнхэр синель утас.",
  },
  {
    slug: "pipe-cleaner-red-100",
    name: "bright red ( 100ш )",
    category: "supplies",
    subcategory: "Синель утас",
    price: "2,900₮",
    priceValue: 2900,
    stock: 2,
    brand: "-",
    image: "/chenille-red.svg",
    description: "Онцгой тод улаан өнгөтэй, гоёлын деталь хийхэд тохиромжтой материал.",
  },
  {
    slug: "pipe-cleaner-purple-100",
    name: "purple ( 100ш )",
    category: "supplies",
    subcategory: "Синель утас",
    price: "2,900₮",
    priceValue: 2900,
    stock: 4,
    brand: "-",
    image: "/chenille-purple.svg",
    description: "Тоглоом, сагс, цэцгийн иш чимэглэхэд хэрэглэх нил ягаан синель утас.",
  },
  {
    slug: "pipe-cleaner-yellow-100",
    name: "yellow ( 100ш )",
    category: "supplies",
    subcategory: "Синель утас",
    price: "2,900₮",
    priceValue: 2900,
    stock: 6,
    brand: "-",
    image: "/chenille-yellow.svg",
    description: "Хурц шар өнгийн гар урлалын утас.",
  },
  {
    slug: "pipe-cleaner-orange-100",
    name: "orange ( 100ш )",
    category: "supplies",
    subcategory: "Синель утас",
    price: "2,900₮",
    priceValue: 2900,
    stock: 3,
    brand: "-",
    image: "/chenille-orange.svg",
    description: "Намрын өнгө, цэцэг, жижиг чимэглэл хийхэд зориулсан улбар шар материал.",
  },
  {
    slug: "pipe-cleaner-green-100",
    name: "green ( 100ш )",
    category: "supplies",
    subcategory: "Синель утас",
    price: "2,900₮",
    priceValue: 2900,
    stock: 8,
    brand: "-",
    image: "/chenille-green.svg",
    description: "Навч, иш, ногоон деталь хийхэд тохирсон синель утас.",
  },
  {
    slug: "rabbit-doll-pink",
    name: "Нандинсувд дэгээ зүүнийн тоглоом",
    category: "finished",
    subcategory: "Тоглоом",
    price: "50,000₮",
    priceValue: 50000,
    stock: 999,
    brand: "-",
    image: "/finished-rabbit.svg",
    description: "Гараар сүлжсэн зөөлөн туулай, жижиг цүнхтэй хамт бэлэглэхэд бэлэн.",
    features: [
      "Гараар бүрэн сүлжсэн, нэг бүрчлэн шалгасан.",
      "Хүүхдийн өрөө, бэлэг, дурсгалын зориулалтаар тохиромжтой.",
      "Захиалгын дараа нэмэлт зураг, хүргэлтийн мэдээлэл илгээнэ.",
      "Хэмжээ, өнгөний захиалгат өөрчлөлт хийх боломжтой.",
    ],
  },
  {
    slug: "bear-gift-set",
    name: "Бяцхан баавгайн бэлгийн багц",
    category: "finished",
    subcategory: "Бэлгийн багц",
    price: "68,000₮",
    priceValue: 68000,
    stock: 12,
    brand: "-",
    image: "/finished-bear.svg",
    description: "Зөөлөн баавгай, жижиг хөнжил, бэлгийн ууттай иж бүрдэл.",
  },
  {
    slug: "strawberry-mini-bag",
    name: "Гүзээлзгэнэ mini bag",
    category: "finished",
    subcategory: "Цүнх",
    price: "42,000₮",
    priceValue: 42000,
    stock: 15,
    brand: "-",
    image: "/finished-bag.svg",
    description: "Гүзээлзгэнийн өнгөтэй, өдөр тутмын жижиг хэрэглэл хийх сүлжмэл цүнх.",
  },
];

export function getCatalogItems(category: ShopCategoryKey) {
  return catalogItems.filter((item) => item.category === category);
}

export function getCatalogItem(category: ShopCategoryKey, slug: string) {
  return catalogItems.find((item) => item.category === category && item.slug === slug);
}
