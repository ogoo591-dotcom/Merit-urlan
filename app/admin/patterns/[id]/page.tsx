import Link from "next/link";
import { notFound } from "next/navigation";

import { deletePatternAction } from "@/app/admin/patterns/actions";
import { ConfirmButton } from "@/components/admin/confirm-button";
import { PatternForm } from "@/components/admin/pattern-form";
import { PageHeader } from "@/components/admin/ui";
import { requireAdmin } from "@/lib/auth";
import { getPatternForAdmin } from "@/lib/data/patterns";
import { getProducts } from "@/lib/data/products";

export default async function EditPatternPage({ params }: { params: Promise<{ id: string }> }) {
  await requireAdmin();
  const pattern = await getPatternForAdmin((await params).id);
  if (!pattern) notFound();
  const materials = (await getProducts({ type: "material" })).map(({ id, name }) => ({ id, name }));

  return (
    <div>
      <Link href="/admin/patterns" className="text-[12px] text-[#7a6b63] hover:text-[#a24456]">← Буцах</Link>
      <div className="mt-3">
        <PageHeader
          title={pattern.name}
          action={
            <form action={deletePatternAction}>
              <input type="hidden" name="id" value={pattern.id} />
              <ConfirmButton
                message={`"${pattern.name}" схемийг устгах уу? Худалдаж авсан хэрэглэгчид татах боломжгүй болно.`}
                className="rounded-xl border border-[#e8b4b4] px-4 py-2 text-[12px] font-semibold text-[#a33a3a] hover:bg-[#fdf3f3]"
              >
                Устгах
              </ConfirmButton>
            </form>
          }
        />
      </div>
      <PatternForm pattern={pattern} materialOptions={materials} />
    </div>
  );
}
