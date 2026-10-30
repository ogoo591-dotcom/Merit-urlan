import { redirect } from "next/navigation";

// Нэг цонхоор нэвтрэх болон бүртгүүлэх хоёулаа хийгддэг.
export default function SignUpPage() {
  redirect("/sign-in");
}
