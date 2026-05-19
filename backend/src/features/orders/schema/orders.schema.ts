import { z } from "zod";

export const orderItemSchema = z.object({
  product_id: z.string().uuid("Invalid product ID"),
  quantity: z.number().int().positive("Quantity must be at least 1"),
});

export const createOrderSchema = z.object({
  items: z.array(orderItemSchema).min(1, "Order must contain at least one item"),
});

export const orderStatusSchema = z.object({
  status: z.enum(["pending", "processing", "delivered", "cancelled"]),
});

export const ordersQuerySchema = z.object({
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().positive().max(1000).default(20),
  status: z.enum(["pending", "processing", "delivered", "cancelled"]).optional(),
});

export type CreateOrderInput = z.infer<typeof createOrderSchema>;
export type OrderStatusInput = z.infer<typeof orderStatusSchema>;
export type OrdersQuery = z.infer<typeof ordersQuerySchema>;
