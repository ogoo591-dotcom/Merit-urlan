"use client";

import { useUser } from "@clerk/nextjs";
import { createContext, useCallback, useContext, useMemo, useSyncExternalStore } from "react";
import type { ReactNode } from "react";

export type DeliveryAddress = { district: string; khoroo: string; detail: string };

export const districts = [
  "Баянзүрх",
  "Баянгол",
  "Сонгинохайрхан",
  "Сүхбаатар",
  "Хан-Уул",
  "Чингэлтэй",
  "Налайх",
  "Багануур",
  "Багахангай",
  "Орон нутаг",
];

type DeliveryAddressContextValue = {
  address: DeliveryAddress | null;
  saveAddress: (address: DeliveryAddress) => Promise<void>;
};

const DeliveryAddressContext = createContext<DeliveryAddressContextValue | null>(null);
const storageKey = "merit-urlan-address";
const changeEvent = "merit-urlan-address-change";

export function formatAddress(address: DeliveryAddress) {
  return [address.district, address.khoroo && `${address.khoroo}-р хороо`, address.detail].filter(Boolean).join(", ");
}

export function shortAddress(address: DeliveryAddress) {
  return [address.district, address.khoroo && `${address.khoroo}-р хороо`].filter(Boolean).join(", ");
}

function parse(value: unknown): DeliveryAddress | null {
  if (!value || typeof value !== "object") return null;
  const { district, khoroo, detail } = value as Record<string, unknown>;
  if (typeof district !== "string" || !district) return null;
  return { district, khoroo: String(khoroo ?? ""), detail: String(detail ?? "") };
}

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

// Зочин бол хөтөч дээр, нэвтэрсэн бол Clerk-ийн профайлд хадгална
// (тиймээс өөр төхөөрөмжөөс нэвтэрсэн ч хаяг нь хадгалагдсан байна).
export function DeliveryAddressProvider({ children }: { children: ReactNode }) {
  const { user } = useUser();
  const stored = useSyncExternalStore(subscribe, readStored, () => null);

  const address = useMemo(() => {
    const fromAccount = parse(user?.unsafeMetadata?.deliveryAddress);
    if (fromAccount) return fromAccount;
    try {
      return stored ? parse(JSON.parse(stored)) : null;
    } catch {
      return null;
    }
  }, [user?.unsafeMetadata?.deliveryAddress, stored]);

  const saveAddress = useCallback(
    async (next: DeliveryAddress) => {
      try {
        window.localStorage.setItem(storageKey, JSON.stringify(next));
      } catch {
        // Хувийн цонх зэрэгт localStorage хаалттай байж болно.
      }
      window.dispatchEvent(new Event(changeEvent));
      if (user) await user.update({ unsafeMetadata: { ...user.unsafeMetadata, deliveryAddress: next } });
    },
    [user],
  );

  const value = useMemo(() => ({ address, saveAddress }), [address, saveAddress]);

  return <DeliveryAddressContext.Provider value={value}>{children}</DeliveryAddressContext.Provider>;
}

export function useDeliveryAddress() {
  const value = useContext(DeliveryAddressContext);
  if (!value) throw new Error("useDeliveryAddress must be used inside DeliveryAddressProvider");
  return value;
}
