// Админ эсэхийг шалгах дүрэм (middleware болон серверт хамт ашиглана).
// 1) Clerk Dashboard → Users → Metadata → Public: {"role": "admin"}
// 2) эсвэл .env.local: ADMIN_EMAILS=a@gmail.com,b@gmail.com

type AdminCandidate = {
  publicMetadata?: Record<string, unknown> | null;
  emailAddresses?: Array<{ emailAddress: string; verification?: { status?: string | null } | null }>;
};

export function adminEmails() {
  return (process.env.ADMIN_EMAILS ?? "")
    .split(",")
    .map((email) => email.trim().toLowerCase())
    .filter(Boolean);
}

export function isAdminUser(user: AdminCandidate | null | undefined) {
  if (!user) return false;
  if (user.publicMetadata?.role === "admin") return true;
  const allowed = adminEmails();
  // Зөвхөн баталгаажсан имэйлээр (хүн өөр хүний имэйлийг баталгаажуулалгүй нэмээд админ болохоос сэргийлнэ).
  return (user.emailAddresses ?? []).some(
    (email) => email.verification?.status === "verified" && allowed.includes(email.emailAddress.toLowerCase()),
  );
}
