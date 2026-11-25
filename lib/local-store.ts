// Mock "өгөгдлийн сан": хүснэгт бүрийг localStorage-д JSON-оор хадгална.
// Админ болон хэрэглэгч нэг хөтөч дээр байвал өөрчлөлт шууд харагдана. Supabase руу шилжихэд энэ файл хэрэггүй болно.

const prefix = "merit-mock:";
const changeEvent = "merit-mock-change";

export function readTable<T>(name: string, seed: T): T {
  if (typeof window === "undefined") return seed;
  try {
    const raw = window.localStorage.getItem(prefix + name);
    return raw ? (JSON.parse(raw) as T) : seed;
  } catch {
    return seed;
  }
}

export function writeTable<T>(name: string, value: T) {
  try {
    window.localStorage.setItem(prefix + name, JSON.stringify(value));
  } catch {
    // Хувийн цонх зэрэгт хадгалах боломжгүй байж болно.
  }
  window.dispatchEvent(new Event(changeEvent));
}

// Mock өгөгдөл өөрчлөгдөх бүрт (энэ таб эсвэл өөр таб) дуудна.
export function subscribeMock(callback: () => void) {
  const onStorage = (event: StorageEvent) => {
    if (event.key?.startsWith(prefix)) callback();
  };
  window.addEventListener(changeEvent, callback);
  window.addEventListener("storage", onStorage);
  return () => {
    window.removeEventListener(changeEvent, callback);
    window.removeEventListener("storage", onStorage);
  };
}

export const wait = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));
