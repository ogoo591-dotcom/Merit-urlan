"use client";

import { createContext, useContext, useEffect, useMemo, useState } from "react";
import type { ReactNode } from "react";

// kind: "course" бол тоо ширхэг үргэлж 1 (онлайн сургалт). slug нь "course:<id>" хэлбэртэй.
// selected: сагснаас аль мөрийг худалдан авахаа сонгоно (анхдагч — сонгосон).
export type CartLine = {
  slug: string;
  name: string;
  price: string;
  priceValue: number;
  image: string;
  quantity: number;
  kind?: "product" | "course";
  href?: string;
  selected?: boolean;
};

type CartContextValue = {
  items: CartLine[];
  selectedItems: CartLine[];
  ready: boolean;
  addItem: (item: Omit<CartLine, "quantity" | "selected">, quantity?: number) => void;
  setQuantity: (slug: string, quantity: number) => void;
  removeItem: (slug: string) => void;
  toggleSelected: (slug: string) => void;
  setAllSelected: (selected: boolean) => void;
  removeSelected: () => void;
  clear: () => void;
};

const CartContext = createContext<CartContextValue | null>(null);
const storageKey = "merit-urlan-cart";

export const courseCartSlug = (courseId: string) => `course:${courseId}`;
export const isSelected = (line: CartLine) => line.selected !== false;

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartLine[]>([]);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    try {
      const stored = window.localStorage.getItem(storageKey);
      // Сагсыг серверээс биш хөтчөөс уншдаг тул hydration-ий дараа нэг удаа ачаална.
      // eslint-disable-next-line react-hooks/set-state-in-effect
      if (stored) setItems(JSON.parse(stored) as CartLine[]);
    } catch {
      window.localStorage.removeItem(storageKey);
    }
    setReady(true);
  }, []);

  useEffect(() => {
    if (!ready) return;
    window.localStorage.setItem(storageKey, JSON.stringify(items));
  }, [items, ready]);

  const value = useMemo<CartContextValue>(() => {
    const single = (line: Pick<CartLine, "kind">, quantity: number) => (line.kind === "course" ? 1 : Math.max(1, quantity));
    return {
      items,
      selectedItems: items.filter(isSelected),
      ready,
      addItem(item, quantity = 1) {
        setItems((current) => {
          const existing = current.find((line) => line.slug === item.slug);
          if (existing) {
            return current.map((line) =>
              line.slug === item.slug ? { ...line, quantity: single(line, line.quantity + quantity), selected: true } : line,
            );
          }
          return [...current, { ...item, quantity: single(item, quantity), selected: true }];
        });
      },
      setQuantity(slug, quantity) {
        setItems((current) => current.map((line) => (line.slug === slug ? { ...line, quantity: single(line, quantity) } : line)));
      },
      removeItem(slug) {
        setItems((current) => current.filter((line) => line.slug !== slug));
      },
      toggleSelected(slug) {
        setItems((current) => current.map((line) => (line.slug === slug ? { ...line, selected: !isSelected(line) } : line)));
      },
      setAllSelected(selected) {
        setItems((current) => current.map((line) => ({ ...line, selected })));
      },
      removeSelected() {
        setItems((current) => current.filter((line) => !isSelected(line)));
      },
      clear() {
        setItems([]);
      },
    };
  }, [items, ready]);

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const value = useContext(CartContext);
  if (!value) throw new Error("useCart must be used inside CartProvider");
  return value;
}
