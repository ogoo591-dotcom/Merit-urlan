import { MapPin, MessageCircle, Phone, Users } from "lucide-react";
import type { LucideIcon } from "lucide-react";

import { aboutContact } from "@/lib/mock/about";

type ContactCard = { icon: LucideIcon; label: string; value: string; href?: string; external?: boolean };

const cards: ContactCard[] = [
  { icon: Phone, label: "Утас", value: aboutContact.phone, href: aboutContact.phoneHref },
  { icon: Users, label: "Facebook групп", value: "Группт нэгдэх", href: aboutContact.facebookGroup, external: true },
  { icon: MessageCircle, label: "Messenger", value: "Бидэнд бичих", href: aboutContact.messenger, external: true },
  { icon: MapPin, label: "Хаяг", value: aboutContact.address },
];

export function AboutContact() {
  return (
    <section id="contact" className="scroll-mt-[var(--header-h,130px)] bg-[#fcf6f0] px-6 py-20 lg:px-[144px]">
      <div className="mx-auto w-full max-w-[1200px]">
        <div className="mx-auto max-w-[720px] text-center">
          <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-[#7a6b63]">Холбоо барих</p>
          <h2 className="mt-5 font-serif text-[40px] leading-tight text-[#2f2420] lg:text-[48px]">Бидэнтэй холбогдоорой</h2>
          <p className="mt-5 text-[12px] leading-[1.9] text-[#7a6b63]">
            Захиалга, сургалт, захиалгат бүтээлийн талаар асуух зүйл байвал доорх сувгуудаар холбогдоорой.
          </p>
        </div>

        <ul className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {cards.map(({ icon: Icon, label, value, href, external }) => {
            const body = (
              <>
                <span className="flex h-12 w-12 items-center justify-center rounded-full bg-[#f7e9ec] text-[#a24456] transition group-hover:bg-[#a24456] group-hover:text-white">
                  <Icon aria-hidden className="h-5 w-5" strokeWidth={1.7} />
                </span>
                <span className="mt-5 block text-[11px] text-[#9c8c84]">{label}</span>
                <span className="mt-1.5 block text-[13px] font-semibold leading-snug text-[#2f2420]">{value}</span>
              </>
            );
            const cardClass = "group block h-full rounded-[24px] border border-[#efe4da] bg-white p-6";
            return (
              <li key={label}>
                {href ? (
                  <a
                    href={href}
                    {...(external ? { target: "_blank", rel: "noreferrer" } : {})}
                    className={`${cardClass} transition hover:-translate-y-0.5 hover:border-[#a24456]`}
                  >
                    {body}
                  </a>
                ) : (
                  <div className={cardClass}>{body}</div>
                )}
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
