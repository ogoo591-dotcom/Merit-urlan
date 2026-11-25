import "server-only";

import { serverEnv } from "@/lib/env";
import { mockProvider } from "@/lib/payment-provider/mock";
import { qpayProvider } from "@/lib/payment-provider/qpay";
import type { PaymentProvider } from "@/lib/payment-provider/types";

export type * from "@/lib/payment-provider/types";

export function getPaymentProvider(): PaymentProvider {
  return serverEnv().PAYMENT_PROVIDER === "qpay" ? qpayProvider : mockProvider;
}
