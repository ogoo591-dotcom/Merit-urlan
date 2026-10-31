// Бүтээгдэхүүн, материалын mock өгөгдөл. Үнэ, үлдэгдэл түр утга — жинхэнэ тоогоор солино.
// id нь хуучин /shop/... хаягийн slug-тай ижил тул хуучин холбоосууд шинэ хуудас руу зөв шилжинэ.

export type ProductType = "product" | "material";
export type Availability = "ready" | "made_to_order";
export type Origin = "Хятад" | "Турк";

// Шүүлтүүрийн өнгө. Бараанд түлхүүрийг нь хадгална (colors: ["red", "white"]).
export const productColors = {
  red: { label: "Улаан", hex: "#D9473F" },
  pink: { label: "Ягаан", hex: "#EE9AB4" },
  orange: { label: "Улбар шар", hex: "#F08A3E" },
  yellow: { label: "Шар", hex: "#F3CF4A" },
  green: { label: "Ногоон", hex: "#5DAA66" },
  blue: { label: "Цэнхэр", hex: "#6BB4E3" },
  purple: { label: "Нил ягаан", hex: "#A78BD0" },
  brown: { label: "Бор", hex: "#9A6644" },
  beige: { label: "Шаргал", hex: "#E7D3B6" },
  white: { label: "Цагаан", hex: "#FFFFFF" },
  gray: { label: "Саарал", hex: "#A3A3A6" },
  black: { label: "Хар", hex: "#2F2A2B" },
  multi: { label: "Алаг", hex: "conic-gradient(#D9473F, #F3CF4A, #5DAA66, #6BB4E3, #A78BD0, #D9473F)" },
} as const;
export type ColorKey = keyof typeof productColors;

// Материалын 2 үндсэн ангилал.
export const materialCategories = ["Нэхмэлийн утас", "Туслах материал"] as const;

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
  // Ангилал доторх дэд ангилал (жишээ нь "Даавуун утас", "Дэгээ зүү").
  subcategory?: string;
  brand?: string;
  colors?: ColorKey[];
  // Зөвхөн материалд.
  origin?: Origin;
};

// ---- Материал: туслах функцууд (mock өгөгдлийг товч бичихэд) ----

type MaterialSeed = Omit<StoreProduct, "type" | "category" | "availability" | "description" | "images"> &
  Partial<Pick<StoreProduct, "availability" | "description" | "images">>;

const material = (category: (typeof materialCategories)[number], image: string) => (item: MaterialSeed): StoreProduct => ({
  type: "material",
  availability: "ready",
  description: `${item.name}. ${item.brand ? `${item.brand} брэнд, ` : ""}${item.origin ?? ""} үйлдвэрлэл.`,
  images: [item.colors?.[0] && image === "yarn" ? `/materials/yarn-${item.colors[0]}.svg` : `/materials/${image}.svg`],
  ...item,
  category,
});

const yarn = material("Нэхмэлийн утас", "yarn");

