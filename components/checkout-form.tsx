"use client";

import Image from "next/image";
import Link from "next/link";
import { useActionState, useEffect, useRef } from "react";

import { placeOrder, type CheckoutState } from "@/app/checkout/actions";
import { AddressFields, readAddressFields } from "@/components/address-fields";
import { useCart } from "@/components/cart-provider";
import { formatAddress, useDeliveryAddress } from "@/components/delivery-address-provider";

type Props = {
  defaults: { name: string; phone: string; email: string };
};

const inputClass =
  "w-full rounded-[14px] border border-[#eadfd5] bg-white px-4 py-3 text-[13px] text-[#2f2420] outline-none transition focus:border-[#6e4f45]";
const labelClass = "mb-2 block text-[12px] font-medium text-[#4a3b35]";

export function CheckoutForm({ defaults }: Props) {
  const { items, ready, setQuantity, removeItem, clear } = useCart();
  const { address, saveAddress } = useDeliveryAddress();
  const [state, action, pending] = useActionState<CheckoutState, FormData>(placeOrder, {});
  const total = items.reduce((sum, item) => sum + item.priceValue * item.quantity, 0);

  const clearedOrder = useRef<number | null>(null);

  useEffect(() => {
    if (!state.orderId || clearedOrder.current === state.orderId) return;
    clearedOrder.current = state.orderId;
    clear();
  }, [state.orderId, clear]);

  if (state.orderId) {
    return (
      <div className="mt-10 rounded-[24px] border border-[#eadfd5] bg-white p-10 text-center">
        <p className="text-[40px]">🧶</p>
        <h2 className="mt-4 text-[20px] font-semibold text-[#2f2420]">Захиалга #{state.orderId} хүлээн авлаа</h2>
        <p className="mx-auto mt-3 max-w-md text-[12px] leading-relaxed text-[#7a6b63]">
          Бид тантай удахгүй холбогдож төлбөр, хүргэлтийг баталгаажуулна.
        </p>
        <div className="mt-8 flex justify-center gap-3">
          <Link href="/account" className="rounded-[14px] bg-[#6e4f45] px-6 py-3 text-[12px] font-medium text-white">
            Миний захиалгууд
          </Link>
          <Link href="/shop" className="rounded-[14px] border border-[#eadfd5] bg-white px-6 py-3 text-[12px] text-[#4a3b35]">
            Дэлгүүр рүү буцах
          </Link>
        </div>
      </div>
    );
  }

  if (!ready) return <div className="mt-10 h-64 animate-pulse rounded-[24px] bg-white/70" />;

  if (!items.length) {
    return (
      <div className="mt-10 rounded-[24px] border border-[#eadfd5] bg-white p-10 text-center">
        <p className="text-[12px] text-[#7a6b63]">Сагс хоосон байна.</p>
        <Link href="/shop" className="mt-6 inline-block rounded-[14px] bg-[#6e4f45] px-6 py-3 text-[12px] font-medium text-white">
          Дэлгүүр хэсэх
        </Link>
      </div>
    );
  }

  return (
    <form
      action={action}
      onSubmit={(event) => {
        const formData = new FormData(event.currentTarget);
        if (formData.get("save_address")) void saveAddress(readAddressFields(formData));
      }}
      className="mt-10 grid gap-8 lg:grid-cols-[1.2fr_1fr]">
      <input type="hidden" name="items" value={JSON.stringify(items.map(({ slug, quantity }) => ({ slug, quantity })))} />

      <div className="space-y-5 rounded-[24px] border border-[#eadfd5] bg-white p-8">
        <h2 className="text-[14px] font-semibold text-[#2f2420]">Хүргэлтийн мэдээлэл</h2>
        <div>
          <label htmlFor="name" className={labelClass}>Нэр</label>
          <input id="name" name="name" required defaultValue={defaults.name} className={inputClass} />
        </div>
        <div className="grid gap-5 sm:grid-cols-2">
          <div>
            <label htmlFor="phone" className={labelClass}>Утас</label>
            <input id="phone" name="phone" required inputMode="tel" defaultValue={defaults.phone} className={inputClass} />
          </div>
          <div>
            <label htmlFor="email" className={labelClass}>Имэйл (заавал биш)</label>
            <input id="email" name="email" type="email" defaultValue={defaults.email} className={inputClass} />
          </div>
        </div>
        <div>
          <p className={labelClass}>Хүргэлтийн хаяг</p>
          {/* Хадгалсан хаяг ачаалагдмагц талбаруудыг дахин бөглөнө. */}
          <AddressFields key={address ? formatAddress(address) : "empty"} value={address} idPrefix="checkout-address" />
          <label className="mt-3 flex items-center gap-2 text-[11px] text-[#6f625b]">
            <input name="save_address" type="checkbox" defaultChecked className="h-4 w-4 accent-[#6e4f45]" />
            Энэ хаягийг дараагийн захиалгад хадгалах
          </label>
        </div>
        <div>
          <label htmlFor="note" className={labelClass}>Нэмэлт тайлбар</label>
          <textarea id="note" name="note" rows={2} className={inputClass} />
        </div>
      </div>

      <div className="h-fit rounded-[24px] border border-[#eadfd5] bg-white p-8">
        <h2 className="text-[14px] font-semibold text-[#2f2420]">Таны сагс</h2>
        <ul className="mt-4">
          {items.map((item) => (
            <li key={item.slug} className="flex items-center gap-4 border-b border-[#f1ebe5] py-4">
              <Image src={item.image} alt="" width={56} height={56} className="h-14 w-14 rounded-lg bg-[#f7f2ed] object-cover" />
              <div className="min-w-0 flex-1">
                <p className="line-clamp-2 text-[12px] font-medium text-[#2f2420]">{item.name}</p>
                <div className="mt-2 flex items-center gap-2 text-[12px]">
                  <button type="button" onClick={() => setQuantity(item.slug, item.quantity - 1)} className="h-7 w-7 rounded-full border border-[#eadfd5]">−</button>
                  <span className="w-6 text-center">{item.quantity}</span>
                  <button type="button" onClick={() => setQuantity(item.slug, item.quantity + 1)} className="h-7 w-7 rounded-full border border-[#eadfd5]">+</button>
                  <button type="button" onClick={() => removeItem(item.slug)} className="ml-2 text-[11px] text-[#b04a4a]">Хасах</button>
                </div>
              </div>
              <strong className="text-[12px] text-[#2f2420]">{(item.priceValue * item.quantity).toLocaleString("en-US")}₮</strong>
            </li>
          ))}
        </ul>
        <div className="mt-6 flex items-center justify-between text-[14px]">
          <span className="text-[#6f625b]">Нийт</span>
          <strong className="text-[#2f2420]">{total.toLocaleString("en-US")}₮</strong>
        </div>

        {state.error ? <p className="mt-4 rounded-xl bg-[#fbeaea] px-4 py-3 text-[12px] text-[#b04a4a]">{state.error}</p> : null}

        <button
          type="submit"
          disabled={pending}
          className="mt-6 w-full rounded-[14px] bg-[#6e4f45] px-6 py-4 text-[13px] font-medium text-white transition hover:bg-[#5c4038] disabled:opacity-60"
        >
          {pending ? "Илгээж байна…" : "Захиалга баталгаажуулах"}
        </button>
        <p className="mt-3 text-center text-[11px] text-[#8a7b73]">Төлбөрийг бид холбогдож баталгаажуулсны дараа төлнө.</p>
      </div>
    </form>
  );
}
