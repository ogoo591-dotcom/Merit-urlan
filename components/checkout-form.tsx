"use client";

import { Check, Clock, CreditCard, GraduationCap, Info, ShieldCheck, Truck } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCallback, useState } from "react";
import type { FormEvent } from "react";

import { AddressFields, readAddressFields } from "@/components/address-fields";
import { CartLineRow, SelectAllRow } from "@/components/cart/cart-lines";
import { useCart } from "@/components/cart-provider";
import { formatAddress, useDeliveryAddress } from "@/components/delivery-address-provider";
import { checkCart, placeOrder } from "@/app/actions";
import { QPayDialog } from "@/components/store/qpay-dialog";
import { createQPayInvoice, type QPayInvoice } from "@/lib/data/payments";
import { useData } from "@/lib/data/use-data";
import { formatPrice } from "@/lib/format";
import { formatOrderAddress, type Order } from "@/lib/orders";

type Props = {
  defaults: { name: string; phone: string };
};

type PendingOrder = Pick<Order, "customer" | "address" | "note">;

const inputClass =
  "w-full rounded-[14px] border border-[#eadfd5] bg-white px-4 py-3 text-[13px] text-[#2f2420] outline-none transition focus:border-[#a24456]";
const labelClass = "mb-2 block text-[12px] font-semibold text-[#2f2420]";
const cardClass = "rounded-[24px] border border-[#eadfd5] bg-white";
const required = <span className="text-[#a24456]">*</span>;