// Нэхмэлийн утас. Зураг түр зуурын — жинхэнэ зургаар солино.
const yarns: StoreProduct[] = [
  yarn({ id: "yarnart-jeans-red", name: "Yarn art Jeans — Улаан", subcategory: "Даавуун утас", brand: "Yarn art", origin: "Турк", price: 6500, stock: 14, colors: ["red"], description: "55% хөвөн, 45% акрил. 50гр / 160м. Amigurumi тоглоомд хамгийн их хэрэглэгддэг утас." }),
  yarn({ id: "yarnart-jeans-white", name: "Yarn art Jeans — Цагаан", subcategory: "Даавуун утас", brand: "Yarn art", origin: "Турк", price: 6500, stock: 20, colors: ["white"], description: "55% хөвөн, 45% акрил. 50гр / 160м." }),
  yarn({ id: "yarnart-jeans-black", name: "Yarn art Jeans — Хар", subcategory: "Даавуун утас", brand: "Yarn art", origin: "Турк", price: 6500, stock: 9, colors: ["black"] }),
  yarn({ id: "yarnart-jeans-beige", name: "Yarn art Jeans — Шаргал", subcategory: "Даавуун утас", brand: "Yarn art", origin: "Турк", price: 6500, stock: 2, colors: ["beige"] }),
  yarn({ id: "yarnart-baby-color", name: "Yarn art Baby Color — Алаг", subcategory: "Акрил утас", brand: "Yarn art", origin: "Турк", price: 5800, stock: 7, colors: ["multi"] }),
  yarn({ id: "yarnart-angora-star", name: "Yarn art Angora Star — Ягаан", subcategory: "Ноос, ангор", brand: "Yarn art", origin: "Турк", price: 8500, stock: 5, colors: ["pink"] }),
  yarn({ id: "yarnart-christmas", name: "Yarn art Christmas — Ногоон", subcategory: "Акрил утас", brand: "Yarn art", origin: "Турк", price: 3500, stock: 11, colors: ["green"] }),
  yarn({ id: "yarnart-charisma", name: "Yarn art Charisma — Саарал", subcategory: "Ноос, ангор", brand: "Yarn art", origin: "Турк", price: 9800, stock: 3, colors: ["gray"] }),
  yarn({ id: "yarnart-merino-bulky", name: "Yarn art Merino Bulky — Бор", subcategory: "Ноос, ангор", brand: "Yarn art", origin: "Турк", price: 9500, stock: 6, colors: ["brown"] }),
  yarn({ id: "yarnart-velour-purple", name: "Yarn art Velour — Нил ягаан", subcategory: "Үслэг утас", brand: "Yarn art", origin: "Турк", price: 7800, stock: 8, colors: ["purple"], images: ["/materials/yarn-purple.svg"] }),
  yarn({ id: "alize-cotton-gold-yellow", name: "Alize Cotton Gold — Шар", subcategory: "Даавуун утас", brand: "Alize", origin: "Турк", price: 7200, stock: 10, colors: ["yellow"] }),
  yarn({ id: "alize-cotton-gold-blue", name: "Alize Cotton Gold — Цэнхэр", subcategory: "Даавуун утас", brand: "Alize", origin: "Турк", price: 7200, stock: 0, colors: ["blue"] }),
  yarn({ id: "alize-softy-white", name: "Alize Softy — Цагаан", subcategory: "Үслэг утас", brand: "Alize", origin: "Турк", price: 8200, stock: 12, colors: ["white"], images: ["/materials/yarn-white.svg"] }),
  yarn({ id: "himalaya-dolphin-baby", name: "Himalaya Dolphin Baby — Ягаан", subcategory: "Үслэг утас", brand: "Himalaya", origin: "Турк", price: 8800, stock: 4, colors: ["pink"], images: ["/materials/yarn-fluffy.svg"] }),
  yarn({ id: "himalaya-dolphin-baby-blue", name: "Himalaya Dolphin Baby — Цэнхэр", subcategory: "Үслэг утас", brand: "Himalaya", origin: "Турк", price: 8800, stock: 6, colors: ["blue"] }),
  yarn({ id: "wolans-bunny-orange", name: "Wolans Bunny үслэг утас — Улбар шар", subcategory: "Үслэг утас", brand: "Wolans", origin: "Хятад", price: 3500, stock: 15, colors: ["orange"], images: ["/materials/yarn-fluffy.svg"] }),
  yarn({ id: "wolans-bunny-beige", name: "Wolans Bunny үслэг утас — Шаргал", subcategory: "Үслэг утас", brand: "Wolans", origin: "Хятад", price: 3500, stock: 1, colors: ["beige"] }),
  yarn({ id: "khovsgor-uslag-gray", name: "Хөвсгөр үслэг утас — Саарал", subcategory: "Үслэг утас", origin: "Хятад", price: 2800, stock: 18, colors: ["gray"] }),
  yarn({ id: "milk-cotton-multi", name: "Алаг даавуун утас (Milk cotton)", subcategory: "Даавуун утас", origin: "Хятад", price: 2500, stock: 22, colors: ["multi", "blue", "pink"] }),
  yarn({ id: "milk-cotton-red", name: "Milk cotton 5 эрчтэй — Улаан", subcategory: "Даавуун утас", origin: "Хятад", price: 2500, stock: 16, colors: ["red"] }),
  yarn({ id: "combed-cotton-beige", name: "Combed cotton (4 эрчлээт) — Шаргал", subcategory: "Даавуун утас", origin: "Хятад", price: 3000, stock: 13, colors: ["beige"] }),
  yarn({ id: "combed-cotton-green", name: "Combed cotton (4 эрчлээт) — Ногоон", subcategory: "Даавуун утас", origin: "Хятад", price: 3000, stock: 0, colors: ["green"] }),
  yarn({ id: "boucle-gray", name: "Буржгар утас — Саарал", subcategory: "Үслэг утас", origin: "Хятад", price: 5500, stock: 5, colors: ["gray", "black"] }),
  yarn({ id: "thin-elastic-white", name: "Нарийн уян утас 50гр — Цагаан", subcategory: "Акрил утас", origin: "Хятад", price: 2200, stock: 9, colors: ["white"] }),
];

