import Image from "next/image";
import Link from "next/link";

import { toggleActive, updateStock } from "@/app/admin/products/actions";
import { getAdminSupabase } from "@/lib/auth";
import { formatPrice, type ProductRow } from "@/lib/products";

export const runtime = "edge";

type AdminProductsPageProps = {
  searchParams: Promise<{ q?: string; filter?: string; saved?: string }>;
};

const categoryLabels = { supplies: "Материал", finished: "Бэлэн бүтээгдэхүүн" } as const;

export default async function AdminProductsPage({ searchParams }: AdminProductsPageProps) {
  const { q = "", filter, saved } = await searchParams;
  const supabase = await getAdminSupabase();

  let query = supabase.from("products").select("*").order("category").order("sort_order");
  if (filter === "low") query = query.lte("stock", 5);
  if (filter === "hidden") query = query.eq("is_active", false);
  const { data, error } = await query;
  const term = q.trim().toLowerCase();
  const products = ((data ?? []) as ProductRow[]).filter(
    (product) => !term || product.name.toLowerCase().includes(term) || product.slug.includes(term),
  );
  const totalUnits = products.reduce((sum, product) => sum + product.stock, 0);

  const filters = [
    { key: undefined, label: "Бүгд" },
    { key: "low", label: "Үлдэгдэл бага" },
    { key: "hidden", label: "Нуусан" },
  ];

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-[24px] font-semibold">Бараа бүтээгдэхүүн</h1>
          <p className="mt-1 text-[12px] text-[#8a7b73]">
            {products.length} бараа · нийт {totalUnits.toLocaleString("en-US")} ширхэг үлдэгдэл
          </p>
        </div>
        <Link href="/admin/products/new" className="rounded-[14px] bg-[#6e4f45] px-5 py-3 text-[12px] font-medium text-white hover:bg-[#5c4038]">
          + Шинэ бараа нэмэх
        </Link>
      </div>

      {saved ? <p className="mt-4 rounded-xl bg-[#e3f2e6] px-4 py-3 text-[12px] text-[#2e7a43]">Амжилттай хадгаллаа.</p> : null}
      {error ? <p className="mt-4 rounded-xl bg-[#fbeaea] px-4 py-3 text-[12px] text-[#b04a4a]">{error.message}</p> : null}

      <div className="mt-6 flex flex-wrap items-center gap-3">
        {filters.map((item) => (
          <Link
            key={item.label}
            href={item.key ? `/admin/products?filter=${item.key}` : "/admin/products"}
            className={`rounded-full px-4 py-2 text-[12px] ${filter === item.key ? "bg-[#2f2420] text-white" : "bg-white text-[#4a3b35] ring-1 ring-[#eadfd5]"}`}
          >
            {item.label}
          </Link>
        ))}
        <form className="ml-auto">
          {filter ? <input type="hidden" name="filter" value={filter} /> : null}
          <input
            name="q"
            defaultValue={q}
            placeholder="Нэр, кодоор хайх…"
            className="w-56 rounded-full border border-[#eadfd5] bg-white px-4 py-2 text-[12px] outline-none focus:border-[#6e4f45]"
          />
        </form>
      </div>

      <div className="mt-4 overflow-x-auto rounded-[20px] border border-[#eadfd5] bg-white">
        <table className="w-full min-w-[820px] text-left text-[12px]">
          <thead className="border-b border-[#eadfd5] text-[11px] text-[#8a7b73]">
            <tr>
              <th className="px-5 py-3 font-medium">Бараа</th>
              <th className="px-5 py-3 font-medium">Ангилал</th>
              <th className="px-5 py-3 font-medium">Үнэ</th>
              <th className="px-5 py-3 font-medium">Үлдэгдэл</th>
              <th className="px-5 py-3 font-medium">Төлөв</th>
              <th className="px-5 py-3" />
            </tr>
          </thead>
          <tbody className="divide-y divide-[#f1ebe5]">
            {products.map((product) => (
              <tr key={product.slug} className={product.is_active ? "" : "opacity-55"}>
                <td className="px-5 py-3">
                  <div className="flex items-center gap-3">
                    <Image src={product.image} alt="" width={44} height={44} className="h-11 w-11 rounded-lg bg-[#f7f2ed] object-cover" />
                    <div className="min-w-0">
                      <p className="line-clamp-1 font-medium">{product.name}</p>
                      <p className="text-[10px] text-[#8a7b73]">{product.slug}</p>
                    </div>
                  </div>
                </td>
                <td className="px-5 py-3 text-[#4a3b35]">
                  {categoryLabels[product.category]}
                  <span className="block text-[10px] text-[#8a7b73]">{product.subcategory}</span>
                </td>
                <td className="px-5 py-3">{formatPrice(product.price)}</td>
                <td className="px-5 py-3">
                  <form action={updateStock} className="flex items-center gap-2">
                    <input type="hidden" name="slug" value={product.slug} />
                    <input
                      name="stock"
                      type="number"
                      min={0}
                      defaultValue={product.stock}
                      className={`w-20 rounded-lg border px-2 py-1.5 text-[12px] ${product.stock <= 5 ? "border-[#e9c08a] bg-[#fdf6e7]" : "border-[#eadfd5]"}`}
                    />
                    <button className="rounded-lg bg-[#f3ebe4] px-2.5 py-1.5 text-[11px] hover:bg-[#eadfd5]">Хадгалах</button>
                  </form>
                </td>
                <td className="px-5 py-3">
                  <form action={toggleActive}>
                    <input type="hidden" name="slug" value={product.slug} />
                    <input type="hidden" name="is_active" value={String(!product.is_active)} />
                    <button className={`rounded-full px-3 py-1 text-[11px] ${product.is_active ? "bg-[#e3f2e6] text-[#2e7a43]" : "bg-[#efe9e4] text-[#7a6b63]"}`}>
                      {product.is_active ? "Харагдаж байна" : "Нуусан"}
                    </button>
                  </form>
                </td>
                <td className="px-5 py-3 text-right">
                  <Link href={`/admin/products/${product.slug}`} className="text-[12px] font-medium text-[#6e4f45] underline">
                    Засах
                  </Link>
                </td>
              </tr>
            ))}
            {products.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-5 py-10 text-center text-[#8a7b73]">Бараа олдсонгүй</td>
              </tr>
            ) : null}
          </tbody>
        </table>
      </div>
    </div>
  );
}
