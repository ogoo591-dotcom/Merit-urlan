// Бараа, материалын төрлүүд (client, server хоёуланд).

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

export type ProductSort = "default" | "price_asc" | "price_desc" | "name";

export type CatalogFilters = {
  type: ProductType;
  category?: string;
  subcategory?: string;
  brands?: string[];
  colors?: ColorKey[];
  origins?: Origin[];
  availability?: Availability[];
  minPrice?: number;
  maxPrice?: number;
  query?: string;
  sort?: ProductSort;
  page?: number;
  perPage?: number;
};

export type FacetOption = { value: string; label: string; count: number; swatch?: string };

export type Catalog = {
  items: StoreProduct[];
  total: number;
  page: number;
  pageCount: number;
  perPage: number;
  categories: Array<FacetOption & { subcategories: FacetOption[] }>;
  facets: { brands: FacetOption[]; colors: FacetOption[]; origins: FacetOption[]; availability: FacetOption[] };
};
