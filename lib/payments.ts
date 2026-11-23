// Төлбөрийн нийтлэг төрөл, туслах функцууд (client, server хоёуланд).
//
// УРСГАЛ (дансаар шилжүүлэх + админ баталгаажуулах):
// 1. Хэрэглэгч "Төлөх" дарахад данс, дүн, гүйлгээний утга (код) бүхий цонх гарна.
// 2. Дансаар шилжүүлээд "Төлбөр шилжүүлсэн" дарна → хүлээгдэж буй төлбөр үүсч, админд мэдэгдэл очно.
// 3. Админ /admin/payments хэсэгт банкны хуулгатай тулгаад "Баталгаажуулах" дарна →
//    захиалга төлөгдсөн болж, сургалт/схем нээгдэн, хэрэглэгчид мэдэгдэл очно.
// QPay merchant гэрээ хийгдсэний дараа 2-р алхмыг QPay invoice + callback-аар сольж, 3-р алхам автомат болно.

export type PaymentStatus = "pending" | "approved" | "rejected";

export const paymentStatusLabel: Record<PaymentStatus, string> = {
  pending: "Шалгагдаж байна",
  approved: "Баталгаажсан",
  rejected: "Татгалзсан",
};

export const paymentStatusTone: Record<PaymentStatus, string> = {
  pending: "bg-[#fdf0dc] text-[#9a6412]",
  approved: "bg-[#e3f2e6] text-[#2e7a43]",
  rejected: "bg-[#fbeaea] text-[#a33a3a]",
};

// Гүйлгээний утга: MU-XXXXXX (андуурагдах 0/O, 1/I үсэг ороогүй).
const codeAlphabet = "23456789ABCDEFGHJKLMNPQRSTUVWXYZ";
export const paymentCodePattern = /^MU-[23456789ABCDEFGHJKLMNPQRSTUVWXYZ]{6}$/;

export function newPaymentCode() {
  const bytes = crypto.getRandomValues(new Uint8Array(6));
  return `MU-${[...bytes].map((byte) => codeAlphabet[byte % codeAlphabet.length]).join("")}`;
}

export type PaymentInvoice = { code: string; amount: number };
