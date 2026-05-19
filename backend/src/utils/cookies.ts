import type { FastifyReply } from "fastify";

const IS_PRODUCTION = process.env.NODE_ENV === "production";

export const JWT_COOKIE_NAME = "jwt";

export const JWT_COOKIE_OPTIONS = {
  httpOnly: true,                     // JS cannot read — XSS safe
  secure: IS_PRODUCTION,              // HTTPS only in production
  sameSite: "strict" as const,        // CSRF safe
  path: "/",
  maxAge: 7 * 24 * 60 * 60,          // 7 days in seconds
};

/** Set the JWT HttpOnly cookie on the reply */
export function setAuthCookie(reply: FastifyReply, token: string): void {
  reply.setCookie(JWT_COOKIE_NAME, token, JWT_COOKIE_OPTIONS);
}

/** Clear the JWT cookie (logout) */
export function clearAuthCookie(reply: FastifyReply): void {
  reply.clearCookie(JWT_COOKIE_NAME, { path: "/" });
}
