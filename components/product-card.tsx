import type { Product } from "@/lib/site-data";

type ProductCardProps = {
  product: Product;
};

export function ProductCard({ product }: ProductCardProps) {
  return (
    <article className="overflow-hidden rounded-[2rem] border border-[#e7d2d0] bg-white shadow-[0_20px_45px_-35px_rgba(90,41,52,0.28)]">
      <div
        className="flex h-72 items-end p-6"
        style={{
          background: `linear-gradient(135deg, ${product.palette[0]}, ${product.palette[1]})`,
        }}
      >
        <div className="rounded-full bg-white/75 px-4 py-2 text-sm font-semibold text-[#a24457]">
          {product.label}
        </div>
      </div>

      <div className="space-y-4 p-6">
        <h3 className="font-serif text-3xl text-[#31202b]">{product.name}</h3>
        <p className="text-base leading-7 text-[#9e7981]">{product.description}</p>
        <div className="flex items-center justify-between gap-4 pt-2">
          <p className="text-2xl font-bold text-[#b7475d]">{product.price}</p>
          <button className="rounded-xl border border-[#d6a8b2] px-5 py-3 text-base font-semibold text-[#b7475d] transition hover:bg-[#b7475d] hover:text-white">
            Дэлгэрэнгүй
          </button>
        </div>
      </div>
    </article>
  );
}
