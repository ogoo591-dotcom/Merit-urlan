import "server-only";

import { readFile } from "node:fs/promises";
import path from "node:path";

import { mockDbDir, readDb } from "@/lib/mock/db";

// Схемийн PDF-ийг private/ хавтаснаас унших (Node.js runtime шаардлагатай — edge дээр fs байхгүй).
// Зөвхөн эрх шалгасны дараа дуудна. Дараа нь Supabase Storage-ийн private bucket + signed URL руу солино.
export async function readPatternPdf(id: string): Promise<{ data: Buffer; fileName: string } | null> {
  const pattern = (await readDb()).patterns.find((item) => item.id === id);
  if (!pattern) return null;
  // pdfPath нь өгөгдлөөс ирдэг (хэрэглэгчийн оролт биш), гэхдээ private/ эсвэл .mock-db/files/ (админы upload)-аас гадагш гарахгүйг баталгаажуулна.
  const allowedRoots = [path.join(process.cwd(), "private"), path.join(mockDbDir, "files")];
  const filePath = path.resolve(process.cwd(), pattern.pdfPath);
  if (!allowedRoots.some((root) => filePath.startsWith(root + path.sep))) return null;
  try {
    return { data: await readFile(filePath), fileName: `${pattern.name}.pdf` };
  } catch {
    return null;
  }
}
