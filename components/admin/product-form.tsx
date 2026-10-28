"use client";

import Image from "next/image";
import { useActionState, useState } from "react";

import { saveProduct, type ProductFormState } from "@/app/admin/products/actions";
import type { ProductRow } from "@/lib/products";

const inputClass =
  "mt-2 w-full rounded-xl border border-[#eadfd5] bg-white px-3.5 py-2.5 text-[12px] text-[#2f2420] outline-none transition focus:border-[#6e4f45]";
const labelClass = "block text-[12px] font-medium text-[#4a3b35]";
const hintClass = "mt-1 block text-[10px] font-normal text-[#8a7b73]";

export function ProductForm({ product }: { product?: ProductRow }) {
  const [state, action, pending] = useActionState<ProductFormState, FormData>(saveProduct, {});
  const [preview, setPreview] = useState(product?.image ?? "");

  return (
    <form action={action} className="mt-6 grid gap-6 lg:grid-cols-[1.5fr_1fr]">
      {product ? <input type="hidden" name="existing_slug" value={product.slug} /> : null}
      <input type="hidden" name="current_image" value={product?.image ?? ""} />

      <div className="space-y-5 rounded-[20px] border border-[#eadfd5] bg-white p-6">
        <label className={labelClass}>
          Барааны нэр
          <input name="name" required defaultValue={product?.name} className={inputClass} />
        </label>

        <label className={labelClass}>
          Код (slug)
          <input
            name="slug"
            required={!product}
            disabled={Boolean(product)}
            defaultValue={product?.slug}
            placeholder="bor-tovch-12mm"
            className={`${inputClass} disabled:bg-[#f7f3ef] disabled:text-[#8a7b73]`}
          />
          <span className={hintClass}>Хаягт харагдана (/shop/…/код). Латин жижиг үсэг, тоо, зураас. Дараа нь солигдохгүй.</span>
        </label>

        <div className="grid gap-5 sm:grid-cols-2">
          <label className={labelClass}>
            Ангилал
            <select name="category" defaultValue={product?.category ?? "finished"} className={inputClass}>
              <option value="finished">Бэлэн бүтээгдэхүүн</option>
              <option value="supplies">Материал</option>
            </select>
          </label>
          <label className={labelClass}>
            Дэд ангилал
            <input name="subcategory" defaultValue={product?.subcategory} placeholder="Товч, Синель утас, Тоглоом…" className={inputClass} />
          </label>
        </div>

        <div className="grid gap-5 sm:grid-cols-3">
          <label className={labelClass}>
            Үнэ (₮)
            <input name="price" type="number" min={0} required defaultValue={product?.price} className={inputClass} />
          </label>
          <label className={labelClass}>
            Үлдэгдэл (ш)
            <input name="stock" type="number" min={0} required defaultValue={product?.stock ?? 0} className={inputClass} />
          </label>
          <label className={labelClass}>
            Брэнд
            <input name="brand" defaultValue={product?.brand === "-" ? "" : product?.brand} className={inputClass} />
          </label>
        </div>

        <label className={labelClass}>
          Тайлбар
          <textarea name="description" rows={4} defaultValue={product?.description} className={inputClass} />
        </label>

        <label className={labelClass}>
          Онцлогууд
          <textarea name="features" rows={4} defaultValue={product?.features.join("\n")} className={inputClass} />
          <span className={hintClass}>Мөр бүрт нэг онцлог.</span>
        </label>

        <div className="grid gap-5 sm:grid-cols-2">
          <label className={labelClass}>
            Хувилбарын бүлэг
            <input name="group_slug" defaultValue={product?.group_slug ?? ""} placeholder="buttons-12mm" className={inputClass} />
            <span className={hintClass}>Нэг барааны өөр өнгөнүүдэд ижил бүлгийн нэр өгвөл хамт харагдана.</span>
          </label>
          <label className={labelClass}>
            Хувилбарын нэр
            <input name="option_label" defaultValue={product?.option_label ?? ""} placeholder="Бор, Mint…" className={inputClass} />
          </label>
        </div>
      </div>

      <div className="space-y-5">
        <div className="rounded-[20px] border border-[#eadfd5] bg-white p-6">
          <p className={labelClass}>Зураг</p>
          <div className="relative mt-3 aspect-square overflow-hidden rounded-xl bg-[#f7f2ed]">
            {preview ? (
              <Image src={preview} alt="" fill unoptimized className="object-cover" />
            ) : (
              <div className="flex h-full items-center justify-center text-[11px] text-[#8a7b73]">Зураг сонгоогүй</div>
            )}
          </div>
          <input
            name="image"
            type="file"
            accept="image/*"
            onChange={(event) => {
              const file = event.target.files?.[0];
              if (file) setPreview(URL.createObjectURL(file));
            }}
            className="mt-3 w-full text-[11px] file:mr-3 file:rounded-lg file:border-0 file:bg-[#f3ebe4] file:px-3 file:py-2 file:text-[11px]"
          />
          <span className={hintClass}>JPG, PNG, WEBP · 5MB хүртэл</span>
        </div>

        <div className="space-y-4 rounded-[20px] border border-[#eadfd5] bg-white p-6">
          <label className="flex items-center gap-3 text-[12px]">
            <input name="is_active" type="checkbox" defaultChecked={product?.is_active ?? true} className="h-4 w-4 accent-[#6e4f45]" />
            Сайтад харуулах
          </label>
          <label className={labelClass}>
            Тэмдэглэгээ (badge)
            <input name="badge" defaultValue={product?.badge ?? ""} placeholder="Шинэ, Хямдрал…" className={inputClass} />
          </label>
          <label className={labelClass}>
            Эрэмбэ
            <input name="sort_order" type="number" min={0} defaultValue={product?.sort_order ?? 0} className={inputClass} />
            <span className={hintClass}>Бага тоо түрүүлж харагдана.</span>
          </label>
        </div>

        {state.error ? <p className="rounded-xl bg-[#fbeaea] px-4 py-3 text-[12px] text-[#b04a4a]">{state.error}</p> : null}

        <button
          type="submit"
          disabled={pending}
          className="w-full rounded-[14px] bg-[#6e4f45] px-6 py-3.5 text-[13px] font-medium text-white transition hover:bg-[#5c4038] disabled:opacity-60"
        >
          {pending ? "Хадгалж байна…" : product ? "Өөрчлөлт хадгалах" : "Бараа нэмэх"}
        </button>
      </div>
    </form>
  );
}
