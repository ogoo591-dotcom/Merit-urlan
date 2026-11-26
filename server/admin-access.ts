// Админ эсэхийг шалгах дүрэм (middleware болон серверт хамт ашиглана).
// Clerk Dashboard → Users → Metadata → Public: {"role": "admin"}. Session token-д {"metadata": "{{user.public_metadata}}"}
// нэмсэн тул Clerk API дуудалгүй token-оос уншина (эрх өөрчлөгдсөнөөс ~1 минутын дотор шинэчлэгдэнэ).

export function isAdminClaims(claims: CustomJwtSessionClaims | null | undefined) {
  return claims?.metadata?.role === "admin";
}

// ТҮР: локал dev-д админ шалгалтыг алгасна (.env.local: ADMIN_AUTH_BYPASS=true). Production build-д хэзээ ч ажиллахгүй.
export function adminAuthBypassed() {
  return process.env.NODE_ENV !== "production" && process.env.ADMIN_AUTH_BYPASS === "true";
}
