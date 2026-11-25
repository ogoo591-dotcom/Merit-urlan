// Header-ийн хоёрдугаар мөр болон "☰ Бүгд" drawer-ийн цэс, мөн бараа/материалын ангиллын бүтэц.
// Ангилал нэмэх, засах бол зөвхөн энд өөрчилнө. Mock өгөгдөлд ангилал/дэд ангиллыг монгол нэрээр (label) хадгалдаг,
// URL-д slug ашиглана (/products?category=suljmel&sub=togloom).
import {
  Award,
  BookOpen,
  CircleHelp,
  Gift,
  GraduationCap,
  Heart,
  Images,
  Info,
  LifeBuoy,
  MessageCircle,
  Rabbit,
  Scissors,
  ShoppingBag,
  Phone,
  Spool,
  Sparkles,
  type LucideIcon,
} from "lucide-react";

import type { ProductType } from "@/types/catalog";

// ---- Ангиллын бүтэц ----

export type CatalogSub = { slug: string; label: string };
// Дэд ангиллыг бүлэглэж харуулах (жишээ нь "Хятад утас", "Турк утас"). title байхгүй бол гарчиггүй.
export type CatalogSubGroup = { title?: string; subs: CatalogSub[] };
export type CatalogCategory = { slug: string; label: string; groups: CatalogSubGroup[] };

// Нэхмэлийн утас: гарал үүслээр бүлэглэсэн брэнд/төрөл. Шинэ брэнд нэмэхдээ тухайн массивт нэг мөр нэмнэ.
export const yarnGroups: Array<CatalogSubGroup & { origin: "Хятад" | "Турк" }> = [
  {
    origin: "Хятад",
    title: "Хятад утас",
    subs: [
      { slug: "navchtai", label: "Навчтай" },
      { slug: "combed-cotton", label: "Combed cotton" },
      { slug: "burjgar", label: "Буржгар" },
      { slug: "khamban", label: "Хамбан" },
      { slug: "suide-cotton", label: "Suide cotton" },
    ],
  },
  {
    origin: "Турк",
    title: "Турк утас",
    subs: [
      { slug: "alize", label: "Alize" },
      { slug: "wolans", label: "Wolans" },
    ],
  },
];

export const catalogCategories: Record<ProductType, CatalogCategory[]> = {
  product: [
    {
      slug: "suljmel",
      label: "Сүлжмэл бүтээгдэхүүн",
      groups: [{ subs: [{ slug: "togloom", label: "Тоглоом" }, { slug: "busad", label: "Бусад" }] }],
    },
    { slug: "belgiin-bagts", label: "Бэлгийн багц", groups: [] },
    {
      slug: "zuu-oroosen",
      label: "Зүү ороосон бүтээл",
      groups: [
        {
          subs: [
            { slug: "khavtaga", label: "Хавтага" },
            { slug: "daalin", label: "Даалин" },
            { slug: "bus", label: "Бүс" },
          ],
        },
      ],
    },
  ],
  material: [
    { slug: "utas", label: "Нэхмэлийн утас", groups: yarnGroups },
    {
      slug: "tuslah",
      label: "Туслах материал",
      groups: [
        {
          subs: [
            { slug: "degee-zuu", label: "Дэгээ зүү" },
            { slug: "duurgegch", label: "Дүүргэгч" },
            { slug: "suljmeliin-zuu", label: "Сүлжмэлийн зүү" },
            { slug: "nud-khamar", label: "Нүд, хамар" },
            { slug: "tovch", label: "Товч" },
            { slug: "sinel-utas", label: "Синель утас" },
            { slug: "tsunkhnii-material", label: "Цүнхний материал" },
            { slug: "kheregsel", label: "Хэрэгсэл" },
          ],
        },
      ],
    },
  ],
};

const catalogBase: Record<ProductType, string> = { product: "/products", material: "/materials" };
const subsOf = (category: CatalogCategory) => category.groups.flatMap((group) => group.subs);
const matchesParam = (item: { slug: string; label: string }, value: string) => item.slug === value || item.label === value;

// URL-ийн ?category=&sub= (slug эсвэл хуучин монгол нэр) → өгөгдөлд хадгалсан нэр.
export function resolveCatalogParams(type: ProductType, category?: string, sub?: string) {
  const found = category ? catalogCategories[type].find((item) => matchesParam(item, category)) : undefined;
  const categoryLabel = found?.label ?? category;
  const foundSub = sub ? (found ? subsOf(found) : catalogCategories[type].flatMap(subsOf)).find((item) => matchesParam(item, sub)) : undefined;
  return { category: categoryLabel, sub: foundSub?.label ?? sub };
}

// Өгөгдлийн нэр → URL-ийн slug (тодорхойлогдоогүй бол нэрээрээ).
export function categorySlug(type: ProductType, label: string) {
  return catalogCategories[type].find((item) => item.label === label)?.slug ?? label;
}

export function subSlug(type: ProductType, categoryLabel: string | undefined, label: string) {
  const scope = catalogCategories[type].filter((item) => !categoryLabel || item.label === categoryLabel);
  return scope.flatMap(subsOf).find((item) => item.label === label)?.slug ?? label;
}

// navigation.ts-д тодорхойлсон дарааллаар эрэмбэлэх (тодорхойгүй нь хамгийн сүүлд).
export function categoryOrder(type: ProductType, label: string) {
  const index = catalogCategories[type].findIndex((item) => item.label === label);
  return index === -1 ? Number.MAX_SAFE_INTEGER : index;
}

