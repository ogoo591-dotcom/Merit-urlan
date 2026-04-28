"use client";

import { UserButton, useUser } from "@clerk/nextjs";
import Image from "next/image";
import Link from "next/link";
import { useMemo, useState } from "react";

import { catalogItems, navigation } from "@/lib/site-data";

function SearchIcon({ className = "h-8 w-8" }: { className?: string }) {
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
      className="h-8 w-8"
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

function ChevronDownIcon() {
  return (
    <svg
      aria-hidden="true"
      className="h-5 w-5"
      viewBox="0 0 20 20"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M4.5 7.5L10 13L15.5 7.5"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
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
      className="h-9 w-9"
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
      <span className="text-[#f39a08]">{match}</span>
      {after}
    </>
  );
}

export function SiteHeader() {
  const { isSignedIn } = useUser();
  const [isAccountOpen, setIsAccountOpen] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const searchResults = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();

    if (!query) {
      return [];
    }

    return catalogItems
      .filter((item) =>
        [item.name, item.subcategory, item.description].some((value) =>
          value.toLowerCase().includes(query),
        ),
      )
      .slice(0, 4);
  }, [searchQuery]);

  const closeSearch = () => {
    setIsSearchOpen(false);
    setSearchQuery("");
  };

  return (
    <>
      <header className="relative z-40 border-b border-[#ddd1c4] bg-[#f3ede5]">
        <div className="mx-auto flex w-full max-w-[1600px] flex-col gap-5 px-6 py-5 lg:flex-row lg:items-center lg:justify-between lg:px-12">
          <Link href="/" className="flex shrink-0 items-center gap-3">
            <Image
              src="/Logo.png"
              alt="Merit Urlan Logo"
              width={96}
              height={96}
              className="h-15 w-auto"
              priority
            />
            <p className="font-serif text-xl font-semibold uppercase tracking-tight text-[#7b2533] md:text-4xl">
              Merit Urlan
            </p>
          </Link>

          <nav className="flex flex-1 flex-wrap items-center justify-center gap-6 text-xs uppercase tracking-[0.34em] text-stone-500 md:gap-10">
            {navigation.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="transition hover:text-[#7b2533]"
              >
                {item.label}
              </Link>
            ))}
          </nav>

          <div className="relative flex items-center gap-7 self-end text-[#27313a] lg:self-auto">
            <button
              type="button"
              aria-label="Хайх"
              onClick={() => {
                setIsSearchOpen(true);
                setIsAccountOpen(false);
              }}
              className="flex h-11 w-11 items-center justify-center transition hover:text-[#7b2533]"
            >
              <SearchIcon />
            </button>
            <button
              type="button"
              aria-label="Сагс"
              onClick={() => {
                setIsCartOpen(true);
                setIsAccountOpen(false);
              }}
              className="relative flex h-11 w-11 items-center justify-center transition hover:text-[#7b2533]"
            >
              <CartIcon />
              <span className="absolute -right-2 -top-1 flex h-8 min-w-8 items-center justify-center rounded-full bg-[#f39a08] px-2 text-base font-bold leading-none text-white">
                0
              </span>
            </button>

            {!isSignedIn ? (
              <button
                type="button"
                aria-label="Нэвтрэх"
                onClick={() => setIsAccountOpen((isOpen) => !isOpen)}
                className={`flex h-11 items-center justify-center gap-2 transition ${
                  isAccountOpen ? "text-[#f39a08]" : "hover:text-[#7b2533]"
                }`}
              >
                <UserIcon />
                <ChevronDownIcon />
              </button>
            ) : null}

            {isSignedIn ? (
              <UserButton />
            ) : null}

            {isAccountOpen ? (
              <div className="absolute right-0 top-[calc(100%+1.25rem)] z-50 w-[min(28rem,calc(100vw-2rem))] rounded-b-2xl rounded-tr-2xl bg-white py-8 shadow-[0_24px_60px_-30px_rgba(0,0,0,0.45)]">
                <div className="absolute right-8 top-0 h-8 w-8 -translate-y-1/2 rotate-45 bg-white" />
                <Link
                  href="/sign-in"
                  onClick={() => setIsAccountOpen(false)}
                  className="relative block px-8 py-4 text-3xl font-medium text-[#3f465f] transition hover:text-[#f39a08]"
                >
                  Нэвтрэх
                </Link>
                <div className="mx-8 border-t border-[#dfe3e6]" />
                <Link
                  href="/sign-up"
                  onClick={() => setIsAccountOpen(false)}
                  className="relative block px-8 py-4 text-3xl font-medium text-[#3f465f] transition hover:text-[#f39a08]"
                >
                  Бүртгүүлэх
                </Link>
              </div>
            ) : null}
          </div>
        </div>
      </header>

      {isCartOpen ? (
        <div className="fixed inset-0 z-50 bg-black/45" onClick={() => setIsCartOpen(false)}>
          <aside
            className="ml-auto flex h-full w-full max-w-[46rem] flex-col bg-white"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-[#dfe3e6] bg-[#f5f8fa] px-8 py-7 md:px-12">
              <h2 className="text-4xl font-bold text-[#101820]">Таны сагс</h2>
              <button
                type="button"
                aria-label="Сагс хаах"
                onClick={() => setIsCartOpen(false)}
                className="flex h-14 w-14 items-center justify-center rounded-full bg-white text-[#7a828a] transition hover:text-[#f39a08]"
              >
                <CloseIcon className="h-7 w-7" />
              </button>
            </div>

            <div className="flex flex-1 flex-col items-center justify-center px-8 text-center">
              <CartIcon className="h-28 w-28 text-[#6f7880]" />
              <h3 className="mt-10 text-4xl font-bold text-[#6f7880]">Таны сагс хоосон байна</h3>
              <p className="mt-6 max-w-xl text-3xl font-medium leading-relaxed text-[#6f7880]">
                Дуртай бараагаа нэмээд худалдан авалтаа эхлээрэй
              </p>
              <Link
                href="/shop"
                onClick={() => setIsCartOpen(false)}
                className="mt-8 flex w-full max-w-[34rem] items-center justify-center gap-4 rounded bg-[#f7a009] px-8 py-5 text-4xl font-bold text-white transition hover:bg-[#dd8900]"
              >
                <StoreIcon />
                Дэлгүүр хэсэх
              </Link>
            </div>
          </aside>
        </div>
      ) : null}

      {isSearchOpen ? (
        <div className="fixed inset-0 z-50 bg-black/65 px-4 py-10" onClick={closeSearch}>
          <div
            className="mx-auto w-full max-w-6xl overflow-hidden rounded-[1.7rem] bg-white shadow-[0_30px_80px_-28px_rgba(0,0,0,0.55)]"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="flex items-center gap-6 border-b border-[#e6e6e6] p-6">
              <div className="flex min-w-0 flex-1 items-center gap-5 rounded-[1.35rem] bg-[#f4f4f4] px-6 py-5">
                <SearchIcon className="h-8 w-8 shrink-0 text-[#6f7880]" />
                <input
                  value={searchQuery}
                  onChange={(event) => setSearchQuery(event.target.value)}
                  autoFocus
                  placeholder="Хайх..."
                  className="min-w-0 flex-1 bg-transparent text-3xl font-semibold text-black outline-none placeholder:text-[#9aa1a8]"
                />
                {searchQuery ? (
                  <button
                    type="button"
                    aria-label="Хайлтын үг арилгах"
                    onClick={() => setSearchQuery("")}
                    className="text-[#6f7880] transition hover:text-[#f39a08]"
                  >
                    <CloseIcon />
                  </button>
                ) : null}
              </div>
              <button
                type="button"
                onClick={closeSearch}
                className="text-3xl font-bold text-[#f39a08] transition hover:text-[#d48200]"
              >
                Болих
              </button>
            </div>

            {searchQuery.trim() && searchResults.length > 0 ? (
              <>
                <div>
                  {searchResults.map((item) => (
                    <Link
                      key={`${item.category}-${item.slug}`}
                      href={`/shop/${item.category}/${item.slug}`}
                      onClick={closeSearch}
                      className="flex items-center gap-6 border-b border-[#ececec] px-8 py-5 transition hover:bg-[#fafafa]"
                    >
                      <Image
                        src={item.image}
                        alt=""
                        width={96}
                        height={96}
                        className="h-24 w-24 shrink-0 rounded-xl bg-[#f2f2f2] object-cover"
                      />
                      <div className="min-w-0">
                        <h3 className="line-clamp-2 text-3xl font-bold text-black">
                          {highlightMatch(item.name, searchQuery)}
                        </h3>
                        <p className="mt-2 text-2xl font-bold text-[#f39a08]">{item.price}</p>
                      </div>
                    </Link>
                  ))}
                </div>
                <div className="p-8">
                  <Link
                    href={`/shop?search=${encodeURIComponent(searchQuery.trim())}`}
                    onClick={closeSearch}
                    className="flex w-full items-center justify-center gap-4 rounded-[1.35rem] bg-[#f7a009] px-8 py-6 text-3xl font-bold text-white transition hover:bg-[#dd8900]"
                  >
                    <SearchIcon className="h-8 w-8" />
                    «{searchQuery.trim()}» бүгдийг харах
                  </Link>
                </div>
              </>
            ) : null}

            {searchQuery.trim() && searchResults.length === 0 ? (
              <div className="flex min-h-72 flex-col items-center justify-center px-8 py-14 text-center">
                <SearchIcon className="h-24 w-24 text-[#c2c7cc]" />
                <p className="mt-7 text-3xl font-bold text-[#72777c]">«{searchQuery.trim()}» олдсонгүй</p>
              </div>
            ) : null}
          </div>
        </div>
      ) : null}
    </>
  );
}
