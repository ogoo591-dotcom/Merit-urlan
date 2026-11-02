"use client";

import { FileCheck } from "lucide-react";
import Image from "next/image";
import { useActionState } from "react";

import { savePatternAction, type FormState } from "@/app/admin/patterns/actions";
import { SubmitButton } from "@/components/admin/submit-button";
import { Notice, cardClass, hintClass, inputClass, labelClass, primaryButton } from "@/components/admin/ui";
import type { DbPattern } from "@/lib/mock/db";

export function PatternForm({ pattern, materialOptions }: { pattern?: DbPattern; materialOptions: Array<{ id: string; name: string }> }) {
  const [state, action] = useActionState<FormState, FormData>(savePatternAction, {});

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
            <input name="price" type="number" min={0} step={500} required defaultValue={pattern?.price ?? 0} className={inputClass} />
            <span className={hintClass}>0 бол үнэгүй: хэн ч нэвтрэлгүй үзэж, татна.</span>
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
            Эх зохиогч
            <input name="credit" defaultValue={pattern?.credit} placeholder="@designer" className={inputClass} />
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
          <p className={labelClass}>Бүтэн схем (зураг эсвэл PDF)</p>
          {pattern ? (
            <p className="mt-2 flex items-center gap-2 text-[12px] text-[#2e7a43]">
              <FileCheck aria-hidden className="h-4 w-4" /> Файл байгаа · солих бол шинийг сонгоно
            </p>
          ) : null}
          <input name="file" type="file" accept="image/jpeg,image/png,image/webp,application/pdf" required={!pattern} className={`${inputClass} mt-3`} />
          <span className={hintClass}>20MB хүртэл. Нийтэд нээлттэй биш газар хадгалагдана (mock: .mock-db/files, дараа нь Supabase private bucket).</span>
        </div>

        <div className={cardClass}>
          <p className={labelClass}>Нүүр зураг</p>
          <span className={hintClass}>Жагсаалтад хүн бүрт харагдана. Зөвхөн бүтээлийн зургийг оруулна, схемийн заавар орж болохгүй.</span>
          {pattern?.coverImage ? (
            <div className="relative mt-3 aspect-square w-32 overflow-hidden rounded-xl bg-[#faf7f6]">
              <Image src={pattern.coverImage} alt="" fill sizes="128px" className="object-cover" />
            </div>
          ) : null}
          <input name="cover" type="file" accept="image/jpeg,image/png,image/webp" required={!pattern} className={`${inputClass} mt-3`} />
        </div>

        <SubmitButton className={`${primaryButton} w-full py-3`} pendingText="Хадгалж байна…">
          {pattern ? "Өөрчлөлт хадгалах" : "Схем нэмэх"}
        </SubmitButton>
      </div>
    </form>
  );
}
