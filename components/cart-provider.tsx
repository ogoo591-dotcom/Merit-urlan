"use client";

import { createContext, useContext, useEffect, useMemo, useState } from "react";
import type { ReactNode } from "react";

type CartLine = { slug: string; name: string; price: string; priceValue: number; image: string; quantity: number };
type CartContextValue = {
  items: CartLine[];
  ready: boolean;
  addItem: (item: Omit<CartLine, "quantity">, quantity?: number) => void;
  setQuantity: (slug: string, quantity: number) => void;
  removeItem: (slug: string) => void;
  clear: () => void;
};

const CartContext = createContext<CartContextValue | null>(null);
const storageKey = "merit-urlan-cart";

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartLine[]>([]);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    try {
      const stored = window.localStorage.getItem(storageKey);
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

  const value = useMemo<CartContextValue>(() => ({
    items,
    ready,
    addItem(item, quantity = 1) {
      setItems((current) => {
        const existing = current.find((line) => line.slug === item.slug);
        if (existing) {
          return current.map((line) => line.slug === item.slug ? { ...line, quantity: line.quantity + quantity } : line);
        }
        return [...current, { ...item, quantity }];
      });
    },
    setQuantity(slug, quantity) {
      setItems((current) => current.map((line) => line.slug === slug ? { ...line, quantity: Math.max(1, quantity) } : line));
    },
    removeItem(slug) {
      setItems((current) => current.filter((line) => line.slug !== slug));
    },
    clear() {
      setItems([]);
    },
  }), [items, ready]);

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const value = useContext(CartContext);
  if (!value) throw new Error("useCart must be used inside CartProvider");
  return value;
}
