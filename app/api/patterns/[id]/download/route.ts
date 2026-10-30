import { auth } from "@clerk/nextjs/server";

import { readPatternPdf } from "@/lib/data/pattern-files";
import { hasPatternAccess } from "@/lib/data/purchases";

// private/ хавтаснаас файл уншдаг тул Node.js runtime (edge биш).
export const runtime = "nodejs";

// Схемийн PDF: зөвхөн худалдаж авсан, нэвтэрсэн хэрэглэгчид сервер талаас олгоно.
export async function GET(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const { userId } = await auth();

  if (!userId) return Response.json({ error: "Нэвтэрнэ үү." }, { status: 401 });
  if (!(await hasPatternAccess(userId, id))) return Response.json({ error: "Энэ схемийг худалдаж аваагүй байна." }, { status: 403 });

  const file = await readPatternPdf(id);
  if (!file) return Response.json({ error: "Файл олдсонгүй." }, { status: 404 });

  return new Response(new Uint8Array(file.data), {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `attachment; filename="${id}.pdf"; filename*=UTF-8''${encodeURIComponent(file.fileName)}`,
      "Cache-Control": "private, no-store",
      "X-Content-Type-Options": "nosniff",
    },
  });
}
