"use client";

import { FileCheck, X } from "lucide-react";
import Image from "next/image";
import { useActionState, useState } from "react";

import { savePatternAction, type FormState } from "@/app/admin/patterns/actions";
import { SubmitButton } from "@/components/admin/submit-button";
import { Notice, cardClass, hintClass, inputClass, labelClass, primaryButton } from "@/components/admin/ui";
import type { DbPattern } from "@/lib/mock/db";

export function PatternForm({ pattern, materialOptions }: { pattern?: DbPattern; materialOptions: Array<{ id: string; name: string }> }) {
  const [state, action] = useActionState<FormState, FormData>(savePatternAction, {});
  const [previews, setPreviews] = useState(pattern?.previews ?? []);

  return (
    <form action={action} className="mt-6 grid gap-6 lg:grid-cols-[1.5fr_1fr]">
      {pattern ? <input type="hidden" name="originalId" value={pattern.id} /> : null}

      <div className={`${cardClass} space-y-5`}>
        {state.error ? <Notice tone="error">{state.error}</Notice> : null}
        <label className={labelClass}>
          Схемийн нэр
          <input name="name" required defaultValue={pattern?.name} className={inputClass} />
        </label>
        {!pattern ? (
          <label className={labelClass}>
            ID (хаягт харагдана)
            <input name="id" placeholder="snoopy-dog" className={inputClass} />
            <span className={hintClass}>Латин жижиг үсэг, тоо, зураас. Хоосон орхивол автоматаар үүснэ.</span>
          </label>
        ) : (
          <p className="text-[11px] text-[#9c8c84]">ID: {pattern.id}</p>
        )}
        <label className={labelClass}>
          Тайлбар
          <textarea name="description" rows={3} defaultValue={pattern?.description} className={inputClass} />
        </label>
        <div className="grid gap-4 sm:grid-cols-3">
          <label className={labelClass}>
            Үнэ (₮)
            <input name="price" type="number" min={0} step={500} required defaultValue={pattern?.price} className={inputClass} />
          </label>
          <label className={labelClass}>
            Төрөл
            <select name="type" defaultValue={pattern?.type ?? "toy"} className={inputClass}>
              <option value="toy">Тоглоом</option>
              <option value="clothes">Хувцас</option>
              <option value="home">Гэр ахуй</option>
              <option value="accessory">Аксессуар</option>
            </select>
          </label>
          <label className={labelClass}>
            Түвшин
            <select name="level" defaultValue={pattern?.level ?? "beginner"} className={inputClass}>
              <option value="beginner">Анхан шат</option>
              <option value="intermediate">Дунд шат</option>
              <option value="advanced">Ахисан шат</option>
            </select>
          </label>
          <label className={labelClass}>
            Хэмжээ
            <input name="size" defaultValue={pattern?.size} placeholder="Өндөр ~25 см" className={inputClass} />
          </label>
          <label className={labelClass}>
            Эх хэл
            <input name="sourceLanguage" defaultValue={pattern?.sourceLanguage ?? "Англи"} className={inputClass} />
          </label>
          <label className={labelClass}>
            PDF хуудас
            <input name="pages" type="number" min={1} defaultValue={pattern?.pages ?? 1} className={inputClass} />
          </label>
        </div>
        <label className={labelClass}>
          Шаардлагатай материал (мөр бүрт нэг)
          <textarea
            name="materials"
            rows={5}
            defaultValue={pattern?.materials.map((item) => (item.materialId ? `${item.name} | ${item.materialId}` : item.name)).join("\n")}
            placeholder={"2.5мм дэгээ\n12мм бор товч | 12mm-bor-tovch-10"}
            className={inputClass}
          />
          <span className={hintClass}>
            Дэлгүүрийн материалтай холбох бол “Нэр | материалын ID” гэж бичнэ. ID-ууд:{" "}
            {materialOptions.map((option) => option.id).join(", ")}
          </span>
        </label>
      </div>

      <div className="space-y-6">
        <div className={cardClass}>
          <p className={labelClass}>Схемийн PDF</p>
          {pattern ? (
            <p className="mt-2 flex items-center gap-2 text-[12px] text-[#2e7a43]">
              <FileCheck aria-hidden className="h-4 w-4" /> PDF байгаа · солих бол шинийг сонгоно
            </p>
          ) : null}
          <input name="pdf" type="file" accept="application/pdf" required={!pattern} className={`${inputClass} mt-3`} />
          <span className={hintClass}>20MB хүртэл. Нийтэд нээлттэй биш газар хадгалагдана (mock: .mock-db/files, дараа нь Supabase private bucket).</span>
        </div>

        <div className={cardClass}>
          <p className={labelClass}>Нүүр зураг</p>
          {pattern?.coverImage ? (
            <div className="relative mt-3 aspect-square w-32 overflow-hidden rounded-xl bg-[#faf7f6]">
              <Image src={pattern.coverImage} alt="" fill sizes="128px" className="object-cover" />
            </div>
          ) : null}
          <input name="cover" type="file" accept="image/jpeg,image/png,image/webp" required={!pattern} className={`${inputClass} mt-3`} />
        </div>

        <div className={cardClass}>
          <p className={labelClass}>Урьдчилан харах хуудсууд (1–2)</p>
          {previews.length ? (
            <ul className="mt-3 flex gap-3">
              {previews.map((src) => (
                <li key={src} className="relative h-28 w-20 overflow-hidden rounded-lg border border-[#eadfd5] bg-white">
                  <input type="hidden" name="keepPreviews" value={src} />
                  <Image src={src} alt="" fill sizes="80px" className="object-contain" />
                  <button
                    type="button"
                    onClick={() => setPreviews((list) => list.filter((item) => item !== src))}
                    aria-label="Хасах"
                    className="absolute right-1 top-1 flex h-5 w-5 items-center justify-center rounded-full bg-white/90 text-[#a33a3a]"
                  >
                    <X aria-hidden className="h-3 w-3" />
                  </button>
                </li>
              ))}
            </ul>
          ) : null}
          <input name="previews" type="file" accept="image/jpeg,image/png,image/webp" multiple className={`${inputClass} mt-3`} />
          <span className={hintClass}>Схемийн хуудасны зураг (“ДЭЭЖ” тэмдэгтэй хувилбар оруулахыг зөвлөнө).</span>
        </div>

        <SubmitButton className={`${primaryButton} w-full py-3`} pendingText="Хадгалж байна…">
          {pattern ? "Өөрчлөлт хадгалах" : "Схем нэмэх"}
        </SubmitButton>
      </div>
    </form>
  );
}
