import { FastifyInstance } from "fastify";
import { ordersController } from "../controller/orders.controller.js";
import { authenticate } from "../../../middleware/authenticate.js";
import { requireAdmin } from "../../../middleware/authenticate.js";

export async function ordersRoutes(app: FastifyInstance) {
  // Authenticated user routes
  app.post("/orders", { preHandler: [authenticate] }, ordersController.create);
  app.get("/orders/my", { preHandler: [authenticate] }, ordersController.getMyOrders);
  app.get("/orders/:id", { preHandler: [authenticate] }, ordersController.getOrderById);

  // Admin-only routes
  app.get("/orders", { preHandler: [requireAdmin] }, ordersController.getAllAdmin);
  app.patch("/orders/:id/status", { preHandler: [requireAdmin] }, ordersController.updateStatus);
}
