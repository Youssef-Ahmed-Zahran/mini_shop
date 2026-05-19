import { FastifyInstance } from "fastify";
import { categoriesController } from "../controller/categories.controller.js";
import { requireAdmin } from "../../../middleware/authenticate.js";

export async function categoriesRoutes(app: FastifyInstance) {
  // Note: GET /categories is currently in products routes, but we can manage them here
  app.get("/categories", categoriesController.getAll);
  
  // Admin only
  app.post("/categories", { preHandler: [requireAdmin] }, categoriesController.create);
  app.patch("/categories/:id", { preHandler: [requireAdmin] }, categoriesController.update);
  app.delete("/categories/:id", { preHandler: [requireAdmin] }, categoriesController.delete);
}
