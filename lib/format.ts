// Client, server аль алинд ашиглах форматын туслах функцууд.

export function formatPrice(value: number) {
  return `${value.toLocaleString("en-US")}₮`;
}

export function formatDateTime(iso: string) {
  return new Intl.DateTimeFormat("mn-MN", { dateStyle: "medium", timeStyle: "short", timeZone: "Asia/Ulaanbaatar" }).format(
    new Date(iso),
  );
}

// "11-р сарын 5-нд"
export function formatReadyDate(iso: string) {
  const date = new Date(iso);
  return `${date.getMonth() + 1}-р сарын ${date.getDate()}-нд`;
}

// "11/05"
export function formatShortDate(iso: string) {
  const date = new Date(iso);
  return `${String(date.getMonth() + 1).padStart(2, "0")}/${String(date.getDate()).padStart(2, "0")}`;
}
