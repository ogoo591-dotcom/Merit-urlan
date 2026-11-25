import Link from "next/link";
import { notFound } from "next/navigation";

import { deleteCourseAction } from "@/server/modules/courses/admin-actions";
import { ConfirmButton } from "@/components/ui/confirm-button";
import { CourseForm } from "@/features/admin/components/course-form";
import { PageHeader } from "@/features/admin/components/ui";
import { requireAdmin } from "@/server/auth";
import { getCourseForAdmin } from "@/server/modules/courses/queries";

export default async function EditCoursePage({ params }: { params: Promise<{ id: string }> }) {
  await requireAdmin();
  const course = await getCourseForAdmin((await params).id);
  if (!course) notFound();

  return (
    <div>
      <Link href="/admin/courses" className="text-[12px] text-[#7a6b63] hover:text-[#a24456]">← Буцах</Link>
      <div className="mt-3">
        <PageHeader
          title={course.title}
          action={
            <form action={deleteCourseAction}>
              <input type="hidden" name="id" value={course.id} />
              <ConfirmButton
                message={`"${course.title}" сургалтыг устгах уу? Худалдаж авсан хэрэглэгчид хандах боломжгүй болно.`}
                className="rounded-xl border border-[#e8b4b4] px-4 py-2 text-[12px] font-semibold text-[#a33a3a] hover:bg-[#fdf3f3]"
              >
                Устгах
              </ConfirmButton>
            </form>
          }
        />
      </div>
      <CourseForm course={course} />
    </div>
  );
}
