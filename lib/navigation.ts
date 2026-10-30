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
const supplies = (category: string) => `/materials?category=${encodeURIComponent(category)}`;

export const navSections: NavSection[] = [
  {
    id: "about",
    label: "Бидний тухай",
    href: "/about",
    icon: Info,
    description: "Merit урлангийн түүх ба бидний тухай",
    links: [
      { label: "Бидний түүх", href: "/about#story", icon: BookOpen },
      { label: "Зургийн цомог", href: "/about#gallery", icon: Images },
      { label: "Яагаад Merit урлан", href: "/about#why", icon: Award },
      { label: "Түгээмэл асуулт", href: "/about#faq", icon: CircleHelp },
      { label: "Холбоо барих", href: "/about#contact", icon: Phone },
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
    description: "Утас, товч, зүү болон туслах материал",
    links: [
      { label: "Утас", href: supplies("Утас"), icon: Spool },
      { label: "Синель утас", href: supplies("Синель утас"), icon: Flower2 },
      { label: "Товч", href: supplies("Товч"), icon: Palette },
      { label: "Зүү", href: supplies("Зүү"), icon: Scissors },
      { label: "Шинэ ирсэн", href: "/materials", icon: Sparkles },
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
