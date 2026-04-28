import Link from "next/link";

const footerTitleClass = "text-sm font-semibold uppercase tracking-[0.32em] text-[#f0cbc3]/75";
const footerTextClass = "text-[1.05rem] leading-[1.6] text-[#f7dfda]";

function FacebookIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className="h-10 w-10">
      <circle cx="12" cy="12" r="12" fill="#1877F2" />
      <path
        fill="#fff"
        d="M13.4 20v-6.3h2.1l.3-2.5h-2.4V9.6c0-.7.2-1.2 1.2-1.2h1.3V6.2c-.2 0-1-.1-1.9-.1-1.9 0-3.2 1.1-3.2 3.3v1.8H8.6v2.5h2.2V20h2.6Z"
      />
    </svg>
  );
}

function InstagramIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className="h-10 w-10">
      <defs>
        <linearGradient id="instagramGradient" x1="0%" x2="100%" y1="100%" y2="0%">
          <stop offset="0%" stopColor="#feda75" />
          <stop offset="35%" stopColor="#fa7e1e" />
          <stop offset="60%" stopColor="#d62976" />
          <stop offset="85%" stopColor="#962fbf" />
          <stop offset="100%" stopColor="#4f5bd5" />
        </linearGradient>
      </defs>
      <rect x="2.5" y="2.5" width="19" height="19" rx="5.5" fill="none" stroke="url(#instagramGradient)" strokeWidth="2.2" />
      <circle cx="12" cy="12" r="4.2" fill="none" stroke="url(#instagramGradient)" strokeWidth="2.2" />
      <circle cx="18" cy="6.4" r="1.3" fill="url(#instagramGradient)" />
    </svg>
  );
}

export function SiteFooter() {
  return (
    <footer className="relative overflow-hidden border-t border-[#a6626c] bg-[#8f2533] text-[#f1d4cd]">
      <div className="pointer-events-none absolute inset-x-0 top-0 overflow-hidden select-none">
        <div className="translate-x-[-1%] pt-3 font-serif text-[5rem] leading-[0.82] tracking-[-0.05em] text-[#dca09a]/18 sm:text-[8rem] lg:text-[15rem]">
          <div>MERIT URLAN</div>
        </div>
      </div>

      <div className="relative mx-auto w-full max-w-[1800px] px-6 pt-36 pb-6 lg:px-12 lg:pt-[34rem]">
        <div className="grid gap-12 lg:grid-cols-4">
          <div className="space-y-6">
            <p className={footerTitleClass}>Навигаци</p>
            <div className={`flex flex-col gap-5 ${footerTextClass}`}>
              <Link href="/shop" className="transition hover:text-white">
                Дэлгүүр
              </Link>
              <Link href="/shop" className="transition hover:text-white">
                Утас
              </Link>
              <Link href="/courses" className="transition hover:text-white">
                Зүү
              </Link>
              <Link href="/courses" className="transition hover:text-white">
                Товч
              </Link>
              <Link href="/shop" className="transition hover:text-white">
                Бэлэн бүтээгдэхүүн
              </Link>
            </div>
          </div>

          <div className="space-y-6">
            <p className={footerTitleClass}>Мэдээлэл</p>
            <div className={`flex flex-col gap-5 ${footerTextClass}`}>
              <Link href="/" className="transition hover:text-white">
                Бидний тухай
              </Link>
              <Link href="/" className="transition hover:text-white">
                Хүргэлт
              </Link>
              <Link href="/" className="transition hover:text-white">
                Буцаалт
              </Link>
              <Link href="/" className="transition hover:text-white">
                Нууцлал
              </Link>
            </div>
          </div>

          <div className="space-y-6">
            <p className={footerTitleClass}>Холбоо барих</p>
            <div className={`max-w-xs space-y-6 ${footerTextClass}`}>
              <Link
                href="tel:99129445"
                className="flex items-center gap-4 font-medium transition hover:text-white"
              >
                <span>✆</span>
                <span>99129445</span>
              </Link>

              <p>
                БГД 11-р хороо
                <br />
                Богд арын 813-32 тоот
              </p>

              <div className="flex items-center gap-6 pt-1">
                <Link
                  href="https://www.facebook.com/meriturlan"
                  target="_blank"
                  rel="noreferrer"
                  aria-label="Merit Urlan Facebook"
                  className="transition hover:scale-105"
                >
                  <FacebookIcon />
                </Link>
                <Link
                  href="https://www.instagram.com/merit_urlan/"
                  target="_blank"
                  rel="noreferrer"
                  aria-label="Merit Urlan Instagram"
                  className="transition hover:scale-105"
                >
                  <InstagramIcon />
                </Link>
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <p className={footerTitleClass}>Мэдээлэл авах</p>
            <p className={`max-w-md ${footerTextClass}`}>
              Шинэ цуглуулга, багц, сэтгэмжийг сар бүр нэг удаа илгээнэ.
            </p>
            <div className={`flex items-center justify-between gap-4 border-b border-[#e1b0ac]/55 pb-3 ${footerTextClass}`}>
              <span>И-мэйл хаяг</span>
              <span>→</span>
            </div>
          </div>
        </div>

        <div className="mt-14 border-t border-[#ddb0ad]/25 pt-6 text-center text-sm tracking-[0.24em] text-[#efcbc3]/45">
          © 2026 — Улаанбаатарт, гараар, хайраар.
        </div>
      </div>
    </footer>
  );
}
