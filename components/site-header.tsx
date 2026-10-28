"use client";

import { UserButton, useUser } from "@clerk/nextjs";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";

import type { CatalogItem } from "@/lib/site-data";
import { AddressButton } from "@/components/address-button";
import { CategoryMenu } from "@/components/category-menu";
import { useAuthModal } from "@/components/auth/auth-modal-provider";
import { useCart } from "@/components/cart-provider";

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

function UserIcon() {
  return (
    <svg
      aria-hidden="true"
      className="h-6 w-6"
      viewBox="0 0 32 32"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <circle cx="16" cy="9.5" r="5.5" stroke="currentColor" strokeWidth="2" />
      <path
        d="M6 28C6.6 21.8 10.4 18.5 16 18.5C21.6 18.5 25.4 21.8 26 28H6Z"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinejoin="round"
      />
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
  const { isSignedIn, user } = useUser();
  const isAdmin = user?.publicMetadata?.role === "admin";
  const { openAuth, requireAuth } = useAuthModal();
  const { items, removeItem } = useCart();
  const cartCount = items.reduce((total, item) => total + item.quantity, 0);
  const cartTotal = items.reduce((total, item) => total + item.priceValue * item.quantity, 0);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<CatalogItem[]>([]);
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

  // Бичиж дуусахыг 250мс хүлээгээд сангаас хайна.
  useEffect(() => {
    const query = searchQuery.trim();

    if (!query) {
      return;
    }

    const controller = new AbortController();
    const timer = window.setTimeout(() => {
      fetch(`/api/search?q=${encodeURIComponent(query)}`, { signal: controller.signal })
        .then((response) => (response.ok ? response.json() : { items: [] }))
        .then((data: { items: CatalogItem[] }) => setSearchResults(data.items))
        .catch(() => {});
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
      <header ref={headerRef} className="sticky top-0 z-40 border-b border-[#eadfd5] bg-[#fcf6f0] bg-[radial-gradient(#ead9cc_1px,transparent_1px)] [background-size:28px_28px]">
        <div className="mx-auto grid w-full max-w-[1600px] grid-cols-[auto_1fr] items-center gap-x-6 gap-y-4 px-6 py-3 lg:grid-cols-[1fr_auto_1fr] lg:px-[60px]">
          <div className="order-last col-span-2 flex w-full items-center gap-3 lg:order-none lg:col-span-1 lg:max-w-[500px]">
          <CategoryMenu />

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
                  router.push(`/shop?search=${encodeURIComponent(query)}`);
                  closeSearch();
                }
              }}
              className="flex items-center gap-3 rounded-xl border border-[#e3d6cb] bg-white/80 px-4 py-3 transition focus-within:border-[#6e4f45]"
            >
              <SearchIcon className="h-6 w-6 shrink-0 text-[#8a7b73]" />
              <input
                value={searchQuery}
                onChange={(event) => {
                  setSearchQuery(event.target.value);
                  setIsSearchOpen(true);
                }}
                onFocus={() => setIsSearchOpen(true)}
                placeholder="Хайх"
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
                        key={`${item.category}-${item.slug}`}
                        href={`/shop/${item.category}/${item.slug}`}
                        onClick={closeSearch}
                        className="flex items-center gap-4 border-b border-[#f1ebe5] px-4 py-3 transition hover:bg-[#fcf6f0]"
                      >
                        <Image
                          src={item.image}
                          alt=""
                          width={56}
                          height={56}
                          className="h-14 w-14 shrink-0 rounded-lg bg-[#f2f2f2] object-cover"
                        />
                        <div className="min-w-0">
                          <p className="line-clamp-1 text-[11px] font-semibold text-[#2f2420]">
                            {highlightMatch(item.name, searchQuery)}
                          </p>
                          <p className="mt-0.5 text-[10px] font-medium text-[#6e4f45]">{item.price}</p>
                        </div>
                      </Link>
                    ))}
                    <Link
                      href={`/shop?search=${encodeURIComponent(searchQuery.trim())}`}
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

          <Link href="/" className="flex shrink-0 items-center gap-3">
            <Image
              src="/Logo.png"
              alt="Merit Urlan Logo"
              width={128}
              height={128}
              className="h-14 w-14 rounded-full object-cover"
              priority
            />
            <div className="leading-tight">
              <p className="text-[12px] font-semibold text-[#2f2420]">Merit урлан</p>
              <p className="mt-1 text-[9px] font-medium uppercase tracking-[0.2em] text-[#8a7b73]">
                Бизнес
              </p>
            </div>
          </Link>

          <div className="flex items-center justify-end gap-5 text-[#2f2420]">
            <AddressButton />
            <button
              type="button"
              aria-label="Сагс"
              onClick={() => setIsCartOpen(true)}
              className="relative flex h-11 w-11 items-center justify-center transition hover:text-[#6e4f45]"
            >
              <CartIcon />
              {cartCount > 0 ? (
                <span className="absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-[#6e4f45] px-1.5 text-[8px] font-semibold leading-none text-white">
                  {cartCount}
                </span>
              ) : null}
            </button>

            {isSignedIn ? (
              <>
                {isAdmin ? (
                  <Link
                    href="/admin"
                    className="rounded-full bg-[#2f2420] px-4 py-2 text-[11px] font-semibold text-white transition hover:bg-[#6e4f45]"
                  >
                    Админ
                  </Link>
                ) : null}
                <UserButton>
                  <UserButton.MenuItems>
                    <UserButton.Link label="Миний захиалгууд" labelIcon={<CartIcon className="h-4 w-4" />} href="/account" />
                  </UserButton.MenuItems>
                </UserButton>
              </>
            ) : (
              <button
                type="button"
                onClick={() => openAuth()}
                className="flex items-center gap-2 rounded-full border-[1.5px] border-[#2f2420] px-5 py-2.5 text-[12px] font-semibold transition hover:border-[#6e4f45] hover:text-[#6e4f45]"
              >
                <UserIcon />
                Нэвтрэх
              </button>
            )}
          </div>
        </div>
      </header>

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
                  href="/shop"
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
