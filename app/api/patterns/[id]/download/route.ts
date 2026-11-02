import { auth } from "@clerk/nextjs/server";

import { readPatternFile } from "@/lib/data/pattern-files";
import { getPattern } from "@/lib/data/patterns";
import { hasPatternAccess } from "@/lib/data/purchases";

// private/ хавтаснаас файл уншдаг тул Node.js runtime (edge биш).
export const runtime = "nodejs";

// Бүтэн схем: үнэгүй бол хэн ч авна, төлбөртэй бол зөвхөн худалдаж авсан, нэвтэрсэн хэрэглэгчид сервер талаас олгоно.
// Анхдагчаар хуудсанд харагдана, ?download=1 бол файлаар татагдана.
export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const pattern = await getPattern(id);
  if (!pattern) return Response.json({ error: "Схем олдсонгүй." }, { status: 404 });

  if (!pattern.isFree) {
    const { userId } = await auth();
    if (!userId) return Response.json({ error: "Нэвтэрнэ үү." }, { status: 401 });
    if (!(await hasPatternAccess(userId, id))) return Response.json({ error: "Энэ схемийг худалдаж аваагүй байна." }, { status: 403 });
  }

  const file = await readPatternFile(id);
  if (!file) return Response.json({ error: "Файл олдсонгүй." }, { status: 404 });

  const disposition = new URL(request.url).searchParams.has("download") ? "attachment" : "inline";
  return new Response(new Uint8Array(file.data), {
    headers: {
      "Content-Type": file.contentType,
      "Content-Disposition": `${disposition}; filename="${id}${file.extension}"; filename*=UTF-8''${encodeURIComponent(file.fileName)}`,
      "Cache-Control": pattern.isFree ? "public, max-age=3600" : "private, no-store",
      "X-Content-Type-Options": "nosniff",
    },
  });
}
