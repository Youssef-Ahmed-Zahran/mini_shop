import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { ordersApi } from "../api/orders.api";
import type { OrderStatus } from "../types";

const ORDERS_KEY = "orders";

export const useOrders = (params?: {
  page?: number;
  limit?: number;
  status?: string;
}) =>
  useQuery({
    queryKey: [ORDERS_KEY, params],
    queryFn: () => ordersApi.getAll(params),
  });

export const useOrder = (id: string) =>
  useQuery({
    queryKey: [ORDERS_KEY, id],
    queryFn: () => ordersApi.getById(id),
    enabled: !!id,
  });

export const useOrderStats = () =>
  useQuery({
    queryKey: ["order-stats"],
    queryFn: ordersApi.getStats,
    staleTime: 1000 * 60, // 1 min
  });

export const useUpdateOrderStatus = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, status }: { id: string; status: OrderStatus }) =>
      ordersApi.updateStatus(id, status),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: [ORDERS_KEY] });
      qc.invalidateQueries({ queryKey: ["order-stats"] });
      toast.success("Order status updated");
    },
    onError: () => toast.error("Failed to update status"),
  });
};
