"use client";

import { ArrowDown, ArrowUp, Plus, Trash2 } from "lucide-react";
import Image from "next/image";
import { useActionState, useState } from "react";

import { saveCourseAction, type FormState } from "@/app/admin/courses/actions";
import { SubmitButton } from "@/components/admin/submit-button";
import { Notice, cardClass, hintClass, inputClass, labelClass, primaryButton, secondaryButton } from "@/components/admin/ui";
import type { DbCourse } from "@/lib/mock/db";

type LessonDraft = DbCourse["lessons"][number] & { key: string };

const newLesson = (): LessonDraft => ({
  key: crypto.randomUUID(),
  id: "",
  title: "",
  duration: "",
  videoUrl: "",
  isFree: false,
});

// Админ хуудсанд зөвхөн админ ордог тул видео линкийг энд харуулж болно.
export function CourseForm({ course }: { course?: DbCourse }) {
  const [state, action] = useActionState<FormState, FormData>(saveCourseAction, {});
  const [lessons, setLessons] = useState<LessonDraft[]>(
    course?.lessons.map((lesson) => ({ ...lesson, key: lesson.id })) ?? [{ ...newLesson(), isFree: true }],
  );

  const update = (key: string, patch: Partial<LessonDraft>) =>
    setLessons((list) => list.map((lesson) => (lesson.key === key ? { ...lesson, ...patch } : lesson)));
  const move = (index: number, delta: number) =>
    setLessons((list) => {
      const next = [...list];
      const [item] = next.splice(index, 1);
      next.splice(index + delta, 0, item);
      return next;
    });

  return (
    <form action={action} className="mt-6 space-y-6">
      {course ? <input type="hidden" name="originalId" value={course.id} /> : null}
      <input type="hidden" name="currentCover" value={course?.coverImage ?? ""} />
      <input type="hidden" name="lessons" value={JSON.stringify(lessons.map(({ id, title, duration, videoUrl, isFree }) => ({ id, title, duration, videoUrl, isFree })))} />

      {state.error ? <Notice tone="error">{state.error}</Notice> : null}

      <div className="grid gap-6 lg:grid-cols-[1.5fr_1fr]">
        <div className={`${cardClass} space-y-5`}>
          <label className={labelClass}>
            Сургалтын нэр
            <input name="title" required defaultValue={course?.title} className={inputClass} />
          </label>
          {!course ? (
            <label className={labelClass}>
              ID (хаягт харагдана)
              <input name="id" placeholder="amigurumi-studio" className={inputClass} />
              <span className={hintClass}>Латин жижиг үсэг, тоо, зураас. Хоосон орхивол автоматаар үүснэ.</span>
            </label>
          ) : (
            <p className="text-[11px] text-[#9c8c84]">ID: {course.id}</p>
          )}
          <label className={labelClass}>
            Тайлбар
            <textarea name="description" rows={3} defaultValue={course?.description} className={inputClass} />
          </label>
          <div className="grid gap-4 sm:grid-cols-3">
            <label className={labelClass}>
              Үнэ (₮)
              <input name="price" type="number" min={0} step={1000} required defaultValue={course?.price} className={inputClass} />
            </label>
            <label className={labelClass}>
              Түвшин
              <select name="level" defaultValue={course?.level ?? "beginner"} className={inputClass}>
                <option value="beginner">Анхан шат</option>
                <option value="intermediate">Дунд шат</option>
                <option value="advanced">Ахисан шат</option>
              </select>
            </label>
            <label className={labelClass}>
              Нийт хугацаа
              <input name="totalDuration" defaultValue={course?.totalDuration} placeholder="1 цаг 30 мин" className={inputClass} />
            </label>
          </div>
          <label className={labelClass}>
            Юу сурах вэ (мөр бүрт нэг)
            <textarea name="outcomes" rows={4} defaultValue={course?.outcomes.join("\n")} className={inputClass} />
          </label>
          <label className={labelClass}>
            Сэдэв (таслалаар)
            <input name="topics" defaultValue={course?.topics.join(", ")} placeholder="amigurumi, basics" className={inputClass} />
            <span className={hintClass}>“amigurumi” гэж бичвэл сургалтын “Amigurumi” шүүлтүүрт гарна.</span>
          </label>
        </div>

        <div className={`${cardClass} h-fit`}>
          <p className={labelClass}>Нүүр зураг</p>
          {course?.coverImage ? (
            <div className="relative mt-3 aspect-[4/3] overflow-hidden rounded-xl bg-[#faf7f6]">
              <Image src={course.coverImage} alt="" fill sizes="320px" className="object-cover" />
            </div>
          ) : null}
          <input name="cover" type="file" accept="image/jpeg,image/png,image/webp" className={`${inputClass} mt-3`} />
          <span className={hintClass}>{course ? "Солих бол шинэ зураг сонгоно." : "JPG, PNG, WEBP · 5MB хүртэл."}</span>
        </div>
      </div>

      <section className={cardClass}>
        <div className="flex items-center justify-between">
          <h2 className="text-[14px] font-semibold">Хичээлүүд ({lessons.length})</h2>
          <button type="button" onClick={() => setLessons((list) => [...list, newLesson()])} className={secondaryButton}>
            <Plus aria-hidden className="h-4 w-4" /> Хичээл нэмэх
          </button>
        </div>
        <ol className="mt-4 space-y-3">
          {lessons.map((lesson, index) => (
            <li key={lesson.key} className="rounded-2xl border border-[#eadfd5] p-4">
              <div className="flex items-center gap-2">
                <span className="text-[12px] font-semibold text-[#a24456]">{index + 1}.</span>
                <input
                  aria-label={`${index + 1}-р хичээлийн нэр`}
                  value={lesson.title}
                  onChange={(event) => update(lesson.key, { title: event.target.value })}
                  placeholder="Хичээлийн нэр"
                  className={`${inputClass} mt-0 flex-1`}
                />
                <input
                  aria-label="Хугацаа"
                  value={lesson.duration}
                  onChange={(event) => update(lesson.key, { duration: event.target.value })}
                  placeholder="12 мин"
                  className={`${inputClass} mt-0 w-24`}
                />
                <button type="button" aria-label="Дээш" disabled={index === 0} onClick={() => move(index, -1)} className="p-1.5 text-[#7a6b63] disabled:opacity-30">
                  <ArrowUp aria-hidden className="h-4 w-4" />
                </button>
                <button type="button" aria-label="Доош" disabled={index === lessons.length - 1} onClick={() => move(index, 1)} className="p-1.5 text-[#7a6b63] disabled:opacity-30">
                  <ArrowDown aria-hidden className="h-4 w-4" />
                </button>
                <button
                  type="button"
                  aria-label="Хичээл устгах"
                  onClick={() => setLessons((list) => list.filter((item) => item.key !== lesson.key))}
                  className="p-1.5 text-[#a33a3a]"
                >
                  <Trash2 aria-hidden className="h-4 w-4" />
                </button>
              </div>
              <div className="mt-3 flex flex-wrap items-center gap-4 pl-5">
                <input
                  aria-label="Видео линк"
                  value={lesson.videoUrl}
                  onChange={(event) => update(lesson.key, { videoUrl: event.target.value })}
                  placeholder="https://www.youtube.com/watch?v=… эсвэл https://…/video.mp4"
                  className={`${inputClass} mt-0 min-w-[260px] flex-1`}
                />
                <label className="flex items-center gap-2 text-[12px] text-[#4a3b35]">
                  <input
                    type="checkbox"
                    checked={lesson.isFree}
                    onChange={(event) => update(lesson.key, { isFree: event.target.checked })}
                    className="h-4 w-4 accent-[#a24456]"
                  />
                  Үнэгүй хичээл
                </label>
              </div>
            </li>
          ))}
        </ol>
        <p className={hintClass}>Видео линк зөвхөн эрхтэй хэрэглэгчид серверээс олгогдоно (үнэгүй хичээлийг хэн ч үзнэ).</p>
      </section>

      <SubmitButton className={`${primaryButton} px-8 py-3`} pendingText="Хадгалж байна…">
        {course ? "Өөрчлөлт хадгалах" : "Сургалт нэмэх"}
      </SubmitButton>
    </form>
  );
}