const supply = (image: string) => material("Туслах материал", image);

// Туслах материал.
const supplies: StoreProduct[] = [
  supply("hook-set")({ id: "hook-set-led", name: "Гэрэл асдаг дэгээ зүүний иж бүрдэл", subcategory: "Дэгээ зүү", origin: "Хятад", price: 35000, stock: 2, colors: ["pink", "black"] }),
  supply("hook-set")({ id: "hook-set-soft", name: "Зөөлөн бариултай дэгээ зүүний иж бүрдэл (14ш)", subcategory: "Дэгээ зүү", origin: "Хятад", price: 28000, stock: 3, colors: ["multi"] }),
  supply("hook")({ id: "hook-soft-3mm", name: "Дэгээ зүү 3мм — зөөлөн бариултай", subcategory: "Дэгээ зүү", origin: "Хятад", price: 2500, stock: 25, colors: ["pink"] }),
  supply("hook")({ id: "hook-soft-6mm", name: "Дэгээ зүү 6мм — зөөлөн бариултай", subcategory: "Дэгээ зүү", origin: "Хятад", price: 3000, stock: 12, colors: ["blue"] }),
  supply("knitting-needles")({ id: "bamboo-circular-needle", name: "Хулсан дугуй зүү 80см", subcategory: "Сүлжмэлийн зүү", origin: "Хятад", price: 4600, stock: 8, colors: ["brown"] }),
  supply("knitting-needles")({ id: "metal-circular-needle", name: "Төмөр хос зүү 120см, 10мм", subcategory: "Сүлжмэлийн зүү", origin: "Турк", brand: "Alize", price: 4000, stock: 6, colors: ["gray"] }),
  supply("safety-eyes")({ id: "safety-eyes-10mm", name: "Тоглоомын нүд 10мм (20ш)", subcategory: "Нүд, хамар", origin: "Хятад", price: 2000, stock: 30, colors: ["black"] }),
  supply("safety-eyes")({ id: "safety-eyes-14mm", name: "Тоглоомын нүд 14мм (10ш)", subcategory: "Нүд, хамар", origin: "Хятад", price: 2500, stock: 3, colors: ["black"] }),
  supply("stuffing")({ id: "stuffing-500g", name: "Тоглоомын дүүргэгч хөвөн 500гр", subcategory: "Дүүргэгч", origin: "Хятад", price: 6000, stock: 10, colors: ["white"] }),
  supply("bag-flap")({ id: "bag-flap-pink", name: "Цүнхний арьсан хавтас + оосор", subcategory: "Цүнхний материал", origin: "Хятад", price: 10000, stock: 2, colors: ["pink"] }),
  supply("bag-handle")({ id: "bag-handle-leather", name: "Арьсан цүнхний бариул (хос)", subcategory: "Цүнхний материал", origin: "Турк", price: 10000, stock: 4, colors: ["brown", "yellow"] }),
  supply("mesh")({ id: "bag-mesh", name: "Цүнхний дотор сетка 2.2м × 1м", subcategory: "Цүнхний материал", origin: "Хятад", price: 5000, stock: 7, colors: ["pink", "white"] }),
  supply("stitch-markers")({ id: "stitch-markers-20", name: "Тэмдэглэгээний цагираг (20ш)", subcategory: "Хэрэгсэл", origin: "Хятад", price: 1500, stock: 40, colors: ["multi"] }),
  supply("scissors")({ id: "mini-scissors", name: "Жижиг хайч", subcategory: "Хэрэгсэл", origin: "Хятад", price: 3500, stock: 0, colors: ["pink"] }),
];

