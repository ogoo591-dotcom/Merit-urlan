// Dev DB-тэй холбогдож байгаа эсэхийг шалгана. Ажиллуулах: npm run db:check
import postgres from "postgres";

async function main() {
  process.loadEnvFile(".env.local");
  const url = process.env.DATABASE_URL;
  if (!url) throw new Error("DATABASE_URL .env.local-д алга");

  const sql = postgres(url, { prepare: false, max: 1 });
  try {
    const [row] = await sql`select current_database() as db, version() as version, now() as now`;
    console.log("✓ Холбогдлоо:", row.db, "|", String(row.version).split(" ").slice(0, 2).join(" "), "|", row.now);
  } finally {
    await sql.end();
  }
}

main().catch((error) => {
  console.error("✗ Холбогдож чадсангүй:", error instanceof Error ? error.message : error);
  process.exit(1);
});
