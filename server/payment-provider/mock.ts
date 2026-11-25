import "server-only";

import type { Invoice, InvoiceCheck, InvoiceRequest, PaymentProvider } from "@/server/payment-provider/types";

type MockInvoice = { request: InvoiceRequest; paid: boolean; cancelled: boolean };

// Хөгжүүлэлтийн provider: invoice-ийг санах ойд хадгална. Dev-д markMockInvoicePaid()-аар "төлөгдсөн" болгоно.
const globalForMock = globalThis as unknown as { meritMockInvoices?: Map<string, MockInvoice> };
const invoices = (globalForMock.meritMockInvoices ??= new Map());

export const mockProvider: PaymentProvider = {
  name: "mock",

  async createInvoice(request): Promise<Invoice> {
    const providerInvoiceId = `mock-${crypto.randomUUID()}`;
    invoices.set(providerInvoiceId, { request, paid: false, cancelled: false });
    return {
      providerInvoiceId,
      qrText: `MOCK:${providerInvoiceId}:${request.amount}`,
      qrImage: null,
      shortUrl: null,
      deeplinks: [],
    };
  },

  async checkInvoice(providerInvoiceId): Promise<InvoiceCheck> {
    const invoice = invoices.get(providerInvoiceId);
    const paid = Boolean(invoice?.paid && !invoice.cancelled);
    return {
      paid,
      paidAmount: paid ? invoice!.request.amount : 0,
      providerPaymentId: paid ? `mock-payment-${providerInvoiceId}` : null,
    };
  },

  async cancelInvoice(providerInvoiceId) {
    const invoice = invoices.get(providerInvoiceId);
    if (invoice) invoice.cancelled = true;
  },
};

export function markMockInvoicePaid(providerInvoiceId: string) {
  const invoice = invoices.get(providerInvoiceId);
  if (!invoice) return null;
  invoice.paid = true;
  return invoice.request;
}