// Mock бараа өөрчлөгдөхөд нэмэгдүүлнэ — .mock-db дахь хуучин барааны жагсаалтыг шинээр солино.
export const mockCatalogVersion = 2;

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
    category: "Туслах материал",
    subcategory: "Синель утас",
    type: "material",
    stock: 2,
    availability: "ready",
    colors: ["black"],
    origin: "Турк",
  },
  {
    id: "pipe-cleaner-red-100",
    name: "Синель утас — Улаан (100ш)",
    description: "Онцгой тод улаан өнгөтэй, гоёлын деталь хийхэд тохиромжтой синель утас.",
    price: 2900,
    images: ["/chenille-red.svg"],
    category: "Туслах материал",
    subcategory: "Синель утас",
    type: "material",
    stock: 6,
    availability: "ready",
    colors: ["red"],
    origin: "Турк",
  },
  {
    id: "pipe-cleaner-yellow-100",
    name: "Синель утас — Шар (100ш)",
    description: "Хурц шар өнгийн гар урлалын синель утас.",
    price: 2900,
    images: ["/chenille-yellow.svg"],
    category: "Туслах материал",
    subcategory: "Синель утас",
    type: "material",
    stock: 0,
    availability: "ready",
    colors: ["yellow"],
    origin: "Турк",
  },
  {
    id: "pipe-cleaner-green-100",
    name: "Синель утас — Ногоон (100ш)",
    description: "Навч, иш, ногоон деталь хийхэд тохирсон синель утас.",
    price: 2900,
    images: ["/chenille-green.svg"],
    category: "Туслах материал",
    subcategory: "Синель утас",
    type: "material",
    stock: 8,
    availability: "ready",
    colors: ["green"],
    origin: "Турк",
  },
  {
    id: "12mm-bor-tovch-10",
    name: "12мм товч — Бор (10ш)",
    description: "Нэхмэл амьтан, хүүхдийн хувцас, жижиг гоёлын ажилд тохирох 12мм хэмжээтэй товч.",
    price: 2500,
    images: ["/buttons-brown.svg"],
    category: "Туслах материал",
    subcategory: "Товч",
    type: "material",
    stock: 7,
    availability: "ready",
    colors: ["brown"],
    origin: "Хятад",
  },
  {
    id: "buttons-sky",
    name: "12мм товч — Цэнхэр (10ш)",
    description: "Тэнгэрийн цэнхэр өнгийн 12мм товч, amigurumi детальд тохиромжтой.",
    price: 2500,
    images: ["/buttons-sky.svg"],
    category: "Туслах материал",
    subcategory: "Товч",
    type: "material",
    stock: 7,
    availability: "ready",
    colors: ["blue"],
    origin: "Хятад",
  },
  {
    id: "buttons-coral",
    name: "12мм товч — Coral (10ш)",
    description: "Шүрэн ягаан өнгийн 12мм товч.",
    price: 2500,
    images: ["/buttons-coral.svg"],
    category: "Туслах материал",
    subcategory: "Товч",
    type: "material",
    stock: 4,
    availability: "ready",
    colors: ["pink"],
    origin: "Хятад",
  },
  {
    id: "buttons-lilac",
    name: "12мм товч — Lilac (10ш)",
    description: "Цайвар нил ягаан өнгийн 12мм товч.",
    price: 2500,
    images: ["/buttons-lilac.svg"],
    category: "Туслах материал",
    subcategory: "Товч",
    type: "material",
    stock: 10,
    availability: "made_to_order",
    leadDays: 14,
    colors: ["purple"],
    origin: "Хятад",
  },
  ...yarns,
  ...supplies,
];
