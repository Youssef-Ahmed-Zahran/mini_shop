import { FastifyInstance } from "fastify";
import { productsController } from "../controller/products.controller.js";
import { authenticate } from "../../../middleware/authenticate.js";
import { requireAdmin } from "../../../middleware/authenticate.js";

export async function productsRoutes(app: FastifyInstance) {
  // Public routes
  app.get("/products", productsController.getAll);
  app.get("/products/:id", productsController.getById);

  // Admin-only routes
  app.post("/products", { preHandler: [requireAdmin] }, productsController.create);
  app.patch("/products/:id", { preHandler: [requireAdmin] }, productsController.update);
  app.delete("/products/:id", { preHandler: [requireAdmin] }, productsController.delete);
}
