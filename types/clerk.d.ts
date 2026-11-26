// Clerk session token-ий нэмэлт claim (Dashboard → Sessions → Customize session token).
export {};

declare global {
  interface CustomJwtSessionClaims {
    metadata?: { role?: "admin" };
  }
}
