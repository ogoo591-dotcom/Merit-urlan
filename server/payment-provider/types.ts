// Төлбөрийн provider-ийн нийтлэг гэрээ. Хэлбэр нь QPay v2-ийн invoice API-тай ижил, mock ч яг үүнийг дагана.

export type InvoiceRequest = {
  // Манай payments хүснэгтийн id — callback ирэхэд аль төлбөр болохыг үүгээр олно.
  paymentId: string;
  amount: number;
  description: string;
  callbackUrl: string;
};

export type BankDeeplink = { name: string; description: string; logo: string; link: string };

export type Invoice = {
  providerInvoiceId: string;
  qrText: string;
  qrImage: string | null;
  shortUrl: string | null;
  deeplinks: BankDeeplink[];
};

export type InvoiceCheck = {
  paid: boolean;
  paidAmount: number;
  providerPaymentId: string | null;
};

export interface PaymentProvider {
  readonly name: "mock" | "qpay";
  createInvoice(request: InvoiceRequest): Promise<Invoice>;
  // Callback-д итгэхгүй — төлөгдсөн эсэхийг заавал provider-оос дахин шалгана.
  checkInvoice(providerInvoiceId: string): Promise<InvoiceCheck>;
  cancelInvoice(providerInvoiceId: string): Promise<void>;
}
