"use client";

import { useRouter } from "next/navigation";

import { AuthForm } from "@/components/auth/auth-form";

export function SignInScreen({ redirectTo }: { redirectTo: string }) {
  const router = useRouter();

  return (
    <main className="flex min-h-screen items-center justify-center bg-[#fcf6f0] bg-[radial-gradient(#ead9cc_1px,transparent_1px)] [background-size:28px_28px] px-4 py-16">
      <div className="w-full max-w-[460px] rounded-[24px] bg-white p-8 shadow-[0_30px_80px_-40px_rgba(47,36,32,0.5)] sm:p-10">
        <AuthForm
          redirectTo={redirectTo}
          onSuccess={() => router.replace(redirectTo)}
          onGuest={() => router.push("/")}
        />
      </div>
    </main>
  );
}
