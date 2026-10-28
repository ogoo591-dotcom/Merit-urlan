"use server";

import { redirect } from "next/navigation";

import { requireUserId } from "@/lib/auth";
import { featuredCourses } from "@/lib/site-data";
import { getSupabase, isSupabaseConfigured } from "@/lib/supabase";

export type EnrollState = { error?: string };

export async function enrollInCourse(_state: EnrollState, formData: FormData): Promise<EnrollState> {
  const userId = await requireUserId();
  const courseTitle = String(formData.get("course") ?? "");
  const customerName = String(formData.get("name") ?? "").trim().slice(0, 120);
  const phone = String(formData.get("phone") ?? "").trim().slice(0, 20);
  const email = String(formData.get("email") ?? "").trim().slice(0, 160);

  if (!featuredCourses.some((course) => course.title === courseTitle)) return { error: "Сургалт олдсонгүй." };
  if (!customerName || !/^[0-9+\s-]{8,}$/.test(phone)) return { error: "Нэр, утсаа бөглөнө үү." };
  if (!isSupabaseConfigured()) return { error: "Бүртгэлийн систем хараахан тохируулагдаагүй байна." };

  const { error } = await getSupabase().from("course_enrollments").insert({
    user_id: userId,
    course_title: courseTitle,
    customer_name: customerName,
    phone,
    email: email || null,
  });
  if (error) {
    console.error("enrollment failed", error);
    return { error: "Бүртгэхэд алдаа гарлаа. Дахин оролдоно уу." };
  }

  redirect("/account");
}
