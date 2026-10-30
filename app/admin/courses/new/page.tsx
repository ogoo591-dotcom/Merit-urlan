import Link from "next/link";

import { CourseForm } from "@/components/admin/course-form";
import { PageHeader } from "@/components/admin/ui";
import { requireAdmin } from "@/lib/auth";

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
