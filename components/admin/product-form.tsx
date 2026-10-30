"use client";

import { X } from "lucide-react";
import Image from "next/image";
import { useActionState, useState } from "react";

import { saveProductAction, type FormState } from "@/app/admin/products/actions";
import { SubmitButton } from "@/components/admin/submit-button";
import { Notice, cardClass, hintClass, inputClass, labelClass, primaryButton } from "@/components/admin/ui";
import type { ProductType, StoreProduct } from "@/lib/mock/products";

export function ProductForm({
  product,
  defaultType,
  categories,
}: {
  product?: StoreProduct;
  defaultType: ProductType;
  categories: string[];
}) {
  const [state, action] = useActionState<FormState, FormData>(saveProductAction, {});
  const [type, setType] = useState<ProductType>(product?.type ?? defaultType);
  const [availability, setAvailability] = useState(product?.availability ?? "ready");
  const [images, setImages] = useState(product?.images ?? []);

  return (
    <form action={action} className="mt-6 grid gap-6 lg:grid-cols-[1.5fr_1fr]">
      {product ? <input type="hidden" name="originalId" value={product.id} /> : null}

      <div className={`${cardClass} space-y-5`}>
        {state.error ? <Notice tone="error">{state.error}</Notice> : null}
        <label className={labelClass}>
          Нэр
          <input name="name" required defaultValue={product?.name} className={inputClass} />
        </label>
        {!product ? (
          <label className={labelClass}>
            ID (хаягт харагдана)
            <input name="id" placeholder="snoopy-dog" className={inputClass} />
            <span className={hintClass}>Латин жижиг үсэг, тоо, зураас. Хоосон орхивол автоматаар үүснэ. Дараа нь солигдохгүй.</span>
          </label>
        ) : (
          <p className="text-[11px] text-[#9c8c84]">ID: {product.id}</p>
        )}
        <label className={labelClass}>
          Тайлбар
          <textarea name="description" rows={4} defaultValue={product?.description} className={inputClass} />
        </label>
        <div className="grid gap-4 sm:grid-cols-2">
          <label className={labelClass}>
            Төрөл
            <select name="type" value={type} onChange={(event) => setType(event.target.value as ProductType)} className={inputClass}>
              <option value="product">Бүтээгдэхүүн</option>
              <option value="material">Материал</option>
            </select>
          </label>
          <label className={labelClass}>
            Ангилал
            <input name="category" required list="product-categories" defaultValue={product?.category} className={inputClass} />
            <datalist id="product-categories">
              {categories.map((category) => (
                <option key={category} value={category} />
              ))}
            </datalist>
          </label>
          <label className={labelClass}>
            Үнэ (₮)
            <input name="price" type="number" min={0} step={100} required defaultValue={product?.price} className={inputClass} />
          </label>
          <label className={labelClass}>
            Үлдэгдэл
            <input name="stock" type="number" min={0} step={1} required defaultValue={product?.stock ?? 0} className={inputClass} />
          </label>
          <label className={labelClass}>
            Бэлэн байдал
            <select
              name="availability"
              value={availability}
              onChange={(event) => setAvailability(event.target.value as typeof availability)}
              className={inputClass}
            >
              <option value="ready">Бэлэн</option>
              <option value="made_to_order">Захиалгаар хийнэ</option>
            </select>
          </label>
          {availability === "made_to_order" ? (
            <label className={labelClass}>
              Бэлэн болох хоног
              <input name="leadDays" type="number" min={1} required defaultValue={product?.leadDays ?? 7} className={inputClass} />
            </label>
          ) : null}
          {type === "material" ? (
            <label className={labelClass}>
              Гарал үүсэл
              <select name="origin" defaultValue={product?.origin ?? ""} className={inputClass}>
                <option value="">—</option>
                <option value="Хятад">Хятад</option>
                <option value="Турк">Турк</option>
              </select>
            </label>
          ) : null}
        </div>
      </div>

      <div className="space-y-6">
        <div className={cardClass}>
          <p className={labelClass}>Зургууд</p>
          {images.length ? (
            <ul className="mt-3 grid grid-cols-3 gap-3">
              {images.map((src) => (
                <li key={src} className="relative aspect-square overflow-hidden rounded-xl border border-[#eadfd5] bg-[#faf7f6]">
                  <input type="hidden" name="keepImages" value={src} />
                  <Image src={src} alt="" fill sizes="120px" className="object-contain" />
                  <button
                    type="button"
                    onClick={() => setImages((list) => list.filter((item) => item !== src))}
                    aria-label="Зураг хасах"
                    className="absolute right-1 top-1 flex h-6 w-6 items-center justify-center rounded-full bg-white/90 text-[#a33a3a]"
                  >
                    <X aria-hidden className="h-3.5 w-3.5" />
                  </button>
                </li>
              ))}
            </ul>
          ) : null}
          <label className={`${labelClass} mt-4`}>
            Зураг нэмэх
            <input name="images" type="file" accept="image/jpeg,image/png,image/webp,image/gif" multiple className={`${inputClass} file:mr-3 file:rounded-lg file:border-0 file:bg-[#f7e9ec] file:px-3 file:py-1.5 file:text-[#a24456]`} />
            <span className={hintClass}>JPG, PNG, WEBP · 5MB хүртэл. (Mock: .mock-db/uploads-д хадгална, дараа нь Supabase Storage.)</span>
          </label>
        </div>
        <SubmitButton className={`${primaryButton} w-full py-3`} pendingText="Хадгалж байна…">
          {product ? "Өөрчлөлт хадгалах" : "Нэмэх"}
        </SubmitButton>
      </div>
    </form>
  );
}
