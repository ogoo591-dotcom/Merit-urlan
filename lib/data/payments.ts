// QPay нэхэмжлэх (mock). Төлбөрийн баталгаажуулалтыг сервер талын action-ууд хийнэ (app/actions.ts г.м.).
// Жинхэнэ QPay холбохдоо invoice-ийг сервер дээр үүсгэж, callback/шалгалтаар төлөгдсөнийг баталгаажуулна.

export type QPayInvoice = { invoiceId: string; amount: number; qrText: string };

export async function createQPayInvoice(amount: number): Promise<QPayInvoice> {
  const invoiceId = `MOCK-${Date.now().toString(36).toUpperCase()}`;
  return { invoiceId, amount, qrText: `qpay://mock/${invoiceId}/${amount}` };
}
