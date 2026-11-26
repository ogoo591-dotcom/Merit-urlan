import "server-only";

import { z } from "zod";

// Env-ийг хэсэг тус бүрээр, анх хэрэглэх үед нь шалгана — тохируулаагүй хэсэг (жишээ нь storage) DB-ийн ажлыг зогсоохгүй.
const sections = {
  db: z.object({
    DATABASE_URL: z.url(),
  }),
  storage: z.object({
    SUPABASE_URL: z.url(),
    SUPABASE_SERVICE_ROLE_KEY: z.string().min(1),
  }),
  payment: z
    .object({
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
    }),
};

type Sections = typeof sections;
export type ServerEnv<K extends keyof Sections> = z.infer<Sections[K]>;

const cache = new Map<keyof Sections, unknown>();

export function serverEnv<K extends keyof Sections>(section: K): ServerEnv<K> {
  if (cache.has(section)) return cache.get(section) as ServerEnv<K>;
  // Хоосон мөрийг (KEY=) тохируулаагүй гэж үзнэ, ингэснээр default утга ажиллана.
  const values = Object.fromEntries(Object.entries(process.env).filter(([, value]) => value !== ""));
  const parsed = sections[section].safeParse(values);
  if (!parsed.success) {
    const lines = parsed.error.issues.map((issue) => `  ${issue.path.join(".")}: ${issue.message}`);
    throw new Error(`.env.local-ийн "${section}" хэсэг дутуу эсвэл буруу байна:\n${lines.join("\n")}`);
  }
  cache.set(section, parsed.data);
  return parsed.data as ServerEnv<K>;
}
