import { FastifyRequest, FastifyReply } from "fastify";
import { categoriesService } from "../service/categories.service.js";
import { createCategorySchema, updateCategorySchema } from "../schema/categories.schema.js";
import { ApiError } from "../../../utils/ApiError.js";

export const categoriesController = {
  async getAll(request: FastifyRequest, reply: FastifyReply) {
    const result = await categoriesService.getAll();
    return reply.send({ statusCode: 200, data: result });
  },

  async create(request: FastifyRequest, reply: FastifyReply) {
    const body = createCategorySchema.safeParse(request.body);
    if (!body.success) throw new ApiError(400, body.error.issues[0].message);

    const result = await categoriesService.create(body.data);
    return reply.status(201).send({ statusCode: 201, data: result });
  },

  async update(request: FastifyRequest, reply: FastifyReply) {
    const { id } = request.params as { id: string };
    const body = updateCategorySchema.safeParse(request.body);
    if (!body.success) throw new ApiError(400, body.error.issues[0].message);

    const result = await categoriesService.update(id, body.data);
    return reply.send({ statusCode: 200, data: result });
  },

  async delete(request: FastifyRequest, reply: FastifyReply) {
    const { id } = request.params as { id: string };
    const result = await categoriesService.delete(id);
    return reply.send({ statusCode: 200, data: result });
  },
};
