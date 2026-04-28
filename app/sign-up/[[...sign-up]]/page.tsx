import { SignUp } from "@clerk/nextjs";

export const runtime = "edge";

export default function SignUpPage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-[#f8f1eb] px-6 py-16">
      <SignUp
        appearance={{
          variables: {
            colorPrimary: "#f39a08",
            borderRadius: "0.75rem",
          },
        }}
      />
    </main>
  );
}
