import { Pencil, Plus } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

import { updateStockAction } from "@/app/admin/products/actions";
import { SubmitButton } from "@/components/admin/submit-button";
import { Notice, PageHeader, StatusPill, primaryButton } from "@/components/admin/ui";
import { requireAdmin } from "@/lib/auth";
import { getProducts, type ProductType } from "@/lib/data/products";
import { formatPrice } from "@/lib/format";

export default async function AdminProductsPage({
  searchParams,
}: {
  searchParams: Promise<{ type?: string; saved?: string; deleted?: string; q?: string }>;
}) {
  await requireAdmin();
  const params = await searchParams;
  const type: ProductType = params.type === "material" ? "material" : "product";
  const products = await getProducts({ type, query: params.q?.trim() || undefined });

  return (
    <div>
      <PageHeader
        title="Бүтээгдэхүүн / Материал"
        description="Бараа нэмэх, засах, үлдэгдэл өөрчлөх"
        action={
          <Link href={`/admin/products/new?type=${type}`} className={primaryButton}>
            <Plus aria-hidden className="h-4 w-4" /> Шинэ {type === "product" ? "бүтээгдэхүүн" : "материал"}
          </Link>
        }
      />
      <div className="mt-4 space-y-2">
        {params.saved ? <Notice>Хадгаллаа.</Notice> : null}
        {params.deleted ? <Notice>Устгалаа.</Notice> : null}
      </div>

      <div className="mt-6 flex flex-wrap items-center justify-between gap-3">
        <div className="flex gap-2 text-[12px]">
          {(["product", "material"] as const).map((value) => (
            <Link
              key={value}
              href={`/admin/products?type=${value}`}
              className={`rounded-full px-4 py-2 ${type === value ? "bg-[#a24456] text-white" : "bg-white ring-1 ring-[#eadfd5]"}`}
            >
              {value === "product" ? "Бүтээгдэхүүн" : "Материал"}
            </Link>
          ))}
        </div>
        <form className="flex gap-2">
          <input type="hidden" name="type" value={type} />
          <input name="q" defaultValue={params.q} placeholder="Нэрээр хайх" className="rounded-xl border border-[#eadfd5] bg-white px-3.5 py-2 text-[12px] outline-none focus:border-[#a24456]" />
        </form>
      </div>

      <div className="mt-6 overflow-x-auto rounded-[20px] border border-[#eadfd5] bg-white">
        <table className="w-full min-w-[760px] text-left text-[12px]">
          <thead className="border-b border-[#f1ebe5] text-[11px] text-[#9c8c84]">
            <tr>
              <th className="px-5 py-3 font-medium">Бараа</th>
              <th className="px-5 py-3 font-medium">Ангилал</th>
              <th className="px-5 py-3 font-medium">Үнэ</th>
              <th className="px-5 py-3 font-medium">Бэлэн байдал</th>
              <th className="px-5 py-3 font-medium">Үлдэгдэл</th>
              <th className="px-5 py-3" />
            </tr>
          </thead>
          <tbody className="divide-y divide-[#f1ebe5]">
            {products.map((product) => (
              <tr key={product.id}>
                <td className="px-5 py-3">
                  <div className="flex items-center gap-3">
                    <Image src={product.images[0] ?? "/Logo.png"} alt="" width={40} height={40} className="h-10 w-10 rounded-lg bg-[#faf7f6] object-contain" />
                    <span className="font-medium">{product.name}</span>
                  </div>
                </td>
                <td className="px-5 py-3 text-[#7a6b63]">
                  {product.category}
                  {product.origin ? ` · ${product.origin}` : ""}
                </td>
                <td className="px-5 py-3">{formatPrice(product.price)}</td>
                <td className="px-5 py-3">
                  {product.availability === "made_to_order" ? (
                    <StatusPill className="bg-[#fdf1d6] text-[#8a5a00]">Захиалгаар · {product.leadDays} хоног</StatusPill>
                  ) : (
                    <StatusPill className="bg-[#e3f4e8] text-[#1f7a3d]">Бэлэн</StatusPill>
                  )}
                </td>
                <td className="px-5 py-3">
                  <form action={updateStockAction} className="flex items-center gap-2">
                    <input type="hidden" name="id" value={product.id} />
                    <label className="sr-only" htmlFor={`stock-${product.id}`}>Үлдэгдэл</label>
                    <input
                      id={`stock-${product.id}`}
                      name="stock"
                      type="number"
                      min={0}
                      defaultValue={product.stock}
                      className={`w-20 rounded-lg border px-2.5 py-1.5 text-[12px] outline-none focus:border-[#a24456] ${
                        product.stock === 0 ? "border-[#e8b4b4] bg-[#fdf3f3]" : product.stock <= 2 ? "border-[#f0d9a8] bg-[#fdf9ef]" : "border-[#eadfd5]"
                      }`}
                    />
                    <SubmitButton className="rounded-lg border border-[#eadfd5] px-2.5 py-1.5 text-[11px] hover:border-[#a24456]">Хадгалах</SubmitButton>
                  </form>
                </td>
                <td className="px-5 py-3 text-right">
                  <Link href={`/admin/products/${product.id}`} className="inline-flex items-center gap-1.5 text-[12px] font-medium text-[#a24456]">
                    <Pencil aria-hidden className="h-3.5 w-3.5" /> Засах
                  </Link>
                </td>
              </tr>
            ))}
            {!products.length ? (
              <tr>
                <td colSpan={6} className="px-5 py-10 text-center text-[#9c8c84]">
                  Бараа алга
                </td>
              </tr>
            ) : null}
          </tbody>
        </table>
      </div>
    </div>
  );
}
