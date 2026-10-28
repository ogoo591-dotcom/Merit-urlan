import type { Metadata } from "next";
import { ClerkProvider } from "@clerk/nextjs";
import { AuthModalProvider } from "@/components/auth/auth-modal-provider";
import { CartProvider } from "@/components/cart-provider";
import { DeliveryAddressProvider } from "@/components/delivery-address-provider";
import "./globals.css";

export const runtime = "edge";

export const metadata: Metadata = {
  title: "Merit Urlan",
  description: "Soft editorial crochet ecommerce and courses from Merit Urlan.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider signInUrl="/sign-in" signUpUrl="/sign-in">
      <html lang="mn" className="h-full scroll-smooth antialiased">
      <body className="flex min-h-full flex-col">
        <AuthModalProvider>
          <DeliveryAddressProvider>
            <CartProvider>{children}</CartProvider>
          </DeliveryAddressProvider>
        </AuthModalProvider>
      </body>
      </html>
    </ClerkProvider>
  );
}
