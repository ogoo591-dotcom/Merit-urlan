"use client";

import { UserButton, useUser } from "@clerk/nextjs";
import Image from "next/image";
import Link from "next/link";
import { Bell, Heart, Library, Menu, ShieldCheck, ShoppingBag, ShoppingCart, User } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import type { ReactNode } from "react";

import { AddressButton } from "@/components/address-button";
import { AllMenuDrawer } from "@/components/all-menu-drawer";
import { useAuthModal } from "@/components/auth/auth-modal-provider";
import { useCart } from "@/components/cart-provider";
import { useSaved } from "@/components/saved-provider";
import { storeMeta } from "@/components/store/store-paths";
import { getViewerStatus, searchCatalog } from "@/app/actions";
import { formatPrice } from "@/lib/format";
import type { StoreProduct } from "@/lib/mock/products";
import { navSections } from "@/lib/navigation";

function SearchIcon({ className = "h-6 w-6" }: { className?: string }) {
  return (
    <svg
      aria-hidden="true"
      className={className}
      viewBox="0 0 32 32"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <circle cx="13.25" cy="13.25" r="7.25" stroke="currentColor" strokeWidth="2" />
      <path
        d="M18.8 18.8L26 26"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  );
}

function CartIcon({ className = "h-8 w-8" }: { className?: string }) {
  return (
    <svg
      aria-hidden="true"
      className={className}
      viewBox="0 0 32 32"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M6.5 7.5H10L12.8 20.5H25"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M11.2 11.5H27L24.7 18.5H12.7"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <circle cx="14.5" cy="25" r="2" stroke="currentColor" strokeWidth="2" />
      <circle cx="23.5" cy="25" r="2" stroke="currentColor" strokeWidth="2" />
    </svg>
  );
}

