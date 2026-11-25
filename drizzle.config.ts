import { defineConfig } from "drizzle-kit";

// Migration нь pooler биш шууд холболтоор (DIRECT_URL, 5432) явна.
try {
  process.loadEnvFile(".env.local");
} catch {
  // Prod дээр env-ийг гаднаас дамжуулна.
}

export default defineConfig({
  dialect: "postgresql",
  schema: "./server/db/schema.ts",
  out: "./db/migrations",
  dbCredentials: { url: process.env.DIRECT_URL ?? "" },
  strict: true,
  verbose: true,
});
