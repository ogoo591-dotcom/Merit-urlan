// Хаягаас зөвхөн замыг (path) авна, тиймээс гадны сайт руу хэзээ ч чиглүүлэхгүй.
export function safeRedirect(value: string | string[] | undefined, fallback = "/") {
  const raw = Array.isArray(value) ? value[0] : value;
  if (!raw) return fallback;

  try {
    const url = new URL(raw, "http://localhost");
    const path = `${url.pathname}${url.search}`;
    return path.startsWith("/sign-in") || path.startsWith("/sign-up") ? fallback : path;
  } catch {
    return fallback;
  }
}
