import "server-only";

import { createHash } from "node:crypto";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";

import { mockDbDir } from "@/lib/mock/db";

// Админы зураг: CLOUDINARY_* тохируулсан бол Cloudinary-д, үгүй бол (mock) .mock-db/uploads дотор хадгална.
// Бүтэн схем (зураг, PDF) нь нийтэд нээлттэй биш тул .mock-db/files дотор үлдэнэ (дараа нь Supabase private bucket + signed URL).

export type ImageFolder = "patterns" | "materials" | "products" | "courses";

const imageTypes: Record<string, string> = {
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
  "image/gif": "gif",
};

const uploadsDir = path.join(mockDbDir, "uploads");
const filesDir = path.join(mockDbDir, "files");

// Cloudinary-ийн signed upload: параметрүүдийг цагаан толгойн дарааллаар нэгтгээд secret-тэй sha1 хийнэ.
async function uploadToCloudinary(
  file: File,
  folder: ImageFolder,
  { cloudName, apiKey, apiSecret }: { cloudName: string; apiKey: string; apiSecret: string },
): Promise<string> {
  const timestamp = String(Math.floor(Date.now() / 1000));
  const cloudinaryFolder = `merit/${folder}`;
  const signature = createHash("sha1")
    .update(`folder=${cloudinaryFolder}&timestamp=${timestamp}${apiSecret}`)
    .digest("hex");

  const body = new FormData();
  body.append("file", file);
  body.append("folder", cloudinaryFolder);
  body.append("timestamp", timestamp);
  body.append("api_key", apiKey);
  body.append("signature", signature);

  const response = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/image/upload`, { method: "POST", body });
  const result = (await response.json().catch(() => null)) as { secure_url?: string; error?: { message?: string } } | null;
  if (!response.ok || !result?.secure_url) {
    console.error("Cloudinary upload алдаа:", response.status, result?.error?.message);
    throw new Error("Зургийг Cloudinary-д хадгалж чадсангүй. Дахин оролдоно уу.");
  }
  return result.secure_url;
}

// Зураг хадгалаад URL буцаана (Cloudinary-ийн URL, эсвэл mock үед /api/uploads/<нэр>).
export async function saveImageUpload(file: File, folder: ImageFolder): Promise<string> {
  const extension = imageTypes[file.type];
  if (!extension) throw new Error("Зөвхөн JPG, PNG, WEBP, GIF зураг оруулна.");
  if (file.size > 5 * 1024 * 1024) throw new Error("Зураг 5MB-аас бага байх ёстой.");

  const { CLOUDINARY_CLOUD_NAME: cloudName, CLOUDINARY_API_KEY: apiKey, CLOUDINARY_API_SECRET: apiSecret } = process.env;
  if (cloudName && apiKey && apiSecret) return uploadToCloudinary(file, folder, { cloudName, apiKey, apiSecret });

  await mkdir(uploadsDir, { recursive: true });
  const name = `${crypto.randomUUID()}.${extension}`;
  await writeFile(path.join(uploadsDir, name), Buffer.from(await file.arrayBuffer()));
  return `/api/uploads/${name}`;
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
