import "server-only";

import type { PaymentProvider } from "@/server/payment-provider/types";

// QPay merchant гэрээ хийгдсэний дараа бичнэ: /v2/auth/token, /v2/invoice, /v2/payment/check, DELETE /v2/invoice/{id}.
function notReady(): never {
  throw new Error("QPay provider хараахан хэрэгжээгүй. PAYMENT_PROVIDER=mock ашиглана уу.");
}

export const qpayProvider: PaymentProvider = {
  name: "qpay",
  createInvoice: async () => notReady(),
  checkInvoice: async () => notReady(),
  cancelInvoice: async () => notReady(),
};
