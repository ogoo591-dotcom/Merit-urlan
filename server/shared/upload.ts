import "server-only";

import { saveImageUpload, type ImageFolder } from "@/server/storage/images";

// Маягтын file талбаруудаас хоосон биш зургуудыг хадгалж замуудыг буцаана.
export async function uploadImages(files: FormDataEntryValue[], folder: ImageFolder): Promise<string[]> {
  const saved: string[] = [];
  for (const file of files) {
    if (file instanceof File && file.size > 0) saved.push(await saveImageUpload(file, folder));
  }
  return saved;
}
