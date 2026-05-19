import { FastifyRequest, FastifyReply } from "fastify";
import { authService } from "../service/auth.service.js";
import {
  registerSchema,
  loginSchema,
  forgotPasswordSchema,
  resetPasswordSchema,
} from "../schema/auth.schema.js";
import { ApiError } from "../../../utils/ApiError.js";
import { setAuthCookie, clearAuthCookie } from "../../../utils/cookies.js";

export const authController = {
  async register(request: FastifyRequest, reply: FastifyReply) {
    const body = registerSchema.safeParse(request.body);
    if (!body.success) throw new ApiError(400, body.error.issues[0].message);

    const result = await authService.register(body.data);
    return reply.status(201).send({ statusCode: 201, data: result });
  },

  async login(request: FastifyRequest, reply: FastifyReply) {
    const body = loginSchema.safeParse(request.body);
    if (!body.success) throw new ApiError(400, body.error.issues[0].message);

    const jwtSign = (payload: object) =>
      (request.server as any).jwt.sign(payload, { expiresIn: "7d" });

    const result = await authService.login(body.data, jwtSign);

    // Set token as HttpOnly cookie — JS never sees it
    setAuthCookie(reply, result.token);

    // Return only user info, not the token
    return reply.send({ statusCode: 200, data: { user: result.user } });
  },

  async logout(_request: FastifyRequest, reply: FastifyReply) {
    clearAuthCookie(reply);
    return reply.send({ statusCode: 200, data: { message: "Logged out successfully" } });
  },

  async forgotPassword(request: FastifyRequest, reply: FastifyReply) {
    const body = forgotPasswordSchema.safeParse(request.body);
    if (!body.success) throw new ApiError(400, body.error.issues[0].message);

    const result = await authService.forgotPassword(body.data);
    return reply.send({ statusCode: 200, data: result });
  },

  async me(request: FastifyRequest, reply: FastifyReply) {
    const user = request.user as { id: string };
    const result = await authService.getProfile(user.id);
    return reply.send({ statusCode: 200, data: result });
  },

  async resetPassword(request: FastifyRequest, reply: FastifyReply) {
    const body = resetPasswordSchema.safeParse(request.body);
    if (!body.success) throw new ApiError(400, body.error.issues[0].message);

    const result = await authService.resetPassword(body.data);
    return reply.send({ statusCode: 200, data: result });
  },
};

