import { redirect } from "next/navigation";

export const runtime = "edge";

// Нэг цонхоор нэвтрэх болон бүртгүүлэх хоёулаа хийгддэг.
export default function SignUpPage() {
  redirect("/sign-in");
}
