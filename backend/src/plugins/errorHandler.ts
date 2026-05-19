import { FastifyInstance, FastifyError } from "fastify";
import { ApiError } from "../utils/ApiError.js";

export async function errorHandler(app: FastifyInstance) {
  app.setErrorHandler((error: FastifyError | ApiError | Error, _request, reply) => {
    // Known ApiError
    if (error instanceof ApiError) {
      return reply.status(error.statusCode).send({
        statusCode: error.statusCode,
        error: error.name,
        message: error.message,
      });
    }

    // Fastify JWT error
    if (error.name === "UnauthorizedError" || (error as any).statusCode === 401) {
      return reply.status(401).send({
        statusCode: 401,
        error: "Unauthorized",
        message: "Invalid or expired token",
      });
    }

    // Generic server error
    console.error("[Server Error]", error);
    return reply.status(500).send({
      statusCode: 500,
      error: "InternalServerError",
      message: "Something went wrong",
    });
  });
}
