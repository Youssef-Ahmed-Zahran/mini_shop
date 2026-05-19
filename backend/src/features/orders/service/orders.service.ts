import { query } from "../../../lib/db.js";
import { ApiError } from "../../../utils/ApiError";
import type {
  CreateOrderInput,
  OrderStatusInput,
  OrdersQuery,
} from "../schema/orders.schema.js";

export const ordersService = {
  async create(userId: string, input: CreateOrderInput) {
    // 1. Fetch products to validate & get prices
    const productIds = input.items.map((i) => i.product_id);
    const result = await query<{ id: string; price: number; name: string; is_active: boolean }>(
      `SELECT id, price, name, is_active FROM products WHERE id = ANY($1::uuid[])`,
      [productIds]
    );

    const productMap = new Map(result.rows.map((p) => [p.id, p]));

    for (const item of input.items) {
      const product = productMap.get(item.product_id);
      if (!product) throw new ApiError(400, `Product ${item.product_id} not found`);
      if (!product.is_active) throw new ApiError(400, `Product "${product.name}" is not available`);
    }

    // 2. Calculate total
    const totalAmount = input.items.reduce((sum, item) => {
      const product = productMap.get(item.product_id)!;
      return sum + product.price * item.quantity;
    }, 0);

    // 3. Insert order + items in a transaction
    const client = await (await import("../../../lib/db.js")).pool.connect();
    try {
      await client.query("BEGIN");

      const orderResult = await client.query<{ id: string }>(
        `INSERT INTO orders (user_id, status, total_amount)
        VALUES ($1, 'pending', $2)
        RETURNING id`,
        [userId, totalAmount]
      );
      const orderId = orderResult.rows[0].id;

      for (const item of input.items) {
        const product = productMap.get(item.product_id)!;
        await client.query(
          `INSERT INTO order_items (order_id, product_id, quantity, unit_price)
          VALUES ($1, $2::uuid, $3, $4)`,
          [orderId, item.product_id, item.quantity, product.price]
        );
      }

      await client.query("COMMIT");

      return this.getById(orderId, userId);
    } catch (err) {
      await client.query("ROLLBACK");
      throw err;
    } finally {
      client.release();
    }
  },

  async getMyOrders(userId: string) {
    const result = await query(
      `SELECT o.id, o.status, o.total_amount, o.created_at,
              json_agg(
                json_build_object(
                  'id', oi.id,
                  'product_id', oi.product_id,
                  'product_name', p.name,
                  'product_image', p.image_url,
                  'quantity', oi.quantity,
                  'unit_price', oi.unit_price
                )
              ) as items
        FROM orders o
        LEFT JOIN order_items oi ON oi.order_id = o.id
        LEFT JOIN products p ON p.id = oi.product_id
        WHERE o.user_id = $1
        GROUP BY o.id
        ORDER BY o.created_at DESC`,
      [userId]
    );
    return result.rows;
  },

  async getById(orderId: string, userId?: string) {
    const params: unknown[] = [orderId];
    const userFilter = userId ? `AND o.user_id = $2` : "";
    if (userId) params.push(userId);

    const result = await query(
      `SELECT o.id, o.status, o.total_amount, o.created_at, o.user_id,
              pr.name as customer_name,
              json_agg(
                json_build_object(
                  'id', oi.id,
                  'product_id', oi.product_id,
                  'product_name', p.name,
                  'product_image', p.image_url,
                  'quantity', oi.quantity,
                  'unit_price', oi.unit_price
                )
              ) as items
        FROM orders o
        LEFT JOIN profiles pr ON pr.id = o.user_id
        LEFT JOIN order_items oi ON oi.order_id = o.id
        LEFT JOIN products p ON p.id = oi.product_id
        WHERE o.id = $1 ${userFilter}
        GROUP BY o.id, pr.name`,
      params
    );

    if (!result.rows[0]) throw new ApiError(404, "Order not found");
    return result.rows[0];
  },

  async getAllAdmin(filters: OrdersQuery) {
    const { page, limit, status } = filters;
    const offset = (page - 1) * limit;
    const params: unknown[] = [];
    let i = 1;

    const conditions: string[] = [];
    if (status) { conditions.push(`o.status = $${i}`); params.push(status); i++; }
    const where = conditions.length ? `WHERE ${conditions.join(" AND ")}` : "";

    const countResult = await query<{ count: string }>(
      `SELECT COUNT(*) as count FROM orders o ${where}`, params
    );
    const total = parseInt(countResult.rows[0].count, 10);

    params.push(limit, offset);
    const result = await query(
      `SELECT o.id, o.status, o.total_amount, o.created_at,
              pr.name as customer_name,
              COUNT(oi.id) as item_count
        FROM orders o
        LEFT JOIN profiles pr ON pr.id = o.user_id
        LEFT JOIN order_items oi ON oi.order_id = o.id
        ${where}
        GROUP BY o.id, pr.name
        ORDER BY o.created_at DESC
        LIMIT $${i} OFFSET $${i + 1}`,
      params
    );

    return {
      data: result.rows,
      meta: { total, page, limit, pages: Math.ceil(total / limit) },
    };
  },

  async updateStatus(orderId: string, input: OrderStatusInput) {
    const result = await query(
      `UPDATE orders SET status = $1 WHERE id = $2 RETURNING *`,
      [input.status, orderId]
    );
    if (!result.rows[0]) throw new ApiError(404, "Order not found");
    return result.rows[0];
  },
};
