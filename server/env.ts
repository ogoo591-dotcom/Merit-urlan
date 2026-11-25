import "server-only";

import { z } from "zod";

// Серверийн env-ийг анх хэрэглэх үед нь шалгана (import хийхэд биш), тиймээс тохируулаагүй хэсэг build-ийг эвдэхгүй.
const schema = z
  .object({
    DATABASE_URL: z.url(),
    SUPABASE_URL: z.url(),
    SUPABASE_SERVICE_ROLE_KEY: z.string().min(1),
    APP_URL: z.url().default("http://localhost:3000"),
    PAYMENT_PROVIDER: z.enum(["mock", "qpay"]).default("mock"),
    QPAY_BASE_URL: z.url().default("https://merchant.qpay.mn"),
    QPAY_CLIENT_ID: z.string().optional(),
    QPAY_CLIENT_SECRET: z.string().optional(),
    QPAY_INVOICE_CODE: z.string().optional(),
  })
  .superRefine((env, ctx) => {
    if (env.PAYMENT_PROVIDER !== "qpay") return;
    for (const key of ["QPAY_CLIENT_ID", "QPAY_CLIENT_SECRET", "QPAY_INVOICE_CODE"] as const) {
      if (!env[key]) ctx.addIssue({ code: "custom", path: [key], message: "PAYMENT_PROVIDER=qpay үед заавал" });
    }
  });

export type ServerEnv = z.infer<typeof schema>;

let cached: ServerEnv | undefined;

export function serverEnv(): ServerEnv {
  if (cached) return cached;
  const parsed = schema.safeParse(process.env);
  if (!parsed.success) {
    const lines = parsed.error.issues.map((issue) => `  ${issue.path.join(".")}: ${issue.message}`);
    throw new Error(`.env.local тохиргоо дутуу эсвэл буруу байна:\n${lines.join("\n")}`);
  }
  cached = parsed.data;
  return cached;
}
