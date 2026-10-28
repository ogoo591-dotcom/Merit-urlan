import Image from "next/image";
import Link from "next/link";

import { navigation } from "@/lib/site-data";

const shopLinks = [
  { href: "/shop/supplies", label: "Нэхмэлийн утас" },
  { href: "/shop/supplies", label: "Туслах материал" },
  { href: "/shop/finished", label: "Бэлэн бүтээгдэхүүн" },
  { href: "/courses", label: "Сургалт" },
] as const;

const footerTitleClass = "text-[12px] font-semibold text-[#2f2420]";
const footerLinkClass = "text-[12px] text-[#7a6b63] transition hover:text-[#6e4f45]";
const footerLabelClass = "text-[11px] font-semibold text-[#2f2420]";
const socialLinkClass = "text-[#2f2420] transition hover:text-[#6e4f45]";
const storeBadgeClass =
  "flex items-center gap-3 rounded-lg border-[1.5px] border-[#2f2420] bg-white px-4 py-2 text-[#2f2420]";

function FacebookIcon() {
  return (
    <svg aria-hidden="true" className="h-6 w-6" viewBox="0 0 24 24" fill="currentColor">
      <path d="M22 12a10 10 0 1 0-11.6 9.9v-7H7.9V12h2.5V9.8c0-2.5 1.5-3.9 3.8-3.9 1.1 0 2.2.2 2.2.2v2.5h-1.3c-1.2 0-1.6.8-1.6 1.6V12h2.8l-.4 2.9h-2.3v7A10 10 0 0 0 22 12Z" />
    </svg>
  );
}

function AppleIcon() {
  return (
    <svg aria-hidden="true" className="h-7 w-7" viewBox="0 0 24 24" fill="currentColor">
      <path d="M16.4 12.6c0-2.6 2.1-3.8 2.2-3.9-1.2-1.8-3.1-2-3.7-2-1.6-.2-3.1.9-3.9.9-.8 0-2-.9-3.4-.9-1.7 0-3.3 1-4.2 2.6-1.8 3.1-.5 7.7 1.3 10.2.9 1.2 1.9 2.6 3.2 2.6 1.3-.1 1.8-.8 3.3-.8 1.6 0 2 .8 3.4.8 1.4 0 2.3-1.3 3.1-2.5 1-1.4 1.4-2.8 1.4-2.9 0 0-2.7-1-2.7-4.1ZM13.9 5c.7-.9 1.2-2 1-3.2-1 0-2.3.7-3 1.6-.7.8-1.3 2-1.1 3.1 1.2.1 2.3-.6 3.1-1.5Z" />
    </svg>
  );
}

function PlayIcon() {
  return (
    <svg aria-hidden="true" className="h-7 w-7" viewBox="0 0 24 24" fill="none">
      <path
        d="M4.5 3.2v17.6c0 .5.5.8.9.5l15-8.8c.4-.3.4-.8 0-1L5.4 2.7c-.4-.3-.9 0-.9.5Z"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinejoin="round"
      />
      <path d="M4.8 3 15 12 4.8 21M15 12l-1.8-1.6M15 12l-1.8 1.6" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" />
    </svg>
  );
}

function InstagramIcon() {
  return (
    <svg aria-hidden="true" className="h-6 w-6" viewBox="0 0 24 24" fill="none">
      <rect x="3.5" y="3.5" width="17" height="17" rx="5" stroke="currentColor" strokeWidth="1.8" />
      <circle cx="12" cy="12" r="3.8" stroke="currentColor" strokeWidth="1.8" />
      <circle cx="17.2" cy="6.8" r="1.1" fill="currentColor" />
    </svg>
  );
}

