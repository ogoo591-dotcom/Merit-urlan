import Image from "next/image";
import Link from "next/link";

const quickLinks = [
  { href: "/", label: "Нүүр" },
  { href: "/#about", label: "Бидний тухай" },
  { href: "/#services", label: "Бүтээгдэхүүн / Үйлчилгээ" },
  { href: "/#gallery", label: "Зургийн цомог" },
  { href: "/products", label: "Дэлгүүр" },
  { href: "/#faq", label: "Түгээмэл асуулт" },
] as const;

const socialLinks = [
  { href: "https://www.facebook.com/meriturlan", label: "Facebook", icon: ArrowUpRightIcon },
  { href: "https://www.instagram.com/merit_urlan/", label: "Instagram", icon: ArrowUpRightIcon },
  { href: "https://m.me/meriturlan", label: "Messenger", icon: MessengerIcon },
] as const;

const titleClass = "text-[12px] font-semibold text-white";

function PhoneIcon() {
  return (
    <svg aria-hidden="true" className="h-5 w-5" viewBox="0 0 24 24" fill="none">
      <path
        d="M5.5 4.5h3l1.5 4-2 1.3a10 10 0 0 0 6.2 6.2l1.3-2 4 1.5v3a2 2 0 0 1-2.2 2A15.5 15.5 0 0 1 3.5 6.7a2 2 0 0 1 2-2.2Z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function PinIcon() {
  return (
    <svg aria-hidden="true" className="h-5 w-5" viewBox="0 0 24 24" fill="none">
      <path d="M12 21s-6.5-5.6-6.5-11a6.5 6.5 0 0 1 13 0c0 5.4-6.5 11-6.5 11Z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
      <circle cx="12" cy="10" r="2.3" stroke="currentColor" strokeWidth="1.5" />
    </svg>
  );
}

function ClockIcon() {
  return (
    <svg aria-hidden="true" className="h-5 w-5" viewBox="0 0 24 24" fill="none">
      <circle cx="12" cy="13" r="7.5" stroke="currentColor" strokeWidth="1.5" />
      <path d="M12 9.5V13l2.2 1.6M10 3.5h4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

function ArrowUpRightIcon() {
  return (
    <svg aria-hidden="true" className="h-4 w-4" viewBox="0 0 16 16" fill="none">
      <path d="M4.5 11.5L11.5 4.5M5.5 4.5H11.5V10.5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function MessengerIcon() {
  return (
    <svg aria-hidden="true" className="h-5 w-5" viewBox="0 0 24 24" fill="none">
      <path
        d="M12 3.5c-4.7 0-8.5 3.5-8.5 8 0 2.5 1.2 4.7 3.1 6.2v3l2.8-1.6c.8.2 1.7.4 2.6.4 4.7 0 8.5-3.5 8.5-8s-3.8-8-8.5-8Z"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function ContactItem({ icon, label, children }: { icon: React.ReactNode; label: string; children: React.ReactNode }) {
  return (
    <li className="flex gap-4">
      <span className="mt-0.5 text-[#a8786b]">{icon}</span>
      <div>
        <p className="text-[11px] text-[#9c8c84]">{label}</p>
        <div className="mt-1 text-[12px] leading-relaxed text-[#e6dbd5]">{children}</div>
      </div>
    </li>
  );
}

// Хуудас бүрийн доор байдаг тул цэсний "Холбоо барих" (#contact) аль ч хуудаснаас энд хүрнэ.
export function SiteFooter() {
  return (
    <footer id="contact" className="bg-[#3d302c] text-[#b8aaa2]">
      <div className="mx-auto w-full max-w-[1600px] px-6 pb-8 pt-16 lg:px-[144px] lg:pt-20">
        <div className="grid gap-12 md:grid-cols-2 lg:grid-cols-[1.5fr_0.9fr_1.1fr_0.9fr] lg:gap-16">
          <div>
            <Link href="/" className="inline-flex items-center gap-4">
              <Image src="/Logo.png" alt="Merit урлан лого" width={112} height={112} className="h-14 w-14 rounded-full" />
              <span className="text-[14px] font-semibold text-white">Merit урлан</span>
            </Link>
            <p className="mt-7 max-w-[440px] text-[12px] leading-[2]">
              Merit урлан нь гараар нэхсэн чихмэл тоглоом, бэлэг дурсгалын бүтээл урлаж, гар урлалд дуртай хүн
              бүрт чанартай утас, туслах материал болон алхамчилсан сургалтыг нэг дороос хүргэдэг Монгол брэнд юм.
            </p>
          </div>

          <div>
            <p className={titleClass}>Түргэн холбоос</p>
            <nav className="mt-6 flex flex-col gap-4">
              {quickLinks.map((item) => (
                <Link key={item.href} href={item.href} className="text-[12px] font-medium transition hover:text-white">
                  {item.label}
                </Link>
              ))}
            </nav>
          </div>

          <div>
            <p className={titleClass}>Холбоо барих</p>
            <ul className="mt-6 space-y-5">
              <ContactItem icon={<PhoneIcon />} label="Утас">
                <a href="tel:+97699129445" className="transition hover:text-white">
                  +976 9912 9445
                </a>
              </ContactItem>
              <ContactItem icon={<PinIcon />} label="Хаяг">
                Улаанбаатар хот, БГД, 11-р хороо, Богд арын 813-32 тоот
              </ContactItem>
              <ContactItem icon={<ClockIcon />} label="Захиалга">
                Сайтаар 24/7 захиалж болно. Messenger-ээр асуултад тань хариулна.
              </ContactItem>
            </ul>
          </div>

          <div>
            <p className={titleClass}>Олон нийтийн сүлжээ</p>
            <div className="mt-6 flex flex-col gap-3">
              {socialLinks.map(({ href, label, icon: Icon }) => (
                <Link
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center justify-between rounded-xl border border-white/10 px-5 py-3.5 text-[12px] text-[#e6dbd5] transition hover:border-white/25 hover:bg-white/5 hover:text-white"
                >
                  {label}
                  <Icon />
                </Link>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-16 flex flex-col gap-3 border-t border-white/10 pt-7 text-[11px] text-[#9c8c84] md:flex-row md:items-center md:justify-between">
          <p>© {new Date().getFullYear()} Merit урлан. Бүх эрх хуулиар хамгаалагдсан.</p>
          <p>Гараар, хайраар, сэтгэлээ шингээн Монголд урлав.</p>
        </div>
      </div>
    </footer>
  );
}
