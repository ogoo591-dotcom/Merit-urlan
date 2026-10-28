"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const links = [
  { href: "/admin", label: "Хяналтын самбар" },
  { href: "/admin/products", label: "Бараа бүтээгдэхүүн" },
  { href: "/admin/orders", label: "Захиалга" },
  { href: "/admin/courses", label: "Сургалтын бүртгэл" },
];

export function AdminNav({ compact = false }: { compact?: boolean }) {
  const pathname = usePathname();

  return (
    <nav className={compact ? "flex gap-4 overflow-x-auto" : "mt-10 flex flex-col gap-1"}>
      {links.map((link) => {
        const active = link.href === "/admin" ? pathname === "/admin" : pathname.startsWith(link.href);
        return (
          <Link
            key={link.href}
            href={link.href}
            className={`whitespace-nowrap rounded-xl px-3 py-2.5 text-[12px] transition ${
              active ? "bg-[#f3ebe4] font-semibold text-[#2f2420]" : "text-[#7a6b63] hover:bg-[#faf6f2] hover:text-[#2f2420]"
            }`}
          >
            {link.label}
          </Link>
        );
      })}
    </nav>
  );
}
