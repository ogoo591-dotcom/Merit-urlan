import Link from "next/link";

import { PatternForm } from "@/components/admin/pattern-form";
import { PageHeader } from "@/components/admin/ui";
import { requireAdmin } from "@/lib/auth";
import { getProducts } from "@/lib/data/products";

export default async function NewPatternPage() {
  await requireAdmin();
  const materials = (await getProducts({ type: "material" })).map(({ id, name }) => ({ id, name }));
  return (
    <div>
      <Link href="/admin/patterns" className="text-[12px] text-[#7a6b63] hover:text-[#a24456]">← Буцах</Link>
      <div className="mt-3">
        <PageHeader title="Шинэ схем" />
      </div>
      <PatternForm materialOptions={materials} />
    </div>
  );
}
