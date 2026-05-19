import { apiClient } from "../../../config/apiClient";
import type { ApiResponse, PaginatedResponse } from "../../../types";
import type { Order } from "../types";

export const ordersApi = {
  getAll: async (params?: { page?: number; limit?: number; status?: string }) => {
    const { data } = await apiClient.get<PaginatedResponse<Order>>("/orders", { params });
    return data;
  },

  getById: async (id: string) => {
    const { data } = await apiClient.get<ApiResponse<Order>>(`/orders/${id}`);
    return data.data;
  },

  updateStatus: async (id: string, status: string) => {
    const { data } = await apiClient.patch<ApiResponse<Order>>(
      `/orders/${id}/status`,
      { status }
    );
    return data.data;
  },

  // Dashboard KPI stats derived from orders
  getStats: async () => {
    const [metaRes, allRes] = await Promise.all([
      apiClient.get<PaginatedResponse<Order>>("/orders", {
        params: { limit: 1, page: 1 },
      }),
      apiClient.get<PaginatedResponse<Order>>("/orders", { params: { limit: 1000 } }),
    ]);

    const today = new Date().toDateString();
    const todayOrders = allRes.data.data.filter(
      (o) => new Date(o.created_at).toDateString() === today
    );
    const revenue = allRes.data.data.reduce(
      (sum, o) => (o.status !== "cancelled" ? sum + Number(o.total_amount) : sum),
      0
    );

    return {
      ordersToday: todayOrders.length,
      totalRevenue: revenue,
      totalOrders: metaRes.data.meta.total,
    };
  },
};
