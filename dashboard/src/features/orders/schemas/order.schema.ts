import { z } from "zod";

export const orderStatusSchema = z.object({
  status: z.enum(["pending", "processing", "delivered", "cancelled"]),
});

export type OrderStatusFormValues = z.infer<typeof orderStatusSchema>;