// Захиалгын урсгал: сагснаас сонгох → 1. Мэдээлэл → 2. Төлбөр (QPay mock) → захиалга / сургалт нээгдэнэ.
// Зөвхөн сонгосон мөрүүд худалдан авагдана; бусад нь сагсандаа үлдэнэ.
export function CheckoutForm({ defaults }: Props) {
  const router = useRouter();
  const { items, selectedItems, ready, removeSelected } = useCart();
  const { address, saveAddress } = useDeliveryAddress();
  const [step, setStep] = useState<"info" | "payment">("info");
  const [formError, setFormError] = useState<string>();
  const [pending, setPending] = useState<PendingOrder | null>(null);
  const [invoice, setInvoice] = useState<QPayInvoice | null>(null);
  const [paying, setPaying] = useState(false);
  const [payError, setPayError] = useState<string>();

  const productLines = selectedItems.filter((item) => item.kind !== "course");
  const courseIds = selectedItems.filter((item) => item.kind === "course").map((item) => item.slug.replace(/^course:/, ""));
  const needsDelivery = productLines.length > 0;
  const cart = productLines.map((item) => ({ id: item.slug, quantity: item.quantity }));
  const cartKey = JSON.stringify([cart, courseIds]);

  // Сагсыг одоогийн үнэ, үлдэгдэлтэй тулгаж, асуудлыг төлбөрөөс өмнө харуулна.
  const { data: check } = useData(
    useCallback(() => {
      const [products, courses] = JSON.parse(cartKey) as [typeof cart, string[]];
      return checkCart(products, courses);
    }, [cartKey]),
  );
  const subtotal = selectedItems.reduce((sum, item) => sum + item.priceValue * item.quantity, 0);
  const total = check?.total ?? subtotal;
  const madeToOrderDays = Math.max(0, ...(check?.lines ?? []).filter((line) => line.madeToOrder).map((line) => line.leadDays ?? 0));
  const errors = check?.errors ?? [];

  const submitInfo = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setFormError(undefined);
    const formData = new FormData(event.currentTarget);
    const name = String(formData.get("name") ?? "").trim();
    const phone = String(formData.get("phone") ?? "").trim();
    const deliveryAddress = needsDelivery ? readAddressFields(formData) : { district: "", khoroo: "", detail: "" };

    if (!name || !/^[0-9+\s-]{8,}$/.test(phone) || (needsDelivery && (!deliveryAddress.district || !deliveryAddress.detail))) {
      setFormError(needsDelivery ? "Нэр, утас (8+ оронтой), хүргэлтийн хаягаа бүрэн бөглөнө үү." : "Нэр, утсаа (8+ оронтой) бөглөнө үү.");
      return;
    }
    if (needsDelivery && formData.get("saveAddress")) void saveAddress(deliveryAddress);
    setPending({ customer: { name, phone }, address: deliveryAddress, note: String(formData.get("note") ?? "").trim() });
    setStep("payment");
  };

  const startPayment = async () => {
    setFormError(undefined);
    const latest = await checkCart(cart, courseIds);
    if (latest.errors.length) {
      setFormError(latest.errors[0]);
      return;
    }
    setPayError(undefined);
    setInvoice(await createQPayInvoice(latest.total));
  };

  const pay = async () => {
    if (!invoice || !pending) return;
    setPaying(true);
    setPayError(undefined);
    // Сервер төлбөрийг (mock) шалгаж, үнэ, үлдэгдлийг дахин тулгаад захиалга үүсгэнэ.
    const result = await placeOrder({ ...pending, cart, courses: courseIds });
    if (!result.ok) {
      setPayError(result.error);
      setPaying(false);
      return;
    }
    removeSelected();
    if (result.orderId) router.push(`/account/orders?new=${result.orderId}`);
    else if (result.courseIds.length === 1) router.push(`/courses/${result.courseIds[0]}/learn`);
    else router.push("/library");
  };

  if (!ready) return <div className="mt-10 h-64 animate-pulse rounded-[24px] bg-white/70" />;

  if (!items.length) {
    return (
      <div className={`${cardClass} mt-10 p-10 text-center`}>
        <p className="text-[13px] font-semibold text-[#2f2420]">Сагс хоосон байна</p>
        <div className="mt-6 flex justify-center gap-2">
          <Link href="/products" className="rounded-xl bg-[#3d302c] px-6 py-3 text-[12px] font-semibold text-white transition hover:bg-[#2f2420]">
            Дэлгүүр үзэх
          </Link>
          <Link href="/courses" className="rounded-xl border border-[#eadfd5] px-6 py-3 text-[12px] font-semibold text-[#2f2420] transition hover:border-[#a24456] hover:text-[#a24456]">
            Сургалт үзэх
          </Link>
        </div>
      </div>
    );
  }

  const tabs = [
    { id: "info" as const, label: "Мэдээлэл", icon: Info },
    { id: "payment" as const, label: "Төлбөр төлөх", icon: CreditCard },
  ];

  return (
    <>
      <div className="mt-8 grid gap-8 lg:grid-cols-[1.15fr_1fr]">
        {/* Зүүн: сагс ба дүн */}
        <div className="space-y-5">
          <div className={cardClass}>
            <SelectAllRow className="border-b border-[#f1ebe5] px-5 py-4 sm:px-7" />
            <ul className="divide-y divide-[#f1ebe5]">
              {items.map((item) => {
                const line = check?.lines.find((entry) => entry.id === item.slug);
                return (
                  <li key={item.slug} className="px-5 py-5 sm:px-7">
                    <CartLineRow
                      line={item}
                      note={
                        line?.madeToOrder ? (
                          <p className="mt-1.5 flex items-center gap-1 text-[10px] font-medium text-[#8a5a00]">
                            <Clock aria-hidden className="h-3 w-3" /> Захиалгаар · {line.leadDays} хоног
                          </p>
                        ) : null
                      }
                    />
                  </li>
                );
              })}
            </ul>
          </div>

          {errors.length ? (
            <ul className="space-y-1 rounded-2xl bg-[#fbeaea] px-5 py-4 text-[12px] text-[#a33a3a]">
              {errors.map((error) => (
                <li key={error}>{error}</li>
              ))}
            </ul>
          ) : null}

          <div className={`${cardClass} px-5 py-2 sm:px-7`}>
            <div className="flex items-center justify-between border-b border-[#f1ebe5] py-4 text-[12px] text-[#7a6b63]">
              <span>Захиалгын үнэ ({selectedItems.length})</span>
              <span>{formatPrice(subtotal)}</span>
            </div>
            {needsDelivery ? (
              <div className="flex items-center justify-between border-b border-[#f1ebe5] py-4 text-[12px] text-[#7a6b63]">
                <span>Хүргэлт</span>
                <span>Захиалга баталгаажуулах үед мэдэгдэнэ</span>
              </div>
            ) : null}
            <div className="flex items-center justify-between py-4">
              <span className="text-[13px] font-semibold text-[#2f2420]">Нийт үнэ</span>
              <strong className="text-[20px] text-[#a24456]">{formatPrice(total)}</strong>
            </div>
          </div>

          <ul className="grid gap-3 text-[11px] text-[#7a6b63] sm:grid-cols-3">
            {[
              { icon: ShieldCheck, text: "QPay-ээр аюулгүй төлбөр" },
              { icon: Truck, text: "УБ болон орон нутагт хүргэнэ" },
              { icon: GraduationCap, text: "Сургалт төлбөрийн дараа шууд нээгдэнэ" },
            ].map(({ icon: Icon, text }) => (
              <li key={text} className="flex items-center gap-2.5 rounded-2xl bg-white/70 px-4 py-3 ring-1 ring-[#eadfd5]">
                <Icon aria-hidden className="h-4 w-4 shrink-0 text-[#a24456]" />
                {text}
              </li>
            ))}
          </ul>
        </div>

        {/* Баруун: алхамууд */}
        <div className="h-fit lg:sticky lg:top-[calc(var(--header-h,130px)+24px)]">
          <div role="tablist" aria-label="Захиалгын алхам" className="grid grid-cols-2 border-b border-[#eadfd5]">
            {tabs.map(({ id, label, icon: Icon }, index) => {
              const active = step === id;
              const done = id === "info" && step === "payment";
              return (
                <button
                  key={id}
                  type="button"
                  role="tab"
                  aria-selected={active}
                  disabled={id === "payment" && !pending}
                  onClick={() => setStep(id)}
                  className={`-mb-px flex items-center justify-center gap-2 border-b-2 px-3 py-4 text-[13px] font-semibold transition disabled:cursor-not-allowed ${
                    active ? "border-[#a24456] text-[#2f2420]" : "border-transparent text-[#9c8c84] hover:text-[#4a3b35]"
                  }`}
                >
                  <span
                    className={`flex h-6 w-6 items-center justify-center rounded-full text-[11px] ${
                      done ? "bg-[#a24456] text-white" : active ? "bg-[#f7e9ec] text-[#a24456]" : "bg-[#f5eee8] text-[#9c8c84]"
                    }`}
                  >
                    {done ? <Check aria-hidden className="h-3.5 w-3.5" strokeWidth={3} /> : index + 1}
                  </span>
                  <Icon aria-hidden className="hidden h-4 w-4 sm:block" />
                  {label}
                </button>
              );
            })}
          </div>

          {step === "info" ? (
            <form onSubmit={submitInfo} className="space-y-5 pt-6">
              <div>
                <label htmlFor="checkout-name" className={labelClass}>Нэр {required}</label>
                <input id="checkout-name" name="name" required autoComplete="name" defaultValue={pending?.customer.name ?? defaults.name} className={inputClass} />
              </div>
              <div>
                <label htmlFor="checkout-phone" className={labelClass}>Утас {required}</label>
                <input
                  id="checkout-phone"
                  name="phone"
                  required
                  inputMode="tel"
                  autoComplete="tel"
                  defaultValue={pending?.customer.phone ?? defaults.phone}
                  placeholder="9911 2233"
                  className={inputClass}
                />
              </div>

              {needsDelivery ? (
                <div className="space-y-4 rounded-[20px] bg-[#faf6f3] p-5">
                  <p className="flex items-center gap-2 text-[12px] font-semibold text-[#2f2420]">
                    <Truck aria-hidden className="h-4 w-4 text-[#a24456]" /> Хүргэлтийн хаяг {required}
                  </p>
                  <AddressFields key={address ? formatAddress(address) : "empty"} value={pending?.address.detail ? pending.address : address} idPrefix="checkout" />
                  <label className="flex items-center gap-2.5 text-[12px] text-[#4a3b35]">
                    <input type="checkbox" name="saveAddress" defaultChecked className="h-4 w-4 accent-[#a24456]" />
                    Энэ хаягийг дараагийн захиалгад хадгалах
                  </label>
                </div>
              ) : (
                <p className="rounded-[16px] bg-[#f7e9ec] px-4 py-3 text-[12px] leading-relaxed text-[#8a3748]">
                  Онлайн сургалт тул хүргэлтийн хаяг шаардлагагүй. Төлбөр төлөгдмөгц бүх хичээл “Миний сан”-д нээгдэнэ.
                </p>
              )}

              <div>
                <label htmlFor="checkout-note" className={labelClass}>Нэмэлт мэдээлэл</label>
                <textarea
                  id="checkout-note"
                  name="note"
                  rows={4}
                  defaultValue={pending?.note}
                  placeholder={needsDelivery ? "Өнгө, нэр хатгуулах, хүргэлтийн цаг гэх мэт" : "Асуух зүйл байвал бичээрэй"}
                  className={inputClass}
                />
              </div>

              {formError ? <p className="rounded-xl bg-[#fbeaea] px-4 py-3 text-[12px] text-[#a33a3a]">{formError}</p> : null}

              <button
                type="submit"
                disabled={!selectedItems.length || errors.length > 0}
                className="w-full rounded-2xl bg-[#3d302c] px-6 py-4 text-[13px] font-semibold text-white transition hover:bg-[#2f2420] disabled:cursor-not-allowed disabled:opacity-40"
              >
                Үргэлжлүүлэх
              </button>
              {!selectedItems.length ? <p className="text-center text-[11px] text-[#9c8c84]">Худалдан авах бараагаа сагснаас сонгоно уу.</p> : null}
            </form>
          ) : pending ? (
            <div className="space-y-5 pt-6">
              <dl className="divide-y divide-[#f1ebe5] rounded-[20px] border border-[#eadfd5] bg-white px-5 text-[12px]">
                {[
                  { label: "Нэр", value: pending.customer.name },
                  { label: "Утас", value: pending.customer.phone },
                  ...(needsDelivery ? [{ label: "Хаяг", value: formatOrderAddress(pending.address) }] : []),
                  ...(pending.note ? [{ label: "Нэмэлт", value: pending.note }] : []),
                ].map((row) => (
                  <div key={row.label} className="flex gap-4 py-3.5">
                    <dt className="w-16 shrink-0 text-[#9c8c84]">{row.label}</dt>
                    <dd className="flex-1 text-[#2f2420]">{row.value}</dd>
                  </div>
                ))}
              </dl>
              <button type="button" onClick={() => setStep("info")} className="text-[12px] font-medium text-[#a24456] underline underline-offset-4">
                Мэдээлэл засах
              </button>

              {madeToOrderDays ? (
                <p className="rounded-xl bg-[#fdf6e6] px-4 py-3 text-[11px] leading-relaxed text-[#7a5200]">
                  Захиалгаар хийх бараатай тул төлбөр төлөгдсөнөөс хойш ойролцоогоор {madeToOrderDays} хоногт бэлэн болно.
                </p>
              ) : null}

              <div className="flex items-center justify-between rounded-[20px] bg-[#faf6f3] px-5 py-4">
                <span className="text-[12px] text-[#7a6b63]">Төлөх дүн</span>
                <strong className="text-[22px] text-[#2f2420]">{formatPrice(total)}</strong>
              </div>

              {formError ? <p className="rounded-xl bg-[#fbeaea] px-4 py-3 text-[12px] text-[#a33a3a]">{formError}</p> : null}

              <button
                type="button"
                onClick={startPayment}
                disabled={!selectedItems.length || errors.length > 0}
                className="w-full rounded-2xl bg-[#a24456] px-6 py-4 text-[13px] font-semibold text-white transition hover:bg-[#8a3748] disabled:cursor-not-allowed disabled:opacity-40"
              >
                QPay-ээр төлөх
              </button>
            </div>
          ) : null}
        </div>
      </div>

      {invoice ? <QPayDialog invoice={invoice} paying={paying} error={payError} onPay={pay} onClose={() => setInvoice(null)} /> : null}
    </>
  );
}
