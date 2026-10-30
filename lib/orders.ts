// Захиалгын төрөл, статусууд (client, server хоёуланд).

export const orderStatuses = [
  { key: "received", label: "Хүлээн авсан" },
  { key: "in_progress", label: "Хийгдэж байна" },
  { key: "ready", label: "Бэлэн" },
  { key: "shipping", label: "Хүргэлтэнд гарсан" },
  { key: "delivered", label: "Хүргэгдсэн" },
] as const;

export type OrderStatus = (typeof orderStatuses)[number]["key"];

export const orderStatusLabel = (status: OrderStatus) => orderStatuses.find((item) => item.key === status)?.label ?? status;

export const orderStatusTone: Record<OrderStatus, string> = {
  received: "bg-[#fdf0dc] text-[#9a6412]",
  in_progress: "bg-[#e6eefb] text-[#2f5ea8]",
  ready: "bg-[#efe6fb] text-[#6b3fa8]",
  shipping: "bg-[#e3f4f4] text-[#1f6f72]",
  delivered: "bg-[#e3f2e6] text-[#2e7a43]",
};

export type OrderLine = {
  id: string;
  name: string;
  image: string;
  price: number;
  quantity: number;
  madeToOrder: boolean;
  leadDays?: number;
};

export type Order = {
  id: number;
  userId: string;
  customer: { name: string; phone: string };
  address: { district: string; khoroo: string; detail: string };
  note: string;
  items: OrderLine[];
  total: number;
  status: OrderStatus;
  history: Array<{ status: OrderStatus; at: string }>;
  payment: { provider: "qpay"; transactionId: string };
  createdAt: string;
  // Захиалгаар хийх бараа байвал тооцсон, эсвэл админы сонгосон бэлэн болох огноо.
  readyBy?: string;
};

export type CartInput = Array<{ id: string; quantity: number }>;

export function formatOrderAddress(address: Order["address"]) {
  return [address.district, address.khoroo && `${address.khoroo}-р хороо`, address.detail].filter(Boolean).join(", ");
}
