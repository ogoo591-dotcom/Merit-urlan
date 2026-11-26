import "server-only";

import { serverEnv } from "@/server/env";
import { mockProvider } from "@/server/payment-provider/mock";
import { qpayProvider } from "@/server/payment-provider/qpay";
import type { PaymentProvider } from "@/server/payment-provider/types";

export type * from "@/server/payment-provider/types";

export function getPaymentProvider(): PaymentProvider {
  return serverEnv("payment").PAYMENT_PROVIDER === "qpay" ? qpayProvider : mockProvider;
}
