import type { ReactNode } from "react";

export const inputClass =
  "mt-1.5 w-full rounded-xl border border-[#eadfd5] bg-white px-3.5 py-2.5 text-[12px] text-[#2f2420] outline-none transition focus:border-[#a24456]";
export const labelClass = "block text-[12px] font-medium text-[#4a3b35]";
export const hintClass = "mt-1 block text-[10px] font-normal text-[#8a7b73]";
export const cardClass = "rounded-[20px] border border-[#eadfd5] bg-white p-6";
export const primaryButton =
  "inline-flex items-center justify-center gap-2 rounded-xl bg-[#a24456] px-5 py-2.5 text-[12px] font-semibold text-white transition hover:bg-[#8a3748] disabled:opacity-50";
export const secondaryButton =
  "inline-flex items-center justify-center gap-2 rounded-xl border border-[#eadfd5] bg-white px-5 py-2.5 text-[12px] font-semibold text-[#2f2420] transition hover:border-[#a24456] hover:text-[#a24456]";

export function PageHeader({ title, description, action }: { title: string; description?: string; action?: ReactNode }) {
  return (
    <div className="flex flex-wrap items-end justify-between gap-4">
      <div>
        <h1 className="text-[24px] font-semibold text-[#2f2420]">{title}</h1>
        {description ? <p className="mt-1 text-[12px] text-[#7a6b63]">{description}</p> : null}
      </div>
      {action}
    </div>
  );
}

export function Notice({ tone = "success", children }: { tone?: "success" | "error"; children: ReactNode }) {
  return (
    <p
      role={tone === "error" ? "alert" : "status"}
      className={`rounded-xl px-4 py-3 text-[12px] ${tone === "error" ? "bg-[#fbeaea] text-[#a33a3a]" : "bg-[#e3f2e6] text-[#2e7a43]"}`}
    >
      {children}
    </p>
  );
}

export function StatusPill({ className, children }: { className: string; children: ReactNode }) {
  return <span className={`inline-flex rounded-full px-2.5 py-1 text-[10px] font-semibold ${className}`}>{children}</span>;
}
