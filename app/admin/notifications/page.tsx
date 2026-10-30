import Link from "next/link";

import { markAllAdminNotificationsRead, toggleNotificationRead } from "@/app/admin/notifications/actions";
import { PageHeader, secondaryButton } from "@/components/admin/ui";
import { requireAdmin } from "@/lib/auth";
import { getAdminNotifications } from "@/lib/data/notifications";
import { formatDateTime } from "@/lib/format";

export default async function AdminNotificationsPage({ searchParams }: { searchParams: Promise<{ filter?: string }> }) {
  await requireAdmin();
  const { filter } = await searchParams;
  const all = await getAdminNotifications();
  const items = filter === "unread" ? all.filter((item) => !item.read) : all;
  const unread = all.filter((item) => !item.read).length;

  return (
    <div>
      <PageHeader
        title="Мэдэгдэл"
        description="Шинэ захиалга, худалдан авалт бүрт энд мэдэгдэл ирнэ."
        action={
          unread ? (
            <form action={markAllAdminNotificationsRead}>
              <button className={secondaryButton}>Бүгдийг уншсан болгох</button>
            </form>
          ) : null
        }
      />

      <div className="mt-6 flex gap-2 text-[12px]">
        {[
          { label: `Бүгд (${all.length})`, value: undefined },
          { label: `Уншаагүй (${unread})`, value: "unread" },
        ].map((tab) => (
          <Link
            key={tab.label}
            href={tab.value ? `/admin/notifications?filter=${tab.value}` : "/admin/notifications"}
            className={`rounded-full px-4 py-2 ${filter === tab.value ? "bg-[#a24456] text-white" : "bg-white ring-1 ring-[#eadfd5]"}`}
          >
            {tab.label}
          </Link>
        ))}
      </div>

      <ul className="mt-6 divide-y divide-[#f1ebe5] overflow-hidden rounded-[20px] border border-[#eadfd5] bg-white">
        {items.map((item) => (
          <li key={item.id} className={`flex items-center gap-4 px-5 py-4 ${item.read ? "" : "bg-[#fdf3f5]"}`}>
            <span aria-hidden className={`h-2 w-2 shrink-0 rounded-full ${item.read ? "bg-transparent" : "bg-[#a24456]"}`} />
            <div className="min-w-0 flex-1">
              <p className={`text-[13px] ${item.read ? "text-[#4a3b35]" : "font-semibold"}`}>{item.message}</p>
              <p className="mt-1 text-[11px] text-[#9c8c84]">{formatDateTime(item.createdAt)}</p>
            </div>
            {item.href ? (
              <Link href={item.href} className="text-[12px] font-medium text-[#a24456]">
                Харах
              </Link>
            ) : null}
            <form action={toggleNotificationRead}>
              <input type="hidden" name="id" value={item.id} />
              <input type="hidden" name="read" value={String(!item.read)} />
              <button className="text-[11px] text-[#7a6b63] underline-offset-4 hover:underline">
                {item.read ? "Уншаагүй болгох" : "Уншсан"}
              </button>
            </form>
          </li>
        ))}
        {!items.length ? <li className="px-5 py-10 text-center text-[12px] text-[#9c8c84]">Мэдэгдэл алга</li> : null}
      </ul>
    </div>
  );
}
