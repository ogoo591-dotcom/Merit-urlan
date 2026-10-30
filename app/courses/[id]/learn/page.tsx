import { auth } from "@clerk/nextjs/server";
import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { LearnView } from "@/components/courses/learn-view";
import { SiteHeader } from "@/components/site-header";
import { getCourse, getLessonVideo } from "@/lib/data/courses";
import { hasAccess } from "@/lib/data/purchases";

type Props = { params: Promise<{ id: string }>; searchParams: Promise<{ lesson?: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const course = await getCourse((await params).id);
  return course ? { title: `${course.title} — хичээл | Merit Urlan` } : {};
}

// Эрхийг сервер дээр шалгана: түгжээтэй хичээлийн videoUrl client руу (HTML, RSC payload-д) огт дамжихгүй.
export default async function LearnPage({ params, searchParams }: Props) {
  const [{ id }, { lesson }] = await Promise.all([params, searchParams]);
  const course = await getCourse(id);
  if (!course) notFound();

  const { userId } = await auth();
  const owned = await hasAccess(userId, course.id);
  const current = course.lessons.find((item) => item.id === lesson) ?? course.lessons[0];
  const videoUrl = await getLessonVideo(course.id, current.id, userId);

  return (
    <>
      <SiteHeader />
      <main className="min-h-[calc(100svh-var(--header-h,130px))] bg-[#fcf6f0]">
        <LearnView
          course={{ id: course.id, title: course.title, price: course.price }}
          lessons={course.lessons.map((item) => ({ ...item, locked: !owned && !item.isFree }))}
          currentId={current.id}
          videoUrl={videoUrl}
          owned={owned}
        />
      </main>
    </>
  );
}
