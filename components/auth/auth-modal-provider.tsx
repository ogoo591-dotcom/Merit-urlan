"use client";

import { useAuth } from "@clerk/nextjs";
import { usePathname, useRouter } from "next/navigation";
import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import type { ReactNode } from "react";

import { AuthForm } from "@/components/auth/auth-form";

type AuthModalContextValue = {
  openAuth: (redirectTo?: string) => void;
  // Нэвтэрсэн бол шууд үргэлжилнэ, үгүй бол нэвтрэх цонх нээгдэж,
  // нэвтэрсний дараа redirectTo руу шилжинэ.
  requireAuth: (redirectTo: string) => void;
};

const AuthModalContext = createContext<AuthModalContextValue | null>(null);

export function AuthModalProvider({ children }: { children: ReactNode }) {
  const { isSignedIn } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const [redirectTo, setRedirectTo] = useState<string | null>(null);

  const close = useCallback(() => setRedirectTo(null), []);

  useEffect(() => {
    if (!redirectTo) return;
    const onKey = (event: KeyboardEvent) => event.key === "Escape" && close();
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [redirectTo, close]);

  const value = useMemo<AuthModalContextValue>(
    () => ({
      openAuth: (target) => setRedirectTo(target ?? pathname),
      requireAuth: (target) => (isSignedIn ? router.push(target) : setRedirectTo(target)),
    }),
    [isSignedIn, pathname, router],
  );

  return (
    <AuthModalContext.Provider value={value}>
      {children}
      {redirectTo ? (
        <div
          className="fixed inset-0 z-[60] flex items-center justify-center bg-[#2f2420]/45 px-4 py-6 backdrop-blur-[2px]"
          onClick={close}
        >
          <div
            role="dialog"
            aria-modal="true"
            aria-label="Нэвтрэх"
            className="max-h-full w-full max-w-[460px] overflow-y-auto rounded-[24px] bg-white p-8 shadow-[0_30px_80px_-30px_rgba(47,36,32,0.6)] sm:p-10"
            onClick={(event) => event.stopPropagation()}
          >
            <AuthForm
              redirectTo={redirectTo}
              onClose={close}
              onGuest={close}
              onSuccess={() => {
                const target = redirectTo;
                close();
                if (target === pathname) router.refresh();
                else router.push(target);
              }}
            />
          </div>
        </div>
      ) : null}
    </AuthModalContext.Provider>
  );
}

export function useAuthModal() {
  const value = useContext(AuthModalContext);
  if (!value) throw new Error("useAuthModal must be used inside AuthModalProvider");
  return value;
}
