import "server-only";

import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";

import { mockDbDir } from "@/lib/mock/db";

// Админы upload (mock): .mock-db/ дотор хадгална. Дараа нь Supabase Storage руу солино
// (зураг → public bucket, схемийн PDF → private bucket + signed URL).

const imageTypes: Record<string, string> = {
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
  "image/gif": "gif",
};

const uploadsDir = path.join(mockDbDir, "uploads");
const filesDir = path.join(mockDbDir, "files");

// Зураг хадгалаад /api/uploads/<нэр> URL буцаана.
export async function saveImageUpload(file: File): Promise<string> {
  const extension = imageTypes[file.type];
  if (!extension) throw new Error("Зөвхөн JPG, PNG, WEBP, GIF зураг оруулна.");
  if (file.size > 5 * 1024 * 1024) throw new Error("Зураг 5MB-аас бага байх ёстой.");
  await mkdir(uploadsDir, { recursive: true });
  const name = `${crypto.randomUUID()}.${extension}`;
  await writeFile(path.join(uploadsDir, name), Buffer.from(await file.arrayBuffer()));
  return `/api/uploads/${name}`;
}

// Схемийн PDF-ийг нийтэд нээлттэй биш газар хадгалж, pdfPath буцаана.
export async function savePatternPdf(patternId: string, file: File): Promise<string> {
  const header = Buffer.from(await file.slice(0, 5).arrayBuffer()).toString("latin1");
  if (header !== "%PDF-") throw new Error("Зөвхөн PDF файл оруулна.");
  if (file.size > 20 * 1024 * 1024) throw new Error("PDF 20MB-аас бага байх ёстой.");
  await mkdir(filesDir, { recursive: true });
  const safeId = patternId.replace(/[^a-z0-9-]/g, "");
  await writeFile(path.join(filesDir, `${safeId}.pdf`), Buffer.from(await file.arrayBuffer()));
  return path.join(".mock-db", "files", `${safeId}.pdf`);
}

export async function readImageUpload(name: string): Promise<{ data: Buffer; type: string } | null> {
  const match = name.match(/^[0-9a-f-]{36}\.(jpg|png|webp|gif)$/);
  if (!match) return null;
  try {
    const type = Object.entries(imageTypes).find(([, extension]) => extension === match[1])?.[0] ?? "application/octet-stream";
    return { data: await readFile(path.join(uploadsDir, name)), type };
  } catch {
    return null;
  }
}
