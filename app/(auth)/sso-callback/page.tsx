import { AuthenticateWithRedirectCallback } from "@clerk/nextjs";

// Google/Facebook-ээс буцаж ирэхэд Clerk нэвтрэлтийг дуусгана.
export default function SsoCallbackPage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-[#fcf6f0] text-[12px] text-[#7a6b63]">
      Нэвтэрч байна…
      <AuthenticateWithRedirectCallback />
      <div id="clerk-captcha" />
    </main>
  );
}
