// Сайт доторх мэдэгдэл (админ эсвэл хэрэглэгчид).

export type AppNotification = {
  id: string;
  audience: "admin" | "customer";
  userId?: string;
  message: string;
  href?: string;
  createdAt: string;
  read: boolean;
};