function CloseIcon({ className = "h-8 w-8" }: { className?: string }) {
  return (
    <svg
      aria-hidden="true"
      className={className}
      viewBox="0 0 32 32"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path d="M8 8L24 24" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      <path d="M24 8L8 24" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

function StoreIcon() {
  return (
    <svg
      aria-hidden="true"
      className="h-6 w-6"
      viewBox="0 0 32 32"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M5 13L7.5 7H24.5L27 13"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinejoin="round"
      />
      <path
        d="M7 14V27H25V14"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinejoin="round"
      />
      <path d="M12 27V20H20V27" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" />
      <path d="M5 13H27" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

// Дээд мөрийн баруун талын дүрс + доорх жижиг текст.
const headerActionClass =
  "relative flex min-w-[52px] flex-col items-center gap-1 text-[#2f2420] transition hover:text-[#a24456]";

function ActionLabel({ children }: { children: ReactNode }) {
  return <span className="hidden text-[10px] font-medium leading-none sm:block">{children}</span>;
}

function CountBadge({ count }: { count: number }) {
  return (
    <span className="absolute -top-1.5 right-2 flex h-[18px] min-w-[18px] items-center justify-center rounded-full bg-[#a24456] px-1 text-[9px] font-semibold leading-none text-white">
      {count}
    </span>
  );
}

// Enter дарахад эхний илэрцийн төрлийн (бүтээгдэхүүн / материал) жагсаалт руу хайлттайгаар очно.
function searchPageHref(query: string, results: StoreProduct[]) {
  return `${storeMeta[results[0]?.type ?? "product"].base}?q=${encodeURIComponent(query)}`;
}

function isActivePath(pathname: string, href: string) {
  const path = href.split(/[?#]/)[0];
  return path !== "/" && (pathname === path || pathname.startsWith(`${path}/`));
}

function highlightMatch(text: string, query: string) {
  const trimmedQuery = query.trim();

  if (!trimmedQuery) {
    return text;
  }

  const matchIndex = text.toLowerCase().indexOf(trimmedQuery.toLowerCase());

  if (matchIndex === -1) {
    return text;
  }

  const before = text.slice(0, matchIndex);
  const match = text.slice(matchIndex, matchIndex + trimmedQuery.length);
  const after = text.slice(matchIndex + trimmedQuery.length);

  return (
    <>
      {before}
      <span className="text-[#6e4f45]">{match}</span>
      {after}
    </>
  );
}

export function SiteHeader() {
  const router = useRouter();
  const pathname = usePathname();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { isSignedIn } = useUser();
  // Админ эсэх (publicMetadata эсвэл ADMIN_EMAILS) болон уншаагүй мэдэгдлийн тоог серверээс авна.
  const [viewer, setViewer] = useState({ isAdmin: false, unread: 0 });
  const isAdmin = isSignedIn ? viewer.isAdmin : false;
  const unread = isSignedIn ? viewer.unread : 0;
  const { openAuth, requireAuth } = useAuthModal();
  const { items, removeItem } = useCart();
  const savedCount = useSaved().items.length;
  const cartCount = items.reduce((total, item) => total + item.quantity, 0);
  const cartTotal = items.reduce((total, item) => total + item.priceValue * item.quantity, 0);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<StoreProduct[]>([]);
  const headerRef = useRef<HTMLElement>(null);

  // Expose the header height so full-screen sections (the home hero) can fill
  // exactly the space below it.
  useEffect(() => {
    const header = headerRef.current;

    if (!header) {
      return;
    }

    const observer = new ResizeObserver(() => {
      document.documentElement.style.setProperty("--header-h", `${header.offsetHeight}px`);
    });
    observer.observe(header);

    return () => observer.disconnect();
  }, []);

  // Хуудас солигдох, цонх руу буцаж ирэх бүрд болон минут тутам мэдэгдлийн тоог шинэчилнэ.
  useEffect(() => {
    if (!isSignedIn) return;
    let alive = true;
    const refresh = () =>
      getViewerStatus()
        .then((status) => {
          if (alive) setViewer(status);
        })
        .catch(() => {});
    refresh();
    const timer = window.setInterval(refresh, 60_000);
    window.addEventListener("focus", refresh);
    return () => {
      alive = false;
      window.clearInterval(timer);
      window.removeEventListener("focus", refresh);
    };
  }, [isSignedIn, pathname]);

  // Бичиж дуусахыг 250мс хүлээгээд хайна.
  useEffect(() => {
    const query = searchQuery.trim();

    if (!query) {
      return;
    }

    const controller = new AbortController();
    const timer = window.setTimeout(() => {
      searchCatalog(query).then((items) => {
        if (!controller.signal.aborted) setSearchResults(items);
      });
    }, 250);

    return () => {
      window.clearTimeout(timer);
      controller.abort();
    };
  }, [searchQuery]);

  const closeSearch = () => {
    setIsSearchOpen(false);
    setSearchQuery("");
  };

  return (
    <>
      <header ref={headerRef} className="sticky top-0 z-40 border-b border-[#eadfd5] bg-[#fcf6f0]">
        {/* Дээд мөр: лого | хайлт | хаяг + үйлдлүүд */}
        <div className="mx-auto grid w-full max-w-[1600px] grid-cols-[auto_1fr_auto] items-center gap-x-4 gap-y-3 px-4 py-3 sm:px-6 lg:gap-x-10 lg:px-[60px]">
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setIsMenuOpen(true)}
              aria-label="Бүх ангилал"
              aria-expanded={isMenuOpen}
              className="flex h-10 w-10 items-center justify-center rounded-xl text-[#2f2420] transition hover:bg-white md:hidden"
            >
              <Menu aria-hidden className="h-6 w-6" strokeWidth={1.8} />
            </button>
            <Link href="/" className="flex shrink-0 items-center gap-3">
              <Image
                src="/Logo.png"
                alt="Merit Urlan Logo"
                width={128}
                height={128}
                className="h-11 w-11 rounded-full object-cover sm:h-12 sm:w-12"
                priority
              />
              <span className="hidden text-[14px] font-semibold text-[#2f2420] sm:block">Merit урлан</span>
            </Link>
          </div>

          <div className="order-last col-span-3 lg:order-none lg:col-span-1">
            <div className="mx-auto w-full max-w-[760px]">
          <div
            className="relative min-w-0 flex-1"
            onBlur={(event) => {
              if (!event.currentTarget.contains(event.relatedTarget)) {
                setIsSearchOpen(false);
              }
            }}
          >
            <form
              onSubmit={(event) => {
                event.preventDefault();
                const query = searchQuery.trim();

                if (query) {
                  router.push(searchPageHref(query, searchResults));
                  closeSearch();
                }
              }}
              className="flex items-center gap-3 rounded-full border border-[#e3d6cb] bg-white px-5 py-3 transition focus-within:border-[#a24456] focus-within:shadow-[0_0_0_3px_rgba(162,68,86,0.12)]"
            >
              <SearchIcon className="h-6 w-6 shrink-0 text-[#8a7b73]" />
              <input
                value={searchQuery}
                onChange={(event) => {
                  setSearchQuery(event.target.value);
                  setIsSearchOpen(true);
                }}
                onFocus={() => setIsSearchOpen(true)}
                placeholder="Тоглоом, утас, материал хайх…"
                aria-label="Хайх"
                className="min-w-0 flex-1 bg-transparent text-[12px] text-[#2f2420] outline-none placeholder:text-[#8a7b73]"
              />
              {searchQuery ? (
                <button
                  type="button"
                  aria-label="Хайлтын үг арилгах"
                  onClick={() => setSearchQuery("")}
                  className="text-[#8a7b73] transition hover:text-[#6e4f45]"
                >
                  <CloseIcon className="h-5 w-5" />
                </button>
              ) : null}
            </form>

            {isSearchOpen && searchQuery.trim() ? (
              <div className="absolute inset-x-0 top-[calc(100%+0.5rem)] z-50 overflow-hidden rounded-xl border border-[#eadfd5] bg-white shadow-[0_24px_60px_-30px_rgba(0,0,0,0.45)]">
                {searchResults.length > 0 ? (
                  <>
                    {searchResults.map((item) => (
                      <Link
                        key={item.id}
                        href={`${storeMeta[item.type].base}/${item.id}`}
                        onClick={closeSearch}
                        className="flex items-center gap-4 border-b border-[#f1ebe5] px-4 py-3 transition hover:bg-[#fcf6f0]"
                      >
                        <Image
                          src={item.images[0]}
                          alt=""
                          width={56}
                          height={56}
                          className="h-14 w-14 shrink-0 rounded-lg bg-[#f2f2f2] object-cover"
                        />
                        <div className="min-w-0">
                          <p className="line-clamp-1 text-[11px] font-semibold text-[#2f2420]">
                            {highlightMatch(item.name, searchQuery)}
                          </p>
                          <p className="mt-0.5 text-[10px] font-medium text-[#6e4f45]">{formatPrice(item.price)}</p>
                        </div>
                      </Link>
                    ))}
                    <Link
                      href={searchPageHref(searchQuery.trim(), searchResults)}
                      onClick={closeSearch}
                      className="block px-4 py-3 text-center text-[11px] font-medium text-[#6e4f45] transition hover:bg-[#fcf6f0]"
                    >
                      «{searchQuery.trim()}» бүгдийг харах
                    </Link>
                  </>
                ) : (
                  <p className="px-4 py-6 text-center text-[11px] text-[#8a7b73]">
                    «{searchQuery.trim()}» олдсонгүй
                  </p>
                )}
              </div>
            ) : null}
          </div>
            </div>
          </div>

          <div className="flex items-center justify-end gap-2 sm:gap-4">
            <div className="hidden xl:block">
              <AddressButton />
            </div>

            {isSignedIn ? (
              <div className={headerActionClass}>
                <UserButton>
                  <UserButton.MenuItems>
                    <UserButton.Link label="Миний захиалгууд" labelIcon={<ShoppingBag className="h-4 w-4" />} href="/account/orders" />
                    <UserButton.Link label="Мэдэгдэл" labelIcon={<Bell className="h-4 w-4" />} href={isAdmin ? "/admin/notifications" : "/account/notifications"} />
                    {isAdmin ? (
                      <UserButton.Link label="Админ самбар" labelIcon={<ShieldCheck className="h-4 w-4" />} href="/admin" />
                    ) : null}
                  </UserButton.MenuItems>
                </UserButton>
                {unread > 0 ? (
                  <span aria-label={`${unread} уншаагүй мэдэгдэл`}>
                    <CountBadge count={unread} />
                  </span>
                ) : null}
                <ActionLabel>Профайл</ActionLabel>
              </div>
            ) : (
              <button type="button" onClick={() => openAuth()} className={headerActionClass}>
                <User aria-hidden className="h-6 w-6" strokeWidth={1.7} />
                <ActionLabel>Нэвтрэх</ActionLabel>
              </button>
            )}

            <Link href="/saved" className={`${headerActionClass} max-md:hidden`}>
              <Heart aria-hidden className="h-6 w-6" strokeWidth={1.7} />
              {savedCount > 0 ? <CountBadge count={savedCount} /> : null}
              <ActionLabel>Хадгалсан</ActionLabel>
            </Link>

            <Link href="/library" className={`${headerActionClass} max-md:hidden`}>
              <Library aria-hidden className="h-6 w-6" strokeWidth={1.7} />
              <ActionLabel>Миний сан</ActionLabel>
            </Link>

            <button type="button" aria-label={`Сагс, ${cartCount} бараа`} onClick={() => setIsCartOpen(true)} className={headerActionClass}>
              <ShoppingCart aria-hidden className="h-6 w-6" strokeWidth={1.7} />
              {cartCount > 0 ? <CountBadge count={cartCount} /> : null}
              <ActionLabel>Сагс</ActionLabel>
            </button>
          </div>
        </div>

        {/* Хоёрдугаар мөр: "☰ Бүгд" + үндсэн хэсгүүд. Утсан дээр нуугдаж, дээд мөрийн ☰ товч үлдэнэ. */}
        <div className="hidden border-t border-[#eadfd5] bg-[#f3eeea] md:block">
          <nav aria-label="Үндсэн цэс" className="mx-auto flex w-full max-w-[1600px] items-center gap-1 px-6 py-2 lg:px-[60px]">
            <button
              type="button"
              onClick={() => setIsMenuOpen(true)}
              aria-expanded={isMenuOpen}
              className="mr-3 flex items-center gap-2 rounded-lg bg-[#a24456] px-4 py-2 text-[12px] font-semibold text-white transition hover:bg-[#8a3748]"
            >
              <Menu aria-hidden className="h-4 w-4" strokeWidth={2} />
              Бүгд
            </button>
            {navSections.map((section) => (
              <Link
                key={section.id}
                href={section.href}
                aria-current={isActivePath(pathname, section.href) ? "page" : undefined}
                className={`rounded-lg px-3.5 py-2 text-[12px] font-medium transition hover:bg-white hover:text-[#a24456] ${
                  isActivePath(pathname, section.href) ? "bg-white text-[#a24456]" : "text-[#4a3b35]"
                }`}
              >
                {section.label}
              </Link>
            ))}
          </nav>
        </div>
      </header>

      {isMenuOpen ? <AllMenuDrawer onClose={() => setIsMenuOpen(false)} /> : null}

      {isCartOpen ? (
        <div className="fixed inset-0 z-50 bg-black/45" onClick={() => setIsCartOpen(false)}>
          <aside
            className="ml-auto flex h-full w-full max-w-[32rem] flex-col bg-white"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-[#eadfd5] bg-[#fcf6f0] px-8 py-6">
              <h2 className="text-[12px] font-semibold text-[#2f2420]">Таны сагс</h2>
              <button
                type="button"
                aria-label="Сагс хаах"
                onClick={() => setIsCartOpen(false)}
                className="flex h-11 w-11 items-center justify-center rounded-full bg-white text-[#8a7b73] transition hover:text-[#6e4f45]"
              >
                <CloseIcon className="h-6 w-6" />
              </button>
            </div>

            {cartCount === 0 ? (
              <div className="flex flex-1 flex-col items-center justify-center px-8 text-center">
                <CartIcon className="h-20 w-20 text-[#8a7b73]" />
                <h3 className="mt-8 text-[12px] font-semibold text-[#2f2420]">Таны сагс хоосон байна</h3>
                <p className="mt-3 max-w-sm text-[12px] leading-relaxed text-[#6f625b]">Дуртай бараагаа нэмээд худалдан авалтаа эхлээрэй</p>
                <Link
                  href="/products"
                  onClick={() => setIsCartOpen(false)}
                  className="mt-8 flex w-full max-w-sm items-center justify-center gap-3 rounded-[14px] bg-[#6e4f45] px-6 py-4 text-[12px] font-medium text-white transition hover:bg-[#5c4038]"
                >
                  <StoreIcon />
                  Дэлгүүр хэсэх
                </Link>
              </div>
            ) : (
              <>
                <ul className="flex-1 overflow-y-auto px-8 py-4">
                  {items.map((item) => (
                    <li key={item.slug} className="flex items-center gap-4 border-b border-[#f1ebe5] py-4">
                      <Image src={item.image} alt="" width={56} height={56} className="h-14 w-14 shrink-0 rounded-lg bg-[#f7f2ed] object-cover" />
                      <div className="min-w-0 flex-1">
                        <p className="line-clamp-2 text-[12px] font-medium text-[#2f2420]">{item.name}</p>
                        <p className="mt-1 text-[11px] text-[#8a7b73]">
                          {item.quantity} × {item.priceValue.toLocaleString("en-US")}₮
                        </p>
                      </div>
                      <button
                        type="button"
                        onClick={() => removeItem(item.slug)}
                        aria-label={`${item.name}-г хасах`}
                        className="text-[#b3a69e] transition hover:text-[#b04a4a]"
                      >
                        <CloseIcon className="h-4 w-4" />
                      </button>
                    </li>
                  ))}
                </ul>
                <div className="border-t border-[#eadfd5] px-8 py-6">
                  <div className="flex items-center justify-between text-[12px]">
                    <span className="text-[#6f625b]">Нийт дүн</span>
                    <strong className="text-[#2f2420]">{cartTotal.toLocaleString("en-US")}₮</strong>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      setIsCartOpen(false);
                      requireAuth("/checkout");
                    }}
                    className="mt-5 flex w-full items-center justify-center gap-3 rounded-[14px] bg-[#6e4f45] px-6 py-4 text-[12px] font-medium text-white transition hover:bg-[#5c4038]"
                  >
                    Захиалах
                  </button>
                  {!isSignedIn ? (
                    <p className="mt-3 text-center text-[11px] text-[#8a7b73]">Захиалахын тулд утас эсвэл имэйлээр нэвтэрнэ</p>
                  ) : null}
                </div>
              </>
            )}
          </aside>
        </div>
      ) : null}
    </>
  );
}