export function subOrder(type: ProductType, categoryLabel: string, label: string) {
  const category = catalogCategories[type].find((item) => item.label === categoryLabel);
  const index = category ? subsOf(category).findIndex((item) => item.label === label) : -1;
  return index === -1 ? Number.MAX_SAFE_INTEGER : index;
}

export function catalogHref(type: ProductType, categoryLabel: string, subLabel?: string) {
  const params = new URLSearchParams({ category: categorySlug(type, categoryLabel) });
  if (subLabel) params.set("sub", subSlug(type, categoryLabel, subLabel));
  return `${catalogBase[type]}?${params}`;
}

// ---- Drawer / header цэс ----

export type NavLink = { label: string; href: string; icon: LucideIcon; external?: boolean };

export type NavCardGroup = { title?: string; links: Array<{ label: string; href: string }> };

// Drawer-ийн карт. href байвал гарчиг нь холбоос; action: "messenger" бол "Чат руу шилжих үү?" цонх гаргана.
export type NavCard = {
  label: string;
  icon: LucideIcon;
  href?: string;
  action?: "messenger";
  // Гарчгийн доорх жижиг текстэн дэд жагсаалт (доошоо цуварна).
  groups?: NavCardGroup[];
  // Жагсаалтыг богиносгосон бол "+N" холбоос (ангиллын бүх бараа руу).
  more?: { label: string; href: string };
};

export type NavSection = {
  id: string;
  label: string;
  href: string;
  icon: LucideIcon;
  description: string;
  // "cards": картын grid; "courses": бүх сургалтын жагсаалт (сервероос уншина).
  layout: "cards" | "courses";
  cards: NavCard[];
};

// limit: эхний хэдэн дэд ангиллыг харуулж, үлдсэнийг "+N" болгоно.
function catalogCard(type: ProductType, slug: string, label: string, icon: LucideIcon, limit?: number): NavCard {
  const category = catalogCategories[type].find((item) => item.slug === slug);
  if (!category) throw new Error(`Ангилал олдсонгүй: ${slug}`);
  const href = catalogHref(type, category.label);
  const subs = subsOf(category);
  const shown = limit ? subs.slice(0, limit) : subs;
  return {
    label,
    icon,
    href,
    groups: [{ links: shown.map((sub) => ({ label: sub.label, href: catalogHref(type, category.label, sub.label) })) }],
    more: subs.length > shown.length ? { label: `+${subs.length - shown.length}`, href } : undefined,
  };
}

// Нэхмэлийн утас: drawer-т гарал үүслээр (Турк / Хятад) — материалын хуудасны "Улс" шүүлтүүр рүү.
function yarnCard(): NavCard {
  const category = catalogCategories.material.find((item) => item.slug === "utas")!;
  const href = catalogHref("material", category.label);
  const origins = [...yarnGroups].sort((a, b) => (a.origin === "Турк" ? -1 : b.origin === "Турк" ? 1 : 0));
  return {
    label: category.label,
    icon: Spool,
    href,
    groups: [{ links: origins.map((group) => ({ label: group.title ?? group.origin, href: `${href}&origin=${encodeURIComponent(group.origin)}` })) }],
  };
}

export const navSections: NavSection[] = [
  {
    id: "about",
    label: "Бидний тухай",
    href: "/about",
    icon: Info,
    description: "Merit урлангийн түүх ба бидний тухай",
    layout: "cards",
    cards: [
      { label: "Бидний түүх", href: "/about#story", icon: BookOpen },
      { label: "Зургийн цомог", href: "/#gallery", icon: Images },
      { label: "Яагаад Merit урлан", href: "/about#why", icon: Award },
      { label: "Түгээмэл асуулт", href: "/#faq", icon: CircleHelp },
      { label: "Холбоо барих", icon: Phone, action: "messenger" },
    ],
  },
  {
    id: "products",
    label: "Бүтээгдэхүүн",
    href: "/products",
    icon: Gift,
    description: "Гараар урласан бэлэн бүтээгдэхүүн",
    layout: "cards",
    cards: [
      catalogCard("product", "suljmel", "Сүлжмэл бүтээгдэхүүн", Rabbit),
      catalogCard("product", "belgiin-bagts", "Бэлгийн багц", Gift),
      catalogCard("product", "zuu-oroosen", "Зүү ороосон бүтээл", Sparkles),
      { label: "Захиалгаар хийлгэх", icon: MessageCircle, action: "messenger" },
    ],
  },
  {
    id: "supplies",
    label: "Материал",
    href: "/materials",
    icon: Spool,
    description: "Нэхмэлийн утас болон туслах материал",
    layout: "cards",
    cards: [
      yarnCard(),
      catalogCard("material", "tuslah", "Туслах материал", Scissors, 2),
    ],
  },
  {
    id: "courses",
    label: "Сургалт",
    href: "/courses",
    icon: GraduationCap,
    description: "Видео сургалт — сургалт бүрийн 1-р хичээл үнэгүй",
    layout: "courses",
    cards: [],
  },
  {
    id: "patterns",
    label: "Схем заавар",
    href: "/patterns",
    icon: BookOpen,
    description: "Орчуулсан үнэгүй болон төлбөртэй схемүүд",
    layout: "cards",
    cards: [
      { label: "Үнэгүй схем", href: "/patterns?access=free", icon: Gift },
      { label: "Төлбөртэй схем", href: "/patterns?access=paid", icon: Award },
    ],
  },
];

// Drawer-ийн доод хэсгийн туслах холбоосууд.
export const utilityLinks: NavLink[] = [
  { label: "Тусламж", href: "/#faq", icon: LifeBuoy },
  { label: "Хадгалсан", href: "/saved", icon: Heart },
  { label: "Миний захиалгууд", href: "/account/orders", icon: ShoppingBag },
];
