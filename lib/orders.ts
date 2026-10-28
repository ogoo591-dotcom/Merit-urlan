export type OrderStatus = "new" | "confirmed" | "delivered" | "cancelled";
export type EnrollmentStatus = "new" | "contacted" | "enrolled" | "cancelled";

export type OrderRow = {
  id: number;
  user_id: string;
  customer_name: string;
  phone: string;
  email: string | null;
  address: string;
  note: string | null;
  items: Array<{ slug: string; name: string; price: number; quantity: number }>;
  total: number;
  status: OrderStatus;
  created_at: string;
};

export type EnrollmentRow = {
  id: number;
  user_id: string;
  course_title: string;
  customer_name: string;
  phone: string;
  email: string | null;
  status: EnrollmentStatus;
  created_at: string;
};

export const orderStatusLabels: Record<OrderStatus, string> = {
  new: "Шинэ",
  confirmed: "Баталгаажсан",
  delivered: "Хүргэгдсэн",
  cancelled: "Цуцалсан",
};

export const enrollmentStatusLabels: Record<EnrollmentStatus, string> = {
  new: "Шинэ",
  contacted: "Холбогдсон",
  enrolled: "Элссэн",
  cancelled: "Цуцалсан",
};

export const statusTone: Record<string, string> = {
  new: "bg-[#fdf0dc] text-[#9a6412]",
  confirmed: "bg-[#e6eefb] text-[#2f5ea8]",
  contacted: "bg-[#e6eefb] text-[#2f5ea8]",
  delivered: "bg-[#e3f2e6] text-[#2e7a43]",
  enrolled: "bg-[#e3f2e6] text-[#2e7a43]",
  cancelled: "bg-[#f3e6e6] text-[#a04848]",
};

export function formatDate(value: string) {
  return new Date(value).toLocaleString("mn-MN", { dateStyle: "medium", timeStyle: "short", timeZone: "Asia/Ulaanbaatar" });
}
