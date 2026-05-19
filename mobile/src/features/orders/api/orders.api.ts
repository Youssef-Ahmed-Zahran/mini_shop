import { apiClient } from "../../../config/apiClient";
import type { ApiResponse } from "../../../types";
import type { Order } from "../types";

export interface CreateOrderPayload {
  items: { product_id: string; quantity: number }[];
}

export const ordersApi = {
  getMyOrders: async (page = 1): Promise<Order[]> => {
    const res = await apiClient.get<ApiResponse<Order[]>>(
      "/orders/my",
      { params: { page, limit: 10 } }
    );
    return res.data.data;
  },

  getOrderById: async (id: string): Promise<Order> => {
    const res = await apiClient.get<ApiResponse<Order>>(`/orders/${id}`);
    return res.data.data;
  },

  createOrder: async (payload: CreateOrderPayload): Promise<Order> => {
    const res = await apiClient.post<ApiResponse<Order>>("/orders", payload);
    return res.data.data;
  },
};
