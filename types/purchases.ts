// Сургалт, схемд хандах эрх (худалдан авалт).

export type Purchase = {
  id: string;
  kind: "course" | "pattern";
  itemId: string;
  userId: string;
  price: number;
  transactionId: string;
  createdAt: string;
};