function MessengerIcon({ className = "h-6 w-6" }: { className?: string }) {
  return (
    <svg aria-hidden="true" className={className} viewBox="0 0 24 24" fill="none">
      <path
        d="M12 3.5c-4.7 0-8.5 3.5-8.5 8 0 2.5 1.2 4.7 3.1 6.2v3l2.8-1.6c.8.2 1.7.4 2.6.4 4.7 0 8.5-3.5 8.5-8s-3.8-8-8.5-8Z"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinejoin="round"
      />
      <path
        d="m7.5 13.8 3-3.2 2.2 1.8 3.3-3.2"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function ArrowUpIcon() {
  return (
    <svg aria-hidden="true" className="h-4 w-4" viewBox="0 0 16 16" fill="none">
      <path
        d="M8 13V3M3.5 7.5 8 3l4.5 4.5"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function SiteFooter() {
  return (
    <footer
      id="contact"
      className="border-t border-[#eadfd5] bg-[#fcf6f0] bg-[radial-gradient(#ead9cc_1px,transparent_1px)] [background-size:28px_28px]"
    >
      <div className="mx-auto w-full max-w-[1600px] px-6 pt-20 pb-8 lg:px-[60px]">
        <div className="grid gap-12 md:grid-cols-2 lg:grid-cols-[1.5fr_0.8fr_0.8fr_1.2fr]">
          <div>
            <Link href="/" className="inline-flex items-center gap-4">
              <Image
                src="/Logo.png"
                alt="Merit Urlan Logo"
                width={128}
                height={128}
                className="h-16 w-16 rounded-full object-cover"
              />
              <div className="leading-tight">
                <p className="text-[12px] font-semibold text-[#2f2420]">Merit урлан</p>
                <p className="mt-1 text-[9px] font-medium uppercase tracking-[0.2em] text-[#8a7b73]">
                  Бизнес
                </p>
              </div>
            </Link>

            <div className="mt-10 space-y-6">
              <div>
                <p className={footerLabelClass}>Хаяг:</p>
                <p className="mt-2 max-w-md text-[12px] leading-relaxed text-[#4a3b35]">
                  Монгол Улс, Улаанбаатар хот, БГД, 11-р хороо, Богд арын 813-32 тоот
                </p>
              </div>
              <div>
                <p className={footerLabelClass}>Утас:</p>
                <Link
                  href="tel:99129445"
                  className="mt-2 inline-block text-[12px] text-[#4a3b35] underline decoration-[#cdb9ab] underline-offset-4 transition hover:text-[#6e4f45] hover:decoration-[#6e4f45]"
                >
                  +976 9912 9445
                </Link>
              </div>
            </div>

            <div className="mt-8 flex items-center gap-5">
              <Link
                href="https://www.facebook.com/meriturlan"
                target="_blank"
                rel="noreferrer"
                aria-label="Merit Urlan Facebook"
                className={socialLinkClass}
              >
                <FacebookIcon />
              </Link>
              <Link
                href="https://www.instagram.com/merit_urlan/"
                target="_blank"
                rel="noreferrer"
                aria-label="Merit Urlan Instagram"
                className={socialLinkClass}
              >
                <InstagramIcon />
              </Link>
              <Link
                href="https://m.me/meriturlan"
                target="_blank"
                rel="noreferrer"
                aria-label="Merit Urlan Messenger"
                className={socialLinkClass}
              >
                <MessengerIcon />
              </Link>
            </div>
          </div>

          <div>
            <p className={footerTitleClass}>Мэдээлэл</p>
            <nav className="mt-6 flex flex-col gap-4">
              {navigation.map((item) => (
                <Link key={item.href} href={item.href} className={footerLinkClass}>
                  {item.label}
                </Link>
              ))}
            </nav>
          </div>

          <div>
            <p className={footerTitleClass}>Дэлгүүр</p>
            <nav className="mt-6 flex flex-col gap-4">
              {shopLinks.map((item) => (
                <Link key={item.label} href={item.href} className={footerLinkClass}>
                  {item.label}
                </Link>
              ))}
            </nav>
          </div>

          <div>
            <p className={footerTitleClass}>Merit app тун удахгүй</p>
            <div className="mt-6 flex flex-wrap gap-4">
              <div className={storeBadgeClass} aria-label="App Store — тун удахгүй">
                <AppleIcon />
                <div className="leading-none">
                  <p className="text-[8px] font-medium">Download on the</p>
                  <p className="mt-1 text-[12px] font-semibold tracking-tight">App Store</p>
                </div>
              </div>
              <div className={storeBadgeClass} aria-label="Google Play — тун удахгүй">
                <PlayIcon />
                <div className="leading-none">
                  <p className="text-[8px] font-medium uppercase">Get it on</p>
                  <p className="mt-1 text-[12px] font-semibold tracking-tight">Google Play</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-16 flex flex-col gap-4 border-t border-[#e3d6cb] pt-8 text-[11px] text-[#8a7b73] md:flex-row md:items-center md:justify-between">
          <p>© 2026 Merit урлан. Бүх эрх хуулиар хамгаалагдсан.</p>
          <div className="flex items-center gap-6">
            <p className="hidden lg:block">Гараар, хайраар, сэтгэлээ шингээн Монголд урлав.</p>
            <Link
              href="#"
              className="inline-flex items-center gap-2 rounded-full border border-[#e3d6cb] bg-white px-4 py-2 text-[#4a3b35] transition hover:border-[#6e4f45] hover:text-[#6e4f45]"
            >
              Дээш буцах
              <ArrowUpIcon />
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
