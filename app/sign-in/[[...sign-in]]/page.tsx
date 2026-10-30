import { SignInScreen } from "@/components/auth/sign-in-screen";
import { safeRedirect } from "@/lib/redirect";

type SignInPageProps = {
  searchParams: Promise<{ redirect_url?: string | string[] }>;
};

export default async function SignInPage({ searchParams }: SignInPageProps) {
  const { redirect_url } = await searchParams;
  return <SignInScreen redirectTo={safeRedirect(redirect_url)} />;
}
