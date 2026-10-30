"use client";

import { ArrowLeft, ArrowRight, Check, CircleCheck, Lock, PlayCircle } from "lucide-react";
import Link from "next/link";

import { purchaseCourse } from "@/app/courses/actions";
import { PurchaseButton } from "@/components/purchase-button";
import { useCourseProgress } from "@/components/courses/course-progress";
import { setLessonCompleted } from "@/lib/data/progress";

export type LearnLesson = { id: string; title: string; duration: string; isFree: boolean; locked: boolean };

type Props = {
  course: { id: string; title: string; price: number };
  lessons: LearnLesson[];
  currentId: string;
  // Түгжээтэй хичээлд сервер null дамжуулна — линк client руу огт ирэхгүй.
  videoUrl: string | null;
  owned: boolean;
};

function youTubeEmbed(url: string) {
  const match = url.match(/(?:youtube\.com\/(?:embed\/|watch\?v=)|youtu\.be\/)([\w-]{11})/);
  return match ? `https://www.youtube-nocookie.com/embed/${match[1]}?rel=0` : null;
}

function VideoPlayer({ url, title, onEnded }: { url: string; title: string; onEnded: () => void }) {
  const embed = youTubeEmbed(url);
  if (embed) {
    return (
      <iframe
        src={embed}
        title={title}
        allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
        className="h-full w-full"
      />
    );
  }
  return <video key={url} src={url} controls playsInline controlsList="nodownload" onEnded={onEnded} className="h-full w-full" />;
}

const price = (value: number) => `${value.toLocaleString("en-US")}₮`;

