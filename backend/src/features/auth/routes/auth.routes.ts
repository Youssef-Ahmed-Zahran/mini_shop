import { FastifyInstance } from "fastify";
import { authController } from "../controller/auth.controller.js";
import { authenticate } from "../../../middleware/authenticate.js";

export async function authRoutes(app: FastifyInstance) {
  app.post("/auth/register", authController.register);
  app.post("/auth/login", authController.login);
  app.post("/auth/logout", authController.logout);
  app.post("/auth/forgot-password", authController.forgotPassword);
  app.post("/auth/reset-password", authController.resetPassword);
  app.get("/auth/me", { preHandler: [authenticate] }, authController.me);
}
