"use client";

import { createContext, useCallback, useContext, useMemo, useSyncExternalStore } from "react";
import type { ReactNode } from "react";

export type SavedItem = { slug: string; category: string; name: string; price: string; image: string };

type SavedContextValue = {
  items: SavedItem[];
  isSaved: (slug: string) => boolean;
  toggle: (item: SavedItem) => void;
};

const SavedContext = createContext<SavedContextValue | null>(null);
const storageKey = "merit-urlan-saved";
const changeEvent = "merit-urlan-saved-change";

function subscribe(callback: () => void) {
  window.addEventListener("storage", callback);
  window.addEventListener(changeEvent, callback);
  return () => {
    window.removeEventListener("storage", callback);
    window.removeEventListener(changeEvent, callback);
  };
}

function readStored() {
  try {
    return window.localStorage.getItem(storageKey);
  } catch {
    return null;
  }
}

// "Хадгалсан" (зүрх) бараануудыг хөтөч дээр хадгална. Нэвтрэх шаардлагагүй.
export function SavedProvider({ children }: { children: ReactNode }) {
  const stored = useSyncExternalStore(subscribe, readStored, () => null);

  const items = useMemo<SavedItem[]>(() => {
    try {
      const parsed: unknown = stored ? JSON.parse(stored) : [];
      return Array.isArray(parsed) ? (parsed as SavedItem[]).filter((item) => item && typeof item.slug === "string") : [];
    } catch {
      return [];
    }
  }, [stored]);

  const toggle = useCallback(
    (item: SavedItem) => {
      const next = items.some((saved) => saved.slug === item.slug)
        ? items.filter((saved) => saved.slug !== item.slug)
        : [item, ...items];
      try {
        window.localStorage.setItem(storageKey, JSON.stringify(next));
      } catch {
        // Хувийн цонх зэрэгт хадгалах боломжгүй байж болно.
      }
      window.dispatchEvent(new Event(changeEvent));
    },
    [items],
  );

  const value = useMemo<SavedContextValue>(
    () => ({ items, isSaved: (slug) => items.some((item) => item.slug === slug), toggle }),
    [items, toggle],
  );

  return <SavedContext.Provider value={value}>{children}</SavedContext.Provider>;
}

export function useSaved() {
  const value = useContext(SavedContext);
  if (!value) throw new Error("useSaved must be used inside SavedProvider");
  return value;
}
