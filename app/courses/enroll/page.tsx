import { currentUser } from "@clerk/nextjs/server";
import { notFound } from "next/navigation";

import { EnrollForm } from "@/components/enroll-form";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { featuredCourses } from "@/lib/site-data";

export const runtime = "edge";

type EnrollPageProps = {
  searchParams: Promise<{ course?: string }>;
};

export default async function EnrollPage({ searchParams }: EnrollPageProps) {
  const { course: title } = await searchParams;
  const course = featuredCourses.find((item) => item.title === title);
  if (!course) notFound();

  const user = await currentUser();

  return (
    <>
      <SiteHeader />
      <main className="flex-1 bg-[#fcf6f0]">
        <div className="mx-auto w-full max-w-[640px] px-6 py-12">
          <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-[#7a6b63]">Сургалтад бүртгүүлэх</p>
          <h1 className="mt-3 font-serif text-[40px] text-[#2f2420]">{course.title}</h1>
          <p className="mt-3 text-[12px] leading-relaxed text-[#7a6b63]">
            {course.duration} · {course.level}. Бүртгүүлсний дараа бид тантай холбогдож төлбөр, хуваарийг тохиролцоно.
          </p>
          <EnrollForm
            course={course.title}
            defaults={{
              name: user?.fullName ?? "",
              phone: user?.primaryPhoneNumber?.phoneNumber.replace(/^\+976/, "") ?? "",
              email: user?.primaryEmailAddress?.emailAddress ?? "",
            }}
          />
        </div>
      </main>
      <SiteFooter />
    </>
  );
}
