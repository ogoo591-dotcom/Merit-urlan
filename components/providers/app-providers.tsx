import type { ReactNode } from "react";

import { AuthModalProvider } from "@/features/auth/components/auth-modal-provider";
import { CartProvider } from "@/features/cart/components/cart-provider";
import { DeliveryAddressProvider } from "@/features/checkout/components/delivery-address-provider";
import { SavedProvider } from "@/features/saved/components/saved-provider";

// Root layout-ийн client provider-ууд. Дараалал нь хуучин layout-тай ижил.
export function AppProviders({ children }: { children: ReactNode }) {
  return (
    <AuthModalProvider>
      <DeliveryAddressProvider>
        <CartProvider>
          <SavedProvider>{children}</SavedProvider>
        </CartProvider>
      </DeliveryAddressProvider>
    </AuthModalProvider>
  );
}
