"use client";

import { Bell, BookOpen, GraduationCap, LayoutDashboard, Package, ShoppingBag } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const links = [
  { href: "/admin", label: "Хянах самбар", icon: LayoutDashboard },
  { href: "/admin/orders", label: "Захиалгууд", icon: ShoppingBag },
  { href: "/admin/products", label: "Бүтээгдэхүүн / Материал", icon: Package },
  { href: "/admin/courses", label: "Сургалт", icon: GraduationCap },
  { href: "/admin/patterns", label: "Схем", icon: BookOpen },
  { href: "/admin/notifications", label: "Мэдэгдэл", icon: Bell },
];

export function AdminNav({ compact = false, unread = 0 }: { compact?: boolean; unread?: number }) {
  const pathname = usePathname();

  return (
    <nav aria-label="Админ цэс" className={compact ? "flex gap-2 overflow-x-auto" : "mt-10 flex flex-col gap-1"}>
      {links.map(({ href, label, icon: Icon }) => {
        const active = href === "/admin" ? pathname === "/admin" : pathname.startsWith(href);
        return (
          <Link
            key={href}
            href={href}
            aria-current={active ? "page" : undefined}
            className={`flex items-center gap-3 whitespace-nowrap rounded-xl px-3 py-2.5 text-[12px] transition ${
              active ? "bg-[#f7e9ec] font-semibold text-[#a24456]" : "text-[#7a6b63] hover:bg-[#faf6f2] hover:text-[#2f2420]"
            }`}
          >
            <Icon aria-hidden className="h-4 w-4 shrink-0" />
            <span className="flex-1">{label}</span>
            {href === "/admin/notifications" && unread > 0 ? (
              <span className="rounded-full bg-[#a24456] px-1.5 py-0.5 text-[10px] font-semibold text-white">{unread}</span>
            ) : null}
          </Link>
        );
      })}
    </nav>
  );
}
