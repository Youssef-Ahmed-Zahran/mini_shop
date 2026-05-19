import type { OrderStatus } from "../types";

export const STATUS_OPTIONS: OrderStatus[] = ["pending", "processing", "delivered", "cancelled"];

export const STATUS_COLORS: Record<OrderStatus, string> = {
  pending:    "bg-amber-100 text-amber-700",
  processing: "bg-blue-100 text-blue-700",
  delivered:  "bg-emerald-100 text-emerald-700",
  cancelled:  "bg-red-100 text-red-700",
};
