import { setEnrollmentStatus } from "@/app/admin/orders/actions";
import { StatusSelect } from "@/components/admin/status-select";
import { getAdminSupabase } from "@/lib/auth";
import { enrollmentStatusLabels, formatDate, type EnrollmentRow } from "@/lib/orders";

export const runtime = "edge";

export default async function AdminCoursesPage() {
  const supabase = await getAdminSupabase();
  const { data } = await supabase.from("course_enrollments").select("*").order("created_at", { ascending: false }).limit(300);
  const enrollments = (data ?? []) as EnrollmentRow[];

  return (
    <div>
      <h1 className="text-[24px] font-semibold">Сургалтын бүртгэл</h1>
      <div className="mt-6 overflow-x-auto rounded-[20px] border border-[#eadfd5] bg-white">
        <table className="w-full min-w-[720px] text-left text-[12px]">
          <thead className="border-b border-[#eadfd5] text-[11px] text-[#8a7b73]">
            <tr>
              <th className="px-5 py-3 font-medium">Сургалт</th>
              <th className="px-5 py-3 font-medium">Хэрэглэгч</th>
              <th className="px-5 py-3 font-medium">Огноо</th>
              <th className="px-5 py-3 font-medium">Төлөв</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#f1ebe5]">
            {enrollments.map((enrollment) => (
              <tr key={enrollment.id}>
                <td className="px-5 py-3 font-medium">{enrollment.course_title}</td>
                <td className="px-5 py-3">
                  {enrollment.customer_name}
                  <span className="block text-[11px] text-[#8a7b73]">
                    <a href={`tel:${enrollment.phone}`} className="underline">{enrollment.phone}</a>
                    {enrollment.email ? ` · ${enrollment.email}` : ""}
                  </span>
                </td>
                <td className="px-5 py-3 text-[#8a7b73]">{formatDate(enrollment.created_at)}</td>
                <td className="px-5 py-3">
                  <form action={setEnrollmentStatus}>
                    <input type="hidden" name="id" value={enrollment.id} />
                    <StatusSelect name="status" defaultValue={enrollment.status} options={enrollmentStatusLabels} />
                  </form>
                </td>
              </tr>
            ))}
            {enrollments.length === 0 ? (
              <tr>
                <td colSpan={4} className="px-5 py-10 text-center text-[#8a7b73]">Бүртгэл алга</td>
              </tr>
            ) : null}
          </tbody>
        </table>
      </div>
    </div>
  );
}
