"use client";

import { Loader2 } from "lucide-react";
import type { ReactNode } from "react";
import { useFormStatus } from "react-dom";

export function SubmitButton({ className, children, pendingText }: { className: string; children: ReactNode; pendingText?: string }) {
  const { pending } = useFormStatus();
  return (
    <button type="submit" disabled={pending} className={className}>
      {pending ? <Loader2 aria-hidden className="h-4 w-4 animate-spin" /> : null}
      {pending && pendingText ? pendingText : children}
    </button>
  );
}
