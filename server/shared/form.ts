import "server-only";

// FormData задлах туслахууд (admin-actions, actions).

export const text = (formData: FormData, name: string, max = 300) => String(formData.get(name) ?? "").trim().slice(0, max);

export const int = (formData: FormData, name: string) => Math.floor(Number(formData.get(name)));

export const money = (formData: FormData, name: string) => Math.round(Number(formData.get(name)));

export const lines = (value: string) =>
  value
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean);

// Латин үсэг, тоо, зураасаас бүрдсэн id. Хоосон бол fallback-аас үүсгэнэ.
export function slugify(value: string, fallbackPrefix: string) {
  const slug = value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 60);
  return slug || `${fallbackPrefix}-${Date.now().toString(36)}`;
}

export const errorMessage = (error: unknown, fallback: string) => (error instanceof Error ? error.message : fallback);
