"use client";

import { Clock, Minus, Plus, Trash2 } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCallback, useMemo, useState } from "react";
import type { FormEvent } from "react";

import { AddressFields, readAddressFields } from "@/components/address-fields";
import { useCart } from "@/components/cart-provider";
import { formatAddress, useDeliveryAddress } from "@/components/delivery-address-provider";
import { checkCart, placeOrder } from "@/app/actions";
import { QPayDialog } from "@/components/store/qpay-dialog";
import { createQPayInvoice, type QPayInvoice } from "@/lib/data/payments";
import { useData } from "@/lib/data/use-data";
import { formatPrice } from "@/lib/format";
import type { Order } from "@/lib/orders";

type Props = {
  defaults: { name: string; phone: string };
};

type PendingOrder = Pick<Order, "customer" | "address" | "note">;

const inputClass =
  "w-full rounded-[14px] border border-[#eadfd5] bg-white px-4 py-3 text-[13px] text-[#2f2420] outline-none transition focus:border-[#a24456]";
const labelClass = "mb-2 block text-[12px] font-medium text-[#4a3b35]";

// Захиалгын урсгал: мэдээлэл бөглөх → QPay (mock) төлөх → захиалга үүсч, үлдэгдэл хасагдана → /account/orders.
export function CheckoutForm({ defaults }: Props) {
  const router = useRouter();
  const { items, ready, setQuantity, removeItem, clear } = useCart();
  const { address, saveAddress } = useDeliveryAddress();
  const [formError, setFormError] = useState<string>();
  const [pending, setPending] = useState<PendingOrder | null>(null);
  const [invoice, setInvoice] = useState<QPayInvoice | null>(null);
  const [paying, setPaying] = useState(false);
  const [payError, setPayError] = useState<string>();

  const cart = useMemo(() => items.map((item) => ({ id: item.slug, quantity: item.quantity })), [items]);
  const cartKey = JSON.stringify(cart);
  // Сагсыг одоогийн үнэ, үлдэгдэлтэй тулгаж, асуудлыг төлбөрөөс өмнө харуулна.
  const { data: check } = useData(useCallback(() => checkCart(JSON.parse(cartKey)), [cartKey]));
  const total = check?.total ?? items.reduce((sum, item) => sum + item.priceValue * item.quantity, 0);
  const madeToOrderDays = Math.max(0, ...(check?.lines ?? []).filter((line) => line.madeToOrder).map((line) => line.leadDays ?? 0));

  const startPayment = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setFormError(undefined);
    const formData = new FormData(event.currentTarget);
    const name = String(formData.get("name") ?? "").trim();
    const phone = String(formData.get("phone") ?? "").trim();
    const deliveryAddress = readAddressFields(formData);

    if (!name || !/^[0-9+\s-]{8,}$/.test(phone) || !deliveryAddress.district || !deliveryAddress.detail) {
      setFormError("Нэр, утас (8+ оронтой), хүргэлтийн хаягаа бүрэн бөглөнө үү.");
      return;
    }
    const latest = await checkCart(cart);
    if (latest.errors.length) {
      setFormError(latest.errors[0]);
      return;
    }
    if (formData.get("saveAddress")) void saveAddress(deliveryAddress);

    setPending({ customer: { name, phone }, address: deliveryAddress, note: String(formData.get("note") ?? "").trim() });
    setPayError(undefined);
    setInvoice(await createQPayInvoice(latest.total));
  };

  const pay = async () => {
    if (!invoice || !pending) return;
    setPaying(true);
    setPayError(undefined);
    // Сервер төлбөрийг (mock) шалгаж, үнэ, үлдэгдлийг дахин тулгаад захиалга үүсгэнэ.
    const result = await placeOrder({ ...pending, cart });
    if (!result.ok) {
      setPayError(result.error);
      setPaying(false);
      return;
    }
    clear();
    router.push(`/account/orders?new=${result.orderId}`);
  };

  if (!ready) return <div className="mt-10 h-64 animate-pulse rounded-[24px] bg-white/70" />;

  if (!items.length) {
    return (
      <div className="mt-10 rounded-[24px] border border-[#eadfd5] bg-white p-10 text-center">
        <p className="text-[12px] text-[#7a6b63]">Сагс хоосон байна.</p>
        <Link href="/products" className="mt-6 inline-block rounded-[14px] bg-[#a24456] px-6 py-3 text-[12px] font-semibold text-white">
          Бүтээгдэхүүн үзэх
        </Link>
      </div>
    );
  }

  return (
    <>
      <form onSubmit={startPayment} className="mt-10 grid gap-8 lg:grid-cols-[1.2fr_1fr]">
        <div className="space-y-6 rounded-[24px] border border-[#eadfd5] bg-white p-6 lg:p-8">
          <h2 className="text-[14px] font-semibold text-[#2f2420]">Хүргэлтийн мэдээлэл</h2>
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label htmlFor="checkout-name" className={labelClass}>Нэр</label>
              <input id="checkout-name" name="name" required autoComplete="name" defaultValue={defaults.name} className={inputClass} />
            </div>
            <div>
              <label htmlFor="checkout-phone" className={labelClass}>Утас</label>
              <input id="checkout-phone" name="phone" required inputMode="tel" autoComplete="tel" defaultValue={defaults.phone} placeholder="9911 2233" className={inputClass} />
            </div>
          </div>

          <AddressFields key={address ? formatAddress(address) : "empty"} value={address} idPrefix="checkout" />

          <label className="flex items-center gap-2.5 text-[12px] text-[#4a3b35]">
            <input type="checkbox" name="saveAddress" defaultChecked className="h-4 w-4 accent-[#a24456]" />
            Энэ хаягийг дараагийн захиалгад хадгалах
          </label>

          <div>
            <label htmlFor="checkout-note" className={labelClass}>Тэмдэглэл (заавал биш)</label>
            <textarea id="checkout-note" name="note" rows={3} placeholder="Өнгө, нэр хатгуулах, хүргэлтийн цаг гэх мэт" className={inputClass} />
          </div>
        </div>

        <div className="h-fit space-y-5 rounded-[24px] border border-[#eadfd5] bg-white p-6 lg:sticky lg:top-[calc(var(--header-h,130px)+24px)] lg:p-8">
          <h2 className="text-[14px] font-semibold text-[#2f2420]">Таны захиалга</h2>
          <ul className="divide-y divide-[#f1ebe5]">
            {items.map((item) => {
              const line = check?.lines.find((entry) => entry.id === item.slug);
              return (
                <li key={item.slug} className="flex items-center gap-4 py-4">
                  <Image src={item.image} alt="" width={64} height={64} className="h-16 w-16 shrink-0 rounded-xl bg-[#faf7f6] object-contain" />
                  <div className="min-w-0 flex-1">
                    <p className="line-clamp-2 text-[12px] font-medium text-[#2f2420]">{item.name}</p>
                    <p className="mt-1 text-[11px] text-[#9c8c84]">{formatPrice(line?.price ?? item.priceValue)}</p>
                    {line?.madeToOrder ? (
                      <p className="mt-1 flex items-center gap-1 text-[10px] text-[#8a5a00]">
                        <Clock aria-hidden className="h-3 w-3" /> Захиалгаар · {line.leadDays} хоног
                      </p>
                    ) : null}
                  </div>
                  <div className="flex items-center rounded-full border border-[#eadfd5]">
                    <button type="button" aria-label="Хасах" disabled={item.quantity <= 1} onClick={() => setQuantity(item.slug, item.quantity - 1)} className="flex h-8 w-8 items-center justify-center disabled:opacity-30">
                      <Minus aria-hidden className="h-3.5 w-3.5" />
                    </button>
                    <span className="w-6 text-center text-[12px] font-semibold">{item.quantity}</span>
                    <button type="button" aria-label="Нэмэх" onClick={() => setQuantity(item.slug, item.quantity + 1)} className="flex h-8 w-8 items-center justify-center">
                      <Plus aria-hidden className="h-3.5 w-3.5" />
                    </button>
                  </div>
                  <button type="button" aria-label={`${item.name}-г хасах`} onClick={() => removeItem(item.slug)} className="text-[#b3a69e] transition hover:text-[#a33a3a]">
                    <Trash2 aria-hidden className="h-4 w-4" />
                  </button>
                </li>
              );
            })}
          </ul>

          {check?.errors.length ? (
            <ul className="space-y-1 rounded-xl bg-[#fbeaea] px-4 py-3 text-[12px] text-[#a33a3a]">
              {check.errors.map((error) => (
                <li key={error}>{error}</li>
              ))}
            </ul>
          ) : null}

          {madeToOrderDays ? (
            <p className="rounded-xl bg-[#fdf6e6] px-4 py-3 text-[11px] leading-relaxed text-[#7a5200]">
              Захиалгаар хийх бараатай тул төлбөр төлөгдсөнөөс хойш ойролцоогоор {madeToOrderDays} хоногт бэлэн болно.
            </p>
          ) : null}

          <div className="flex items-center justify-between border-t border-[#f1ebe5] pt-5">
            <span className="text-[12px] text-[#7a6b63]">Нийт дүн</span>
            <strong className="text-[20px] text-[#2f2420]">{formatPrice(total)}</strong>
          </div>

          {formError ? <p className="rounded-xl bg-[#fbeaea] px-4 py-3 text-[12px] text-[#a33a3a]">{formError}</p> : null}

          <button
            type="submit"
            disabled={Boolean(check?.errors.length)}
            className="w-full rounded-2xl bg-[#a24456] px-6 py-4 text-[13px] font-semibold text-white transition hover:bg-[#8a3748] disabled:cursor-not-allowed disabled:opacity-50"
          >
            QPay-ээр төлөх
          </button>
        </div>
      </form>

      {invoice ? (
        <QPayDialog
          invoice={invoice}
          paying={paying}
          error={payError}
          onPay={pay}
          onClose={() => setInvoice(null)}
        />
      ) : null}
    </>
  );
}
