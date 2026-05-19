import { FastifyRequest, FastifyReply } from "fastify";
import { productsService } from "../service/products.service";
import {
  createProductSchema,
  updateProductSchema,
  productQuerySchema,
} from "../schema/products.schema.js";
import { ApiError } from "../../../utils/ApiError";

export const productsController = {
  async getAll(request: FastifyRequest, reply: FastifyReply) {
    const query = productQuerySchema.safeParse(request.query);
    if (!query.success) throw new ApiError(400, query.error.issues[0].message);
    const result = await productsService.getAll(query.data);
    return reply.send({ statusCode: 200, ...result });
  },

  async getById(request: FastifyRequest, reply: FastifyReply) {
    const { id } = request.params as { id: string };
    const result = await productsService.getById(id);
    return reply.send({ statusCode: 200, data: result });
  },

  async create(request: FastifyRequest, reply: FastifyReply) {
    const body = createProductSchema.safeParse(request.body);
    if (!body.success) throw new ApiError(400, body.error.issues[0].message);
    const result = await productsService.create(body.data);
    return reply.status(201).send({ statusCode: 201, data: result });
  },

  async update(request: FastifyRequest, reply: FastifyReply) {
    const { id } = request.params as { id: string };
    const body = updateProductSchema.safeParse(request.body);
    if (!body.success) throw new ApiError(400, body.error.issues[0].message);
    const result = await productsService.update(id, body.data);
    return reply.send({ statusCode: 200, data: result });
  },

  async delete(request: FastifyRequest, reply: FastifyReply) {
    const { id } = request.params as { id: string };
    const result = await productsService.delete(id);
    return reply.send({ statusCode: 200, data: result });
  },

  async getCategories(_request: FastifyRequest, reply: FastifyReply) {
    const result = await productsService.getAllCategories();
    return reply.send({ statusCode: 200, data: result });
  },
};
