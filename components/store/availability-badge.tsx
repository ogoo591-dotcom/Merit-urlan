import type { StoreProduct } from "@/lib/mock/products";

// "Бэлэн" (ногоон) / "Захиалгаар · 7 хоног" (шар) / "Дууссан" (саарал).
export function AvailabilityBadge({ product, className = "" }: { product: StoreProduct; className?: string }) {
  const base = "inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-[10px] font-semibold";

  if (product.stock < 1) {
    return <span className={`${base} bg-[#ece8e5] text-[#7a6b63] ${className}`}>Дууссан</span>;
  }
  if (product.availability === "made_to_order") {
    return (
      <span className={`${base} bg-[#fdf1d6] text-[#8a5a00] ${className}`}>
        <span aria-hidden className="h-1.5 w-1.5 rounded-full bg-[#e0a100]" />
        Захиалгаар · {product.leadDays ?? 7} хоног
      </span>
    );
  }
  return (
    <span className={`${base} bg-[#e3f4e8] text-[#1f7a3d] ${className}`}>
      <span aria-hidden className="h-1.5 w-1.5 rounded-full bg-[#2fa65a]" />
      Бэлэн
    </span>
  );
}
