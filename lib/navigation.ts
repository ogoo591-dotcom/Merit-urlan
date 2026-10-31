// Header-ийн хоёрдугаар мөр болон "☰ Бүгд" drawer-ийн цэс. Ангилал нэмэх, засах бол зөвхөн энд өөрчилнө.
import {
  Award,
  Baby,
  BookOpen,
  CircleHelp,
  Feather,
  Flower2,
  Gift,
  GraduationCap,
  Heart,
  Images,
  Info,
  LayoutGrid,
  Library,
  LifeBuoy,
  MessageCircle,
  Package,
  Palette,
  Phone,
  PlayCircle,
  Rabbit,
  Scissors,
  Shirt,
  Sparkles,
  Spool,
  Star,
  type LucideIcon,
} from "lucide-react";

export type NavLink = { label: string; href: string; icon: LucideIcon; external?: boolean };

export type NavSection = {
  id: string;
  label: string;
  href: string;
  icon: LucideIcon;
  description: string;
  links: NavLink[];
};

const finished = (category: string) => `/products?category=${encodeURIComponent(category)}`;
const supplies = (category: string, sub?: string) =>
  `/materials?category=${encodeURIComponent(category)}${sub ? `&sub=${encodeURIComponent(sub)}` : ""}`;

export const navSections: NavSection[] = [
  {
    id: "about",
    label: "Бидний тухай",
    href: "/about",
    icon: Info,
    description: "Merit урлангийн түүх ба бидний тухай",
    links: [
      { label: "Бидний түүх", href: "/about#story", icon: BookOpen },
      { label: "Зургийн цомог", href: "/#gallery", icon: Images },
      { label: "Яагаад Merit урлан", href: "/about#why", icon: Award },
      { label: "Түгээмэл асуулт", href: "/#faq", icon: CircleHelp },
      { label: "Холбоо барих", href: "#contact", icon: Phone },
    ],
  },
  {
    id: "products",
    label: "Бүтээгдэхүүн",
    href: "/products",
    icon: Gift,
    description: "Гараар урласан бэлэн бүтээгдэхүүн",
    links: [
      { label: "Тоглоом", href: finished("Тоглоом"), icon: Rabbit },
      { label: "Бэлгийн багц", href: finished("Бэлгийн багц"), icon: Gift },
      { label: "Хавтага", href: finished("Хавтага"), icon: Package },
      { label: "Захиалгаар хийлгэх", href: "https://m.me/meriturlan", icon: MessageCircle, external: true },
    ],
  },
  {
    id: "supplies",
    label: "Материал",
    href: "/materials",
    icon: Spool,
    description: "Нэхмэлийн утас болон туслах материал",
    links: [
      { label: "Нэхмэлийн утас", href: supplies("Нэхмэлийн утас"), icon: Spool },
      { label: "Туслах материал", href: supplies("Туслах материал"), icon: Scissors },
      { label: "Үслэг утас", href: supplies("Нэхмэлийн утас", "Үслэг утас"), icon: Flower2 },
      { label: "Дэгээ зүү", href: supplies("Туслах материал", "Дэгээ зүү"), icon: Palette },
      { label: "Yarn art", href: "/materials?brand=Yarn%20art", icon: Sparkles },
    ],
  },
  {
    id: "courses",
    label: "Сургалт",
    href: "/courses",
    icon: GraduationCap,
    description: "Видео сургалт, алхамчилсан хичээлүүд",
    links: [
      { label: "Бүх сургалт", href: "/courses", icon: LayoutGrid },
      { label: "Үнэгүй хичээл", href: "/courses?filter=free", icon: PlayCircle },
      { label: "Эхлэгчдэд", href: "/courses?level=beginner", icon: Star },
      { label: "Amigurumi", href: "/courses?topic=amigurumi", icon: Rabbit },
    ],
  },
  {
    id: "patterns",
    label: "Схем заавар",
    href: "/patterns",
    icon: BookOpen,
    description: "Орчуулсан схем, PDF заавар",
    links: [
      { label: "Бүх схем", href: "/patterns", icon: LayoutGrid },
      { label: "Тоглоом", href: "/patterns?type=toy", icon: Baby },
      { label: "Хувцас", href: "/patterns?type=clothes", icon: Shirt },
      { label: "Шинэ", href: "/patterns?sort=new", icon: Feather },
    ],
  },
];

// Drawer-ийн доод хэсгийн туслах холбоосууд.
export const utilityLinks: NavLink[] = [
  { label: "Тусламж", href: "/#faq", icon: LifeBuoy },
  { label: "Хадгалсан", href: "/saved", icon: Heart },
  { label: "Миний сан", href: "/library", icon: Library },
];
