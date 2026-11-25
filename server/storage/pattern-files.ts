import "server-only";

import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";

import { mockDbDir, readDb } from "@/server/mock/db";

// Бүтэн схем (зураг, PDF) нь нийтэд нээлттэй биш тул .mock-db/files дотор үлдэнэ (дараа нь Supabase private bucket + signed URL).
const filesDir = path.join(mockDbDir, "files");

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

function patternFileExtension(header: Buffer) {
  if (header.subarray(0, 5).toString("latin1") === "%PDF-") return "pdf";
  if (header[0] === 0xff && header[1] === 0xd8 && header[2] === 0xff) return "jpg";
  if (header.subarray(0, 4).toString("hex") === "89504e47") return "png";
  if (header.subarray(0, 4).toString("latin1") === "RIFF" && header.subarray(8, 12).toString("latin1") === "WEBP") return "webp";
  return null;
}

// Бүтэн схемийг (зураг, PDF) нийтэд нээлттэй биш газар хадгалж, filePath буцаана.
// Төлбөртэй схем холбоосоор нь үзэгдэхгүйн тулд Cloudinary руу явуулахгүй.
export async function savePatternFile(patternId: string, file: File): Promise<string> {
  const extension = patternFileExtension(Buffer.from(await file.slice(0, 12).arrayBuffer()));
  if (!extension) throw new Error("Схемийн файл нь JPG, PNG, WEBP зураг эсвэл PDF байх ёстой.");
  if (file.size > 20 * 1024 * 1024) throw new Error("Схемийн файл 20MB-аас бага байх ёстой.");
  await mkdir(filesDir, { recursive: true });
  const safeId = patternId.replace(/[^a-z0-9-]/g, "");
  await writeFile(path.join(filesDir, `${safeId}.${extension}`), Buffer.from(await file.arrayBuffer()));
  return path.join(".mock-db", "files", `${safeId}.${extension}`);
}
