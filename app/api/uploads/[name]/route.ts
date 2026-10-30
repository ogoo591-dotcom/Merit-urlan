import { readImageUpload } from "@/lib/data/uploads";

// Админы upload хийсэн зургийг (mock: .mock-db/uploads) буцаана. Supabase Storage руу шилжихэд хэрэггүй болно.
export async function GET(_request: Request, { params }: { params: Promise<{ name: string }> }) {
  const file = await readImageUpload((await params).name);
  if (!file) return new Response("Not found", { status: 404 });
  return new Response(new Uint8Array(file.data), {
    headers: { "Content-Type": file.type, "Cache-Control": "public, max-age=31536000, immutable", "X-Content-Type-Options": "nosniff" },
  });
}
