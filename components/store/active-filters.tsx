import { X } from "lucide-react";
import Link from "next/link";

// Сонгосон шүүлтүүрүүдийн шошго: дарахад тухайн шүүлтүүр хасагдана.
export function ActiveFilters({ filters, clearHref }: { filters: Array<{ label: string; href: string }>; clearHref: string }) {
  if (!filters.length) return null;
  return (
    <div className="mt-6 flex flex-wrap items-center gap-2">
      {filters.map((filter) => (
        <Link
          key={filter.label}
          href={filter.href}
          className="inline-flex items-center gap-1.5 rounded-full bg-[#3d302c] px-3.5 py-1.5 text-[11px] font-medium text-white transition hover:bg-[#2f2420]"
        >
          {filter.label}
          <X aria-label="хасах" className="h-3.5 w-3.5" />
        </Link>
      ))}
      <Link href={clearHref} className="ml-1 text-[11px] font-medium text-[#a24456] underline underline-offset-4">
        Бүгдийг цэвэрлэх
      </Link>
    </div>
  );
}
