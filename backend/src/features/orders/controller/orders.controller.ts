import { FastifyRequest, FastifyReply } from "fastify";
import { ordersService } from "../service/orders.service.js";
import {
  createOrderSchema,
  orderStatusSchema,
  ordersQuerySchema,
} from "../schema/orders.schema.js";
import { ApiError } from "../../../utils/ApiError.js";

export const ordersController = {
  async create(request: FastifyRequest, reply: FastifyReply) {
    const body = createOrderSchema.safeParse(request.body);
    if (!body.success) throw new ApiError(400, body.error.issues[0].message);

    const user = request.user as { id: string };
    const result = await ordersService.create(user.id, body.data);
    return reply.status(201).send({ statusCode: 201, data: result });
  },

  async getMyOrders(request: FastifyRequest, reply: FastifyReply) {
    const user = request.user as { id: string };
    const result = await ordersService.getMyOrders(user.id);
    return reply.send({ statusCode: 200, data: result });
  },

  async getOrderById(request: FastifyRequest, reply: FastifyReply) {
    const { id } = request.params as { id: string };
    const user = request.user as { id: string; role: string };
    const userId = user.role === "admin" ? undefined : user.id;
    const result = await ordersService.getById(id, userId);
    return reply.send({ statusCode: 200, data: result });
  },

  async getAllAdmin(request: FastifyRequest, reply: FastifyReply) {
    const query = ordersQuerySchema.safeParse(request.query);
    if (!query.success) throw new ApiError(400, query.error.issues[0].message);
    const result = await ordersService.getAllAdmin(query.data);
    return reply.send({ statusCode: 200, ...result });
  },

  async updateStatus(request: FastifyRequest, reply: FastifyReply) {
    const { id } = request.params as { id: string };
    const body = orderStatusSchema.safeParse(request.body);
    if (!body.success) throw new ApiError(400, body.error.issues[0].message);
    const result = await ordersService.updateStatus(id, body.data);
    return reply.send({ statusCode: 200, data: result });
  },
};