export function LearnView({ course, lessons, currentId, videoUrl, owned }: Props) {
  const lessonIds = lessons.map((lesson) => lesson.id);
  const { userId, completed, percent, doneCount } = useCourseProgress(course.id, lessonIds);
  const index = lessons.findIndex((lesson) => lesson.id === currentId);
  const current = lessons[index];
  const previous = lessons[index - 1];
  const next = lessons[index + 1];
  const isDone = completed.includes(currentId);
  const markDone = (done: boolean) => void setLessonCompleted(userId, course.id, currentId, done);

  return (
    <div className="mx-auto grid w-full max-w-[1600px] gap-6 px-4 py-6 sm:px-6 lg:grid-cols-[1fr_380px] lg:px-[60px] lg:py-10">
      {/* Зүүн: видео тоглуулагч */}
      <div className="min-w-0">
        <Link href={`/courses/${course.id}`} className="inline-flex items-center gap-1.5 text-[12px] text-[#7a6b63] hover:text-[#a24456]">
          <ArrowLeft aria-hidden className="h-4 w-4" />
          {course.title}
        </Link>

        <div className="mt-4 aspect-video overflow-hidden rounded-[20px] bg-[#1c1513]">
          {videoUrl ? (
            <VideoPlayer url={videoUrl} title={current.title} onEnded={() => markDone(true)} />
          ) : (
            <div className="flex h-full flex-col items-center justify-center gap-4 px-6 text-center text-white">
              <span className="flex h-14 w-14 items-center justify-center rounded-full bg-white/10">
                <Lock aria-hidden className="h-6 w-6" />
              </span>
              <p className="text-[15px] font-semibold">Энэ хичээл түгжээтэй</p>
              <p className="max-w-[360px] text-[12px] leading-relaxed text-white/70">
                Сургалтыг авснаар бүх {lessons.length} хичээл нээгдэж, хүссэн үедээ дахин үзэх боломжтой.
              </p>
              <PurchaseButton action={purchaseCourse} itemId={course.id} price={course.price} label={`Энэ сургалтыг авах — ${price(course.price)}`} />
            </div>
          )}
        </div>

        <div className="mt-5 flex flex-wrap items-start justify-between gap-4">
          <div>
            <p className="text-[11px] text-[#9c8c84]">
              Хичээл {index + 1}/{lessons.length} · {current.duration}
            </p>
            <h1 className="mt-1 text-[20px] font-semibold text-[#2f2420]">{current.title}</h1>
          </div>
          {videoUrl ? (
            <button
              type="button"
              onClick={() => markDone(!isDone)}
              aria-pressed={isDone}
              className={`inline-flex items-center gap-2 rounded-xl px-4 py-2.5 text-[12px] font-semibold transition ${
                isDone ? "bg-[#e3f4e8] text-[#1f7a3d]" : "border border-[#e3d6cb] bg-white text-[#2f2420] hover:border-[#a24456]"
              }`}
            >
              <Check aria-hidden className="h-4 w-4" />
              {isDone ? "Үзэж дууссан" : "Дууссан гэж тэмдэглэх"}
            </button>
          ) : null}
        </div>

        <div className="mt-6 flex justify-between gap-3 border-t border-[#eadfd5] pt-5">
          {previous ? (
            <Link href={`?lesson=${previous.id}`} className="inline-flex items-center gap-2 text-[12px] font-medium text-[#4a3b35] hover:text-[#a24456]">
              <ArrowLeft aria-hidden className="h-4 w-4" /> Өмнөх
            </Link>
          ) : (
            <span />
          )}
          {next ? (
            <Link href={`?lesson=${next.id}`} className="inline-flex items-center gap-2 text-[12px] font-medium text-[#4a3b35] hover:text-[#a24456]">
              Дараагийн хичээл <ArrowRight aria-hidden className="h-4 w-4" />
            </Link>
          ) : null}
        </div>
      </div>

      {/* Баруун: хичээлийн жагсаалт, явц */}
      <aside className="h-fit rounded-[20px] border border-[#eadfd5] bg-white lg:sticky lg:top-[calc(var(--header-h,130px)+24px)]">
        <div className="border-b border-[#f1ebe5] p-5">
          <p className="text-[13px] font-semibold text-[#2f2420]">Хичээлүүд</p>
          <div className="mt-3 flex justify-between text-[11px] text-[#7a6b63]">
            <span>
              {doneCount}/{lessons.length} үзсэн
            </span>
            <span className="font-semibold text-[#2f2420]">{percent}%</span>
          </div>
          <div
            className="mt-2 h-2 overflow-hidden rounded-full bg-[#f1e6e0]"
            role="progressbar"
            aria-valuenow={percent}
            aria-valuemin={0}
            aria-valuemax={100}
            aria-label="Сургалтын явц"
          >
            <div className="h-full rounded-full bg-[#a24456] transition-[width]" style={{ width: `${percent}%` }} />
          </div>
        </div>
        <ol className="max-h-[60svh] overflow-y-auto p-2">
          {lessons.map((lesson, lessonIndex) => {
            const active = lesson.id === currentId;
            const done = completed.includes(lesson.id);
            return (
              <li key={lesson.id}>
                <Link
                  href={`?lesson=${lesson.id}`}
                  aria-current={active ? "true" : undefined}
                  className={`flex items-center gap-3 rounded-xl px-3 py-3 transition ${active ? "bg-[#f7e9ec]" : "hover:bg-[#faf6f3]"}`}
                >
                  <span className={`shrink-0 ${lesson.locked ? "text-[#b3a69e]" : done ? "text-[#2fa65a]" : "text-[#a24456]"}`}>
                    {lesson.locked ? (
                      <Lock aria-label="Түгжээтэй" className="h-5 w-5" />
                    ) : done ? (
                      <CircleCheck aria-label="Үзсэн" className="h-5 w-5" />
                    ) : (
                      <PlayCircle aria-label="Үзэх" className="h-5 w-5" />
                    )}
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className={`block text-[12px] ${active ? "font-semibold text-[#a24456]" : "text-[#2f2420]"}`}>
                      {lessonIndex + 1}. {lesson.title}
                    </span>
                    <span className="mt-0.5 block text-[10px] text-[#9c8c84]">
                      {lesson.duration}
                      {lesson.isFree && !owned ? " · Үнэгүй" : ""}
                    </span>
                  </span>
                </Link>
              </li>
            );
          })}
        </ol>
        {!owned ? (
          <div className="border-t border-[#f1ebe5] p-4">
            <PurchaseButton
              action={purchaseCourse}
              itemId={course.id}
              price={course.price}
              label={`Бүх хичээлийг нээх — ${price(course.price)}`}
              className="w-full"
            />
          </div>
        ) : null}
      </aside>
    </div>
  );
}
