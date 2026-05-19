import Fastify from "fastify";
import cors from "@fastify/cors";
import jwt from "@fastify/jwt";
import cookie from "@fastify/cookie";
import { config } from "dotenv";

import { errorHandler } from "./plugins/errorHandler.js";
import { authRoutes } from "./features/auth/routes/auth.routes.js";
import { productsRoutes } from "./features/products/routes/products.routes.js";
import { categoriesRoutes } from "./features/categories/routes/categories.routes.js";
import { ordersRoutes } from "./features/orders/routes/orders.routes.js";

config();

const app = Fastify({ 
  logger: true,
  bodyLimit: 50 * 1024 * 1024 // 50MB payload limit
});

// ─── Plugins ────────────────────────────────────────────────────────────────
await app.register(cors, {
  origin: [
    "http://localhost:5173", // dashboard
    "http://localhost:8082", // expo web
  ],
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
  credentials: true,
});

await app.register(jwt, {
  secret: process.env.JWT_SECRET ?? "changeme_min_32_chars_secret_key",
});

await app.register(cookie);

// ─── Global Error Handler ────────────────────────────────────────────────────
await app.register(errorHandler);

// ─── Health Check ────────────────────────────────────────────────────────────
app.get("/health", async () => ({
  status: "ok",
  timestamp: new Date().toISOString(),
}));

// ─── Routes ──────────────────────────────────────────────────────────────────
await app.register(authRoutes);
await app.register(productsRoutes);
await app.register(categoriesRoutes);
await app.register(ordersRoutes);

// ─── Start ───────────────────────────────────────────────────────────────────
const port = Number(process.env.PORT) || 3000;

try {
  await app.listen({ port, host: "0.0.0.0" });
  console.log(`🚀 Server running on http://localhost:${port}`);
} catch (err) {
  app.log.error(err);
  process.exit(1);
}
