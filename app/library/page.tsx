import { Library } from "lucide-react";
import type { Metadata } from "next";

import { EmptyPage } from "@/components/empty-page";

export const runtime = "edge";

export const metadata: Metadata = { title: "Миний сан | Merit Urlan" };

export default function LibraryPage() {
  return (
    <EmptyPage
      icon={Library}
      eyebrow="Миний сан"
      title="Таны сан хоосон байна"
      description="Худалдаж авсан сургалт, схем заавар тань энд хадгалагдана. Хүссэн үедээ орж үзэж, татаж аваарай."
      actions={[
        { label: "Сургалт үзэх", href: "/courses" },
        { label: "Миний захиалгууд", href: "/account" },
      ]}
    />
  );
}
