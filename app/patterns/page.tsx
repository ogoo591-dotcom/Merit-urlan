import { BookOpen } from "lucide-react";
import type { Metadata } from "next";

import { EmptyPage } from "@/components/empty-page";

export const runtime = "edge";

export const metadata: Metadata = { title: "Схем заавар | Merit Urlan" };

export default function PatternsPage() {
  return (
    <EmptyPage
      icon={BookOpen}
      eyebrow="Схем заавар"
      title="Схемүүд тун удахгүй"
      description="Тоглоом, хувцасны орчуулсан схем, PDF зааврууд энд нэмэгдэнэ. Худалдаж авсан схемээ “Миний сан” хэсгээс татаж авна."
      actions={[
        { label: "Сургалт үзэх", href: "/courses" },
        { label: "Материал авах", href: "/shop/supplies" },
      ]}
    />
  );
}
