import Link from "next/link";

import { CourseForm } from "@/features/admin/components/course-form";
import { PageHeader } from "@/features/admin/components/ui";
import { requireAdmin } from "@/server/auth";

export default async function NewCoursePage() {
  await requireAdmin();
  return (
    <div>
      <Link href="/admin/courses" className="text-[12px] text-[#7a6b63] hover:text-[#a24456]">← Буцах</Link>
      <div className="mt-3">
        <PageHeader title="Шинэ сургалт" />
      </div>
      <CourseForm />
    </div>
  );
}
