import { FastifyRequest, FastifyReply } from "fastify";
import { ApiError } from "../utils/ApiError.js";

export async function authenticate(
  request: FastifyRequest,
  reply: FastifyReply
): Promise<void> {
  try {
    // Read JWT from HttpOnly cookie
    const token = request.cookies?.jwt;
    if (!token) throw new ApiError(401, "Unauthorized — no token provided");
    request.user = request.server.jwt.verify(token);
  } catch (err) {
    if (err instanceof ApiError) throw err;
    throw new ApiError(401, "Unauthorized — invalid or expired token");
  }
}

export async function requireAdmin(
  request: FastifyRequest,
  reply: FastifyReply
): Promise<void> {
  await authenticate(request, reply);
  const user = request.user as { role?: string };
  if (user?.role !== "admin") {
    throw new ApiError(403, "Forbidden — admin access required");
  }
}
