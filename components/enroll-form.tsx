"use client";

import { useActionState } from "react";

import { enrollInCourse, type EnrollState } from "@/app/courses/enroll/actions";

type Props = {
  course: string;
  defaults: { name: string; phone: string; email: string };
};

const inputClass =
  "w-full rounded-[14px] border border-[#eadfd5] bg-white px-4 py-3 text-[13px] text-[#2f2420] outline-none transition focus:border-[#6e4f45]";

export function EnrollForm({ course, defaults }: Props) {
  const [state, action, pending] = useActionState<EnrollState, FormData>(enrollInCourse, {});

  return (
    <form action={action} className="mt-8 space-y-5 rounded-[24px] border border-[#eadfd5] bg-white p-8">
      <input type="hidden" name="course" value={course} />
      <label className="block text-[12px] font-medium text-[#4a3b35]">
        Нэр
        <input name="name" required defaultValue={defaults.name} className={`${inputClass} mt-2`} />
      </label>
      <label className="block text-[12px] font-medium text-[#4a3b35]">
        Утас
        <input name="phone" required inputMode="tel" defaultValue={defaults.phone} className={`${inputClass} mt-2`} />
      </label>
      <label className="block text-[12px] font-medium text-[#4a3b35]">
        Имэйл (заавал биш)
        <input name="email" type="email" defaultValue={defaults.email} className={`${inputClass} mt-2`} />
      </label>
      {state.error ? <p className="rounded-xl bg-[#fbeaea] px-4 py-3 text-[12px] text-[#b04a4a]">{state.error}</p> : null}
      <button
        type="submit"
        disabled={pending}
        className="w-full rounded-[14px] bg-[#6e4f45] px-6 py-4 text-[13px] font-medium text-white transition hover:bg-[#5c4038] disabled:opacity-60"
      >
        {pending ? "Илгээж байна…" : "Бүртгүүлэх"}
      </button>
    </form>
  );
}
