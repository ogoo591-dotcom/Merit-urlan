import { currentUser } from "@clerk/nextjs/server";

import { CheckoutForm } from "@/components/checkout-form";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";

export const runtime = "edge";

export default async function CheckoutPage() {
  const user = await currentUser();
  const phone = user?.primaryPhoneNumber?.phoneNumber.replace(/^\+976/, "") ?? "";

  return (
    <>
      <SiteHeader />
      <main className="flex-1 bg-[#fcf6f0] bg-[radial-gradient(#efe2d7_1px,transparent_1px)] [background-size:28px_28px]">
        <div className="mx-auto w-full max-w-[1200px] px-6 py-12 lg:px-10">
          <h1 className="font-serif text-[40px] text-[#2f2420] lg:text-[48px]">Захиалга</h1>
          <CheckoutForm
            defaults={{
              name: user?.fullName ?? "",
              phone,
              email: user?.primaryEmailAddress?.emailAddress ?? "",
            }}
          />
        </div>
      </main>
      <SiteFooter />
    </>
  );
}
