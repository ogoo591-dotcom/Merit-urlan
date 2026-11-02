import "server-only";

import { readFile } from "node:fs/promises";
import path from "node:path";

import { mockDbDir, readDb } from "@/lib/mock/db";

const contentTypes: Record<string, string> = {
  ".pdf": "application/pdf",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".png": "image/png",
  ".webp": "image/webp",
};

// Бүтэн схемийг (зураг, PDF) private/ хавтаснаас унших (Node.js runtime шаардлагатай — edge дээр fs байхгүй).
// Зөвхөн эрх шалгасны дараа дуудна. Дараа нь Supabase Storage-ийн private bucket + signed URL руу солино.
export async function readPatternFile(id: string): Promise<{ data: Buffer; fileName: string; extension: string; contentType: string } | null> {
  const pattern = (await readDb()).patterns.find((item) => item.id === id);
  if (!pattern) return null;
  // filePath нь өгөгдлөөс ирдэг (хэрэглэгчийн оролт биш), гэхдээ private/ эсвэл .mock-db/files/ (админы upload)-аас гадагш гарахгүйг баталгаажуулна.
  const allowedRoots = [path.join(process.cwd(), "private"), path.join(mockDbDir, "files")];
  const filePath = path.resolve(process.cwd(), pattern.filePath);
  if (!allowedRoots.some((root) => filePath.startsWith(root + path.sep))) return null;
  const extension = path.extname(filePath).toLowerCase();
  const contentType = contentTypes[extension];
  if (!contentType) return null;
  try {
    return { data: await readFile(filePath), fileName: `${pattern.name}${extension}`, extension, contentType };
  } catch {
    return null;
  }
}
